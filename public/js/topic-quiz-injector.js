/**
 * ============================================
 * JUANOVA CORTEX - TOPIC QUIZ INJECTOR
 * Automatically adds "Done with Topic" button
 * and quiz modal to topic pages
 * ============================================
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        supabaseUrl: 'https://kruwfhzfqieuiuhqlutt.supabase.co',
        supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',
        questionsPerQuiz: 5,
        passThreshold: 70,
        subjects: ['mathematics', 'english', 'chemistry', 'physics', 'biology']
    };
    
    // State
    let supabase = null;
    let user = null;
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let answers = [];
    let quizStartTime = null;
    let topicInfo = { subject: null, topic: null, topicKey: null, subfolder: null };
    
    // ============================================
    // INITIALIZATION
    // ============================================
    async function init() {
        // Check if we're on a topic page for one of the supported subjects
        if (!isTopicPage()) {
            console.log('Not a topic page, quiz injector skipped');
            return;
        }
        
        console.log('🎯 Topic Quiz Injector initializing...');
        
        // Get topic info from page
        extractTopicInfo();
        
        if (!topicInfo.subject || !topicInfo.topic) {
            console.log('Could not determine topic info');
            return;
        }
        
        // Initialize Supabase
        await initSupabase();
        
        // Add Done button
        addDoneButton();
        
        // Add styles
        addStyles();
        
        console.log(`✅ Quiz ready for: ${topicInfo.subject} - ${topicInfo.topic}`);
    }
    
    function isTopicPage() {
        const path = window.location.pathname.toLowerCase();
        return CONFIG.subjects.some(subject => 
            path.includes(`/subjects/${subject}/`) && 
            !path.endsWith('/index.html') &&
            !path.endsWith(`/${subject}.html`)
        );
    }
    
    function extractTopicInfo() {
        const path = window.location.pathname;
        
        // Extract from URL: /subjects/{subject}/{subfolder}/{topic}.html
        const match = path.match(/\/subjects\/([^\/]+)\/(.+?)\/([^\/]+)\.html/i);
        
        if (match) {
            topicInfo.subject = match[1].toLowerCase();
            topicInfo.subfolder = match[2];
            const filename = match[3];
            
            // Clean up topic name
            topicInfo.topic = filename
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            
            // Create topic key for quiz lookup
            topicInfo.topicKey = filename.toLowerCase();
        } else {
            // Try meta tags
            const subjectMeta = document.querySelector('meta[name="subject"]');
            const topicMeta = document.querySelector('meta[name="topic"]');
            
            if (subjectMeta) topicInfo.subject = subjectMeta.content.toLowerCase();
            if (topicMeta) {
                topicInfo.topic = topicMeta.content;
                topicInfo.topicKey = topicMeta.content.toLowerCase().replace(/\s+/g, '-');
            }
        }
        
        // Try to get from page title as fallback
        if (!topicInfo.topic) {
            const title = document.title.split(' - ')[0].split(' | ')[0];
            topicInfo.topic = title;
        }
        
        console.log('Topic info extracted:', topicInfo);
    }
    
    async function initSupabase() {
        if (window.supabaseClient) {
            supabase = window.supabaseClient;
        } else {
            try {
                const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
                supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey, {
                    auth: { autoRefreshToken: true, persistSession: true }
                });
                window.supabaseClient = supabase;
            } catch (err) {
                console.error('Failed to init Supabase:', err);
            }
        }
        
        // Get user
        if (supabase) {
            try {
                const { data: { user: u } } = await supabase.auth.getUser();
                user = u;
            } catch (err) {
                console.warn('Could not get user:', err);
            }
        }
    }
    
    // ============================================
    // ADD DONE BUTTON
    // ============================================
    function addDoneButton() {
        // Find a good place to add the button
        const container = findButtonContainer();
        if (!container) {
            console.log('Could not find container for Done button');
            return;
        }
        
        // Create button
        const button = document.createElement('button');
        button.id = 'topicDoneBtn';
        button.className = 'topic-done-btn';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>Done with Topic</span>
        `;
        button.onclick = startQuiz;
        
        container.appendChild(button);
        console.log('Done button added');
    }
    
    function findButtonContainer() {
        // Try to find existing button container
        let container = document.querySelector('.topic-actions');
        
        if (!container) {
            container = document.querySelector('.content-footer');
        }
        
        if (!container) {
            container = document.querySelector('main .container');
        }
        
        if (!container) {
            container = document.querySelector('main');
        }
        
        if (!container) {
            container = document.querySelector('.content');
        }
        
        if (!container) {
            // Create one at the end of the page
            container = document.createElement('div');
            container.className = 'topic-actions-container';
            
            const main = document.querySelector('main') || document.body;
            main.appendChild(container);
        }
        
        return container;
    }
    
    // ============================================
    // QUIZ LOGIC
    // ============================================
    async function startQuiz() {
        console.log('Starting quiz for:', topicInfo.topicKey);
        
        // Try to load the specific quiz file
        if (topicInfo.subfolder && window.loadTopicQuizFile) {
            await window.loadTopicQuizFile(topicInfo.subject, topicInfo.subfolder, topicInfo.topicKey);
        }
        
        // Get questions for this topic
        const questions = await getQuestions();
        
        if (!questions || questions.length === 0) {
            showNoQuizMessage();
            return;
        }
        
        // Select random questions
        currentQuiz = shuffleArray(questions).slice(0, CONFIG.questionsPerQuiz);
        currentQuestionIndex = 0;
        answers = [];
        quizStartTime = new Date();
        
        // Show quiz modal
        showQuizModal();
    }
    
    async function getQuestions() {
        // Check new registry first
        if (window.getTopicQuiz) {
            const quizData = window.getTopicQuiz(topicInfo.subject, topicInfo.topicKey);
            if (quizData && quizData.questions) {
                console.log('Found quiz in registry');
                return quizData.questions;
            }
        }
        
        // Check legacy quiz data
        const allData = window.TopicQuizzesData || {};
        const subjectData = allData[topicInfo.subject];
        
        if (subjectData) {
            // Try different key formats
            let questions = null;
            const possibleKeys = [
                topicInfo.topicKey,
                topicInfo.topicKey.replace(/-/g, ''),
                topicInfo.topicKey.split('-').pop(),
                topicInfo.topic.toLowerCase().replace(/\s+/g, '-')
            ];
            
            for (const key of possibleKeys) {
                if (subjectData[key]) {
                    questions = subjectData[key].questions;
                    console.log('Found questions for key:', key);
                    break;
                }
            }
            
            if (questions) return questions;
        }
        
        // Generate default questions
        console.log('No questions found, generating defaults');
        return generateDefaultQuestions();
    }
    
    function generateDefaultQuestions() {
        return [
            {
                question: `What is the main concept covered in ${topicInfo.topic}?`,
                options: [
                    "Understanding fundamental principles",
                    "Memorizing facts only",
                    "Avoiding practical applications",
                    "Ignoring related concepts"
                ],
                correct: 0,
                explanation: `${topicInfo.topic} focuses on understanding fundamental principles.`
            },
            {
                question: `Which approach best helps in learning ${topicInfo.topic}?`,
                options: [
                    "Skipping difficult parts",
                    "Practice and application",
                    "Reading without understanding",
                    "Avoiding examples"
                ],
                correct: 1,
                explanation: "Practice and application are essential for mastering any topic."
            },
            {
                question: `Why is ${topicInfo.topic} important in ${topicInfo.subject}?`,
                options: [
                    "It builds foundational knowledge",
                    "It is not important",
                    "It only matters for exams",
                    "It has no real-world application"
                ],
                correct: 0,
                explanation: `${topicInfo.topic} provides foundational knowledge essential for ${topicInfo.subject}.`
            },
            {
                question: "What is the best way to prepare for questions on this topic?",
                options: [
                    "Last-minute cramming",
                    "Regular review and practice",
                    "Avoiding difficult concepts",
                    "Relying only on memory"
                ],
                correct: 1,
                explanation: "Regular review and practice lead to better understanding and retention."
            },
            {
                question: "How can you apply knowledge of this topic?",
                options: [
                    "Only in classroom settings",
                    "In real-world problem solving",
                    "It cannot be applied",
                    "Only in theoretical contexts"
                ],
                correct: 1,
                explanation: `Knowledge of ${topicInfo.topic} can be applied to solve real-world problems.`
            }
        ];
    }
    
    function showNoQuizMessage() {
        const toast = document.createElement('div');
        toast.className = 'quiz-toast warning';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">📝</span>
                <div>
                    <strong>Quiz Coming Soon</strong>
                    <p>Questions for this topic are being added.</p>
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // QUIZ MODAL
    // ============================================
    function showQuizModal() {
        // Remove existing modal
        const existing = document.getElementById('topicQuizModal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.id = 'topicQuizModal';
        modal.className = 'quiz-modal';
        modal.innerHTML = `
            <div class="quiz-modal-content">
                <div class="quiz-header">
                    <div class="quiz-title">
                        <h2>📋 Topic Quiz</h2>
                        <p>${capitalize(topicInfo.subject)}: ${topicInfo.topic}</p>
                    </div>
                    <button class="quiz-close-btn" onclick="closeQuizModal()">×</button>
                </div>
                
                <div class="quiz-progress">
                    <div class="progress-info">
                        <span>Question <span id="quizCurrentNum">1</span> of ${currentQuiz.length}</span>
                        <span id="quizTimer">0:00</span>
                    </div>
                    <div class="progress-bar">
                        <div id="quizProgressFill" class="progress-fill" style="width: ${100/currentQuiz.length}%"></div>
                    </div>
                </div>
                
                <div id="quizQuestionArea" class="quiz-question-area">
                    ${renderQuestion()}
                </div>
                
                <div class="quiz-footer">
                    <button id="quizPrevBtn" class="quiz-btn secondary" onclick="previousQuestion()" style="visibility: hidden;">
                        ← Previous
                    </button>
                    <button id="quizNextBtn" class="quiz-btn primary" onclick="nextQuestion()">
                        Next →
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Start timer
        startTimer();
    }
    
    function renderQuestion() {
        const q = currentQuiz[currentQuestionIndex];
        const selected = answers[currentQuestionIndex];
        
        return `
            <div class="question-text">
                <span class="question-number">Q${currentQuestionIndex + 1}.</span>
                ${q.question}
            </div>
            <div class="options-container">
                ${q.options.map((opt, i) => `
                    <button class="option-btn ${selected === i ? 'selected' : ''}" onclick="selectAnswer(${i})">
                        <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="option-text">${opt}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    function selectAnswer(index) {
        answers[currentQuestionIndex] = index;
        
        // Update UI
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });
        
        // Enable next button
        updateNavigationButtons();
    }
    
    function nextQuestion() {
        // Check if answered
        if (answers[currentQuestionIndex] === undefined) {
            alert('Please select an answer');
            return;
        }
        
        // If last question, show results
        if (currentQuestionIndex === currentQuiz.length - 1) {
            showResults();
            return;
        }
        
        // Next question
        currentQuestionIndex++;
        updateQuestionDisplay();
    }
    
    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionDisplay();
        }
    }
    
    function updateQuestionDisplay() {
        document.getElementById('quizQuestionArea').innerHTML = renderQuestion();
        document.getElementById('quizCurrentNum').textContent = currentQuestionIndex + 1;
        document.getElementById('quizProgressFill').style.width = `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%`;
        updateNavigationButtons();
    }
    
    function updateNavigationButtons() {
        const prevBtn = document.getElementById('quizPrevBtn');
        const nextBtn = document.getElementById('quizNextBtn');
        
        prevBtn.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
        
        if (currentQuestionIndex === currentQuiz.length - 1) {
            nextBtn.textContent = 'Submit Quiz';
            nextBtn.classList.add('submit');
        } else {
            nextBtn.textContent = 'Next →';
            nextBtn.classList.remove('submit');
        }
    }
    
    // ============================================
    // TIMER
    // ============================================
    let timerInterval = null;
    let elapsedSeconds = 0;
    
    function startTimer() {
        elapsedSeconds = 0;
        timerInterval = setInterval(() => {
            elapsedSeconds++;
            const mins = Math.floor(elapsedSeconds / 60);
            const secs = elapsedSeconds % 60;
            const timerEl = document.getElementById('quizTimer');
            if (timerEl) {
                timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    // ============================================
    // RESULTS
    // ============================================
    function showResults() {
        stopTimer();
        
        // Calculate score
        let correct = 0;
        currentQuiz.forEach((q, i) => {
            if (answers[i] === q.correct) correct++;
        });
        
        const score = Math.round((correct / currentQuiz.length) * 100);
        const passed = score >= CONFIG.passThreshold;
        
        // Save result
        saveQuizResult(score, correct, currentQuiz.length);
        
        // Show results
        const modal = document.getElementById('topicQuizModal');
        const content = modal.querySelector('.quiz-modal-content');
        
        content.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-title">
                    <h2>📊 Quiz Results</h2>
                    <p>${capitalize(topicInfo.subject)}: ${topicInfo.topic}</p>
                </div>
            </div>
            
            <div class="results-container">
                <div class="score-circle ${passed ? 'passed' : 'failed'}">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="${passed ? '#10b981' : '#f59e0b'}" 
                                stroke-width="8" stroke-linecap="round"
                                stroke-dasharray="${score * 2.83} 283"
                                transform="rotate(-90 50 50)"/>
                    </svg>
                    <div class="score-text">
                        <span class="score-value">${score}%</span>
                        <span class="score-detail">${correct}/${currentQuiz.length} correct</span>
                    </div>
                </div>
                
                <div class="result-message ${passed ? 'passed' : 'failed'}">
                    ${passed ? '🎉 Excellent Work!' : '📚 Keep Practicing!'}
                </div>
                
                <div class="result-stats">
                    <div class="stat">
                        <span class="stat-icon">⏱️</span>
                        <span class="stat-value">${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s</span>
                        <span class="stat-label">Time</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">✓</span>
                        <span class="stat-value">${correct}</span>
                        <span class="stat-label">Correct</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">✗</span>
                        <span class="stat-value">${currentQuiz.length - correct}</span>
                        <span class="stat-label">Incorrect</span>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="quiz-btn secondary" onclick="showReview()">
                        📝 Review Answers
                    </button>
                    <button class="quiz-btn primary" onclick="closeQuizModal()">
                        ${passed ? '✓ Continue' : '✓ Close'}
                    </button>
                </div>
            </div>
        `;
    }
    
    function showReview() {
        const modal = document.getElementById('topicQuizModal');
        const content = modal.querySelector('.quiz-modal-content');
        
        let reviewHTML = `
            <div class="quiz-header">
                <div class="quiz-title">
                    <h2>📝 Answer Review</h2>
                </div>
                <button class="quiz-close-btn" onclick="closeQuizModal()">×</button>
            </div>
            
            <div class="review-container">
        `;
        
        currentQuiz.forEach((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            
            reviewHTML += `
                <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="review-question">
                        <span class="review-number">Q${i + 1}</span>
                        ${q.question}
                    </div>
                    <div class="review-answer">
                        <div class="user-answer">
                            Your answer: <span class="${isCorrect ? 'correct' : 'incorrect'}">${String.fromCharCode(65 + userAnswer)}. ${q.options[userAnswer]}</span>
                        </div>
                        ${!isCorrect ? `
                            <div class="correct-answer">
                                Correct answer: <span class="correct">${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}</span>
                            </div>
                        ` : ''}
                        <div class="explanation">
                            💡 ${q.explanation}
                        </div>
                    </div>
                </div>
            `;
        });
        
        reviewHTML += `
            </div>
            <div class="results-actions">
                <button class="quiz-btn primary" onclick="showResults()">
                    ← Back to Results
                </button>
            </div>
        `;
        
        content.innerHTML = reviewHTML;
    }
    
    // ============================================
    // SAVE RESULT
    // ============================================
    async function saveQuizResult(score, correct, total) {
        if (!supabase || !user) {
            // Save locally
            const results = JSON.parse(localStorage.getItem('pending_quiz_results') || '[]');
            results.push({
                subject: topicInfo.subject,
                topic: topicInfo.topic,
                score,
                correct,
                total,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('pending_quiz_results', JSON.stringify(results));
            return;
        }
        
        try {
            // Save to topic_progress
            const { data: existing } = await supabase
                .from('topic_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('topic', topicInfo.topic)
                .maybeSingle();
            
            const now = new Date().toISOString();
            
            if (existing) {
                const newAttempts = (existing.quiz_attempts || 0) + 1;
                const bestScore = Math.max(existing.quiz_best_score || 0, score);
                const avgScore = existing.quiz_score
                    ? ((existing.quiz_score * existing.quiz_attempts) + score) / newAttempts
                    : score;
                
                await supabase
                    .from('topic_progress')
                    .update({
                        quiz_score: avgScore,
                        quiz_attempts: newAttempts,
                        quiz_best_score: bestScore,
                        status: score >= CONFIG.passThreshold ? 'completed' : 'in_progress',
                        last_accessed_at: now
                    })
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('topic_progress')
                    .insert({
                        user_id: user.id,
                        subject: capitalize(topicInfo.subject),
                        topic: topicInfo.topic,
                        quiz_score: score,
                        quiz_attempts: 1,
                        quiz_best_score: score,
                        status: score >= CONFIG.passThreshold ? 'completed' : 'in_progress',
                        last_accessed_at: now
                    });
            }
            
            // Update daily stats
            const today = new Date().toISOString().split('T')[0];
            const { data: dailyStats } = await supabase
                .from('daily_study_stats')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', today)
                .maybeSingle();
            
            if (dailyStats) {
                await supabase
                    .from('daily_study_stats')
                    .update({
                        quizzes_taken: (dailyStats.quizzes_taken || 0) + 1,
                        avg_quiz_score: dailyStats.avg_quiz_score
                            ? ((dailyStats.avg_quiz_score * dailyStats.quizzes_taken) + score) / (dailyStats.quizzes_taken + 1)
                            : score
                    })
                    .eq('id', dailyStats.id);
            } else {
                await supabase
                    .from('daily_study_stats')
                    .insert({
                        user_id: user.id,
                        date: today,
                        quizzes_taken: 1,
                        avg_quiz_score: score
                    });
            }
            
            console.log('✅ Quiz result saved');
        } catch (err) {
            console.error('Error saving quiz result:', err);
        }
    }
    
    // ============================================
    // GLOBAL FUNCTIONS
    // ============================================
    window.closeQuizModal = function() {
        stopTimer();
        const modal = document.getElementById('topicQuizModal');
        if (modal) {
            modal.classList.add('closing');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    };
    
    window.selectAnswer = selectAnswer;
    window.nextQuestion = nextQuestion;
    window.previousQuestion = previousQuestion;
    window.showReview = showReview;
    window.showResults = function() {
        // Re-render results
        showResults();
    };
    
    // ============================================
    // STYLES
    // ============================================
    function addStyles() {
        if (document.getElementById('topicQuizStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'topicQuizStyles';
        styles.textContent = `
            .topic-done-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 14px 24px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            .topic-done-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 30px rgba(16, 185, 129, 0.5);
            }
            
            .topic-done-btn:active {
                transform: translateY(0);
            }
            
            .topic-actions-container {
                display: flex;
                justify-content: center;
                padding: 32px;
                margin-top: 32px;
            }
            
            .quiz-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(4px);
                animation: fadeIn 0.3s ease;
            }
            
            .quiz-modal.closing {
                animation: fadeOut 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .quiz-modal-content {
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .quiz-header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            
            .quiz-header h2 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .quiz-header p {
                margin: 4px 0 0;
                opacity: 0.9;
                font-size: 0.9rem;
            }
            
            .quiz-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            
            .quiz-close-btn:hover {
                opacity: 1;
            }
            
            .quiz-progress {
                padding: 16px 24px;
                background: #f9fafb;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .progress-info {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
                color: #6b7280;
                margin-bottom: 8px;
            }
            
            .progress-bar {
                height: 6px;
                background: #e5e7eb;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #059669);
                transition: width 0.3s ease;
            }
            
            .quiz-question-area {
                padding: 24px;
                min-height: 300px;
            }
            
            .question-text {
                font-size: 1.2rem;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            
            .question-number {
                color: #10b981;
                margin-right: 8px;
            }
            
            .options-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .option-btn {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                background: #f9fafb;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s ease;
                font-size: 1rem;
            }
            
            .option-btn:hover {
                border-color: #10b981;
                background: #f0fdf4;
            }
            
            .option-btn.selected {
                border-color: #10b981;
                background: #ecfdf5;
            }
            
            .option-letter {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                background: #e5e7eb;
                border-radius: 50%;
                font-weight: 600;
                color: #6b7280;
                flex-shrink: 0;
            }
            
            .option-btn.selected .option-letter {
                background: #10b981;
                color: white;
            }
            
            .option-text {
                flex: 1;
            }
            
            .quiz-footer {
                padding: 16px 24px;
                background: #f9fafb;
                display: flex;
                justify-content: space-between;
                border-top: 1px solid #e5e7eb;
            }
            
            .quiz-btn {
                padding: 12px 28px;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }
            
            .quiz-btn.primary {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }
            
            .quiz-btn.primary:hover {
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            }
            
            .quiz-btn.primary.submit {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            }
            
            .quiz-btn.secondary {
                background: #e5e7eb;
                color: #4b5563;
            }
            
            .quiz-btn.secondary:hover {
                background: #d1d5db;
            }
            
            /* Results */
            .results-container {
                padding: 32px;
                text-align: center;
            }
            
            .score-circle {
                position: relative;
                width: 160px;
                height: 160px;
                margin: 0 auto 24px;
            }
            
            .score-circle svg {
                transform: rotate(-90deg);
            }
            
            .score-circle svg circle:last-child {
                transition: stroke-dasharray 1s ease;
            }
            
            .score-text {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .score-value {
                font-size: 2.5rem;
                font-weight: 700;
            }
            
            .score-circle.passed .score-value { color: #10b981; }
            .score-circle.failed .score-value { color: #f59e0b; }
            
            .score-detail {
                font-size: 0.9rem;
                color: #6b7280;
            }
            
            .result-message {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 24px;
            }
            
            .result-message.passed { color: #10b981; }
            .result-message.failed { color: #f59e0b; }
            
            .result-stats {
                display: flex;
                justify-content: center;
                gap: 32px;
                margin-bottom: 32px;
            }
            
            .stat {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }
            
            .stat-icon {
                font-size: 1.5rem;
            }
            
            .stat-value {
                font-size: 1.2rem;
                font-weight: 600;
                color: #1f2937;
            }
            
            .stat-label {
                font-size: 0.8rem;
                color: #6b7280;
            }
            
            .results-actions {
                display: flex;
                justify-content: center;
                gap: 16px;
            }
            
            /* Review */
            .review-container {
                max-height: 60vh;
                overflow-y: auto;
                padding: 24px;
            }
            
            .review-item {
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 16px;
            }
            
            .review-item.correct {
                background: #ecfdf5;
                border: 1px solid #a7f3d0;
            }
            
            .review-item.incorrect {
                background: #fef3c7;
                border: 1px solid #fcd34d;
            }
            
            .review-question {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 12px;
            }
            
            .review-number {
                display: inline-block;
                background: #e5e7eb;
                padding: 2px 8px;
                border-radius: 4px;
                margin-right: 8px;
                font-size: 0.8rem;
            }
            
            .review-answer {
                font-size: 0.9rem;
            }
            
            .user-answer, .correct-answer {
                margin-bottom: 8px;
            }
            
            .explanation {
                padding: 12px;
                background: rgba(255,255,255,0.5);
                border-radius: 8px;
                margin-top: 8px;
            }
            
            .user-answer .correct { color: #10b981; font-weight: 600; }
            .user-answer .incorrect { color: #f59e0b; font-weight: 600; }
            .correct-answer .correct { color: #10b981; font-weight: 600; }
            
            /* Toast */
            .quiz-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                z-index: 10001;
                transform: translateX(120%);
                transition: transform 0.3s ease;
            }
            
            .quiz-toast.show {
                transform: translateX(0);
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .toast-icon {
                font-size: 1.5rem;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
