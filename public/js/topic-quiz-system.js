/**
 * ============================================
 * JUANOVA CORTEX - TOPIC QUIZ SYSTEM
 * Quizzes after each topic completion
 * ============================================
 * 
 * Features:
 * - Auto-show quiz after topic completion
 * - Topic-specific quiz questions
 * - Score tracking and subject performance
 * - Integration with StudyTracker
 */

const TopicQuizConfig = {
    supabaseUrl: 'https://kruwfhzfqieuiuhqlutt.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',
    
    // Minimum time on page before quiz (seconds)
    minTimeForQuiz: 60,
    
    // Pass threshold
    passThreshold: 70,
    
    // Questions per quiz
    questionsPerQuiz: 5
};

// ============================================
// QUIZ STATE
// ============================================
const QuizState = {
    supabase: null,
    user: null,
    
    currentQuiz: null,
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    
    topicInfo: {
        subject: null,
        topic: null,
        topicId: null,
        subjectId: null
    },
    
    initialized: false
};

// ============================================
// INITIALIZATION
// ============================================
async function initQuizSystem() {
    if (QuizState.initialized) return;
    
    console.log('🔧 Initializing Topic Quiz System...');
    
    // Initialize Supabase
    QuizState.supabase = await getQuizSupabase();
    
    if (QuizState.supabase) {
        try {
            const { data: { user } } = await QuizState.supabase.auth.getUser();
            QuizState.user = user;
        } catch (err) {
            console.warn('Could not get user:', err);
        }
    }
    
    QuizState.initialized = true;
    console.log('✅ Topic Quiz System initialized');
    
    return true;
}

async function getQuizSupabase() {
    if (QuizState.supabase) return QuizState.supabase;
    
    if (window.supabaseClient) {
        QuizState.supabase = window.supabaseClient;
        return QuizState.supabase;
    }
    
    try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        QuizState.supabase = createClient(
            TopicQuizConfig.supabaseUrl,
            TopicQuizConfig.supabaseKey,
            { auth: { autoRefreshToken: true, persistSession: true } }
        );
        window.supabaseClient = QuizState.supabase;
        return QuizState.supabase;
    } catch (err) {
        console.error('Failed to create Supabase client:', err);
        return null;
    }
}

// ============================================
// QUIZ DATA - Sample questions per topic
// These can be loaded from database or defined inline
// ============================================
const TopicQuizQuestions = {
    // Chemistry - Acids and Bases
    'chemistry-acids-bases': [
        {
            question: "What is the pH of a neutral solution?",
            options: ["0", "7", "14", "1"],
            correct: 1,
            explanation: "A neutral solution has a pH of 7, which is neither acidic nor basic."
        },
        {
            question: "Which of the following is a strong acid?",
            options: ["Acetic acid", "Hydrochloric acid", "Carbonic acid", "Citric acid"],
            correct: 1,
            explanation: "Hydrochloric acid (HCl) is a strong acid that completely dissociates in water."
        },
        {
            question: "What ion is responsible for acidic properties?",
            options: ["OH⁻", "H⁺", "O²⁻", "Na⁺"],
            correct: 1,
            explanation: "Hydrogen ions (H⁺) are responsible for acidic properties in solutions."
        },
        {
            question: "What is the product of a neutralization reaction?",
            options: ["Salt and water", "Acid and base", "Hydrogen and oxygen", "Metal and non-metal"],
            correct: 0,
            explanation: "Neutralization produces salt and water when an acid reacts with a base."
        },
        {
            question: "Which indicator turns red in acidic solution?",
            options: ["Phenolphthalein", "Litmus", "Methyl orange", "Both B and C"],
            correct: 3,
            explanation: "Both litmus and methyl orange turn red in acidic solutions."
        }
    ],
    
    // Chemistry - Atomic Structure
    'chemistry-atomic-structure': [
        {
            question: "What is the mass number of an atom?",
            options: ["Number of protons", "Number of neutrons", "Protons + neutrons", "Protons + electrons"],
            correct: 2,
            explanation: "Mass number = protons + neutrons in the nucleus."
        },
        {
            question: "Which subatomic particle has a negative charge?",
            options: ["Proton", "Neutron", "Electron", "Nucleus"],
            correct: 2,
            explanation: "Electrons have a negative charge and orbit the nucleus."
        },
        {
            question: "What determines the chemical properties of an element?",
            options: ["Mass number", "Atomic number", "Neutron count", "Nucleus size"],
            correct: 1,
            explanation: "The atomic number (number of protons/electrons) determines chemical properties."
        },
        {
            question: "Isotopes differ in their number of:",
            options: ["Protons", "Electrons", "Neutrons", "Energy levels"],
            correct: 2,
            explanation: "Isotopes have the same number of protons but different numbers of neutrons."
        },
        {
            question: "The maximum number of electrons in the first energy level is:",
            options: ["2", "8", "18", "32"],
            correct: 0,
            explanation: "The first energy level can hold a maximum of 2 electrons (2n² formula)."
        }
    ],
    
    // Biology - Cell Structure
    'biology-cell-structure': [
        {
            question: "Which organelle is the 'powerhouse' of the cell?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
            correct: 1,
            explanation: "Mitochondria produce ATP through cellular respiration."
        },
        {
            question: "The cell membrane is mainly composed of:",
            options: ["Proteins only", "Carbohydrates", "Phospholipids", "Nucleic acids"],
            correct: 2,
            explanation: "The cell membrane is a phospholipid bilayer with embedded proteins."
        },
        {
            question: "Which organelle contains genetic material?",
            options: ["Ribosome", "Mitochondria", "Nucleus", "Vacuole"],
            correct: 2,
            explanation: "The nucleus contains DNA, the genetic material of the cell."
        },
        {
            question: "Plant cells have which structure that animal cells lack?",
            options: ["Nucleus", "Cell wall", "Mitochondria", "Ribosome"],
            correct: 1,
            explanation: "Plant cells have a cell wall made of cellulose."
        },
        {
            question: "Chloroplasts are responsible for:",
            options: ["Respiration", "Photosynthesis", "Digestion", "Reproduction"],
            correct: 1,
            explanation: "Chloroplasts contain chlorophyll and carry out photosynthesis."
        }
    ],
    
    // Physics - Newton's Laws
    'physics-newtons-laws': [
        {
            question: "Newton's First Law describes:",
            options: ["F = ma", "Action-reaction", "Inertia", "Gravity"],
            correct: 2,
            explanation: "Newton's First Law is the law of inertia - objects resist changes in motion."
        },
        {
            question: "What is the unit of force?",
            options: ["Kilogram", "Newton", "Joule", "Watt"],
            correct: 1,
            explanation: "Force is measured in Newtons (N) = kg·m/s²"
        },
        {
            question: "According to Newton's Third Law:",
            options: ["F = ma", "Every action has an equal and opposite reaction", "Objects in motion stay in motion", "Energy is conserved"],
            correct: 1,
            explanation: "Newton's Third Law states that forces come in action-reaction pairs."
        },
        {
            question: "If mass doubles and force stays constant, acceleration:",
            options: ["Doubles", "Halves", "Stays same", "Quadruples"],
            correct: 1,
            explanation: "From F = ma, if mass doubles, acceleration halves."
        },
        {
            question: "Which is NOT a force?",
            options: ["Gravity", "Friction", "Mass", "Tension"],
            correct: 2,
            explanation: "Mass is a measure of matter, not a force. The others are forces."
        }
    ],
    
    // Mathematics - Quadratic Equations
    'mathematics-quadratic-equations': [
        {
            question: "The general form of a quadratic equation is:",
            options: ["ax + b = 0", "ax² + bx + c = 0", "y = mx + c", "a² + b² = c²"],
            correct: 1,
            explanation: "A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0."
        },
        {
            question: "The quadratic formula gives solutions for:",
            options: ["Linear equations", "Quadratic equations", "Simultaneous equations", "Inequalities"],
            correct: 1,
            explanation: "x = (-b ± √(b²-4ac)) / 2a solves quadratic equations."
        },
        {
            question: "The discriminant is:",
            options: ["b² - 4ac", "b² + 4ac", "-b/2a", "√(b²-4ac)"],
            correct: 0,
            explanation: "The discriminant Δ = b² - 4ac determines the nature of roots."
        },
        {
            question: "If discriminant > 0, the roots are:",
            options: ["Real and equal", "Real and different", "Imaginary", "No roots"],
            correct: 1,
            explanation: "When Δ > 0, there are two distinct real roots."
        },
        {
            question: "What method uses factoring perfect squares?",
            options: ["Factorization", "Completing the square", "Formula method", "Graphical method"],
            correct: 1,
            explanation: "Completing the square rewrites the quadratic as a perfect square."
        }
    ],
    
    // English - Grammar
    'english-grammar': [
        {
            question: "Which is a singular pronoun?",
            options: ["They", "We", "It", "Those"],
            correct: 2,
            explanation: "'It' is singular. 'They' and 'We' are plural pronouns."
        },
        {
            question: "The past tense of 'write' is:",
            options: ["Writed", "Written", "Wrote", "Writing"],
            correct: 2,
            explanation: "'Write' has irregular past tense: wrote (past) / written (past participle)."
        },
        {
            question: "Which sentence has correct subject-verb agreement?",
            options: ["The dogs runs", "The dog run", "The dogs run", "The dog runs"],
            correct: 3,
            explanation: "Singular subject takes singular verb (dog runs), plural takes plural (dogs run)."
        },
        {
            question: "An interjection expresses:",
            options: ["Action", "Strong emotion", "Connection", "Description"],
            correct: 1,
            explanation: "Interjections like 'Wow!', 'Oh!', express strong emotions."
        },
        {
            question: "Which is a compound sentence?",
            options: ["I ran fast.", "I ran and he walked.", "Running is fun.", "The running boy"],
            correct: 1,
            explanation: "A compound sentence has two independent clauses joined by a conjunction."
        }
    ]
};

// ============================================
// QUIZ FLOW
// ============================================

/**
 * Check if quiz should be shown for current topic
 */
function shouldShowQuiz() {
    // Check if user has spent minimum time
    const studyTime = window.StudyTracker?.getCurrentTime() || 0;
    return studyTime >= TopicQuizConfig.minTimeForQuiz;
}

/**
 * Start a topic quiz
 */
async function startTopicQuiz(subject, topic, subjectId = null, topicId = null) {
    console.log(`📝 Starting topic quiz: ${subject} - ${topic}`);
    
    if (!QuizState.initialized) {
        await initQuizSystem();
    }
    
    // Set topic info
    QuizState.topicInfo = {
        subject,
        topic,
        subjectId,
        topicId
    };
    
    // Get quiz questions
    const quizKey = `${subject.toLowerCase()}-${topic.toLowerCase().replace(/\s+/g, '-')}`;
    let questions = TopicQuizQuestions[quizKey];
    
    // Try alternate key formats
    if (!questions) {
        const altKey = topic.toLowerCase().replace(/\s+/g, '-');
        for (const key of Object.keys(TopicQuizQuestions)) {
            if (key.includes(altKey) || altKey.includes(key.split('-').pop())) {
                questions = TopicQuizQuestions[key];
                break;
            }
        }
    }
    
    // Generate generic questions if no specific quiz exists
    if (!questions || questions.length === 0) {
        questions = generateGenericQuestions(subject, topic);
    }
    
    // Select random questions
    const selectedQuestions = shuffleArray(questions).slice(0, TopicQuizConfig.questionsPerQuiz);
    
    // Initialize quiz state
    QuizState.currentQuiz = selectedQuestions;
    QuizState.currentQuestionIndex = 0;
    QuizState.answers = [];
    QuizState.startTime = new Date();
    
    // Show quiz modal
    showQuizModal();
    
    return true;
}

/**
 * Generate generic questions for topics without specific quizzes
 */
function generateGenericQuestions(subject, topic) {
    return [
        {
            question: `What is the main concept covered in ${topic}?`,
            options: [
                "Understanding fundamental principles",
                "Memorizing facts only",
                "Avoiding practical applications",
                "Ignoring related concepts"
            ],
            correct: 0,
            explanation: `${topic} focuses on understanding the fundamental principles of ${subject}.`
        },
        {
            question: `Which approach best helps in learning ${topic}?`,
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
            question: `Why is ${topic} important in ${subject}?`,
            options: [
                "It builds foundational knowledge",
                "It is not important",
                "It only matters for exams",
                "It has no real-world application"
            ],
            correct: 0,
            explanation: `${topic} provides foundational knowledge essential for ${subject}.`
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
            explanation: `Knowledge of ${topic} can be applied to solve real-world problems.`
        }
    ];
}

/**
 * Show the quiz modal
 */
function showQuizModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('topicQuizModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'topicQuizModal';
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-bold">Topic Quiz</h2>
                        <p class="text-emerald-100 text-sm">${QuizState.topicInfo.subject} - ${QuizState.topicInfo.topic}</p>
                    </div>
                    <button onclick="closeQuizModal()" class="text-white/80 hover:text-white transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <!-- Progress -->
                <div class="mt-4">
                    <div class="flex justify-between text-sm text-emerald-100 mb-2">
                        <span>Question <span id="quizCurrentQuestion">1</span> of <span id="quizTotalQuestions">${QuizState.currentQuiz.length}</span></span>
                        <span id="quizTimer">0:00</span>
                    </div>
                    <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div id="quizProgressBar" class="h-full bg-white transition-all duration-300" style="width: ${(1 / QuizState.currentQuiz.length) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <!-- Question Container -->
            <div id="quizQuestionContainer" class="p-6">
                ${renderQuestion(QuizState.currentQuiz[0], 0)}
            </div>
            
            <!-- Footer -->
            <div class="px-6 pb-6">
                <div id="quizFeedback" class="hidden mb-4 p-4 rounded-lg"></div>
                <div class="flex justify-between">
                    <button id="quizPrevBtn" onclick="previousQuestion()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition hidden">
                        ← Previous
                    </button>
                    <button id="quizNextBtn" onclick="nextQuestion()" class="ml-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition">
                        Next →
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Start timer
    startQuizTimer();
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Render a question
 */
function renderQuestion(question, index) {
    const selectedAnswer = QuizState.answers[index];
    
    return `
        <div class="question-slide">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                ${question.question}
            </h3>
            <div class="space-y-3">
                ${question.options.map((option, optIndex) => `
                    <button 
                        onclick="selectAnswer(${index}, ${optIndex})"
                        class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedAnswer === optIndex 
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                        }"
                    >
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            selectedAnswer === optIndex 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        } font-medium mr-3">
                            ${String.fromCharCode(65 + optIndex)}
                        </span>
                        <span class="text-gray-700 dark:text-gray-300">${option}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Select an answer
 */
function selectAnswer(questionIndex, answerIndex) {
    QuizState.answers[questionIndex] = answerIndex;
    
    // Re-render question to show selection
    const container = document.getElementById('quizQuestionContainer');
    container.innerHTML = renderQuestion(QuizState.currentQuiz[questionIndex], questionIndex);
    
    // Update next button
    updateNavigationButtons();
}

/**
 * Navigate to next question
 */
function nextQuestion() {
    const currentIndex = QuizState.currentQuestionIndex;
    
    // Check if answer is selected
    if (QuizState.answers[currentIndex] === undefined) {
        alert('Please select an answer');
        return;
    }
    
    // If last question, show results
    if (currentIndex === QuizState.currentQuiz.length - 1) {
        showQuizResults();
        return;
    }
    
    // Move to next question
    QuizState.currentQuestionIndex++;
    updateQuestionDisplay();
}

/**
 * Navigate to previous question
 */
function previousQuestion() {
    if (QuizState.currentQuestionIndex > 0) {
        QuizState.currentQuestionIndex--;
        updateQuestionDisplay();
    }
}

/**
 * Update question display
 */
function updateQuestionDisplay() {
    const index = QuizState.currentQuestionIndex;
    const question = QuizState.currentQuiz[index];
    
    // Update question
    const container = document.getElementById('quizQuestionContainer');
    container.innerHTML = renderQuestion(question, index);
    
    // Update progress
    document.getElementById('quizCurrentQuestion').textContent = index + 1;
    document.getElementById('quizProgressBar').style.width = `${((index + 1) / QuizState.currentQuiz.length) * 100}%`;
    
    // Update navigation buttons
    updateNavigationButtons();
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    const index = QuizState.currentQuestionIndex;
    
    // Show/hide previous button
    prevBtn.classList.toggle('hidden', index === 0);
    
    // Update next button text
    if (index === QuizState.currentQuiz.length - 1) {
        nextBtn.textContent = 'Submit Quiz';
        nextBtn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
        nextBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
    } else {
        nextBtn.textContent = 'Next →';
        nextBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');
        nextBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    }
}

// ============================================
// QUIZ TIMER
// ============================================
let quizTimerInterval = null;
let quizElapsedSeconds = 0;

function startQuizTimer() {
    quizElapsedSeconds = 0;
    quizTimerInterval = setInterval(() => {
        quizElapsedSeconds++;
        const mins = Math.floor(quizElapsedSeconds / 60);
        const secs = quizElapsedSeconds % 60;
        const timerEl = document.getElementById('quizTimer');
        if (timerEl) {
            timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function stopQuizTimer() {
    if (quizTimerInterval) {
        clearInterval(quizTimerInterval);
        quizTimerInterval = null;
    }
}

// ============================================
// QUIZ RESULTS
// ============================================
async function showQuizResults() {
    stopQuizTimer();
    
    // Calculate score
    let correctCount = 0;
    QuizState.currentQuiz.forEach((question, index) => {
        if (QuizState.answers[index] === question.correct) {
            correctCount++;
        }
    });
    
    const totalQuestions = QuizState.currentQuiz.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= TopicQuizConfig.passThreshold;
    
    // Record result
    if (window.StudyTracker?.recordQuiz) {
        await window.StudyTracker.recordQuiz(
            QuizState.topicInfo.subject,
            QuizState.topicInfo.topic,
            score,
            totalQuestions,
            correctCount
        );
    }
    
    // Show results
    const container = document.getElementById('quizQuestionContainer');
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    
    prevBtn.classList.add('hidden');
    
    container.innerHTML = `
        <div class="text-center py-6">
            <!-- Score Circle -->
            <div class="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                <svg class="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" stroke-width="12" fill="none"/>
                    <circle cx="64" cy="64" r="56" 
                        stroke="${passed ? '#10b981' : '#f59e0b'}" 
                        stroke-width="12" 
                        fill="none"
                        stroke-linecap="round"
                        stroke-dasharray="${score * 3.52} 352"
                        class="transition-all duration-1000"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-3xl font-bold ${passed ? 'text-emerald-500' : 'text-amber-500'}">${score}%</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">${correctCount}/${totalQuestions} correct</span>
                </div>
            </div>
            
            <!-- Result Message -->
            <h3 class="text-xl font-bold ${passed ? 'text-emerald-600' : 'text-amber-600'} mb-2">
                ${passed ? '🎉 Excellent Work!' : '📚 Keep Practicing!'}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
                ${passed 
                    ? `You've demonstrated good understanding of ${QuizState.topicInfo.topic}.`
                    : `Review ${QuizState.topicInfo.topic} and try again to improve your score.`
                }
            </p>
            
            <!-- Time -->
            <div class="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>${Math.floor(quizElapsedSeconds / 60)}m ${quizElapsedSeconds % 60}s</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>${correctCount} correct</span>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-center gap-4">
                <button onclick="showQuizReview()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">
                    Review Answers
                </button>
                <button onclick="closeQuizModal()" class="px-6 py-2 ${passed ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-lg font-medium transition">
                    ${passed ? 'Continue Learning' : 'Try Again'}
                </button>
            </div>
        </div>
    `;
    
    // Hide navigation
    nextBtn.classList.add('hidden');
}

/**
 * Show quiz review with answers
 */
function showQuizReview() {
    const container = document.getElementById('quizQuestionContainer');
    
    let reviewHTML = `
        <div class="space-y-4 max-h-96 overflow-y-auto">
            <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4">Quiz Review</h3>
    `;
    
    QuizState.currentQuiz.forEach((question, index) => {
        const userAnswer = QuizState.answers[index];
        const isCorrect = userAnswer === question.correct;
        
        reviewHTML += `
            <div class="p-4 rounded-lg border ${isCorrect ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10'}">
                <div class="flex items-start gap-2 mb-2">
                    <span class="text-sm font-medium ${isCorrect ? 'text-emerald-600' : 'text-red-600'}">
                        Q${index + 1}.
                    </span>
                    <p class="text-sm text-gray-800 dark:text-gray-200">${question.question}</p>
                </div>
                <div class="ml-6 space-y-1">
                    <p class="text-sm">
                        <span class="text-gray-500">Your answer:</span>
                        <span class="${isCorrect ? 'text-emerald-600' : 'text-red-600'} font-medium">
                            ${String.fromCharCode(65 + userAnswer)}. ${question.options[userAnswer]}
                        </span>
                    </p>
                    ${!isCorrect ? `
                        <p class="text-sm">
                            <span class="text-gray-500">Correct answer:</span>
                            <span class="text-emerald-600 font-medium">
                                ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}
                            </span>
                        </p>
                    ` : ''}
                    <p class="text-xs text-gray-500 mt-2 italic">${question.explanation}</p>
                </div>
            </div>
        `;
    });
    
    reviewHTML += `
        </div>
        <div class="mt-4 text-center">
            <button onclick="showQuizResults()" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">
                ← Back to Results
            </button>
        </div>
    `;
    
    container.innerHTML = reviewHTML;
}

/**
 * Close quiz modal
 */
function closeQuizModal() {
    stopQuizTimer();
    
    const modal = document.getElementById('topicQuizModal');
    if (modal) {
        modal.remove();
    }
    
    document.body.style.overflow = '';
    
    // Reset state
    QuizState.currentQuiz = null;
    QuizState.currentQuestionIndex = 0;
    QuizState.answers = [];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// AUTO-TRIGGER ON TOPIC PAGES
// ============================================
function setupAutoQuiz() {
    // Check if this is a topic page
    const topicMeta = document.querySelector('meta[name="topic"]');
    const subjectMeta = document.querySelector('meta[name="subject"]');
    
    if (!topicMeta || !subjectMeta) return;
    
    const topic = topicMeta.content;
    const subject = subjectMeta.content;
    
    // Listen for when user has spent enough time
    const checkInterval = setInterval(() => {
        const studyTime = window.StudyTracker?.getCurrentTime() || 0;
        
        // Show quiz prompt after minimum time
        if (studyTime >= TopicQuizConfig.minTimeForQuiz) {
            clearInterval(checkInterval);
            showQuizPrompt(subject, topic);
        }
    }, 10000); // Check every 10 seconds
    
    // Also check on scroll to bottom
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            const studyTime = window.StudyTracker?.getCurrentTime() || 0;
            if (studyTime >= 30) { // Minimum 30 seconds if scrolled to bottom
                showQuizPrompt(subject, topic);
            }
        }
    }, { once: true });
}

/**
 * Show quiz prompt notification
 */
function showQuizPrompt(subject, topic) {
    // Don't show if already shown
    if (document.getElementById('quizPromptToast')) return;
    
    // Don't show if quiz modal is open
    if (document.getElementById('topicQuizModal')) return;
    
    const toast = document.createElement('div');
    toast.id = 'quizPromptToast';
    toast.className = 'fixed bottom-24 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-sm z-40 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <div class="flex-1">
                <h4 class="font-medium text-gray-800 dark:text-gray-200">Ready for a Quiz?</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Test your knowledge of ${topic}</p>
                <div class="flex gap-2 mt-3">
                    <button onclick="this.closest('#quizPromptToast').remove()" class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        Later
                    </button>
                    <button onclick="startTopicQuiz('${subject}', '${topic}'); this.closest('#quizPromptToast').remove();" class="px-3 py-1 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
                        Start Quiz
                    </button>
                </div>
            </div>
            <button onclick="this.closest('#quizPromptToast').remove()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
        if (document.getElementById('quizPromptToast')) {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }
    }, 30000);
}

// ============================================
// INITIALIZE ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    await initQuizSystem();
    
    // Setup auto-quiz trigger
    setupAutoQuiz();
});

// ============================================
// EXPORT
// ============================================
window.TopicQuiz = {
    init: initQuizSystem,
    start: startTopicQuiz,
    close: closeQuizModal,
    
    // Add custom questions
    addQuestions: (topicKey, questions) => {
        TopicQuizQuestions[topicKey] = questions;
    }
};

console.log('✅ Topic Quiz System loaded');
