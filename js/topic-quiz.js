/**
 * Topic Quiz System - Interactive quiz for educational topics
 * Integrates with TopicTracker and Supabase for progress tracking
 * 
 * Features:
 * - Multiple choice questions with feedback
 * - Score calculation and tracking
 * - Pass/fail threshold
 * - Retake option
 * - Syncs results to Supabase
 */

import { getSupabase } from './supabase-client.js';

class TopicQuiz {
    constructor(config = {}) {
        this.topicId = config.topicId || this.extractTopicId();
        this.topicTitle = config.topicTitle || document.title.split('|')[0].trim();
        this.subject = config.subject || 'general';
        this.questions = config.questions || [];
        this.passingScore = config.passingScore || 60; // 60% to pass
        this.currentIndex = 0;
        this.score = 0;
        this.answers = [];
        this.isStarted = false;
        this.isCompleted = false;
        this.tracker = config.tracker || null;
        
        this.modalId = 'topic-quiz-modal';
        this.init();
    }

    extractTopicId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        return filename || 'unknown-topic';
    }

    init() {
        // Create modal if not exists
        this.createModal();
        
        // Bind to complete button if exists
        const completeBtn = document.getElementById('topic-complete-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.start());
        }

        console.log('TopicQuiz initialized with', this.questions.length, 'questions');
    }

    createModal() {
        // Check if modal already exists
        if (document.getElementById(this.modalId)) return;

        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-slide-up">
                <!-- Header -->
                <div class="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-bold" id="quiz-title">${this.topicTitle} - Quiz</h2>
                            <p class="text-sky-100 text-sm mt-1" id="quiz-subtitle">Test your understanding</p>
                        </div>
                        <button onclick="window.TopicQuizInstance && window.TopicQuizInstance.close()" class="text-white/80 hover:text-white transition">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <!-- Progress bar -->
                    <div class="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div id="quiz-progress" class="h-full bg-white transition-all duration-300" style="width: 0%"></div>
                    </div>
                    <div class="flex justify-between text-sm mt-2 text-sky-100">
                        <span id="quiz-question-count">Question 1 of ${this.questions.length}</span>
                        <span id="quiz-score-display">Score: 0</span>
                    </div>
                </div>
                
                <!-- Content -->
                <div id="quiz-content" class="p-6 max-h-[60vh] overflow-y-auto">
                    <!-- Questions will be injected here -->
                </div>
                
                <!-- Footer -->
                <div id="quiz-footer" class="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <button id="quiz-prev-btn" onclick="window.TopicQuizInstance && window.TopicQuizInstance.prev()" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50" disabled>
                        <i class="fas fa-arrow-left mr-2"></i>Previous
                    </button>
                    <button id="quiz-next-btn" onclick="window.TopicQuizInstance && window.TopicQuizInstance.next()" class="px-6 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition disabled:opacity-50" disabled>
                        Next<i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    start() {
        if (this.questions.length === 0) {
            this.showNoQuestions();
            return;
        }

        this.currentIndex = 0;
        this.score = 0;
        this.answers = [];
        this.isStarted = true;
        this.isCompleted = false;

        // Show modal
        const modal = document.getElementById(this.modalId);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');

        // Set global reference
        window.TopicQuizInstance = this;

        // Show first question
        this.showQuestion();
    }

    showNoQuestions() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');

        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-clipboard-question text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">No Quiz Available</h3>
                <p class="text-gray-500 mb-6">Quiz questions haven't been added for this topic yet.</p>
                <button onclick="window.TopicQuizInstance && window.TopicQuizInstance.close()" class="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
                    Close
                </button>
            </div>
        `;

        window.TopicQuizInstance = this;
    }

    showQuestion() {
        const question = this.questions[this.currentIndex];
        const content = document.getElementById('quiz-content');
        
        if (!question) {
            this.showResults();
            return;
        }

        // Update progress
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        document.getElementById('quiz-progress').style.width = `${progress}%`;
        document.getElementById('quiz-question-count').textContent = 
            `Question ${this.currentIndex + 1} of ${this.questions.length}`;

        // Check if already answered
        const previousAnswer = this.answers[this.currentIndex];

        content.innerHTML = `
            <div class="animate-fade-in">
                <div class="mb-6">
                    <span class="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-3">
                        ${question.type || 'Multiple Choice'}
                    </span>
                    <h3 class="text-lg font-semibold text-gray-800">${question.question}</h3>
                </div>
                
                <div class="space-y-3">
                    ${question.options.map((option, index) => {
                        let classes = 'quiz-option p-4 rounded-xl border-2 cursor-pointer transition-all';
                        let isSelected = previousAnswer !== undefined && previousAnswer.selected === index;
                        let isCorrect = index === question.correct;
                        
                        if (previousAnswer !== undefined) {
                            if (isSelected && isCorrect) {
                                classes += ' bg-green-50 border-green-500 text-green-700';
                            } else if (isSelected && !isCorrect) {
                                classes += ' bg-red-50 border-red-500 text-red-700';
                            } else if (isCorrect) {
                                classes += ' bg-green-50 border-green-300';
                            } else {
                                classes += ' border-gray-200 text-gray-500';
                            }
                        } else {
                            classes += ' border-gray-200 hover:border-sky-300 hover:bg-sky-50';
                        }
                        
                        return `
                            <div class="${classes}" 
                                 onclick="window.TopicQuizInstance && window.TopicQuizInstance.selectAnswer(${index})"
                                 data-option="${index}">
                                <div class="flex items-center">
                                    <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600 mr-3">
                                        ${String.fromCharCode(65 + index)}
                                    </span>
                                    <span>${option}</span>
                                    ${previousAnswer !== undefined && isCorrect ? '<i class="fas fa-check-circle text-green-500 ml-auto"></i>' : ''}
                                    ${previousAnswer !== undefined && isSelected && !isCorrect ? '<i class="fas fa-times-circle text-red-500 ml-auto"></i>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${previousAnswer !== undefined && question.explanation ? `
                    <div class="mt-6 p-4 rounded-lg ${previousAnswer.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}">
                        <p class="font-semibold ${previousAnswer.correct ? 'text-green-700' : 'text-amber-700'} mb-2">
                            <i class="fas fa-lightbulb mr-2"></i>Explanation
                        </p>
                        <p class="text-gray-700">${question.explanation}</p>
                    </div>
                ` : ''}
            </div>
        `;

        // Update buttons
        const prevBtn = document.getElementById('quiz-prev-btn');
        const nextBtn = document.getElementById('quiz-next-btn');
        
        prevBtn.disabled = this.currentIndex === 0;
        
        if (previousAnswer !== undefined) {
            nextBtn.disabled = false;
            nextBtn.innerHTML = this.currentIndex === this.questions.length - 1 
                ? 'See Results<i class="fas fa-trophy ml-2"></i>'
                : 'Next<i class="fas fa-arrow-right ml-2"></i>';
        } else {
            nextBtn.disabled = true;
            nextBtn.innerHTML = 'Select an answer<i class="fas fa-arrow-right ml-2"></i>';
        }
    }

    selectAnswer(index) {
        const question = this.questions[this.currentIndex];
        const previousAnswer = this.answers[this.currentIndex];
        
        // Don't allow changing answer
        if (previousAnswer !== undefined) return;

        const isCorrect = index === question.correct;
        
        this.answers[this.currentIndex] = {
            selected: index,
            correct: isCorrect
        };

        if (isCorrect) {
            this.score++;
        }

        // Update score display
        document.getElementById('quiz-score-display').textContent = `Score: ${this.score}/${this.questions.length}`;

        // Refresh question view
        this.showQuestion();
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showQuestion();
        }
    }

    next() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    async showResults() {
        this.isCompleted = true;
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const passed = percentage >= this.passingScore;

        // Update tracker
        if (this.tracker && passed) {
            await this.tracker.markQuizPassed(this.score);
        }

        // Save to Supabase
        await this.saveResults(percentage, passed);

        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="text-center py-8 animate-fade-in">
                <div class="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-green-100' : 'bg-amber-100'}">
                    <i class="fas ${passed ? 'fa-trophy' : 'fa-star'} text-4xl ${passed ? 'text-green-500' : 'text-amber-500'}"></i>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-800 mb-2">
                    ${passed ? 'Congratulations!' : 'Keep Learning!'}
                </h3>
                <p class="text-gray-600 mb-6">
                    ${passed ? 'You passed the quiz!' : `You need ${this.passingScore}% to pass. Try again!`}
                </p>
                
                <div class="bg-gray-50 rounded-xl p-6 mb-6 max-w-sm mx-auto">
                    <div class="text-4xl font-bold ${passed ? 'text-green-500' : 'text-amber-500'} mb-2">
                        ${percentage}%
                    </div>
                    <p class="text-gray-600">You got ${this.score} out of ${this.questions.length} questions correct</p>
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="window.TopicQuizInstance && window.TopicQuizInstance.start()" 
                            class="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                        <i class="fas fa-redo mr-2"></i>Retake Quiz
                    </button>
                    <button onclick="window.TopicQuizInstance && window.TopicQuizInstance.close()" 
                            class="px-6 py-3 rounded-lg ${passed ? 'bg-green-500 hover:bg-green-600' : 'bg-sky-500 hover:bg-sky-600'} text-white transition">
                        ${passed ? '<i class="fas fa-check mr-2"></i>Complete' : '<i class="fas fa-times mr-2"></i>Close'}
                    </button>
                </div>
            </div>
        `;

        // Hide footer
        document.getElementById('quiz-footer').classList.add('hidden');
    }

    async saveResults(percentage, passed) {
        try {
            const supabase = await getSupabase();
            if (!supabase) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const resultData = {
                user_id: user.id,
                topic_id: this.topicId,
                topic_title: this.topicTitle,
                subject: this.subject,
                score: this.score,
                total_questions: this.questions.length,
                percentage: percentage,
                passed: passed,
                answers: this.answers,
                completed_at: new Date().toISOString()
            };

            console.log('📝 TopicQuiz: Saving quiz result:', {
                topic: this.topicTitle,
                subject: this.subject,
                score: this.score,
                percentage: percentage,
                passed: passed
            });

            // Insert result
            const { error } = await supabase
                .from('topic_quiz_results')
                .insert(resultData);

            if (error) {
                console.warn('TopicQuiz: Failed to save results:', error);
            } else {
                console.log('✅ TopicQuiz: Quiz result saved successfully');
                
                // Dispatch event to notify that quiz was completed
                // This allows goals system to sync progress
                window.dispatchEvent(new CustomEvent('quizCompleted', {
                    detail: {
                        topicId: this.topicId,
                        subject: this.subject,
                        percentage: percentage,
                        passed: passed
                    }
                }));
            }

            // Update user stats if passed
            if (passed) {
                await this.updateUserStats(percentage);
            }
            
            // Sync goals progress after saving quiz result
            if (window.GoalsManager && window.GoalsManager.syncGoalProgress) {
                console.log('🔄 TopicQuiz: Syncing goals progress...');
                try {
                    await window.GoalsManager.syncGoalProgress();
                    console.log('✅ TopicQuiz: Goals progress synced');
                } catch (syncErr) {
                    console.warn('TopicQuiz: Failed to sync goals:', syncErr);
                }
            }
        } catch (err) {
            console.warn('TopicQuiz: Save error:', err);
        }
    }

    async updateUserStats(percentage) {
        try {
            const supabase = await getSupabase();
            if (!supabase) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get current stats
            const { data: stats } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (stats) {
                // Update existing stats
                await supabase
                    .from('user_stats')
                    .update({
                        topics_completed: (stats.topics_completed || 0) + 1,
                        total_quiz_score: (stats.total_quiz_score || 0) + percentage,
                        total_quizzes_taken: (stats.total_quizzes_taken || 0) + 1,
                        last_activity: new Date().toISOString()
                    })
                    .eq('user_id', user.id);
            } else {
                // Create new stats
                await supabase
                    .from('user_stats')
                    .insert({
                        user_id: user.id,
                        topics_completed: 1,
                        total_quiz_score: percentage,
                        total_quizzes_taken: 1,
                        last_activity: new Date().toISOString()
                    });
            }
        } catch (err) {
            console.warn('TopicQuiz: Failed to update user stats:', err);
        }
    }

    close() {
        const modal = document.getElementById(this.modalId);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
        
        // Refresh page to show completion status
        if (this.isCompleted && this.tracker) {
            this.tracker.updateUI();
        }
    }
}

// Export for ES modules
export { TopicQuiz };

// Also expose globally for non-module usage
window.TopicQuiz = TopicQuiz;
