/**
 * ============================================
 * JUANOVA CORTEX - TOPIC QUIZ LOADER
 * Dynamically loads topic-specific quiz files
 * ============================================
 */

(function() {
    'use strict';
    
    // Quiz data registry - each topic registers its own questions
    window.TopicQuizRegistry = window.TopicQuizRegistry || {};
    
    // Register a topic's quiz questions
    window.registerTopicQuiz = function(subject, topic, questions) {
        const key = `${subject.toLowerCase()}/${topic.toLowerCase()}`;
        window.TopicQuizRegistry[key] = {
            subject: subject,
            topic: topic,
            questions: questions
        };
        console.log(`✅ Quiz registered: ${key} (${questions.length} questions)`);
    };
    
    // Get quiz for a topic
    window.getTopicQuiz = function(subject, topic) {
        // Try exact match
        let key = `${subject.toLowerCase()}/${topic.toLowerCase()}`;
        if (window.TopicQuizRegistry[key]) {
            return window.TopicQuizRegistry[key];
        }
        
        // Try with variations
        const variations = [
            topic.toLowerCase().replace(/\s+/g, '-'),
            topic.toLowerCase().replace(/-/g, '-'),
            topic.toLowerCase().replace(/\s+/g, ''),
            topic.toLowerCase().split('-').pop(),
            topic.toLowerCase().split(' ').pop()
        ];
        
        for (const v of variations) {
            key = `${subject.toLowerCase()}/${v}`;
            if (window.TopicQuizRegistry[key]) {
                return window.TopicQuizRegistry[key];
            }
        }
        
        // Try partial match
        for (const [k, data] of Object.entries(window.TopicQuizRegistry)) {
            if (k.startsWith(`${subject.toLowerCase()}/`) && 
                (k.includes(topic.toLowerCase()) || topic.toLowerCase().includes(k.split('/')[1]))) {
                return data;
            }
        }
        
        return null;
    };
    
    // Load quiz file dynamically
    window.loadTopicQuizFile = async function(subject, subfolder, topic) {
        const scriptPath = `/quizzes/${subject.toLowerCase()}/${subfolder.toLowerCase()}/${topic.toLowerCase()}.js`;
        
        return new Promise((resolve, reject) => {
            // Check if already loaded
            const key = `${subject.toLowerCase()}/${topic.toLowerCase()}`;
            if (window.TopicQuizRegistry[key]) {
                resolve(window.TopicQuizRegistry[key]);
                return;
            }
            
            // Create script element
            const script = document.createElement('script');
            script.src = scriptPath;
            script.type = 'text/javascript';
            
            script.onload = () => {
                console.log(`✅ Loaded quiz file: ${scriptPath}`);
                resolve(window.TopicQuizRegistry[key]);
            };
            
            script.onerror = () => {
                console.warn(`⚠️ Quiz file not found: ${scriptPath}`);
                resolve(null);
            };
            
            document.head.appendChild(script);
        });
    };
    
    console.log('📚 Topic Quiz Loader initialized');
})();
