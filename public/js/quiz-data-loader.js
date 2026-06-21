/**
 * ============================================
 * JUANOVA CORTEX - QUIZ DATA LOADER
 * Loads all quiz data and makes it available
 * ============================================
 */

// Load quiz data in correct order
(function() {
    // Check if data is already loaded
    if (window.TopicQuizzesData) {
        console.log('Quiz data already loaded');
        return;
    }
    
    // Initialize empty object
    window.TopicQuizzesData = {};
    
    // Function to load script dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Load quiz data files
    async function loadQuizData() {
        try {
            await loadScript('/js/topic-quizzes-data.js');
            await loadScript('/js/topic-quizzes-data-part2.js');
            console.log('✅ All quiz data loaded');
        } catch (err) {
            console.warn('Could not load quiz data files:', err);
        }
    }
    
    // Start loading
    loadQuizData();
})();
