/**
 * ============================================
 * JUANOVA CORTEX - CBT RESULTS SAVER
 * Saves quiz results to Supabase for analytics
 * ============================================
 */

// ============================================
// CONFIGURATION
// ============================================
const CBT_Saver_Config = {
    supabaseUrl: 'https://kruwfhzfqieuiuhqlutt.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',
    
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

async function initCBTSupabase() {
    if (cbtSupabase) return cbtSupabase;
    
    // Check if already initialized globally
    if (window.supabaseClient) {
        cbtSupabase = window.supabaseClient;
        console.log('✅ CBT: Using global Supabase client');
        return cbtSupabase;
    }
    
    // Try to create using ES modules
    try {
        console.log('🔧 CBT: Creating Supabase client...');
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        
        cbtSupabase = createClient(
            CBT_Saver_Config.supabaseUrl,
            CBT_Saver_Config.supabaseKey,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            }
        );
        
        window.supabaseClient = cbtSupabase;
        console.log('✅ CBT: Supabase client created');
        return cbtSupabase;
        
    } catch (err) {
        console.error('❌ CBT: Failed to create Supabase client:', err);
        return null;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getCurrentUser() {
    const sb = await initCBTSupabase();
    if (!sb) return null;
    
    try {
        const { data: { user }, error } = await sb.auth.getUser();
        if (error) {
            console.log('CBT: User not authenticated:', error.message);
            return null;
        }
        return user;
    } catch (err) {
        console.error('CBT: Error getting user:', err);
        return null;
    }
}

function getCurrentTimestamp() {
    return new Date().toISOString();
}

// ============================================
// MAIN SAVE FUNCTIONS
// ============================================

async function saveQuizResult(testData) {
    console.log('💾 CBT: Saving quiz result...');
    
    const sb = await initCBTSupabase();
    if (!sb) {
        console.warn('⚠️ CBT: Supabase not available, saving locally');
        saveResultLocally(testData);
        return { success: false, message: 'Database not available - saved locally' };
    }
    
    const user = await getCurrentUser();
    if (!user) {
        console.warn('⚠️ CBT: User not logged in, saving locally');
        saveResultLocally(testData);
        return { success: false, message: 'Not logged in - saved locally' };
    }
    
    try {
        const timeSpent = (testData.testDuration * 60) - testData.timeRemaining;
        const percentage = Math.round((testData.correct / testData.total) * 100);
        const passed = percentage >= 50;
        
        // Create quiz result record
        const quizResult = {
            user_id: user.id,
            quiz_name: testData.quizName || 'JAMB CBT Practice',
            quiz_id: testData.quizId || `cbt_${Date.now()}`,
            subject: testData.subjects.join(', '),
            score: testData.correct,
            total_questions: testData.total,
            time_taken: timeSpent,
            passed: passed,
            difficulty: testData.testMode === 'full' ? 'hard' : 'medium',
            created_at: getCurrentTimestamp()
        };
        
        console.log('📝 CBT: Inserting quiz result:', quizResult);
        
        const { data: insertedResult, error: insertError } = await sb
            .from(CBT_Saver_Config.tables.quizResults)
            .insert(quizResult)
            .select()
            .single();
        
        if (insertError) {
            console.error('❌ CBT: Insert error:', insertError);
            saveResultLocally(testData);
            
            // More specific error message
            if (insertError.code === '42P01') {
                return { success: false, message: 'Table not found. Run SQL setup in Supabase.' };
            }
            if (insertError.code === '42501' || insertError.message.includes('policy')) {
                return { success: false, message: 'Permission denied. Check RLS policies.' };
            }
            return { success: false, message: insertError.message };
        }
        
        console.log('✅ CBT: Quiz result saved:', insertedResult);
        
        // Save question responses if available
        if (insertedResult && testData.questions && testData.answers) {
            await saveQuestionResponses(insertedResult.id, user.id, testData.questions, testData.answers);
        }
        
        // Update subject progress
        if (testData.subjectBreakdown) {
            for (const subjectData of testData.subjectBreakdown) {
                await updateSubjectProgress(user.id, subjectData);
            }
        }
        
        // Update user stats
        await updateUserStats(user.id, testData);
        
        // Create study session
        await createStudySession(user.id, testData);
        
        return { 
            success: true, 
            message: 'Results saved successfully',
            resultId: insertedResult.id 
        };
        
    } catch (err) {
        console.error('❌ CBT: Error in saveQuizResult:', err);
        saveResultLocally(testData);
        return { success: false, message: err.message };
    }
}

async function saveQuestionResponses(resultId, userId, questions, answers) {
    const sb = await initCBTSupabase();
    if (!sb) return;
    
    try {
        const responses = [];
        const optionLetters = ['A', 'B', 'C', 'D'];
        
        questions.forEach((question, index) => {
            const userAnswer = answers[`${index}`];
            const isCorrect = userAnswer === question.correctAnswer;
            
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
        
        const { error } = await sb
            .from(CBT_Saver_Config.tables.questionResponses)
            .insert(responses);
        
        if (error) {
            console.error('CBT: Error saving responses:', error);
        } else {
            console.log(`✅ CBT: Saved ${responses.length} responses`);
        }
        
    } catch (err) {
        console.error('CBT: Error in saveQuestionResponses:', err);
    }
}

async function updateSubjectProgress(userId, subjectData) {
    const sb = await initCBTSupabase();
    if (!sb) return;
    
    try {
        // Try to find existing record
        const { data: existing, error: fetchError } = await sb
            .from(CBT_Saver_Config.tables.userProgress)
            .select('*')
            .eq('user_id', userId)
            .eq('subject', subjectData.subject)
            .maybeSingle();
        
        const subjectScore = Math.round((subjectData.correct / subjectData.total) * 100);
        
        if (existing) {
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
                    best_score: Math.max(existing.best_score || 0, subjectScore),
                    worst_score: Math.min(existing.worst_score || 100, subjectScore),
                    last_activity: getCurrentTimestamp()
                })
                .eq('id', existing.id);
        } else {
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
        
        console.log(`✅ CBT: Updated progress for ${subjectData.subject}`);
        
    } catch (err) {
        console.error('CBT: Error updating progress:', err);
    }
}

async function updateUserStats(userId, testData) {
    const sb = await initCBTSupabase();
    if (!sb) return;
    
    try {
        const { data: existing, error: fetchError } = await sb
            .from(CBT_Saver_Config.tables.userStats)
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        
        const score = Math.round((testData.correct / testData.total) * 100);
        const studyMinutes = Math.round(((testData.testDuration * 60) - testData.timeRemaining) / 60);
        
        if (existing) {
            const newTotal = existing.total_quizzes + 1;
            const newTotalScore = existing.total_score + testData.correct;
            const newTotalPossible = existing.total_possible + testData.total;
            const newAverage = Math.round((newTotalScore / newTotalPossible) * 100);
            
            // Calculate streak
            const lastActivity = new Date(existing.last_activity);
            const today = new Date();
            const dayDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
            
            let newStreak = existing.current_streak || 1;
            let newLongestStreak = existing.longest_streak || 1;
            
            if (dayDiff === 1) {
                newStreak = (existing.current_streak || 0) + 1;
                newLongestStreak = Math.max(newLongestStreak, newStreak);
            } else if (dayDiff > 1) {
                newStreak = 1;
            }
            
            await sb
                .from(CBT_Saver_Config.tables.userStats)
                .update({
                    total_quizzes: newTotal,
                    total_score: newTotalScore,
                    total_possible: newTotalPossible,
                    overall_average: newAverage,
                    total_study_minutes: (existing.total_study_minutes || 0) + studyMinutes,
                    current_streak: newStreak,
                    longest_streak: newLongestStreak,
                    last_activity: getCurrentTimestamp()
                })
                .eq('id', existing.id);
        } else {
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
        
        console.log('✅ CBT: Updated user stats');
        
    } catch (err) {
        console.error('CBT: Error updating stats:', err);
    }
}

async function createStudySession(userId, testData) {
    const sb = await initCBTSupabase();
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
        
        console.log('✅ CBT: Created study session');
        
    } catch (err) {
        console.error('CBT: Error creating session:', err);
    }
}

function saveResultLocally(testData) {
    try {
        const localResults = JSON.parse(localStorage.getItem('cbt_results') || '[]');
        localResults.push({
            ...testData,
            savedAt: getCurrentTimestamp(),
            synced: false
        });
        localStorage.setItem('cbt_results', JSON.stringify(localResults));
        console.log('💾 CBT: Result saved locally');
    } catch (err) {
        console.error('CBT: Error saving locally:', err);
    }
}

async function syncLocalResults() {
    const sb = await initCBTSupabase();
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
        console.log(`🔄 CBT: Synced ${unsynced.length} local results`);
        
    } catch (err) {
        console.error('CBT: Error syncing:', err);
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
    
    setTimeout(() => {
        syncLocalResults();
    }, 2000);
});

console.log('✅ CBT Results Saver loaded');
