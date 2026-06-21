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
async function waitForSupabaseClient(timeout = 8000) {
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
 * Get or create a user session (supports anonymous auth)
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
async function getOrCreateUserSession() {
    const sb = await getSupabaseClient();
    if (!sb) {
        return { user: null, error: 'supabase_not_initialized' };
    }
    
    // Try to get existing user
    const { data: { user }, error: authError } = await sb.auth.getUser();
    
    if (user) {
        console.log('✅ Existing user session found:', user.id);
        return { user, error: null };
    }
    
    // No user - try to sign in anonymously
    console.log('ℹ️ No user session, attempting anonymous sign-in...');
    
    const { data: anonData, error: anonError } = await sb.auth.signInAnonymously();
    
    if (anonError) {
        console.warn('⚠️ Anonymous sign-in failed:', anonError.message);
        
        // Check if anonymous auth is disabled
        if (anonError.message.includes('Anonymous sign-ins are disabled')) {
            console.log('💡 Anonymous auth is disabled. User must sign in.');
            return { user: null, error: 'not_authenticated' };
        }
        
        return { user: null, error: 'not_authenticated' };
    }
    
    if (anonData?.user) {
        console.log('✅ Created anonymous session:', anonData.user.id);
        return { user: anonData.user, error: null };
    }
    
    return { user: null, error: 'not_authenticated' };
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
        
        // Wait a bit for auth to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get or create user session
        const { user, error: sessionError } = await getOrCreateUserSession();
        
        if (sessionError || !user) {
            console.log('Session error:', sessionError);
            return { hasGoals: false, goals: [], firstTime: true, error: sessionError || 'not_authenticated' };
        }

        console.log('✅ User authenticated:', user.id);

        // Check for existing goals
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
        
        const { data: { user }, error: authError } = await sb.auth.getUser();
        
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
        
        const { data: { user }, error: authError } = await sb.auth.getUser();
        
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
        
        const { data: { user }, error: authError } = await sb.auth.getUser();
        
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
    
    // Helpers
    getGoalProgress,
    getDaysRemaining,
    formatGoal,
    getAvailableSubjects
};

console.log('✅ GoalsManager loaded successfully');
