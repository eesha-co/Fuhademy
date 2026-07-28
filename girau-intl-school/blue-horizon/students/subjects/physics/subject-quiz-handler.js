/**
 * ============================================
 * PHYSICS SUBJECT - QUIZ RESULTS HANDLER
 * ============================================
 * This file handles quiz result collection and saving to Supabase
 * for all Physics topic files.
 */

const PhysicsQuiz = {
    subject: 'Physics',
    
    /**
     * Save quiz result to Supabase
     */
    async saveQuizResult(result) {
        console.log(`⚛️ PhysicsQuiz: Saving quiz result for "${result.topicTitle}"`);
        
        try {
            const supabase = await this.getSupabaseClient();
            if (!supabase) {
                console.warn('⚠️ PhysicsQuiz: Supabase not available');
                return { success: false, error: 'supabase_not_initialized' };
            }
            
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                console.warn('⚠️ PhysicsQuiz: User not authenticated');
                return { success: false, error: 'not_authenticated' };
            }
            
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
            
            console.log('📊 PhysicsQuiz: Saving to topic_quiz_results:', {
                topic: quizData.topic_title,
                subject: quizData.subject,
                score: quizData.score,
                percentage: quizData.percentage,
                passed: quizData.passed
            });
            
            const { error } = await supabase
                .from('topic_quiz_results')
                .insert(quizData);
            
            if (error) {
                console.error('❌ PhysicsQuiz: Error saving result:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ PhysicsQuiz: Quiz result saved successfully');
            
            window.dispatchEvent(new CustomEvent('quizCompleted', {
                detail: {
                    topicId: quizData.topic_id,
                    subject: this.subject,
                    percentage: quizData.percentage,
                    passed: quizData.passed
                }
            }));
            
            if (window.GoalsManager && window.GoalsManager.syncGoalProgress) {
                await window.GoalsManager.syncGoalProgress();
            }
            
            return { success: true };
            
        } catch (err) {
            console.error('❌ PhysicsQuiz: Exception saving result:', err);
            return { success: false, error: err.message };
        }
    },
    
    async savePracticeResult(practiceResult) {
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
    
    async getSupabaseClient() {
        if (window.supabaseClient) return window.supabaseClient;
        if (window.supabase && typeof window.supabase.from === 'function') return window.supabase;
        
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
            setTimeout(() => { clearInterval(checkInterval); resolve(null); }, 5000);
        });
    },
    
    extractTopicId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        return filename || 'unknown-physics-topic';
    },
    
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
            
            if (error) return [];
            return data || [];
        } catch (err) { return []; }
    },
    
    async getTopicAverage() {
        const history = await this.getQuizHistory();
        if (history.length === 0) return null;
        return Math.round(history.reduce((acc, r) => acc + r.percentage, 0) / history.length);
    },
    
    async getBestScore() {
        const history = await this.getQuizHistory();
        if (history.length === 0) return null;
        return Math.max(...history.map(r => r.percentage));
    }
};

window.PhysicsQuiz = PhysicsQuiz;
console.log('✅ PhysicsQuiz handler loaded');
