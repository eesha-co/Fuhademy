/**
 * ============================================
 * JUANOVA CORTEX - GOALS ONBOARDING MODAL
 * Multi-step modal for creating learning goals
 * ============================================
 * 
 * Required: goals-manager.js must be loaded before this file
 * Required: Tailwind CSS for styling
 */

// ============================================
// MODAL STATE MANAGEMENT
// ============================================
const GoalsModalState = {
    isOpen: false,
    currentStep: 1,
    totalSteps: 4,
    
    // User selections
    selections: {
        primaryGoal: null,
        customGoal: '',
        targetScore: 75,
        focusSubjects: [],
        studyHours: '5-10',
        studyTimeFrom: '09:00',
        studyTimeTo: '17:00',
        deadline: null
    },
    
    // Available options
    primaryGoals: [
        { id: 'improve_grades', label: 'Improve my grades', icon: '📈' },
        { id: 'exam_prep', label: 'Prepare for an exam', icon: '📝' },
        { id: 'learn_new', label: 'Learn a new subject', icon: '🆕' },
        { id: 'practice', label: 'Practice and improve', icon: '💪' },
        { id: 'other', label: 'Other', icon: '🎯' }
    ],
    
    studyHourOptions: [
        { id: 'less_5', label: 'Less than 5 hours', hours: 5 },
        { id: '5-10', label: '5-10 hours', hours: 10 },
        { id: '10-20', label: '10-20 hours', hours: 20 },
        { id: 'more_20', label: 'More than 20 hours', hours: 25 }
    ],
    
    // Track if goals have been saved
    goalsSaved: false
};

// ============================================
// MODAL HTML TEMPLATES
// ============================================

function getModalHTML() {
    return `
        <!-- Goals Onboarding Modal -->
        <div id="goalsModal" class="fixed inset-0 z-50 hidden">
            <!-- Backdrop -->
            <div id="modalBackdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
            
            <!-- Modal Container -->
            <div class="relative flex items-center justify-center min-h-screen p-4">
                <!-- Modal Content -->
                <div id="modalContent" class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all scale-95 opacity-0">
                    
                    <!-- Header -->
                    <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">🎯</span>
                                <h2 class="text-xl font-bold text-gray-800">Create Your Learning Plan</h2>
                            </div>
                            <button id="closeModalBtn" class="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Progress Bar -->
                        <div class="mt-4">
                            <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                                <span>Step <span id="currentStepNum">1</span> of ${GoalsModalState.totalSteps}</span>
                                <span id="progressPercent">25%</span>
                            </div>
                            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div id="progressBar" class="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300" style="width: 25%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Step Content -->
                    <div id="stepContent" class="p-6">
                        <!-- Content will be injected here -->
                    </div>
                    
                    <!-- Footer -->
                    <div id="modalFooter" class="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                        <div class="flex items-center justify-between">
                            <button id="backBtn" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors hidden">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                    </svg>
                                    Back
                                </span>
                            </button>
                            <div class="flex-1"></div>
                            <button id="skipBtn" class="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors mr-2">
                                Skip for now
                            </button>
                            <button id="nextBtn" class="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                Next Step
                                <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// STEP TEMPLATES
// ============================================

function getStep1HTML() {
    const goals = GoalsModalState.primaryGoals;
    const selected = GoalsModalState.selections.primaryGoal;
    
    return `
        <div class="space-y-6">
            <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-800">Welcome to Juanova Cortex! 👋</h3>
                <p class="text-gray-500 mt-2">Let's set up your personalized learning goals. This will help us tailor your experience.</p>
            </div>
            
            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">What's your main learning goal?</label>
                
                <div class="grid gap-2">
                    ${goals.map(goal => `
                        <label class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                            ${selected === goal.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}">
                            <input type="radio" name="primaryGoal" value="${goal.id}" 
                                class="w-4 h-4 text-sky-500 focus:ring-sky-500"
                                ${selected === goal.id ? 'checked' : ''}>
                            <span class="text-xl">${goal.icon}</span>
                            <span class="font-medium text-gray-700">${goal.label}</span>
                        </label>
                    `).join('')}
                </div>
                
                <!-- Custom Goal Input (shown when "Other" is selected) -->
                <div id="customGoalInput" class="mt-3 ${selected === 'other' ? '' : 'hidden'}">
                    <input type="text" 
                        placeholder="Tell us your goal..."
                        value="${GoalsModalState.selections.customGoal}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all">
                </div>
            </div>
        </div>
    `;
}

function getStep2HTML() {
    const target = GoalsModalState.selections.targetScore;
    
    return `
        <div class="space-y-6">
            <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-800">Set Your Target Score 📊</h3>
                <p class="text-gray-500 mt-2">What average score would you like to achieve?</p>
            </div>
            
            <div class="bg-gray-50 rounded-2xl p-6">
                <div class="text-center mb-4">
                    <span id="targetScoreDisplay" class="text-5xl font-bold text-sky-600">${target}%</span>
                    <p class="text-gray-500 mt-2">Target Average Score</p>
                </div>
                
                <div class="relative">
                    <input type="range" 
                        id="targetScoreSlider"
                        min="50" 
                        max="100" 
                        value="${target}"
                        class="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-6
                            [&::-webkit-slider-thumb]:h-6
                            [&::-webkit-slider-thumb]:bg-sky-500
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:shadow-lg
                            [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:hover:scale-110">
                    
                    <div class="flex justify-between text-sm text-gray-400 mt-2">
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                </div>
                
                <div class="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                    <p class="text-sm text-gray-600">
                        <span class="font-medium text-sky-600">💡 Tip:</span> 
                        A target of <span class="font-semibold">${target}%</span> means you'll need to answer correctly on ${Math.round(target / 100 * 20)} out of 20 questions on average.
                    </p>
                </div>
            </div>
            
            <!-- Deadline Option -->
            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">When do you want to achieve this? (Optional)</label>
                <select id="deadlineSelect" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none">
                    <option value="">No deadline</option>
                    <option value="1">1 month from now</option>
                    <option value="3" selected>3 months from now</option>
                    <option value="6">6 months from now</option>
                    <option value="12">1 year from now</option>
                </select>
            </div>
        </div>
    `;
}

function getStep3HTML() {
    const selectedSubjects = GoalsModalState.selections.focusSubjects;
    
    // Default subjects
    const subjects = [
        { name: 'Mathematics', icon: '📐', color: 'bg-red-50 border-red-200 text-red-700' },
        { name: 'English', icon: '📚', color: 'bg-blue-50 border-blue-200 text-blue-700' },
        { name: 'Physics', icon: '⚛️', color: 'bg-green-50 border-green-200 text-green-700' },
        { name: 'Chemistry', icon: '🧪', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
        { name: 'Biology', icon: '🧬', color: 'bg-purple-50 border-purple-200 text-purple-700' },
        { name: 'Geography', icon: '🌍', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
        { name: 'History', icon: '🏛️', color: 'bg-pink-50 border-pink-200 text-pink-700' },
        { name: 'Economics', icon: '💰', color: 'bg-lime-50 border-lime-200 text-lime-700' },
        { name: 'Computer Science', icon: '💻', color: 'bg-orange-50 border-orange-200 text-orange-700' },
        { name: 'Literature', icon: '📖', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' }
    ];
    
    return `
        <div class="space-y-6">
            <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-800">Choose Focus Subjects 📚</h3>
                <p class="text-gray-500 mt-2">Select the subjects you want to focus on (you can change this later)</p>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                ${subjects.map(subject => {
                    const isSelected = selectedSubjects.includes(subject.name);
                    return `
                        <label class="flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all
                            ${isSelected ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'}">
                            <input type="checkbox" 
                                name="focusSubject" 
                                value="${subject.name}"
                                ${isSelected ? 'checked' : ''}
                                class="w-4 h-4 text-sky-500 rounded focus:ring-sky-500">
                            <span class="text-lg">${subject.icon}</span>
                            <span class="text-sm font-medium text-gray-700">${subject.name}</span>
                        </label>
                    `;
                }).join('')}
            </div>
            
            <div class="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <span class="text-sm text-gray-600">Selected subjects:</span>
                <span id="selectedCount" class="font-semibold text-sky-600">${selectedSubjects.length} subjects</span>
            </div>
        </div>
    `;
}

function getStep4HTML() {
    const selectedHours = GoalsModalState.selections.studyHours;
    const options = GoalsModalState.studyHourOptions;
    
    return `
        <div class="space-y-6">
            <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-800">Study Schedule ⏰</h3>
                <p class="text-gray-500 mt-2">How much time can you dedicate to learning each week?</p>
            </div>
            
            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">Weekly study hours</label>
                
                <div class="grid gap-2">
                    ${options.map(opt => `
                        <label class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                            ${selectedHours === opt.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'}">
                            <input type="radio" name="studyHours" value="${opt.id}" 
                                class="w-4 h-4 text-sky-500 focus:ring-sky-500"
                                ${selectedHours === opt.id ? 'checked' : ''}>
                            <span class="font-medium text-gray-700">${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">Preferred study time (Optional)</label>
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <label class="text-xs text-gray-500 mb-1 block">From</label>
                        <input type="time" 
                            id="studyTimeFrom"
                            value="${GoalsModalState.selections.studyTimeFrom}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none">
                    </div>
                    <span class="text-gray-400 mt-5">━</span>
                    <div class="flex-1">
                        <label class="text-xs text-gray-500 mb-1 block">To</label>
                        <input type="time" 
                            id="studyTimeTo"
                            value="${GoalsModalState.selections.studyTimeTo}"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none">
                    </div>
                </div>
            </div>
            
            <div class="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p class="text-sm text-amber-800">
                    <span class="font-medium">💡 Tip:</span> 
                    Consistency beats intensity! It's better to study 1 hour daily than 7 hours once a week.
                </p>
            </div>
        </div>
    `;
}

function getCompletionHTML() {
    const sel = GoalsModalState.selections;
    const subjectsList = sel.focusSubjects.length > 0 ? sel.focusSubjects.join(', ') : 'All subjects';
    
    return `
        <div class="text-center py-8 space-y-6">
            <div class="text-6xl">🎉</div>
            
            <div>
                <h3 class="text-2xl font-bold text-gray-800">Your Learning Plan is Ready!</h3>
                <p class="text-gray-500 mt-2">We'll help you stay on track with reminders and progress updates.</p>
            </div>
            
            <div class="bg-gray-50 rounded-2xl p-6 text-left space-y-4">
                <h4 class="font-semibold text-gray-700 text-center mb-4">📋 Your Goals Summary</h4>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-gray-600">🎯 Main Goal</span>
                        <span class="font-medium text-gray-800">${getPrimaryGoalLabel()}</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-gray-600">📊 Target Score</span>
                        <span class="font-medium text-sky-600">${sel.targetScore}%</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-gray-600">📚 Focus Subjects</span>
                        <span class="font-medium text-gray-800">${subjectsList}</span>
                    </div>
                    
                    <div class="flex items-center justify-between py-2 border-b border-gray-200">
                        <span class="text-gray-600">⏰ Study Time</span>
                        <span class="font-medium text-gray-800">${getStudyHoursLabel()}</span>
                    </div>
                    
                    ${sel.deadline ? `
                        <div class="flex items-center justify-between py-2">
                            <span class="text-gray-600">📅 Deadline</span>
                            <span class="font-medium text-gray-800">${formatDeadline(sel.deadline)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <p class="text-sm text-gray-500">
                You can always update your goals from your dashboard settings.
            </p>
        </div>
    `;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getPrimaryGoalLabel() {
    const goal = GoalsModalState.primaryGoals.find(g => g.id === GoalsModalState.selections.primaryGoal);
    if (GoalsModalState.selections.primaryGoal === 'other') {
        return GoalsModalState.selections.customGoal || 'Custom Goal';
    }
    return goal ? goal.label : 'Not specified';
}

function getStudyHoursLabel() {
    const opt = GoalsModalState.studyHourOptions.find(o => o.id === GoalsModalState.selections.studyHours);
    return opt ? opt.label : 'Not specified';
}

function formatDeadline(months) {
    const date = new Date();
    date.setMonth(date.getMonth() + parseInt(months));
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function updateProgress() {
    const progress = (GoalsModalState.currentStep / GoalsModalState.totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;
    document.getElementById('currentStepNum').textContent = GoalsModalState.currentStep;
}

function renderStep() {
    const stepContent = document.getElementById('stepContent');
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const skipBtn = document.getElementById('skipBtn');
    
    // Update step content
    switch (GoalsModalState.currentStep) {
        case 1:
            stepContent.innerHTML = getStep1HTML();
            break;
        case 2:
            stepContent.innerHTML = getStep2HTML();
            break;
        case 3:
            stepContent.innerHTML = getStep3HTML();
            break;
        case 4:
            stepContent.innerHTML = getStep4HTML();
            break;
        case 5: // Completion
            stepContent.innerHTML = getCompletionHTML();
            break;
    }
    
    // Update buttons
    backBtn.classList.toggle('hidden', GoalsModalState.currentStep === 1);
    skipBtn.classList.toggle('hidden', GoalsModalState.currentStep === GoalsModalState.totalSteps + 1);
    
    if (GoalsModalState.currentStep === GoalsModalState.totalSteps + 1) {
        nextBtn.innerHTML = `
            Start Learning 🚀
        `;
        nextBtn.classList.remove('from-sky-500', 'to-blue-600');
        nextBtn.classList.add('from-purple-500', 'to-pink-600');
    } else if (GoalsModalState.currentStep === GoalsModalState.totalSteps) {
        nextBtn.innerHTML = `
            Complete Setup ✓
        `;
    } else {
        nextBtn.innerHTML = `
            Next Step
            <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
        `;
    }
    
    updateProgress();
    attachStepListeners();
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachStepListeners() {
    const stepContent = document.getElementById('stepContent');
    
    switch (GoalsModalState.currentStep) {
        case 1:
            // Primary goal selection
            stepContent.querySelectorAll('input[name="primaryGoal"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    GoalsModalState.selections.primaryGoal = e.target.value;
                    document.getElementById('customGoalInput').classList.toggle('hidden', e.target.value !== 'other');
                    renderStep();
                });
            });
            
            // Custom goal input
            const customInput = stepContent.querySelector('#customGoalInput input');
            if (customInput) {
                customInput.addEventListener('input', (e) => {
                    GoalsModalState.selections.customGoal = e.target.value;
                });
            }
            break;
            
        case 2:
            // Target score slider
            const slider = document.getElementById('targetScoreSlider');
            const display = document.getElementById('targetScoreDisplay');
            
            slider.addEventListener('input', (e) => {
                GoalsModalState.selections.targetScore = parseInt(e.target.value);
                display.textContent = `${e.target.value}%`;
            });
            
            // Deadline select
            const deadlineSelect = document.getElementById('deadlineSelect');
            deadlineSelect.addEventListener('change', (e) => {
                GoalsModalState.selections.deadline = e.target.value;
            });
            break;
            
        case 3:
            // Subject selection
            stepContent.querySelectorAll('input[name="focusSubject"]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const subject = e.target.value;
                    const subjects = GoalsModalState.selections.focusSubjects;
                    
                    if (e.target.checked) {
                        if (!subjects.includes(subject)) {
                            subjects.push(subject);
                        }
                    } else {
                        const index = subjects.indexOf(subject);
                        if (index > -1) {
                            subjects.splice(index, 1);
                        }
                    }
                    
                    document.getElementById('selectedCount').textContent = `${subjects.length} subjects`;
                });
            });
            break;
            
        case 4:
            // Study hours selection
            stepContent.querySelectorAll('input[name="studyHours"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    GoalsModalState.selections.studyHours = e.target.value;
                    renderStep();
                });
            });
            
            // Study time inputs
            const timeFrom = document.getElementById('studyTimeFrom');
            const timeTo = document.getElementById('studyTimeTo');
            
            if (timeFrom) {
                timeFrom.addEventListener('change', (e) => {
                    GoalsModalState.selections.studyTimeFrom = e.target.value;
                });
            }
            if (timeTo) {
                timeTo.addEventListener('change', (e) => {
                    GoalsModalState.selections.studyTimeTo = e.target.value;
                });
            }
            break;
    }
}

// ============================================
// MODAL CONTROL FUNCTIONS
// ============================================

function openGoalsModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('goalsModal')) {
        document.body.insertAdjacentHTML('beforeend', getModalHTML());
        attachModalListeners();
    }
    
    // Reset state
    GoalsModalState.currentStep = 1;
    GoalsModalState.isOpen = true;
    GoalsModalState.selections = {
        primaryGoal: null,
        customGoal: '',
        targetScore: 75,
        focusSubjects: [],
        studyHours: '5-10',
        studyTimeFrom: '09:00',
        studyTimeTo: '17:00',
        deadline: null
    };
    
    // Show modal
    const modal = document.getElementById('goalsModal');
    const content = document.getElementById('modalContent');
    
    modal.classList.remove('hidden');
    
    // Animate in
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Render first step
    renderStep();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeGoalsModal() {
    const modal = document.getElementById('goalsModal');
    const content = document.getElementById('modalContent');
    
    // Animate out
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        GoalsModalState.isOpen = false;
        document.body.style.overflow = '';
    }, 200);
}

function attachModalListeners() {
    // Close button
    document.getElementById('closeModalBtn').addEventListener('click', closeGoalsModal);
    
    // Backdrop click
    document.getElementById('modalBackdrop').addEventListener('click', closeGoalsModal);
    
    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', () => {
        if (GoalsModalState.currentStep > 1) {
            GoalsModalState.currentStep--;
            renderStep();
        }
    });
    
    document.getElementById('nextBtn').addEventListener('click', handleNextStep);
    document.getElementById('skipBtn').addEventListener('click', closeGoalsModal);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!GoalsModalState.isOpen) return;
        
        if (e.key === 'Escape') {
            closeGoalsModal();
        }
    });
}

async function handleNextStep() {
    const state = GoalsModalState;
    
    // Validate current step
    if (state.currentStep === 1 && !state.selections.primaryGoal) {
        showToast('Please select a goal to continue', 'warning');
        return;
    }
    
    // Move to next step or complete
    if (state.currentStep < state.totalSteps) {
        state.currentStep++;
        renderStep();
    } else if (state.currentStep === state.totalSteps) {
        // Save goals and show completion
        const saved = await saveGoals();
        if (saved) {
            state.currentStep++;
            renderStep();
        }
    } else {
        // Close modal after completion
        closeGoalsModal();
        showToast('Your learning plan has been created! 🎉', 'success');
        
        // Trigger custom event for dashboard to listen to
        window.dispatchEvent(new CustomEvent('goalsCreated'));
        
        // Reload the page to show goals
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

async function saveGoals() {
    console.log('💾 saveGoals called');
    
    const sel = GoalsModalState.selections;
    
    // Build goals array
    const goals = [];
    
    // Main score target
    goals.push({
        goal_type: 'score_target',
        title: 'Target Average Score',
        target_value: sel.targetScore,
        unit: '%',
        deadline: sel.deadline ? calculateDeadlineDate(sel.deadline) : null
    });
    
    // Study hours goal
    const hoursOpt = GoalsModalState.studyHourOptions.find(o => o.id === sel.studyHours);
    if (hoursOpt) {
        goals.push({
            goal_type: 'study_hours',
            title: 'Weekly Study Hours',
            target_value: hoursOpt.hours,
            unit: 'hours'
        });
    }
    
    // Subject mastery goals
    sel.focusSubjects.forEach(subject => {
        goals.push({
            goal_type: 'subject_mastery',
            title: `Master ${subject}`,
            subject: subject,
            target_value: 80,
            unit: '%'
        });
    });
    
    console.log('📝 Goals to save:', goals);
    
    // Check if GoalsManager is available
    if (!window.GoalsManager) {
        console.error('❌ GoalsManager not found!');
        showToast('Error: Goals system not loaded', 'error');
        return false;
    }
    
    // Save to database
    try {
        showToast('Saving your goals...', 'info');
        
        const result = await window.GoalsManager.createMultipleGoals(goals);
        
        console.log('📤 Save result:', result);
        
        if (result.success) {
            console.log(`✅ Created ${result.created} goals`);
            showToast(`✅ Created ${result.created} goals!`, 'success');
            
            // Mark as saved
            GoalsModalState.goalsSaved = true;
            
            // Save flag to localStorage to prevent re-showing
            localStorage.setItem('goalsCreated', 'true');
            
            return true;
        } else {
            console.error('❌ Failed to save goals:', result.errors);
            showToast(`Failed to save: ${result.errors?.join(', ') || 'Unknown error'}`, 'error');
            return false;
        }
    } catch (err) {
        console.error('❌ Error saving goals:', err);
        showToast(`Error: ${err.message}`, 'error');
        return false;
    }
}

function calculateDeadlineDate(months) {
    const date = new Date();
    date.setMonth(date.getMonth() + parseInt(months));
    return date.toISOString().split('T')[0];
}

// Simple toast notification
function showToast(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        warning: 'bg-amber-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-fade-in`;
    toast.style.animation = 'fadeIn 0.3s ease-out';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// INITIALIZATION FUNCTION
// ============================================

async function initializeGoalsCheck() {
    console.log('🔍 Checking for existing goals...');
    
    // Check localStorage first for quick check
    if (localStorage.getItem('goalsCreated') === 'true') {
        console.log('✅ Goals already created (from localStorage)');
        return;
    }
    
    // Check if GoalsManager is available
    if (!window.GoalsManager) {
        console.warn('⚠️ GoalsManager not loaded yet');
        // Wait and retry
        setTimeout(initializeGoalsCheck, 1000);
        return;
    }
    
    try {
        const result = await window.GoalsManager.checkUserGoals();
        
        console.log('📊 Goals check result:', result);
        
        if (result.error === 'not_authenticated') {
            console.log('User not authenticated, skipping goals check');
            return;
        }
        
        if (result.error === 'table_not_found') {
            console.warn('⚠️ user_goals table not found. Run the SQL setup script.');
            return;
        }
        
        if (result.firstTime || !result.hasGoals) {
            console.log('👋 First time user - showing goals modal');
            setTimeout(() => {
                openGoalsModal();
            }, 1500);
        } else {
            console.log('✅ User has existing goals:', result.goals.length);
            // Mark as created
            localStorage.setItem('goalsCreated', 'true');
        }
        
    } catch (err) {
        console.error('Error checking goals:', err);
    }
}

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================
window.GoalsModal = {
    open: openGoalsModal,
    close: closeGoalsModal,
    checkGoals: initializeGoalsCheck,  // Alias for initializeGoalsCheck
    state: GoalsModalState
};

console.log('✅ GoalsModal loaded successfully');
