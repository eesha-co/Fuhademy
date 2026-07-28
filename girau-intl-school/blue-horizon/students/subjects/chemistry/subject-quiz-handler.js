/**
 * ============================================
 * CHEMISTRY SUBJECT - QUIZ RESULTS HANDLER
 * ============================================
 * This file handles quiz result collection and saving to Supabase
 * for all Chemistry topic files.
 * 
 * Usage:
 * 1. Include this script in your Chemistry topic HTML files
 * 2. Call ChemistryQuiz.saveQuizResult() after quiz completion
 * 
 * The quiz results are saved to the 'topic_quiz_results' table
 * and used to calculate subject mastery in the dashboard.
 */

const ChemistryQuiz = {
    subject: 'Chemistry',
    
    /**
     * Save quiz result to Supabase
     * @param {Object} result - Quiz result data
     * @param {string} result.topicId - Topic identifier (e.g., 'periodic-table-overview')
     * @param {string} result.topicTitle - Human readable topic title
     * @param {number} result.score - Number of correct answers
     * @param {number} result.totalQuestions - Total number of questions
     * @param {number} result.percentage - Percentage score (0-100)
     * @param {boolean} result.passed - Whether user passed the quiz
     * @param {Array} result.answers - Array of answer objects (optional)
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async saveQuizResult(result) {
        console.log(`🧪 ChemistryQuiz: Saving quiz result for "${result.topicTitle}"`);
        
        try {
            // Get Supabase client
            const supabase = await this.getSupabaseClient();
            if (!supabase) {
                console.warn('⚠️ ChemistryQuiz: Supabase not available');
                return { success: false, error: 'supabase_not_initialized' };
            }
            
            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                console.warn('⚠️ ChemistryQuiz: User not authenticated');
                return { success: false, error: 'not_authenticated' };
            }
            
            // Prepare quiz result data
            const quizData = {
                user_id: user.id,
                topic_id: result.topicId || this.extractTopicId(),
                topic_title: result.topicTitle || document.title.split('|')[0].trim(),
                subject: this.subject,
                score: result.score,
                total_questions: result.totalQuestions,
                percentage: result.percentage || Math.round((result.score / result.totalQuestions) * 100),
                passed: result.passed !== undefined ? result.passed : (result.percentage >= 60),
                answers: result.answers || [],
                completed_at: new Date().toISOString()
            };
            
            console.log('📊 ChemistryQuiz: Saving to topic_quiz_results:', {
                topic: quizData.topic_title,
                subject: quizData.subject,
                score: quizData.score,
                percentage: quizData.percentage,
                passed: quizData.passed
            });
            
            // Save to Supabase
            const { error } = await supabase
                .from('topic_quiz_results')
                .insert(quizData);
            
            if (error) {
                console.error('❌ ChemistryQuiz: Error saving result:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ ChemistryQuiz: Quiz result saved successfully');
            
            // Dispatch event for other components to listen to
            window.dispatchEvent(new CustomEvent('quizCompleted', {
                detail: {
                    topicId: quizData.topic_id,
                    subject: this.subject,
                    percentage: quizData.percentage,
                    passed: quizData.passed
                }
            }));
            
            // Sync goals progress if GoalsManager is available
            if (window.GoalsManager && window.GoalsManager.syncGoalProgress) {
                console.log('🔄 ChemistryQuiz: Syncing goals progress...');
                try {
                    await window.GoalsManager.syncGoalProgress();
                    console.log('✅ ChemistryQuiz: Goals progress synced');
                } catch (syncErr) {
                    console.warn('⚠️ ChemistryQuiz: Failed to sync goals:', syncErr);
                }
            }
            
            return { success: true };
            
        } catch (err) {
            console.error('❌ ChemistryQuiz: Exception saving result:', err);
            return { success: false, error: err.message };
        }
    },
    
    /**
     * Save practice question result (for tracking practice progress)
     * @param {Object} practiceResult - Practice question result
     * @param {string} practiceResult.topicId - Topic identifier
     * @param {string} practiceResult.topicTitle - Topic title
     * @param {string} practiceResult.questionType - Type of practice question
     * @param {number} practiceResult.correct - Number correct
     * @param {number} practiceResult.total - Total questions
     * @returns {Promise<{success: boolean}>}
     */
    async savePracticeResult(practiceResult) {
        console.log(`📝 ChemistryQuiz: Saving practice result for "${practiceResult.questionType}"`);
        
        // Calculate percentage but mark as practice (not a full quiz)
        const percentage = Math.round((practiceResult.correct / practiceResult.total) * 100);
        
        return await this.saveQuizResult({
            topicId: practiceResult.topicId + '-practice-' + practiceResult.questionType,
            topicTitle: practiceResult.topicTitle + ' - Practice',
            score: practiceResult.correct,
            totalQuestions: practiceResult.total,
            percentage: percentage,
            passed: percentage >= 60,
            answers: []
        });
    },
    
    /**
     * Get Supabase client from various sources
     */
    async getSupabaseClient() {
        // Check for global supabaseClient
        if (window.supabaseClient) {
            return window.supabaseClient;
        }
        
        // Check for supabase object
        if (window.supabase && typeof window.supabase.from === 'function') {
            return window.supabase;
        }
        
        // Wait for supabase to be ready
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.supabaseClient) {
                    clearInterval(checkInterval);
                    resolve(window.supabaseClient);
                } else if (window.supabase && typeof window.supabase.from === 'function') {
                    clearInterval(checkInterval);
                    resolve(window.supabase);
                }
            }, 100);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve(null);
            }, 5000);
        });
    },
    
    /**
     * Extract topic ID from URL
     */
    extractTopicId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        return filename || 'unknown-chemistry-topic';
    },
    
    /**
     * Get quiz history for current user and topic
     * @param {string} topicId - Optional topic ID (uses current page if not provided)
     * @returns {Promise<Array>}
     */
    async getQuizHistory(topicId) {
        try {
            const supabase = await this.getSupabaseClient();
            if (!supabase) return [];
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            
            const targetTopicId = topicId || this.extractTopicId();
            
            const { data, error } = await supabase
                .from('topic_quiz_results')
                .select('*')
                .eq('user_id', user.id)
                .eq('topic_id', targetTopicId)
                .eq('subject', this.subject)
                .order('completed_at', { ascending: false });
            
            if (error) {
                console.warn('⚠️ ChemistryQuiz: Error fetching history:', error);
                return [];
            }
            
            return data || [];
            
        } catch (err) {
            console.error('❌ ChemistryQuiz: Error getting history:', err);
            return [];
        }
    },
    
    /**
     * Get average score for current topic
     * @returns {Promise<number|null>}
     */
    async getTopicAverage() {
        const history = await this.getQuizHistory();
        if (history.length === 0) return null;
        
        const sum = history.reduce((acc, result) => acc + result.percentage, 0);
        return Math.round(sum / history.length);
    },
    
    /**
     * Get best score for current topic
     * @returns {Promise<number|null>}
     */
    async getBestScore() {
        const history = await this.getQuizHistory();
        if (history.length === 0) return null;
        
        return Math.max(...history.map(result => result.percentage));
    }
};

// Make available globally
window.ChemistryQuiz = ChemistryQuiz;

console.log('✅ ChemistryQuiz handler loaded');
