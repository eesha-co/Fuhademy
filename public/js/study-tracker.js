/**
 * ============================================
 * JUANOVA CORTEX - STUDY TRACKER
 * Tracks study time and quiz scores per topic
 * ============================================
 * 
 * This module handles:
 * - Tracking time spent reading topics
 * - Recording quiz scores
 * - Managing study sessions
 * - Syncing with Supabase database
 */

const StudyTrackerConfig = {
    supabaseUrl: 'https://kruwfhzfqieuiuhqlutt.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',
    
    tables: {
        studySessions: 'study_sessions',
        topicProgress: 'topic_progress',
        dailyStats: 'daily_study_stats',
        userStats: 'user_stats',
        quizResults: 'quiz_results'
    },
    
    // How often to sync time (in seconds)
    syncInterval: 30,
    
    // Minimum time to consider a session valid (seconds)
    minSessionTime: 10
};

// ============================================
// STATE
// ============================================
const StudyTrackerState = {
    supabase: null,
    user: null,
    
    // Current session
    currentSession: null,
    sessionStartTime: null,
    
    // Topic being studied
    currentSubject: null,
    currentTopic: null,
    
    // Time tracking
    elapsedSeconds: 0,
    timerInterval: null,
    
    // Heartbeat
    heartbeatInterval: null,
    lastHeartbeat: null,
    
    // Is initialized
    initialized: false
};

// ============================================
// INITIALIZATION
// ============================================
async function initStudyTracker() {
    if (StudyTrackerState.initialized) return;
    
    console.log('🔧 Initializing Study Tracker...');
    
    // Initialize Supabase
    StudyTrackerState.supabase = await getTrackerSupabase();
    
    if (!StudyTrackerState.supabase) {
        console.error('❌ Failed to initialize Supabase');
        return false;
    }
    
    // Get user
    const user = await getTrackerUser();
    if (!user) {
        console.warn('⚠️ User not authenticated');
        return false;
    }
    
    StudyTrackerState.user = user;
    StudyTrackerState.initialized = true;
    
    console.log('✅ Study Tracker initialized for user:', user.id);
    
    // Sync any pending local data
    await syncLocalData();
    
    return true;
}

async function getTrackerSupabase() {
    if (StudyTrackerState.supabase) return StudyTrackerState.supabase;
    
    // Check global
    if (window.supabaseClient) {
        StudyTrackerState.supabase = window.supabaseClient;
        return StudyTrackerState.supabase;
    }
    
    // Create new
    try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        StudyTrackerState.supabase = createClient(
            StudyTrackerConfig.supabaseUrl,
            StudyTrackerConfig.supabaseKey,
            { auth: { autoRefreshToken: true, persistSession: true } }
        );
        window.supabaseClient = StudyTrackerState.supabase;
        return StudyTrackerState.supabase;
    } catch (err) {
        console.error('Failed to create Supabase client:', err);
        return null;
    }
}

async function getTrackerUser() {
    const sb = await getTrackerSupabase();
    if (!sb) return null;
    
    try {
        const { data: { user } } = await sb.auth.getUser();
        return user;
    } catch (err) {
        console.error('Error getting user:', err);
        return null;
    }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Start tracking a study session for a topic
 * @param {string} subject - Subject name (e.g., "Chemistry")
 * @param {string} topic - Topic name (e.g., "Acids and Bases")
 * @param {string} subjectId - Subject ID
 * @param {string} topicId - Topic ID
 */
async function startStudySession(subject, topic, subjectId = null, topicId = null) {
    console.log(`📖 Starting study session: ${subject} - ${topic}`);
    
    // Initialize if needed
    if (!StudyTrackerState.initialized) {
        await initStudyTracker();
    }
    
    // End any existing session
    if (StudyTrackerState.currentSession) {
        await endStudySession();
    }
    
    StudyTrackerState.currentSubject = subject;
    StudyTrackerState.currentTopic = topic;
    StudyTrackerState.sessionStartTime = new Date();
    StudyTrackerState.elapsedSeconds = 0;
    
    // Start timer
    startTimer();
    
    // Create session record
    const sessionData = {
        user_id: StudyTrackerState.user?.id,
        subject: subject,
        topic: topic,
        started_at: StudyTrackerState.sessionStartTime.toISOString(),
        ended_at: null,
        duration_minutes: 0
    };
    
    // Save locally first
    saveSessionLocally(sessionData);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('studySessionStarted', {
        detail: { subject, topic, startTime: StudyTrackerState.sessionStartTime }
    }));
    
    return true;
}

/**
 * End the current study session
 */
async function endStudySession() {
    if (!StudyTrackerState.currentSession && !StudyTrackerState.currentTopic) {
        return;
    }
    
    console.log('📕 Ending study session');
    
    // Stop timer
    stopTimer();
    
    const endTime = new Date();
    const durationMinutes = Math.round(StudyTrackerState.elapsedSeconds / 60);
    
    // Only save if meaningful time was spent
    if (StudyTrackerState.elapsedSeconds >= StudyTrackerConfig.minSessionTime) {
        const sessionData = {
            user_id: StudyTrackerState.user?.id,
            subject: StudyTrackerState.currentSubject,
            topic: StudyTrackerState.currentTopic,
            started_at: StudyTrackerState.sessionStartTime?.toISOString(),
            ended_at: endTime.toISOString(),
            duration_minutes: durationMinutes
        };
        
        // Save to database
        await saveSessionToDatabase(sessionData);
        
        // Update daily stats
        await updateDailyStats(durationMinutes);
        
        // Update topic progress
        await updateTopicTime(
            StudyTrackerState.currentSubject,
            StudyTrackerState.currentTopic,
            durationMinutes
        );
    }
    
    // Clear state
    StudyTrackerState.currentSession = null;
    StudyTrackerState.currentSubject = null;
    StudyTrackerState.currentTopic = null;
    StudyTrackerState.sessionStartTime = null;
    StudyTrackerState.elapsedSeconds = 0;
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('studySessionEnded', {
        detail: { durationMinutes }
    }));
    
    return durationMinutes;
}

/**
 * Pause the current session (e.g., user switches tabs)
 */
function pauseStudySession() {
    if (StudyTrackerState.timerInterval) {
        console.log('⏸️ Session paused');
        clearInterval(StudyTrackerState.timerInterval);
        StudyTrackerState.timerInterval = null;
    }
}

/**
 * Resume a paused session
 */
function resumeStudySession() {
    if (StudyTrackerState.currentTopic && !StudyTrackerState.timerInterval) {
        console.log('▶️ Session resumed');
        startTimer();
    }
}

// ============================================
// TIMER
// ============================================
function startTimer() {
    if (StudyTrackerState.timerInterval) return;
    
    StudyTrackerState.timerInterval = setInterval(() => {
        StudyTrackerState.elapsedSeconds++;
        
        // Update display if element exists
        const elapsedEl = document.getElementById('studyTimeElapsed');
        if (elapsedEl) {
            elapsedEl.textContent = formatTime(StudyTrackerState.elapsedSeconds);
        }
        
        // Sync every 30 seconds
        if (StudyTrackerState.elapsedSeconds % StudyTrackerConfig.syncInterval === 0) {
            syncCurrentSession();
        }
    }, 1000);
}

function stopTimer() {
    if (StudyTrackerState.timerInterval) {
        clearInterval(StudyTrackerState.timerInterval);
        StudyTrackerState.timerInterval = null;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function syncCurrentSession() {
    if (!StudyTrackerState.currentTopic) return;
    
    const durationMinutes = Math.round(StudyTrackerState.elapsedSeconds / 60);
    
    // Update local storage
    const sessions = JSON.parse(localStorage.getItem('study_sessions_pending') || '[]');
    const currentIdx = sessions.findIndex(s => 
        s.topic === StudyTrackerState.currentTopic && !s.ended_at
    );
    
    if (currentIdx >= 0) {
        sessions[currentIdx].duration_minutes = durationMinutes;
        localStorage.setItem('study_sessions_pending', JSON.stringify(sessions));
    }
}

// ============================================
// QUIZ TRACKING
// ============================================

/**
 * Record a topic quiz result
 * @param {string} subject - Subject name
 * @param {string} topic - Topic name  
 * @param {number} score - Score percentage (0-100)
 * @param {number} totalQuestions - Total number of questions
 * @param {number} correctAnswers - Number of correct answers
 */
async function recordQuizResult(subject, topic, score, totalQuestions, correctAnswers) {
    console.log(`📝 Recording quiz result: ${subject} - ${topic}: ${score}%`);
    
    if (!StudyTrackerState.initialized) {
        await initStudyTracker();
    }
    
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    
    if (!sb || !user) {
        // Save locally
        saveQuizResultLocally({ subject, topic, score, totalQuestions, correctAnswers });
        return { success: false, message: 'Not authenticated' };
    }
    
    try {
        // Update topic progress
        const { data: existing, error: fetchError } = await sb
            .from(StudyTrackerConfig.tables.topicProgress)
            .select('*')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .maybeSingle();
        
        const now = new Date().toISOString();
        
        if (existing) {
            // Update existing
            const newAttempts = (existing.quiz_attempts || 0) + 1;
            const bestScore = Math.max(existing.quiz_best_score || 0, score);
            const avgScore = existing.quiz_score 
                ? ((existing.quiz_score * (existing.quiz_attempts || 0)) + score) / newAttempts
                : score;
            
            await sb
                .from(StudyTrackerConfig.tables.topicProgress)
                .update({
                    quiz_score: avgScore,
                    quiz_attempts: newAttempts,
                    quiz_best_score: bestScore,
                    status: score >= 70 ? 'completed' : 'in_progress',
                    last_accessed_at: now,
                    updated_at: now
                })
                .eq('id', existing.id);
        } else {
            // Create new
            await sb
                .from(StudyTrackerConfig.tables.topicProgress)
                .insert({
                    user_id: user.id,
                    subject: subject,
                    topic: topic,
                    subject_id: null,
                    topic_id: null,
                    quiz_score: score,
                    quiz_attempts: 1,
                    quiz_best_score: score,
                    status: score >= 70 ? 'completed' : 'in_progress',
                    time_spent_min: 0,
                    last_accessed_at: now
                });
        }
        
        // Update daily stats
        await updateDailyStats(0, 1, score);
        
        // Update user stats
        await updateUserQuizStats(score);
        
        console.log('✅ Quiz result saved');
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('quizCompleted', {
            detail: { subject, topic, score, totalQuestions, correctAnswers }
        }));
        
        return { success: true };
        
    } catch (err) {
        console.error('Error saving quiz result:', err);
        saveQuizResultLocally({ subject, topic, score, totalQuestions, correctAnswers });
        return { success: false, message: err.message };
    }
}

async function updateUserQuizStats(score) {
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    if (!sb || !user) return;
    
    try {
        const { data: stats } = await sb
            .from(StudyTrackerConfig.tables.userStats)
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
        
        const now = new Date().toISOString();
        
        if (stats) {
            const newTotal = (stats.total_quizzes || 0) + 1;
            const newTotalScore = (stats.total_score || 0) + score;
            const newAvg = Math.round(newTotalScore / newTotal);
            
            await sb
                .from(StudyTrackerConfig.tables.userStats)
                .update({
                    total_quizzes: newTotal,
                    total_score: newTotalScore,
                    overall_average: newAvg,
                    last_activity: now
                })
                .eq('id', stats.id);
        } else {
            await sb
                .from(StudyTrackerConfig.tables.userStats)
                .insert({
                    user_id: user.id,
                    total_quizzes: 1,
                    total_score: score,
                    overall_average: score,
                    total_study_minutes: 0,
                    current_streak: 0,
                    longest_streak: 0,
                    last_activity: now
                });
        }
    } catch (err) {
        console.error('Error updating user stats:', err);
    }
}

async function updateTopicTime(subject, topic, minutes) {
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    if (!sb || !user) return;
    
    try {
        const { data: existing } = await sb
            .from(StudyTrackerConfig.tables.topicProgress)
            .select('*')
            .eq('user_id', user.id)
            .eq('topic', topic)
            .maybeSingle();
        
        const now = new Date().toISOString();
        
        if (existing) {
            await sb
                .from(StudyTrackerConfig.tables.topicProgress)
                .update({
                    time_spent_min: (existing.time_spent_min || 0) + minutes,
                    last_accessed_at: now,
                    status: existing.status === 'not_started' ? 'in_progress' : existing.status
                })
                .eq('id', existing.id);
        } else {
            await sb
                .from(StudyTrackerConfig.tables.topicProgress)
                .insert({
                    user_id: user.id,
                    subject: subject,
                    topic: topic,
                    subject_id: null,
                    topic_id: null,
                    time_spent_min: minutes,
                    status: 'in_progress',
                    last_accessed_at: now
                });
        }
    } catch (err) {
        console.error('Error updating topic time:', err);
    }
}

async function updateDailyStats(minutes = 0, quizzes = 0, score = null) {
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    if (!sb || !user) return;
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    try {
        const { data: existing } = await sb
            .from(StudyTrackerConfig.tables.dailyStats)
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle();
        
        if (existing) {
            const newMinutes = (existing.total_minutes || 0) + minutes;
            const newQuizzes = (existing.quizzes_taken || 0) + quizzes;
            const newAvg = score !== null 
                ? existing.avg_quiz_score 
                    ? ((existing.avg_quiz_score * existing.quizzes_taken) + score) / newQuizzes
                    : score
                : existing.avg_quiz_score;
            
            await sb
                .from(StudyTrackerConfig.tables.dailyStats)
                .update({
                    total_minutes: newMinutes,
                    quizzes_taken: newQuizzes,
                    avg_quiz_score: newAvg
                })
                .eq('id', existing.id);
        } else {
            await sb
                .from(StudyTrackerConfig.tables.dailyStats)
                .insert({
                    user_id: user.id,
                    date: today,
                    total_minutes: minutes,
                    quizzes_taken: quizzes,
                    avg_quiz_score: score
                });
        }
    } catch (err) {
        console.error('Error updating daily stats:', err);
    }
}

// ============================================
// LOCAL STORAGE FALLBACKS
// ============================================
function saveSessionLocally(session) {
    const sessions = JSON.parse(localStorage.getItem('study_sessions_pending') || '[]');
    sessions.push({ ...session, savedAt: new Date().toISOString(), synced: false });
    localStorage.setItem('study_sessions_pending', JSON.stringify(sessions));
}

function saveQuizResultLocally(result) {
    const results = JSON.parse(localStorage.getItem('quiz_results_pending') || '[]');
    results.push({ ...result, savedAt: new Date().toISOString(), synced: false });
    localStorage.setItem('quiz_results_pending', JSON.stringify(results));
}

async function saveSessionToDatabase(session) {
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    
    if (!sb || !user) {
        saveSessionLocally(session);
        return false;
    }
    
    try {
        // Save to study_sessions
        await sb.from(StudyTrackerConfig.tables.studySessions).insert({
            user_id: user.id,
            subject: session.subject,
            topic: session.topic,
            duration_minutes: session.duration_minutes,
            created_at: session.started_at
        });
        
        // Update user stats total study minutes
        const { data: stats } = await sb
            .from(StudyTrackerConfig.tables.userStats)
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (stats) {
            const now = new Date();
            const lastActivity = stats.last_activity ? new Date(stats.last_activity) : null;
            
            // Calculate streak
            let newStreak = stats.current_streak || 0;
            if (lastActivity) {
                const dayDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    newStreak = (stats.current_streak || 0) + 1;
                } else if (dayDiff > 1) {
                    newStreak = 1;
                }
                // dayDiff === 0 means same day, keep streak
            } else {
                newStreak = 1;
            }
            
            await sb
                .from(StudyTrackerConfig.tables.userStats)
                .update({
                    total_study_minutes: (stats.total_study_minutes || 0) + session.duration_minutes,
                    current_streak: newStreak,
                    longest_streak: Math.max(stats.longest_streak || 0, newStreak),
                    last_activity: now.toISOString()
                })
                .eq('id', stats.id);
        }
        
        return true;
    } catch (err) {
        console.error('Error saving session to database:', err);
        saveSessionLocally(session);
        return false;
    }
}

async function syncLocalData() {
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    
    if (!sb || !user) return;
    
    // Sync pending sessions
    const sessions = JSON.parse(localStorage.getItem('study_sessions_pending') || '[]');
    const unsynced = sessions.filter(s => !s.synced);
    
    for (const session of unsynced) {
        const saved = await saveSessionToDatabase(session);
        if (saved) {
            session.synced = true;
        }
    }
    localStorage.setItem('study_sessions_pending', JSON.stringify(sessions));
    
    // Sync pending quiz results
    const quizzes = JSON.parse(localStorage.getItem('quiz_results_pending') || '[]');
    const unsyncedQuizzes = quizzes.filter(q => !q.synced);
    
    for (const quiz of unsyncedQuizzes) {
        const result = await recordQuizResult(
            quiz.subject, quiz.topic, quiz.score, 
            quiz.totalQuestions, quiz.correctAnswers
        );
        if (result.success) {
            quiz.synced = true;
        }
    }
    localStorage.setItem('quiz_results_pending', JSON.stringify(quizzes));
    
    console.log(`🔄 Synced ${unsynced.length} sessions and ${unsyncedQuizzes.length} quiz results`);
}

// ============================================
// DATA RETRIEVAL
// ============================================
async function getStudyStats(period = 'all') {
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    
    if (!sb || !user) return null;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
        case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            startDate = new Date(0); // All time
    }
    
    try {
        // Get daily stats
        const { data: dailyStats } = await sb
            .from(StudyTrackerConfig.tables.dailyStats)
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate.toISOString().split('T')[0]);
        
        // Get topic progress
        const { data: topicProgress } = await sb
            .from(StudyTrackerConfig.tables.topicProgress)
            .select('*')
            .eq('user_id', user.id);
        
        // Aggregate
        const stats = {
            totalMinutes: dailyStats?.reduce((sum, d) => sum + (d.total_minutes || 0), 0) || 0,
            totalQuizzes: dailyStats?.reduce((sum, d) => sum + (d.quizzes_taken || 0), 0) || 0,
            topicsStudied: topicProgress?.filter(t => t.time_spent_min > 0).length || 0,
            topicsCompleted: topicProgress?.filter(t => t.status === 'completed').length || 0,
            avgScore: null
        };
        
        // Calculate average score
        const scores = dailyStats?.filter(d => d.avg_quiz_score !== null).map(d => d.avg_quiz_score) || [];
        if (scores.length > 0) {
            stats.avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
        
        return stats;
        
    } catch (err) {
        console.error('Error getting study stats:', err);
        return null;
    }
}

async function getSubjectPerformance() {
    const sb = StudyTrackerState.supabase;
    const user = StudyTrackerState.user;
    
    if (!sb || !user) return [];
    
    try {
        const { data } = await sb
            .from(StudyTrackerConfig.tables.topicProgress)
            .select('*')
            .eq('user_id', user.id);
        
        // Group by subject
        const subjects = {};
        data?.forEach(item => {
            if (!subjects[item.subject]) {
                subjects[item.subject] = {
                    subject: item.subject,
                    topics: 0,
                    completedTopics: 0,
                    totalTimeMin: 0,
                    totalQuizzes: 0,
                    avgScore: 0,
                    scores: []
                };
            }
            
            subjects[item.subject].topics++;
            subjects[item.subject].totalTimeMin += item.time_spent_min || 0;
            subjects[item.subject].totalQuizzes += item.quiz_attempts || 0;
            
            if (item.status === 'completed') {
                subjects[item.subject].completedTopics++;
            }
            
            if (item.quiz_score) {
                subjects[item.subject].scores.push(item.quiz_score);
            }
        });
        
        // Calculate averages
        return Object.values(subjects).map(s => ({
            ...s,
            avgScore: s.scores.length > 0 
                ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length)
                : null,
            completionRate: Math.round((s.completedTopics / s.topics) * 100)
        }));
        
    } catch (err) {
        console.error('Error getting subject performance:', err);
        return [];
    }
}

// ============================================
// PAGE VISIBILITY HANDLING
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseStudySession();
    } else {
        resumeStudySession();
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (StudyTrackerState.currentTopic) {
        endStudySession();
    }
});

// ============================================
// EXPORT
// ============================================
window.StudyTracker = {
    init: initStudyTracker,
    startSession: startStudySession,
    endSession: endStudySession,
    pauseSession: pauseStudySession,
    resumeSession: resumeStudySession,
    recordQuiz: recordQuizResult,
    getStats: getStudyStats,
    getSubjectPerformance,
    syncLocal: syncLocalData,
    
    // State access
    getState: () => StudyTrackerState,
    getCurrentTime: () => StudyTrackerState.elapsedSeconds,
    getCurrentTimeFormatted: () => formatTime(StudyTrackerState.elapsedSeconds)
};

console.log('✅ Study Tracker loaded');
