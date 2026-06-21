// Quiz navigation state management
let currentQuestion = 1;
let totalQuestions = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Find all questions and initialize total count
    const questions = document.querySelectorAll('.question-item');
    totalQuestions = questions.length;

    // Update the UI counters
    updateQuestionCounters();
});

function updateQuestionCounters() {
    document.querySelectorAll('[id^="currentQuestion"]').forEach(elem => {
        elem.textContent = currentQuestion;
    });
    document.querySelectorAll('[id^="totalQuestions"]').forEach(elem => {
        elem.textContent = totalQuestions;
    });
}

function showQuestion(number) {
    // Hide all questions
    document.querySelectorAll('.question-item').forEach(q => {
        q.classList.add('hidden');
    });
    
    // Show the target question
    const targetQuestion = document.querySelector(`.question-item[data-question="${number}"]`);
    if (targetQuestion) {
        targetQuestion.classList.remove('hidden');
    }
}

function nextQuestion(section) {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showQuestion(currentQuestion);
        updateQuestionCounters();
    }
}

function previousQuestion(section) {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
        updateQuestionCounters();
    }
}

function toggleExplanation(id) {
    const explanation = document.getElementById(id);
    explanation.classList.toggle('hidden');
}

// Initialize by showing the first question
showQuestion(1);