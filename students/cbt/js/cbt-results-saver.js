/**
 * ============================================
 * JUANOVA CORTEX - CBT RESULTS SAVER
 * Saves quiz results to Supabase for analytics
 * ============================================
 * 
 * This file handles saving quiz results to the database
 * so they can be used in the Learning Report page.
 */

// ============================================
// CONFIGURATION
// ============================================
const CBT_Saver_Config = {
    // Supabase credentials (same as main site)
    supabaseUrl: 'https://kruwfhzfqieuiuhqlutt.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',
    
    // Table names
    tables: {
        quizResults: 'quiz_results',
        questionResponses: 'question_responses',
        userProgress: 'user_progress',
        userStats: 'user_stats',
        studySessions: 'study_sessions'
    }
};

// ============================================
// SUPABASE CLIENT
// ============================================
let cbtSupabase = null;

function initCBTSupabase() {
    if (cbtSupabase) return cbtSupabase;
    
    // Check if Supabase SDK is available
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        cbtSupabase = window.supabase.createClient(
            CBT_Saver_Config.supabaseUrl,
            CBT_Saver_Config.supabaseKey
        );
        console.log('✅ CBT Supabase client initialized');
        return cbtSupabase;
    }
    
    // Check if global supabase client already exists (from parent page)
    if (typeof window.parent !== 'undefined' && window.parent.supabase) {
        cbtSupabase = window.parent.supabase;
        console.log('✅ Using parent Supabase client');
        return cbtSupabase;
    }
    
    console.warn('⚠️ Supabase SDK not found. Quiz results will not be saved.');
    return null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get current user from Supabase auth
 */
async function getCurrentUser() {
    const sb = initCBTSupabase();
    if (!sb) return null;
    
    try {
        const { data: { user }, error } = await sb.auth.getUser();
        if (error) {
            console.log('User not authenticated:', error.message);
            return null;
        }
        return user;
    } catch (err) {
        console.error('Error getting user:', err);
        return null;
    }
}

/**
 * Format time spent in seconds
 */
function formatTimeSpent(totalSeconds) {
    return Math.round(totalSeconds);
}

/**
 * Get current date/time in ISO format
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

// ============================================
// MAIN SAVE FUNCTIONS
// ============================================

/**
 * Save complete quiz result after test submission
 * @param {Object} testData - All test data
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function saveQuizResult(testData) {
    const sb = initCBTSupabase();
    if (!sb) {
        return { success: false, message: 'Supabase not initialized' };
    }
    
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
        console.warn('⚠️ User not logged in. Results will be saved locally only.');
        // Save to localStorage as fallback
        saveResultLocally(testData);
        return { success: false, message: 'User not authenticated, saved locally' };
    }
    
    try {
        // Calculate time spent
        const timeSpent = (testData.testDuration * 60) - testData.timeRemaining;
        
        // Determine if passed (>= 50%)
        const percentage = Math.round((testData.correct / testData.total) * 100);
        const passed = percentage >= 50;
        
        // Create quiz result record
        const quizResult = {
            user_id: user.id,
            quiz_name: testData.quizName || 'JAMB CBT Practice',
            quiz_id: testData.quizId || `cbt_${Date.now()}`,
            subject: testData.subjects.join(', '), // Multiple subjects for full test
            score: testData.correct,
            total_questions: testData.total,
            time_taken: timeSpent,
            passed: passed,
            difficulty: testData.testMode === 'full' ? 'hard' : 'medium',
            created_at: getCurrentTimestamp()
        };
        
        // Insert quiz result
        const { data: insertedResult, error: insertError } = await sb
            .from(CBT_Saver_Config.tables.quizResults)
            .insert(quizResult)
            .select()
            .single();
        
        if (insertError) {
            console.error('Error saving quiz result:', insertError);
            // Save locally as fallback
            saveResultLocally(testData);
            return { success: false, message: insertError.message };
        }
        
        console.log('✅ Quiz result saved:', insertedResult);
        
        // Save individual question responses if we have the result ID
        if (insertedResult && testData.questions && testData.answers) {
            await saveQuestionResponses(
                insertedResult.id,
                user.id,
                testData.questions,
                testData.answers
            );
        }
        
        // Update user progress for each subject
        for (const subjectData of testData.subjectBreakdown) {
            await updateSubjectProgress(user.id, subjectData);
        }
        
        // Update overall user stats
        await updateUserStats(user.id, testData);
        
        // Create study session record
        await createStudySession(user.id, testData);
        
        return { 
            success: true, 
            message: 'Results saved successfully',
            resultId: insertedResult.id 
        };
        
    } catch (err) {
        console.error('Error in saveQuizResult:', err);
        saveResultLocally(testData);
        return { success: false, message: err.message };
    }
}

/**
 * Save individual question responses for detailed analysis
 */
async function saveQuestionResponses(resultId, userId, questions, answers) {
    const sb = initCBTSupabase();
    if (!sb) return;
    
    try {
        const responses = [];
        
        questions.forEach((question, index) => {
            const userAnswer = answers[`${index}`];
            const isCorrect = userAnswer === question.correctAnswer;
            const optionLetters = ['A', 'B', 'C', 'D'];
            
            responses.push({
                result_id: resultId,
                user_id: userId,
                question_number: index + 1,
                question_text: question.question,
                user_answer: userAnswer !== undefined ? optionLetters[userAnswer] : 'Unanswered',
                correct_answer: optionLetters[question.correctAnswer],
                is_correct: isCorrect,
                topic: question.subject,
                created_at: getCurrentTimestamp()
            });
        });
        
        // Batch insert responses
        const { error } = await sb
            .from(CBT_Saver_Config.tables.questionResponses)
            .insert(responses);
        
        if (error) {
            console.error('Error saving question responses:', error);
        } else {
            console.log(`✅ Saved ${responses.length} question responses`);
        }
        
    } catch (err) {
        console.error('Error in saveQuestionResponses:', err);
    }
}

/**
 * Update subject progress after quiz
 */
async function updateSubjectProgress(userId, subjectData) {
    const sb = initCBTSupabase();
    if (!sb) return;
    
    try {
        // Check if progress record exists
        const { data: existing } = await sb
            .from(CBT_Saver_Config.tables.userProgress)
            .select('*')
            .eq('user_id', userId)
            .eq('subject', subjectData.subject)
            .single();
        
        const subjectScore = Math.round((subjectData.correct / subjectData.total) * 100);
        
        if (existing) {
            // Update existing record
            const newTotal = existing.total_quizzes + 1;
            const newTotalScore = existing.total_score + subjectData.correct;
            const newTotalPossible = existing.total_possible + subjectData.total;
            const newAverage = Math.round((newTotalScore / newTotalPossible) * 100);
            
            await sb
                .from(CBT_Saver_Config.tables.userProgress)
                .update({
                    total_quizzes: newTotal,
                    total_score: newTotalScore,
                    total_possible: newTotalPossible,
                    average_percentage: newAverage,
                    best_score: Math.max(existing.best_score, subjectScore),
                    worst_score: Math.min(existing.worst_score || 100, subjectScore),
                    last_activity: getCurrentTimestamp()
                })
                .eq('id', existing.id);
        } else {
            // Create new record
            await sb
                .from(CBT_Saver_Config.tables.userProgress)
                .insert({
                    user_id: userId,
                    subject: subjectData.subject,
                    total_quizzes: 1,
                    total_score: subjectData.correct,
                    total_possible: subjectData.total,
                    average_percentage: subjectScore,
                    best_score: subjectScore,
                    worst_score: subjectScore,
                    last_activity: getCurrentTimestamp()
                });
        }
        
        console.log(`✅ Updated progress for ${subjectData.subject}`);
        
    } catch (err) {
        console.error('Error updating subject progress:', err);
    }
}

/**
 * Update overall user statistics
 */
async function updateUserStats(userId, testData) {
    const sb = initCBTSupabase();
    if (!sb) return;
    
    try {
        const { data: existing } = await sb
            .from(CBT_Saver_Config.tables.userStats)
            .select('*')
            .eq('user_id', userId)
            .single();
        
        const score = Math.round((testData.correct / testData.total) * 100);
        const studyMinutes = Math.round(((testData.testDuration * 60) - testData.timeRemaining) / 60);
        
        if (existing) {
            const newTotal = existing.total_quizzes + 1;
            const newTotalScore = existing.total_score + testData.correct;
            const newTotalPossible = existing.total_possible + testData.total;
            const newAverage = Math.round((newTotalScore / newTotalPossible) * 100);
            const newStudyMinutes = existing.total_study_minutes + studyMinutes;
            
            // Check if streak should be updated
            const lastActivity = new Date(existing.last_activity);
            const today = new Date();
            const dayDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
            
            let newStreak = existing.current_streak;
            let newLongestStreak = existing.longest_streak;
            
            if (dayDiff === 1) {
                // Consecutive day
                newStreak = existing.current_streak + 1;
                newLongestStreak = Math.max(newLongestStreak, newStreak);
            } else if (dayDiff > 1) {
                // Streak broken
                newStreak = 1;
            }
            // If dayDiff === 0, same day, don't change streak
            
            await sb
                .from(CBT_Saver_Config.tables.userStats)
                .update({
                    total_quizzes: newTotal,
                    total_score: newTotalScore,
                    total_possible: newTotalPossible,
                    overall_average: newAverage,
                    total_study_minutes: newStudyMinutes,
                    current_streak: newStreak,
                    longest_streak: newLongestStreak,
                    last_activity: getCurrentTimestamp()
                })
                .eq('id', existing.id);
        } else {
            // Create new stats record
            await sb
                .from(CBT_Saver_Config.tables.userStats)
                .insert({
                    user_id: userId,
                    total_quizzes: 1,
                    total_score: testData.correct,
                    total_possible: testData.total,
                    overall_average: score,
                    total_study_minutes: studyMinutes,
                    current_streak: 1,
                    longest_streak: 1,
                    last_activity: getCurrentTimestamp()
                });
        }
        
        console.log('✅ Updated user stats');
        
    } catch (err) {
        console.error('Error updating user stats:', err);
    }
}

/**
 * Create study session record
 */
async function createStudySession(userId, testData) {
    const sb = initCBTSupabase();
    if (!sb) return;
    
    try {
        const studyMinutes = Math.round(((testData.testDuration * 60) - testData.timeRemaining) / 60);
        
        await sb
            .from(CBT_Saver_Config.tables.studySessions)
            .insert({
                user_id: userId,
                subject: testData.subjects.join(', '),
                activity_type: 'quiz',
                duration_minutes: studyMinutes,
                created_at: getCurrentTimestamp()
            });
        
        console.log('✅ Created study session record');
        
    } catch (err) {
        console.error('Error creating study session:', err);
    }
}

/**
 * Save result to localStorage as fallback
 */
function saveResultLocally(testData) {
    try {
        const localResults = JSON.parse(localStorage.getItem('cbt_results') || '[]');
        localResults.push({
            ...testData,
            savedAt: getCurrentTimestamp(),
            synced: false
        });
        localStorage.setItem('cbt_results', JSON.stringify(localResults));
        console.log('💾 Result saved locally');
    } catch (err) {
        console.error('Error saving locally:', err);
    }
}

/**
 * Sync locally saved results when user logs in
 */
async function syncLocalResults() {
    const sb = initCBTSupabase();
    if (!sb) return;
    
    const user = await getCurrentUser();
    if (!user) return;
    
    try {
        const localResults = JSON.parse(localStorage.getItem('cbt_results') || '[]');
        const unsynced = localResults.filter(r => !r.synced);
        
        for (const result of unsynced) {
            const syncResult = await saveQuizResult(result);
            if (syncResult.success) {
                result.synced = true;
                result.syncedAt = getCurrentTimestamp();
            }
        }
        
        localStorage.setItem('cbt_results', JSON.stringify(localResults));
        console.log(`🔄 Synced ${unsynced.length} local results`);
        
    } catch (err) {
        console.error('Error syncing local results:', err);
    }
}

// ============================================
// EXPOSE TO WINDOW
// ============================================
window.CBTResultsSaver = {
    init: initCBTSupabase,
    saveResult: saveQuizResult,
    syncLocal: syncLocalResults,
    getCurrentUser: getCurrentUser
};

// Initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    initCBTSupabase();
    
    // Try to sync any local results
    setTimeout(() => {
        syncLocalResults();
    }, 2000);
});

console.log('✅ CBT Results Saver loaded');
