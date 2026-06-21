/**
 * ============================================
 * JUANOVA CORTEX - GOALS MANAGER
 * Handles all goal-related database operations
 * ============================================
 * 
 * Works with existing Supabase client from:
 * - window.supabase (from supabase-bootstrap.js)
 * 
 * Load AFTER your supabase-bootstrap.js
 * 
 * All goals are stored in Supabase database (user_goals table)
 */

// ============================================
// CONFIGURATION
// ============================================
const GoalsConfig = {
    tableName: 'user_goals',
    subjectsTable: 'subjects',
    
    // Default goals to suggest
    defaultGoals: [
        { type: 'score_target', title: 'Target Average Score', target: 75, unit: '%' },
        { type: 'quiz_count', title: 'Quizzes per Week', target: 5, unit: 'quizzes' },
        { type: 'study_hours', title: 'Study Hours per Week', target: 10, unit: 'hours' },
        { type: 'streak_days', title: 'Daily Study Streak', target: 7, unit: 'days' }
    ],
    
    // Goal types with icons
    goalTypes: {
        score_target: { icon: '📊', label: 'Score Target', unit: '%' },
        study_hours: { icon: '⏰', label: 'Study Hours', unit: 'hours' },
        quiz_count: { icon: '📝', label: 'Quiz Count', unit: 'quizzes' },
        streak_days: { icon: '🔥', label: 'Study Streak', unit: 'days' },
        subject_mastery: { icon: '🏆', label: 'Subject Mastery', unit: '%' }
    }
};

// ============================================
// SUPABASE CLIENT HELPER
// ============================================

let _supabaseClient = null;
let _supabaseReady = false;

// Listen for supabase ready event
if (typeof window !== 'undefined') {
    window.addEventListener('supabaseReady', (e) => {
        console.log('✅ GoalsManager: Supabase ready event received');
        _supabaseClient = e.detail.client;
        _supabaseReady = true;
    });
    
    window.addEventListener('supabaseError', (e) => {
        console.error('❌ GoalsManager: Supabase error event received', e.detail.error);
        _supabaseReady = false;
    });
}

/**
 * Create Supabase client directly using ES modules
 * @returns {Promise<Object|null>}
 */
async function createSupabaseClientDirectly() {
    try {
        console.log('🔧 GoalsManager: Attempting to create Supabase client directly...');
        
        if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
            console.error('❌ GoalsManager: Missing Supabase credentials');
            return null;
        }
        
        // Try to import Supabase from esm.sh
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        
        const client = createClient(
            window.SUPABASE_URL,
            window.SUPABASE_ANON_KEY,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            }
        );
        
        console.log('✅ GoalsManager: Created Supabase client directly!');
        return client;
        
    } catch (err) {
        console.error('❌ GoalsManager: Failed to create Supabase client directly:', err);
        return null;
    }
}

/**
 * Wait for Supabase client to be ready
 * @param {number} timeout - Max wait time in ms
 * @returns {Promise<Object|null>}
 */
async function waitForSupabaseClient(timeout = 10000) {
    // If already have client, return it
    if (_supabaseClient) {
        return _supabaseClient;
    }
    
    // Check if already set globally
    if (window.supabaseClient) {
        _supabaseClient = window.supabaseClient;
        return _supabaseClient;
    }
    
    // Wait for the ready event or timeout
    return new Promise(async (resolve) => {
        const startTime = Date.now();
        let resolved = false;
        
        const checkInterval = setInterval(async () => {
            // Check if client is now available
            if (window.supabaseClient) {
                clearInterval(checkInterval);
                _supabaseClient = window.supabaseClient;
                resolved = true;
                resolve(_supabaseClient);
                return;
            }
            
            // Check timeout
            if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                
                if (resolved) return;
                resolved = true;
                
                console.warn('⚠️ GoalsManager: Timeout waiting for Supabase client, creating directly...');
                
                // Try to create client ourselves
                let client = null;
                
                // First try using existing global supabase object (UMD build)
                if (window.supabase && window.supabase.createClient && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
                    console.log('🔧 GoalsManager: Creating client from window.supabase');
                    client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
                }
                
                // If that didn't work, try ES module import
                if (!client) {
                    client = await createSupabaseClientDirectly();
                }
                
                if (client) {
                    _supabaseClient = client;
                    window.supabaseClient = client;
                    resolve(client);
                } else {
                    console.error('❌ GoalsManager: Cannot create Supabase client - all methods failed');
                    resolve(null);
                }
            }
        }, 100);
    });
}

/**
 * Get Supabase client (async version)
 * @returns {Promise<Object|null>}
 */
async function getSupabaseClient() {
    return await waitForSupabaseClient();
}

/**
 * Get Supabase client (sync version - may return null if not ready)
 * @returns {Object|null}
 */
function getSupabaseClientSync() {
    if (_supabaseClient) return _supabaseClient;
    if (window.supabaseClient) {
        _supabaseClient = window.supabaseClient;
        return _supabaseClient;
    }
    return null;
}

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Get the current authenticated user
 * Supports both Firebase (from localStorage) and Supabase auth
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
async function getCurrentUser() {
    // Strictly use Supabase auth
    const sb = await getSupabaseClient();
    if (!sb) {
        return { user: null, error: 'supabase_not_initialized' };
    }
    
    const { data: { user }, error } = await sb.auth.getUser();
    
    if (error) {
        console.log('GoalsManager: No Supabase session found');
        return { user: null, error: error.message };
    }
    
    if (user) {
        console.log('✅ GoalsManager: Found user from Supabase auth:', user.id);
    }
    
    return { user, error: null };
}

/**
 * Check if user has any goals set
 * @returns {Promise<{hasGoals: boolean, goals: Array, firstTime: boolean}>}
 */
async function checkUserGoals() {
    console.log('🔍 checkUserGoals called');
    
    try {
        // Wait for Supabase client to be ready
        const sb = await getSupabaseClient();
        if (!sb) {
            console.warn('⚠️ Supabase client not available after waiting');
            return { hasGoals: false, goals: [], firstTime: true, error: 'supabase_not_initialized' };
        }
        
        // Get current user
        const { user, error: authError } = await getCurrentUser();
        
        if (authError || !user) {
            console.log('Auth error or no user:', authError);
            return { hasGoals: false, goals: [], firstTime: true, error: authError || 'not_authenticated' };
        }

        console.log('✅ User authenticated:', user.id);

        // Check for existing goals in Supabase
        const { data: goals, error } = await sb
            .from(GoalsConfig.tableName)
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            // If table doesn't exist
            if (error.code === '42P01') {
                console.warn('⚠️ user_goals table does not exist. Run the SQL setup script.');
                return { hasGoals: false, goals: [], firstTime: true, error: 'table_not_found' };
            }
            // If permission denied (RLS policy issue)
            if (error.code === '42501' || error.message.includes('policy')) {
                console.warn('⚠️ Permission denied. Check RLS policies.');
                return { hasGoals: false, goals: [], firstTime: true, error: 'permission_denied' };
            }
            
            console.error('Error fetching goals:', error);
            return { hasGoals: false, goals: [], firstTime: true, error: error.message };
        }

        console.log('📊 Goals found:', goals?.length || 0);
        
        const hasGoals = goals && goals.length > 0;
        
        return {
            hasGoals,
            goals: goals || [],
            firstTime: !hasGoals,
            userId: user.id
        };

    } catch (err) {
        console.error('checkUserGoals error:', err);
        return { hasGoals: false, goals: [], firstTime: true, error: err.message };
    }
}

/**
 * Create a new goal
 * @param {Object} goalData - Goal details
 * @returns {Promise<{success: boolean, data: Object, error: string}>}
 */
async function createGoal(goalData) {
    try {
        const sb = await getSupabaseClient();
        if (!sb) return { success: false, error: 'supabase_not_initialized' };
        
        const { user, error: authError } = await getCurrentUser();
        
        if (authError || !user) {
            return { success: false, error: 'not_authenticated' };
        }

        const goal = {
            user_id: user.id,
            goal_type: goalData.goal_type,
            title: goalData.title,
            subject: goalData.subject || null,
            target_value: goalData.target_value,
            current_value: goalData.current_value || 0,
            unit: goalData.unit || '%',
            deadline: goalData.deadline || null,
            status: 'active'
        };

        console.log('💾 Creating goal:', goal);

        const { data, error } = await sb
            .from(GoalsConfig.tableName)
            .insert(goal)
            .select()
            .single();

        if (error) {
            console.error('Error creating goal:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Goal created:', data);
        return { success: true, data };

    } catch (err) {
        console.error('createGoal error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Create multiple goals at once (for onboarding)
 * @param {Array} goalsArray - Array of goal objects
 * @returns {Promise<{success: boolean, created: number, errors: Array}>}
 */
async function createMultipleGoals(goalsArray) {
    console.log('💾 createMultipleGoals called with:', goalsArray.length, 'goals');
    
    try {
        // Wait for Supabase client to be ready
        const sb = await getSupabaseClient();
        if (!sb) {
            console.error('❌ Supabase client not available after waiting');
            return { success: false, created: 0, errors: ['supabase_not_initialized'] };
        }
        
        const { user, error: authError } = await getCurrentUser();
        
        if (authError || !user) {
            console.error('❌ User not authenticated:', authError);
            return { success: false, created: 0, errors: ['not_authenticated'] };
        }

        console.log('✅ User authenticated for goal creation:', user.id);

        const goalsToInsert = goalsArray.map(g => ({
            user_id: user.id,
            goal_type: g.goal_type,
            title: g.title,
            subject: g.subject || null,
            target_value: Number(g.target_value),
            current_value: 0,
            unit: g.unit || '%',
            deadline: g.deadline || null,
            status: 'active'
        }));

        console.log('📝 Inserting goals:', goalsToInsert);

        const { data, error } = await sb
            .from(GoalsConfig.tableName)
            .insert(goalsToInsert)
            .select();

        if (error) {
            console.error('❌ Error creating goals:', error);
            
            // More specific error messages
            if (error.code === '42P01') {
                return { success: false, created: 0, errors: ['Table does not exist. Please run the SQL setup script in Supabase.'] };
            }
            if (error.code === '42501' || error.message.includes('policy')) {
                return { success: false, created: 0, errors: ['Permission denied. Please check RLS policies.'] };
            }
            
            return { success: false, created: 0, errors: [error.message] };
        }

        console.log('✅ Goals created successfully:', data?.length || 0);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('goalsCreated', { detail: { count: data?.length || 0 } }));
        
        return { success: true, created: data?.length || 0, data };

    } catch (err) {
        console.error('❌ createMultipleGoals error:', err);
        return { success: false, created: 0, errors: [err.message] };
    }
}

/**
 * Update an existing goal
 */
async function updateGoal(goalId, updates) {
    try {
        const sb = await getSupabaseClient();
        if (!sb) return { success: false, error: 'supabase_not_initialized' };
        
        const { data, error } = await sb
            .from(GoalsConfig.tableName)
            .update(updates)
            .eq('id', goalId)
            .select()
            .single();

        if (error) {
            console.error('Error updating goal:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };

    } catch (err) {
        console.error('updateGoal error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Update goal progress
 */
async function updateGoalProgress(goalId, currentValue) {
    try {
        const sb = await getSupabaseClient();
        if (!sb) return { success: false, error: 'supabase_not_initialized' };
        
        const { data: goal, error: fetchError } = await sb
            .from(GoalsConfig.tableName)
            .select('*')
            .eq('id', goalId)
            .single();

        if (fetchError || !goal) {
            return { success: false, error: 'goal_not_found' };
        }

        const completed = currentValue >= goal.target_value;

        const updates = {
            current_value: currentValue,
            status: completed ? 'completed' : 'active'
        };

        if (completed) {
            updates.completed_at = new Date().toISOString();
        }

        const { data, error } = await sb
            .from(GoalsConfig.tableName)
            .update(updates)
            .eq('id', goalId)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data, completed };

    } catch (err) {
        console.error('updateGoalProgress error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Delete a goal
 */
async function deleteGoal(goalId) {
    try {
        const sb = await getSupabaseClient();
        if (!sb) return { success: false, error: 'supabase_not_initialized' };
        
        const { error } = await sb
            .from(GoalsConfig.tableName)
            .delete()
            .eq('id', goalId);

        if (error) {
            console.error('Error deleting goal:', error);
            return { success: false, error: error.message };
        }

        return { success: true };

    } catch (err) {
        console.error('deleteGoal error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Get all goals for current user
 * @returns {Promise<{success: boolean, goals: Array}>}
 */
async function getUserGoals() {
    try {
        const sb = await getSupabaseClient();
        if (!sb) return { success: false, goals: [], error: 'supabase_not_initialized' };
        
        const { user, error: authError } = await getCurrentUser();
        
        if (authError || !user) {
            return { success: false, goals: [], error: 'not_authenticated' };
        }

        const { data, error } = await sb
            .from(GoalsConfig.tableName)
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, goals: [], error: error.message };
        }

        return { success: true, goals: data || [] };

    } catch (err) {
        console.error('getUserGoals error:', err);
        return { success: false, goals: [], error: err.message };
    }
}

/**
 * Get goal progress percentage
 */
function getGoalProgress(goal) {
    if (!goal || !goal.target_value || goal.target_value === 0) return 0;
    const progress = (goal.current_value / goal.target_value) * 100;
    return Math.min(Math.round(progress), 100);
}

/**
 * Calculate days remaining until deadline
 */
function getDaysRemaining(deadline) {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

/**
 * Format goal for display
 */
function formatGoal(goal) {
    const progress = getGoalProgress(goal);
    const daysRemaining = getDaysRemaining(goal.deadline);
    const goalType = GoalsConfig.goalTypes[goal.goal_type] || {};
    
    return {
        ...goal,
        progress,
        progressColor: progress >= 75 ? 'green' : progress >= 50 ? 'yellow' : 'red',
        daysRemaining,
        isOverdue: daysRemaining !== null && daysRemaining < 0,
        isCompleted: goal.status === 'completed',
        icon: goalType.icon || '🎯',
        typeLabel: goalType.label || goal.goal_type
    };
}

/**
 * Get available subjects from database
 */
async function getAvailableSubjects() {
    try {
        const sb = await getSupabaseClient();
        if (!sb) return { success: false, subjects: [], error: 'supabase_not_initialized' };
        
        const { data, error } = await sb
            .from(GoalsConfig.subjectsTable)
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            return { success: false, subjects: [], error: error.message };
        }

        return { success: true, subjects: data || [] };

    } catch (err) {
        console.error('getAvailableSubjects error:', err);
        return { success: false, subjects: [], error: err.message };
    }
}

// ============================================
// PROGRESS SYNC FUNCTIONS
// ============================================

/**
 * Sync goal progress from topic_progress and topic_quiz_results tables
 * This calculates actual learning progress and updates user_goals
 * @returns {Promise<{success: boolean, updated: number, errors: Array}>}
 */
async function syncGoalProgress() {
    console.log('🔄 syncGoalProgress: Starting progress sync...');
    
    try {
        // Try multiple ways to get the Supabase client
        let sb = await getSupabaseClient();
        
        // Fallback to global if our client isn't working
        if (!sb && typeof window !== 'undefined') {
            if (window.supabaseClient) {
                sb = window.supabaseClient;
                console.log('🔧 syncGoalProgress: Using window.supabaseClient');
            } else if (window.supabase && typeof window.supabase.from === 'function') {
                sb = window.supabase;
                console.log('🔧 syncGoalProgress: Using window.supabase');
            } else if (window.__supabaseClient) {
                sb = window.__supabaseClient;
                console.log('🔧 syncGoalProgress: Using window.__supabaseClient');
            }
        }
        
        if (!sb) {
            console.warn('⚠️ syncGoalProgress: Supabase not available');
            return { success: false, updated: 0, errors: ['supabase_not_initialized'] };
        }
        
        const { user, error: authError } = await getCurrentUser();
        if (authError || !user) {
            console.warn('⚠️ syncGoalProgress: User not authenticated');
            return { success: false, updated: 0, errors: ['not_authenticated'] };
        }
        
        console.log('🔄 syncGoalProgress: Syncing for user:', user.id);
        
        // Get all user's goals
        const { data: goals, error: goalsError } = await sb
            .from(GoalsConfig.tableName)
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active');
        
        if (goalsError) {
            console.error('❌ syncGoalProgress: Error fetching goals:', goalsError);
            return { success: false, updated: 0, errors: [goalsError.message] };
        }
        
        if (!goals || goals.length === 0) {
            console.log('📭 syncGoalProgress: No active goals to sync');
            return { success: true, updated: 0, errors: [] };
        }
        
        console.log(`📊 syncGoalProgress: Found ${goals.length} active goals`);
        
        // Get all topic progress for this user
        const { data: topicProgress, error: progressError } = await sb
            .from('topic_progress')
            .select('*')
            .eq('user_id', user.id);
        
        if (progressError) {
            console.warn('⚠️ syncGoalProgress: Could not fetch topic_progress:', progressError);
        }
        
        // Get all quiz results for this user
        const { data: quizResults, error: quizError } = await sb
            .from('topic_quiz_results')
            .select('*')
            .eq('user_id', user.id);
        
        if (quizError) {
            console.warn('⚠️ syncGoalProgress: Could not fetch quiz_results:', quizError);
        }
        
        console.log(`📊 syncGoalProgress: Found ${topicProgress?.length || 0} topic progress records`);
        console.log(`📊 syncGoalProgress: Found ${quizResults?.length || 0} quiz results`);
        
        // Log subject distribution for debugging
        if (topicProgress && topicProgress.length > 0) {
            const subjectCounts = {};
            topicProgress.forEach(tp => {
                const subj = tp.subject || 'unknown';
                subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
            });
            console.log('📊 syncGoalProgress: Topic progress by subject:', subjectCounts);
        }
        
        if (quizResults && quizResults.length > 0) {
            const quizSubjectCounts = {};
            quizResults.forEach(q => {
                const subj = q.subject || 'unknown';
                quizSubjectCounts[subj] = (quizSubjectCounts[subj] || 0) + 1;
            });
            console.log('📊 syncGoalProgress: Quiz results by subject:', quizSubjectCounts);
        }
        
        let updatedCount = 0;
        const errors = [];
        
        // Calculate and update each goal
        for (const goal of goals) {
            try {
                const newCurrentValue = await calculateGoalProgress(sb, user.id, goal, topicProgress || [], quizResults || []);
                
                if (newCurrentValue !== null && newCurrentValue !== goal.current_value) {
                    const completed = newCurrentValue >= goal.target_value;
                    
                    const updates = {
                        current_value: newCurrentValue,
                        status: completed ? 'completed' : 'active',
                        updated_at: new Date().toISOString()
                    };
                    
                    if (completed && !goal.completed_at) {
                        updates.completed_at = new Date().toISOString();
                    }
                    
                    const { error: updateError } = await sb
                        .from(GoalsConfig.tableName)
                        .update(updates)
                        .eq('id', goal.id);
                    
                    if (updateError) {
                        console.warn(`⚠️ syncGoalProgress: Failed to update goal ${goal.id}:`, updateError);
                        errors.push(`Failed to update ${goal.title}`);
                    } else {
                        console.log(`✅ syncGoalProgress: Updated ${goal.title}: ${goal.current_value} → ${newCurrentValue}`);
                        updatedCount++;
                    }
                }
            } catch (calcError) {
                console.warn(`⚠️ syncGoalProgress: Error calculating progress for ${goal.title}:`, calcError);
                errors.push(`Error calculating ${goal.title}`);
            }
        }
        
        console.log(`✅ syncGoalProgress: Complete. Updated ${updatedCount} goals`);
        
        // Dispatch event to notify UI
        window.dispatchEvent(new CustomEvent('goalsProgressSynced', { 
            detail: { updated: updatedCount } 
        }));
        
        return { success: true, updated: updatedCount, errors };
        
    } catch (err) {
        console.error('❌ syncGoalProgress error:', err);
        return { success: false, updated: 0, errors: [err.message] };
    }
}

/**
 * Calculate progress for a specific goal based on its type
 * @param {Object} sb - Supabase client
 * @param {string} userId - User ID
 * @param {Object} goal - Goal object
 * @param {Array} topicProgress - Topic progress records
 * @param {Array} quizResults - Quiz result records
 * @returns {number|null} - New current value or null if can't calculate
 */
async function calculateGoalProgress(sb, userId, goal, topicProgress, quizResults) {
    const goalType = goal.goal_type;
    const subject = goal.subject;
    
    switch (goalType) {
        case 'score_target': {
            // Calculate average quiz score across all subjects
            if (!quizResults || quizResults.length === 0) return 0;
            
            // Get quiz percentages from the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const recentQuizzes = quizResults.filter(q => 
                new Date(q.completed_at) >= thirtyDaysAgo
            );
            
            if (recentQuizzes.length === 0) return 0;
            
            // Use percentage field for average score calculation
            const avgScore = recentQuizzes.reduce((sum, q) => sum + (q.percentage || q.score || 0), 0) / recentQuizzes.length;
            return Math.round(avgScore);
        }
        
        case 'subject_mastery': {
            // Calculate mastery percentage for a specific subject
            // PRIMARY: Use quiz percentage from topic_quiz_results
            // SECONDARY: Combine with topic progress if available
            if (!subject) {
                console.log('📊 subject_mastery: No subject specified');
                return 0;
            }
            
            console.log(`📊 subject_mastery: Calculating for subject "${subject}"`);
            console.log(`📊 subject_mastery: Quiz results available: ${quizResults?.length || 0}`);
            
            // Get quiz results for this subject (case-insensitive match)
            const subjectQuizzes = quizResults.filter(q => {
                const quizSubject = (q.subject || '').toLowerCase().trim();
                const targetSubject = subject.toLowerCase().trim();
                const matches = quizSubject === targetSubject || 
                               quizSubject.includes(targetSubject) || 
                               targetSubject.includes(quizSubject);
                if (matches) {
                    console.log(`📊 subject_mastery: Found matching quiz - subject: "${q.subject}", percentage: ${q.percentage}%`);
                }
                return matches;
            });
            
            // Get topic progress for this subject
            const subjectProgress = topicProgress.filter(tp => {
                const tpSubject = (tp.subject || '').toLowerCase().trim();
                const targetSubject = subject.toLowerCase().trim();
                return tpSubject === targetSubject || 
                       tpSubject.includes(targetSubject) || 
                       targetSubject.includes(tpSubject);
            });
            
            console.log(`📊 subject_mastery: Found ${subjectQuizzes.length} quizzes and ${subjectProgress.length} topic progress records for "${subject}"`);
            
            // PRIMARY: Use quiz percentage (most important metric)
            let masteryScore = 0;
            
            if (subjectQuizzes.length > 0) {
                // Get the most recent quiz percentage for this subject
                // Sort by completed_at descending and get the latest
                const sortedQuizzes = subjectQuizzes
                    .filter(q => q.percentage !== undefined && q.percentage !== null)
                    .sort((a, b) => new Date(b.completed_at || 0) - new Date(a.completed_at || 0));
                
                if (sortedQuizzes.length > 0) {
                    // Use average of all quiz percentages for this subject
                    const totalPercentage = sortedQuizzes.reduce((sum, q) => sum + (q.percentage || 0), 0);
                    masteryScore = totalPercentage / sortedQuizzes.length;
                    
                    console.log(`📊 subject_mastery: Quiz percentages: [${sortedQuizzes.map(q => q.percentage).join(', ')}]`);
                    console.log(`📊 subject_mastery: Average quiz percentage: ${masteryScore.toFixed(1)}%`);
                }
            }
            
            // If we have both quiz results and topic progress, weight them
            // Quiz performance is weighted 70%, topic progress 30%
            if (subjectQuizzes.length > 0 && subjectProgress.length > 0) {
                let progressFromTopics = subjectProgress.reduce((sum, tp) => 
                    sum + (tp.progress_percent || 0), 0
                ) / subjectProgress.length;
                
                // Weighted average: 70% quiz, 30% topic progress
                masteryScore = (masteryScore * 0.7) + (progressFromTopics * 0.3);
                console.log(`📊 subject_mastery: Combined score (70% quiz, 30% topics): ${masteryScore.toFixed(1)}%`);
            }
            
            console.log(`📊 subject_mastery: Final score for "${subject}": ${Math.round(masteryScore)}%`);
            
            return Math.round(masteryScore);
        }
        
        case 'study_hours': {
            // Calculate total study hours (from time_spent in topic_progress)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const weeklyProgress = topicProgress.filter(tp => 
                new Date(tp.last_accessed) >= oneWeekAgo
            );
            
            // time_spent is in milliseconds, convert to hours
            const totalMs = weeklyProgress.reduce((sum, tp) => sum + (tp.time_spent || 0), 0);
            const totalHours = totalMs / (1000 * 60 * 60);
            
            return Math.round(totalHours * 10) / 10; // Round to 1 decimal place
        }
        
        case 'quiz_count': {
            // Count quizzes completed in the last week
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const weeklyQuizzes = quizResults.filter(q => 
                new Date(q.completed_at) >= oneWeekAgo
            );
            
            return weeklyQuizzes.length;
        }
        
        case 'streak_days': {
            // Calculate study streak (consecutive days with activity)
            if (!topicProgress || topicProgress.length === 0) return 0;
            
            // Get unique dates with activity
            const activeDates = new Set();
            topicProgress.forEach(tp => {
                if (tp.last_accessed) {
                    const date = new Date(tp.last_accessed).toDateString();
                    activeDates.add(date);
                }
            });
            
            // Sort dates and count consecutive days from today
            const sortedDates = Array.from(activeDates)
                .map(d => new Date(d))
                .sort((a, b) => b - a);
            
            if (sortedDates.length === 0) return 0;
            
            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            for (let i = 0; i < sortedDates.length; i++) {
                const expectedDate = new Date(today);
                expectedDate.setDate(expectedDate.getDate() - i);
                
                const found = sortedDates.some(d => {
                    const checkDate = new Date(d);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate.getTime() === expectedDate.getTime();
                });
                
                if (found) {
                    streak++;
                } else {
                    break;
                }
            }
            
            return streak;
        }
        
        default:
            console.warn(`⚠️ Unknown goal type: ${goalType}`);
            return null;
    }
}

/**
 * Get goals with synced progress
 * First syncs progress from topic_progress, then returns updated goals
 * @returns {Promise<{success: boolean, goals: Array}>}
 */
async function getGoalsWithProgress() {
    console.log('📊 getGoalsWithProgress: Fetching goals with synced progress...');
    
    // First sync progress
    await syncGoalProgress();
    
    // Then get updated goals
    return await getUserGoals();
}

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================
window.GoalsManager = {
    // Config
    Config: GoalsConfig,
    
    // Core functions
    checkUserGoals,
    createGoal,
    createMultipleGoals,
    updateGoal,
    updateGoalProgress,
    deleteGoal,
    getUserGoals,
    getCurrentUser,
    
    // Progress sync functions
    syncGoalProgress,
    calculateGoalProgress,
    getGoalsWithProgress,
    
    // Helpers
    getGoalProgress,
    getDaysRemaining,
    formatGoal,
    getAvailableSubjects
};

console.log('✅ GoalsManager loaded successfully');
