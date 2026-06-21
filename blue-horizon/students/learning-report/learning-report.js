/**
 * ============================================
 * JUANOVA CORTEX - LEARNING REPORT
 * Fetches and displays learning analytics
 * ============================================
 * 
 * Dependencies:
 * - Supabase client (loaded before this)
 * - Chart.js (loaded before this)
 */

// ============================================
// CONFIGURATION
// ============================================
const ReportConfig = {
    supabaseUrl: 'https://kruwfhzfqieuiuhqlutt.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',
    
    // Color palette for charts
    colors: {
        primary: '#0ea5e9',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        purple: '#8b5cf6',
        pink: '#ec4899',
        teal: '#14b8a6',
        orange: '#f97316',
        
        // Subject colors
        subjects: {
            'Mathematics': '#ef4444',
            'English': '#3b82f6',
            'Physics': '#10b981',
            'Chemistry': '#f59e0b',
            'Biology': '#8b5cf6',
            'Geography': '#06b6d4',
            'History': '#ec4899',
            'Economics': '#84cc16',
            'Computer Science': '#f97316',
            'Literature': '#6366f1'
        }
    }
};

// ============================================
// STATE
// ============================================
let reportState = {
    user: null,
    stats: null,
    goals: [],
    quizResults: [],
    subjectProgress: [],
    questionResponses: [],
    studySessions: [],
    
    charts: {
        performance: null,
        subjects: null,
        timeDistribution: null,
        progressTrend: null
    },
    
    dateRange: 'all', // 'week', 'month', 'year', 'all'
    loading: true
};

let reportSupabase = null;

// ============================================
// INITIALIZATION
// ============================================
function initReportSupabase() {
    if (reportSupabase) return reportSupabase;
    
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        reportSupabase = window.supabase.createClient(
            ReportConfig.supabaseUrl,
            ReportConfig.supabaseKey
        );
        return reportSupabase;
    }
    
    console.error('Supabase SDK not found');
    return null;
}

async function initLearningReport() {
    console.log('🚀 Initializing Learning Report...');
    
    const sb = initReportSupabase();
    if (!sb) {
        showErrorMessage('Database connection failed. Please refresh the page.');
        return;
    }
    
    // Check authentication
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) {
        showErrorMessage('Please log in to view your learning report.');
        setTimeout(() => {
            window.location.href = '../student-dashboard.html';
        }, 2000);
        return;
    }
    
    reportState.user = user;
    
    // Load all data
    showLoadingState();
    
    try {
        await Promise.all([
            loadUserStats(),
            loadQuizResults(),
            loadSubjectProgress(),
            loadUserGoals(),
            loadStudySessions()
        ]);
        
        // Render everything
        renderOverviewCards();
        renderPerformanceChart();
        renderSubjectBreakdown();
        renderStrengthsWeaknesses();
        renderRecentActivity();
        renderGoalsProgress();
        renderImprovementInsights();
        
        hideLoadingState();
        
    } catch (err) {
        console.error('Error loading report:', err);
        showErrorMessage('Failed to load your learning data. Please try again.');
    }
}

// ============================================
// DATA LOADING
// ============================================
async function loadUserStats() {
    const sb = initReportSupabase();
    if (!sb || !reportState.user) return;
    
    const { data, error } = await sb
        .from('user_stats')
        .select('*')
        .eq('user_id', reportState.user.id)
        .single();
    
    if (!error && data) {
        reportState.stats = data;
    }
}

async function loadQuizResults() {
    const sb = initReportSupabase();
    if (!sb || !reportState.user) return;
    
    const { data, error } = await sb
        .from('quiz_results')
        .select('*')
        .eq('user_id', reportState.user.id)
        .order('created_at', { ascending: false })
        .limit(50);
    
    if (!error && data) {
        reportState.quizResults = data;
    }
}

async function loadSubjectProgress() {
    const sb = initReportSupabase();
    if (!sb || !reportState.user) return;
    
    const { data, error } = await sb
        .from('user_progress')
        .select('*')
        .eq('user_id', reportState.user.id)
        .order('average_percentage', { ascending: false });
    
    if (!error && data) {
        reportState.subjectProgress = data;
    }
}

async function loadUserGoals() {
    const sb = initReportSupabase();
    if (!sb || !reportState.user) return;
    
    const { data, error } = await sb
        .from('user_goals')
        .select('*')
        .eq('user_id', reportState.user.id)
        .order('created_at', { ascending: false });
    
    if (!error && data) {
        reportState.goals = data;
    }
}

async function loadStudySessions() {
    const sb = initReportSupabase();
    if (!sb || !reportState.user) return;
    
    const { data, error } = await sb
        .from('study_sessions')
        .select('*')
        .eq('user_id', reportState.user.id)
        .order('created_at', { ascending: false })
        .limit(30);
    
    if (!error && data) {
        reportState.studySessions = data;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getSubjectColor(subject) {
    return ReportConfig.colors.subjects[subject] || ReportConfig.colors.primary;
}

function formatDuration(minutes) {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function getDaysAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
}

function filterByDateRange(data, dateField = 'created_at') {
    if (reportState.dateRange === 'all') return data;
    
    const now = new Date();
    let cutoff;
    
    switch (reportState.dateRange) {
        case 'week':
            cutoff = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            cutoff = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case 'year':
            cutoff = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            return data;
    }
    
    return data.filter(item => new Date(item[dateField]) >= cutoff);
}

// ============================================
// UI HELPERS
// ============================================
function showLoadingState() {
    document.querySelectorAll('.skeleton-loader').forEach(el => {
        el.style.display = 'block';
    });
    document.querySelectorAll('.data-content').forEach(el => {
        el.style.display = 'none';
    });
}

function hideLoadingState() {
    document.querySelectorAll('.skeleton-loader').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.data-content').forEach(el => {
        el.style.display = 'block';
    });
    reportState.loading = false;
}

function showErrorMessage(message) {
    const container = document.getElementById('errorContainer');
    if (container) {
        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div class="text-4xl mb-3">⚠️</div>
                <p class="text-red-600 font-medium">${message}</p>
            </div>
        `;
        container.classList.remove('hidden');
    }
    hideLoadingState();
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render overview cards (top stats)
 */
function renderOverviewCards() {
    const stats = reportState.stats;
    const quizResults = filterByDateRange(reportState.quizResults);
    
    // Average Score
    let avgScore = 0;
    if (stats?.overall_average) {
        avgScore = Math.round(stats.overall_average);
    } else if (quizResults.length > 0) {
        const total = quizResults.reduce((sum, r) => sum + (r.score / r.total_questions), 0);
        avgScore = Math.round((total / quizResults.length) * 100);
    }
    
    document.getElementById('avgScoreValue').textContent = `${avgScore}%`;
    document.getElementById('avgScoreCircle').style.background = 
        `conic-gradient(${avgScore >= 70 ? '#22c55e' : avgScore >= 50 ? '#f59e0b' : '#ef4444'} ${avgScore}%, #e5e7eb ${avgScore}%)`;
    
    // Quizzes Taken
    document.getElementById('quizzesTaken').textContent = 
        stats?.total_quizzes || quizResults.length || 0;
    
    // Study Hours
    const studyHours = stats?.total_study_minutes 
        ? Math.round(stats.total_study_minutes / 60) 
        : Math.round(reportState.studySessions.reduce((sum, s) => sum + s.duration_minutes, 0) / 60);
    document.getElementById('studyHours').textContent = studyHours;
    
    // Streak
    document.getElementById('streakDays').textContent = stats?.current_streak || 0;
}

/**
 * Render performance trend chart
 */
function renderPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (reportState.charts.performance) {
        reportState.charts.performance.destroy();
    }
    
    const quizResults = filterByDateRange(reportState.quizResults);
    
    // Group by date
    const byDate = {};
    quizResults.forEach(result => {
        const date = new Date(result.created_at).toLocaleDateString();
        if (!byDate[date]) {
            byDate[date] = { scores: [], dates: [] };
        }
        byDate[date].scores.push((result.score / result.total_questions) * 100);
    });
    
    const labels = Object.keys(byDate).slice(-10);
    const data = labels.map(date => {
        const scores = byDate[date].scores;
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    });
    
    reportState.charts.performance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => {
                const d = new Date(l);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'Score %',
                data: data,
                borderColor: ReportConfig.colors.primary,
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: ReportConfig.colors.primary,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Score: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Render subject breakdown
 */
function renderSubjectBreakdown() {
    const container = document.getElementById('subjectBreakdown');
    if (!container) return;
    
    const progress = reportState.subjectProgress;
    
    if (progress.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-500">
                <div class="text-4xl mb-3">📚</div>
                <p>No subject data yet. Complete some quizzes to see your progress!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = progress.map(subject => {
        const avg = Math.round(subject.average_percentage || 0);
        const color = getSubjectColor(subject.subject);
        
        return `
            <div class="bg-slate-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-slate-700">${subject.subject}</span>
                    <span class="text-sm font-semibold" style="color: ${color}">${avg}%</span>
                </div>
                <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" 
                         style="width: ${avg}%; background-color: ${color}"></div>
                </div>
                <div class="flex justify-between mt-2 text-xs text-slate-500">
                    <span>${subject.total_quizzes || 0} quizzes</span>
                    <span>Best: ${Math.round(subject.best_score || 0)}%</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render strengths and weaknesses
 */
function renderStrengthsWeaknesses() {
    const progress = reportState.subjectProgress;
    
    // Sort by average
    const sorted = [...progress].sort((a, b) => 
        (b.average_percentage || 0) - (a.average_percentage || 0)
    );
    
    // Strengths (top performers)
    const strengthsContainer = document.getElementById('strengthsList');
    if (strengthsContainer) {
        const strengths = sorted.filter(s => (s.average_percentage || 0) >= 70).slice(0, 3);
        
        if (strengths.length === 0) {
            strengthsContainer.innerHTML = `
                <p class="text-sm text-slate-500 text-center py-4">
                    Keep practicing to build your strengths!
                </p>
            `;
        } else {
            strengthsContainer.innerHTML = strengths.map(s => `
                <div class="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <span class="text-2xl">💪</span>
                    <div class="flex-1">
                        <div class="font-medium text-slate-700">${s.subject}</div>
                        <div class="text-sm text-emerald-600">${Math.round(s.average_percentage)}% average</div>
                    </div>
                    <span class="text-emerald-500 text-xl font-bold">${Math.round(s.best_score)}%</span>
                </div>
            `).join('');
        }
    }
    
    // Weaknesses (need improvement)
    const weaknessesContainer = document.getElementById('weaknessesList');
    if (weaknessesContainer) {
        const weaknesses = sorted.filter(s => (s.average_percentage || 0) < 60).slice(0, 3);
        
        if (weaknesses.length === 0) {
            weaknessesContainer.innerHTML = `
                <p class="text-sm text-slate-500 text-center py-4">
                    🎉 Great job! No major weak areas detected.
                </p>
            `;
        } else {
            weaknessesContainer.innerHTML = weaknesses.map(w => `
                <div class="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span class="text-2xl">⚠️</span>
                    <div class="flex-1">
                        <div class="font-medium text-slate-700">${w.subject}</div>
                        <div class="text-sm text-red-600">${Math.round(w.average_percentage)}% average</div>
                    </div>
                    <button onclick="startPractice('${w.subject}')" 
                            class="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors">
                        Practice
                    </button>
                </div>
            `).join('');
        }
    }
}

/**
 * Render recent activity
 */
function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    const quizResults = reportState.quizResults.slice(0, 10);
    
    if (quizResults.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-500">
                <div class="text-4xl mb-3">📝</div>
                <p>No quiz activity yet. Take a quiz to see your history!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = quizResults.map(result => {
        const score = Math.round((result.score / result.total_questions) * 100);
        const passed = score >= 50;
        
        return `
            <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}">
                    ${passed ? '✓' : '✗'}
                </div>
                <div class="flex-1">
                    <div class="font-medium text-slate-700">${result.quiz_name || 'Quiz'}</div>
                    <div class="text-sm text-slate-500">${result.subject}</div>
                </div>
                <div class="text-right">
                    <div class="font-semibold ${passed ? 'text-emerald-600' : 'text-red-600'}">${score}%</div>
                    <div class="text-xs text-slate-400">${getDaysAgo(result.created_at)}</div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render goals progress
 */
function renderGoalsProgress() {
    const container = document.getElementById('goalsProgress');
    if (!container) return;
    
    const goals = reportState.goals.filter(g => g.status === 'active');
    
    if (goals.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-3">🎯</div>
                <p class="text-slate-500 mb-4">No active goals set.</p>
                <a href="../student-dashboard.html" class="text-sky-600 hover:underline font-medium">
                    Set your learning goals →
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = goals.map(goal => {
        const progress = Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100);
        let progressColor = 'bg-emerald-500';
        if (progress < 50) progressColor = 'bg-red-500';
        else if (progress < 75) progressColor = 'bg-amber-500';
        
        const goalType = {
            score_target: { icon: '📊', label: 'Target Score' },
            study_hours: { icon: '⏰', label: 'Study Hours' },
            quiz_count: { icon: '📝', label: 'Quiz Count' },
            streak_days: { icon: '🔥', label: 'Streak' },
            subject_mastery: { icon: '🏆', label: 'Mastery' }
        }[goal.goal_type] || { icon: '🎯', label: goal.goal_type };
        
        return `
            <div class="bg-slate-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">${goalType.icon}</span>
                        <span class="font-medium text-slate-700">${goal.title}</span>
                    </div>
                    <span class="text-sm font-semibold text-slate-600">${progress}%</span>
                </div>
                <div class="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div class="h-full ${progressColor} rounded-full transition-all duration-500" 
                         style="width: ${progress}%"></div>
                </div>
                <div class="flex justify-between text-xs text-slate-500">
                    <span>${goal.current_value} ${goal.unit}</span>
                    <span>Target: ${goal.target_value} ${goal.unit}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render improvement insights
 */
function renderImprovementInsights() {
    const container = document.getElementById('improvementInsights');
    if (!container) return;
    
    const insights = [];
    const quizResults = reportState.quizResults;
    
    // Calculate improvement trend
    if (quizResults.length >= 2) {
        const recent = quizResults.slice(0, Math.min(5, quizResults.length));
        const older = quizResults.slice(Math.min(5, quizResults.length), Math.min(10, quizResults.length));
        
        if (older.length > 0) {
            const recentAvg = recent.reduce((sum, r) => sum + (r.score / r.total_questions), 0) / recent.length;
            const olderAvg = older.reduce((sum, r) => sum + (r.score / r.total_questions), 0) / older.length;
            const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;
            
            if (improvement > 5) {
                insights.push({
                    type: 'success',
                    icon: '📈',
                    text: `Your scores improved by ${Math.round(improvement)}% recently! Keep it up!`
                });
            } else if (improvement < -5) {
                insights.push({
                    type: 'warning',
                    icon: '📉',
                    text: `Your scores have dropped ${Math.round(Math.abs(improvement))}%. Consider reviewing your study approach.`
                });
            }
        }
    }
    
    // Study consistency
    const stats = reportState.stats;
    if (stats?.current_streak >= 7) {
        insights.push({
            type: 'success',
            icon: '🔥',
            text: `Amazing! You're on a ${stats.current_streak}-day study streak!`
        });
    }
    
    // Subject-specific insights
    const weakSubjects = reportState.subjectProgress.filter(s => (s.average_percentage || 0) < 50);
    if (weakSubjects.length > 0) {
        insights.push({
            type: 'info',
            icon: '💡',
            text: `Focus on ${weakSubjects[0].subject} - extra practice could boost your overall average.`
        });
    }
    
    // Default message if no insights
    if (insights.length === 0) {
        insights.push({
            type: 'info',
            icon: '🎯',
            text: 'Complete more quizzes to unlock personalized insights!'
        });
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="flex items-start gap-3 p-4 rounded-lg ${
            insight.type === 'success' ? 'bg-emerald-50 border border-emerald-200' :
            insight.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
            'bg-sky-50 border border-sky-200'
        }">
            <span class="text-2xl">${insight.icon}</span>
            <p class="text-slate-700">${insight.text}</p>
        </div>
    `).join('');
}

/**
 * Start practice for a specific subject
 */
function startPractice(subject) {
    window.location.href = `../cbt/cbt.html?subject=${encodeURIComponent(subject)}`;
}

/**
 * Change date range filter
 */
function changeDateRange(range) {
    reportState.dateRange = range;
    
    // Update button states
    document.querySelectorAll('.date-range-btn').forEach(btn => {
        btn.classList.remove('bg-sky-600', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-600');
    });
    document.querySelector(`.date-range-btn[data-range="${range}"]`)?.classList.remove('bg-slate-100', 'text-slate-600');
    document.querySelector(`.date-range-btn[data-range="${range}"]`)?.classList.add('bg-sky-600', 'text-white');
    
    // Re-render charts
    renderOverviewCards();
    renderPerformanceChart();
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', initLearningReport);

// Expose functions globally
window.LearningReport = {
    changeDateRange,
    startPractice,
    refresh: initLearningReport
};

console.log('✅ Learning Report JS loaded');
