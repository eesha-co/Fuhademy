/**
 * ============================================
 * COMMERCE SUBJECT - QUIZ RESULTS HANDLER
 * ============================================
 * This file handles quiz result collection and saving to Supabase
 * for all Commerce topic files.
 */

const CommerceQuiz = {
    subject: 'Commerce',
    
    async saveQuizResult(result) {
        console.log(`💼 CommerceQuiz: Saving quiz result for "${result.topicTitle}"`);
        
        try {
            const supabase = await this.getSupabaseClient();
            if (!supabase) return { success: false, error: 'supabase_not_initialized' };
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'not_authenticated' };
            
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
            
            const { error } = await supabase.from('topic_quiz_results').insert(quizData);
            if (error) return { success: false, error: error.message };
            
            window.dispatchEvent(new CustomEvent('quizCompleted', {
                detail: { topicId: quizData.topic_id, subject: this.subject, percentage: quizData.percentage, passed: quizData.passed }
            }));
            
            if (window.GoalsManager?.syncGoalProgress) await window.GoalsManager.syncGoalProgress();
            
            return { success: true };
        } catch (err) {
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
            percentage, passed: percentage >= 60, answers: []
        });
    },
    
    async getSupabaseClient() {
        if (window.supabaseClient) return window.supabaseClient;
        if (window.supabase?.from) return window.supabase;
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.supabaseClient) { clearInterval(check); resolve(window.supabaseClient); }
                else if (window.supabase?.from) { clearInterval(check); resolve(window.supabase); }
            }, 100);
            setTimeout(() => { clearInterval(check); resolve(null); }, 5000);
        });
    },
    
    extractTopicId() {
        return window.location.pathname.split('/').pop().replace('.html', '') || 'unknown-commerce-topic';
    },
    
    async getQuizHistory(topicId) {
        try {
            const supabase = await this.getSupabaseClient();
            if (!supabase) return [];
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            const { data } = await supabase.from('topic_quiz_results').select('*')
                .eq('user_id', user.id).eq('topic_id', topicId || this.extractTopicId())
                .eq('subject', this.subject).order('completed_at', { ascending: false });
            return data || [];
        } catch { return []; }
    },
    
    async getTopicAverage() {
        const history = await this.getQuizHistory();
        return history.length ? Math.round(history.reduce((a, r) => a + r.percentage, 0) / history.length) : null;
    },
    
    async getBestScore() {
        const history = await this.getQuizHistory();
        return history.length ? Math.max(...history.map(r => r.percentage)) : null;
    }
};

window.CommerceQuiz = CommerceQuiz;
console.log('✅ CommerceQuiz handler loaded');
