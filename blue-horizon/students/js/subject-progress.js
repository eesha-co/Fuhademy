/**
 * Subject Progress Tracker
 * Calculates subject mastery progress from topic_progress table
 * 
 * This module:
 * 1. Reads topic progress from Supabase topic_progress table
 * 2. Groups topics by subject
 * 3. Calculates overall subject completion percentage
 * 4. Updates dashboard progress bars
 */

// Subject configuration with icons and colors
const SubjectConfig = {
    chemistry: { 
        name: 'Chemistry', 
        icon: '🧪', 
        color: 'pink',
        colorClass: 'bg-pink-500',
        bgClass: 'bg-pink-100',
        textClass: 'text-pink-700'
    },
    physics: { 
        name: 'Physics', 
        icon: '⚛️', 
        color: 'yellow',
        colorClass: 'bg-yellow-500',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700'
    },
    mathematics: { 
        name: 'Mathematics', 
        icon: '📐', 
        color: 'sky',
        colorClass: 'bg-sky-500',
        bgClass: 'bg-sky-100',
        textClass: 'text-sky-700'
    },
    biology: { 
        name: 'Biology', 
        icon: '🧬', 
        color: 'green',
        colorClass: 'bg-green-500',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700'
    },
    english: { 
        name: 'English', 
        icon: '📚', 
        color: 'indigo',
        colorClass: 'bg-indigo-500',
        bgClass: 'bg-indigo-100',
        textClass: 'text-indigo-700'
    },
    economics: { 
        name: 'Economics', 
        icon: '📊', 
        color: 'purple',
        colorClass: 'bg-purple-500',
        bgClass: 'bg-purple-100',
        textClass: 'text-purple-700'
    },
    literature: { 
        name: 'Literature', 
        icon: '📖', 
        color: 'orange',
        colorClass: 'bg-orange-500',
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-700'
    },
    civic: { 
        name: 'Civic Education', 
        icon: '🏛️', 
        color: 'teal',
        colorClass: 'bg-teal-500',
        bgClass: 'bg-teal-100',
        textClass: 'text-teal-700'
    }
};

// Total expected topics per subject (for progress calculation)
const SubjectTopics = {
    chemistry: {
        totalTopics: 30,
        categories: {
            foundations: 10,
            electrochemistry_redox: 9,
            organic: 6,
            kinetics: 5
        }
    },
    physics: {
        totalTopics: 25,
        categories: {
            mechanics: 8,
            properties: 6,
            waves: 5,
            electricity: 6
        }
    },
    mathematics: {
        totalTopics: 28,
        categories: {
            algebraic_foundations: 8,
            calculus: 6,
            geometry: 7,
            statistics: 7
        }
    },
    biology: {
        totalTopics: 25,
        categories: {}
    },
    english: {
        totalTopics: 20,
        categories: {}
    }
};

/**
 * Get Supabase client
 */
async function getSupabaseClient() {
    // Wait for window.supabaseClient to be available
    let attempts = 0;
    while (!window.supabaseClient && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    return window.supabaseClient;
}

/**
 * Get current authenticated user
 */
async function getCurrentUser() {
    const sb = await getSupabaseClient();
    if (!sb) return null;
    
    const { data: { user } } = await sb.auth.getUser();
    return user;
}

/**
 * Fetch all topic progress for the current user
 */
async function fetchTopicProgress() {
    try {
        const sb = await getSupabaseClient();
        if (!sb) {
            console.warn('SubjectProgress: Supabase not available');
            return [];
        }
        
        const user = await getCurrentUser();
        if (!user) {
            console.warn('SubjectProgress: User not authenticated');
            return [];
        }
        
        const { data, error } = await sb
            .from('topic_progress')
            .select('*')
            .eq('user_id', user.id);
        
        if (error) {
            console.error('SubjectProgress: Error fetching progress:', error);
            return [];
        }
        
        return data || [];
    } catch (err) {
        console.error('SubjectProgress: Exception:', err);
        return [];
    }
}

/**
 * Calculate subject progress from topic progress data
 */
function calculateSubjectProgress(topicProgressData) {
    const subjectProgress = {};
    
    // Group by subject
    topicProgressData.forEach(topic => {
        const subject = topic.subject || 'general';
        
        if (!subjectProgress[subject]) {
            subjectProgress[subject] = {
                topics: [],
                totalProgress: 0,
                completedTopics: 0,
                totalTopics: 0,
                quizPassedCount: 0
            };
        }
        
        subjectProgress[subject].topics.push(topic);
        subjectProgress[subject].totalProgress += topic.progress_percent || 0;
        subjectProgress[subject].totalTopics++;
        
        if (topic.progress_percent >= 80) {
            subjectProgress[subject].completedTopics++;
        }
        
        if (topic.quiz_passed) {
            subjectProgress[subject].quizPassedCount++;
        }
    });
    
    // Calculate percentage for each subject
    Object.keys(subjectProgress).forEach(subject => {
        const data = subjectProgress[subject];
        const expectedTotal = SubjectTopics[subject]?.totalTopics || data.totalTopics;
        
        // Progress based on completed topics vs expected topics
        data.completionPercent = Math.round((data.completedTopics / expectedTotal) * 100);
        
        // Average progress across all topics in this subject
        data.averageProgress = data.totalTopics > 0 
            ? Math.round(data.totalProgress / data.totalTopics) 
            : 0;
        
        // Weighted score (completion is more important than average progress)
        data.weightedScore = Math.round(
            (data.completionPercent * 0.7) + (data.averageProgress * 0.3)
        );
        
        data.config = SubjectConfig[subject] || {
            name: subject.charAt(0).toUpperCase() + subject.slice(1),
            icon: '📚',
            colorClass: 'bg-gray-500',
            bgClass: 'bg-gray-100',
            textClass: 'text-gray-700'
        };
    });
    
    return subjectProgress;
}

/**
 * Render subject progress cards to the dashboard
 */
function renderSubjectProgressCards(subjectProgress) {
    const container = document.getElementById('subjectProgressContainer');
    if (!container) {
        console.warn('SubjectProgress: Container not found');
        return;
    }
    
    // Get subjects with progress, sorted by completion
    const subjects = Object.entries(subjectProgress)
        .map(([key, data]) => ({ key, ...data }))
        .sort((a, b) => b.weightedScore - a.weightedScore);
    
    if (subjects.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <div class="text-4xl mb-3">📚</div>
                <p>Start learning to see your subject progress!</p>
                <a href="subjects.html" class="text-sky-600 hover:underline mt-2 inline-block">Browse Subjects</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = subjects.map(subject => {
        const progress = subject.weightedScore;
        const colorClass = progress >= 75 ? 'bg-green-500' : progress >= 50 ? 'bg-amber-500' : 'bg-red-500';
        const bgClass = progress >= 75 ? 'bg-green-100' : progress >= 50 ? 'bg-amber-100' : 'bg-red-100';
        
        return `
            <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                 onclick="window.location.href='subjects/${subject.key}/index.html'">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl">${subject.config.icon}</span>
                    <span class="text-xs font-medium ${progress >= 75 ? 'text-green-600' : progress >= 50 ? 'text-amber-600' : 'text-red-600'}">
                        ${progress}% Mastered
                    </span>
                </div>
                <div class="text-xs text-slate-500 mb-1">Subject</div>
                <div class="font-semibold text-slate-800 mb-3">${subject.config.name}</div>
                
                <div class="h-2 ${bgClass} rounded-full overflow-hidden mb-2">
                    <div class="h-full ${colorClass} rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>
                
                <div class="flex justify-between text-xs text-slate-500">
                    <span>${subject.completedTopics} topics completed</span>
                    <span>${subject.quizPassedCount} quizzes passed</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update the subject mastery goals in the existing goals section
 */
async function updateSubjectMasteryGoals() {
    console.log('🎯 SubjectProgress: Updating subject mastery goals...');
    
    // Fetch and calculate progress
    const topicProgress = await fetchTopicProgress();
    const subjectProgress = calculateSubjectProgress(topicProgress);
    
    console.log('📊 Subject progress calculated:', subjectProgress);
    
    // Render to dashboard
    renderSubjectProgressCards(subjectProgress);
    
    // Also update goals if subject_mastery goals exist
    await updateSubjectMasteryInGoals(subjectProgress);
    
    return subjectProgress;
}

/**
 * Update subject mastery type goals in the user_goals table
 */
async function updateSubjectMasteryInGoals(subjectProgress) {
    try {
        const sb = await getSupabaseClient();
        if (!sb) return;
        
        const user = await getCurrentUser();
        if (!user) return;
        
        // Get existing subject mastery goals
        const { data: existingGoals, error } = await sb
            .from('user_goals')
            .select('*')
            .eq('user_id', user.id)
            .eq('goal_type', 'subject_mastery');
        
        if (error) {
            console.warn('Could not fetch subject mastery goals:', error);
            return;
        }
        
        // Update each existing goal with current progress
        for (const goal of (existingGoals || [])) {
            const subject = goal.subject;
            if (subject && subjectProgress[subject]) {
                const newProgress = subjectProgress[subject].weightedScore;
                
                await sb
                    .from('user_goals')
                    .update({ 
                        current_value: newProgress,
                        status: newProgress >= goal.target_value ? 'completed' : 'active'
                    })
                    .eq('id', goal.id);
            }
        }
        
    } catch (err) {
        console.error('Error updating subject mastery goals:', err);
    }
}

/**
 * Initialize subject progress tracking
 */
async function initSubjectProgress() {
    console.log('🚀 SubjectProgress: Initializing...');
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(updateSubjectMasteryGoals, 2000);
        });
    } else {
        setTimeout(updateSubjectMasteryGoals, 2000);
    }
    
    // Update on visibility change (when user returns to dashboard)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateSubjectMasteryGoals();
        }
    });
    
    // Update periodically
    setInterval(updateSubjectMasteryGoals, 60000); // Every minute
}

// Export functions
window.SubjectProgress = {
    init: initSubjectProgress,
    update: updateSubjectMasteryGoals,
    calculate: calculateSubjectProgress,
    fetch: fetchTopicProgress,
    Config: SubjectConfig,
    Topics: SubjectTopics
};

// Auto-initialize
initSubjectProgress();

console.log('✅ SubjectProgress module loaded');
