/**
 * ============================================
 * JUANOVA CORTEX - LEARNING REPORT
 * ============================================
 */

const CONFIG = {
    supabaseUrl: 'https://kruwfhzfqieuiuhqlutt.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydXdmaHpmcWlldWl1aHFsdXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTk0OTAsImV4cCI6MjA3Nzc3NTQ5MH0.XD3-PDjDtKwCVsBILYgVrHF7Yc9tHkzpvpN2b7ojvB4',
    
    colors: {
        subjects: {
            'Mathematics': '#ef4444',
            'English': '#3b82f6',
            'English Language': '#3b82f6',
            'Physics': '#10b981',
            'Chemistry': '#f59e0b',
            'Biology': '#8b5cf6',
            'Geography': '#06b6d4',
            'History': '#ec4899',
            'Economics': '#84cc16',
            'Computer Science': '#f97316',
            'Literature': '#6366f1',
            'Agricultural Science': '#65a30d'
        }
    }
};

// State
const state = {
    user: null,
    stats: null,
    quizResults: [],
    subjectProgress: [],
    goals: [],
    studySessions: [],
    dateRange: 'all',
    chart: null
};

let supabase = null;

// ============================================
// INITIALIZATION
// ============================================
async function initSupabase() {
    if (supabase) return supabase;
    
    if (window.supabaseClient) {
        supabase = window.supabaseClient;
        return supabase;
    }
    
    try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey, {
            auth: { autoRefreshToken: true, persistSession: true }
        });
        window.supabaseClient = supabase;
        return supabase;
    } catch (err) {
        console.error('Failed to init Supabase:', err);
        return null;
    }
}

async function init() {
    console.log('🚀 Loading Learning Report...');
    
    const sb = await initSupabase();
    if (!sb) {
        showError('Database connection failed');
        return;
    }
    
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) {
        showError('Please log in to view your report');
        return;
    }
    
    state.user = user;
    
    // Load data
    await Promise.all([
        loadStats(),
        loadQuizResults(),
        loadSubjectProgress(),
        loadGoals(),
        loadStudySessions()
    ]);
    
    // Render
    renderStats();
    renderChart();
    renderSubjects();
    renderRecent();
    renderStrengthsWeaknesses();
    renderGoals();
    renderInsights();
    
    hideSkeletons();
    console.log('✅ Report loaded');
}

// ============================================
// DATA LOADING
// ============================================
async function loadStats() {
    try {
        const { data } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', state.user.id)
            .maybeSingle();
        if (data) state.stats = data;
    } catch (e) { console.warn('Stats load error:', e.message); }
}

async function loadQuizResults() {
    try {
        const { data } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', state.user.id)
            .order('created_at', { ascending: false })
            .limit(50);
        if (data) state.quizResults = data;
    } catch (e) { console.warn('Quiz results load error:', e.message); }
}

async function loadSubjectProgress() {
    try {
        const { data } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', state.user.id)
            .order('average_percentage', { ascending: false });
        if (data) state.subjectProgress = data;
    } catch (e) { console.warn('Subject progress load error:', e.message); }
}

async function loadGoals() {
    try {
        const { data } = await supabase
            .from('user_goals')
            .select('*')
            .eq('user_id', state.user.id)
            .eq('status', 'active');
        if (data) state.goals = data;
    } catch (e) { console.warn('Goals load error:', e.message); }
}

async function loadStudySessions() {
    try {
        const { data } = await supabase
            .from('study_sessions')
            .select('*')
            .eq('user_id', state.user.id)
            .order('created_at', { ascending: false })
            .limit(30);
        if (data) state.studySessions = data;
    } catch (e) { console.warn('Study sessions load error:', e.message); }
}

// ============================================
// HELPERS
// ============================================
function filterByDate(data) {
    if (state.dateRange === 'all' || !data) return data || [];
    
    const now = new Date();
    let cutoff;
    
    switch (state.dateRange) {
        case 'week': cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000); break;
        case 'month': cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000); break;
        case 'year': cutoff = new Date(now - 365 * 24 * 60 * 60 * 1000); break;
        default: return data;
    }
    
    return data.filter(item => new Date(item.created_at) >= cutoff);
}

function getSubjectColor(subject) {
    return CONFIG.colors.subjects[subject] || '#0ea5e9';
}

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
}

function showError(msg) {
    document.getElementById('errorBanner').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = msg;
    hideSkeletons();
}

function hideSkeletons() {
    document.querySelectorAll('[id$="Skeleton"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id$="Container"]').forEach(el => el.classList.remove('hidden'));
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderStats() {
    const results = filterByDate(state.quizResults);
    
    // Average score
    let avg = 0;
    if (state.stats?.overall_average) {
        avg = Math.round(state.stats.overall_average);
    } else if (results.length > 0) {
        const sum = results.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0);
        avg = Math.round(sum / results.length);
    }
    
    document.getElementById('avgScore').textContent = avg + '%';
    const circle = document.getElementById('scoreCircle');
    const offset = 377 - (377 * avg / 100);
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = avg >= 70 ? '#22c55e' : avg >= 50 ? '#f59e0b' : '#ef4444';
    
    // Quiz count
    document.getElementById('quizCount').textContent = state.stats?.total_quizzes || results.length || 0;
    const passed = results.filter(r => (r.score / r.total_questions) >= 0.5).length;
    document.getElementById('passedCount').textContent = passed + ' passed';
    document.getElementById('failedCount').textContent = (results.length - passed) + ' failed';
    
    // Study time
    const totalMins = state.stats?.total_study_minutes || 
        state.studySessions.reduce((s, sess) => s + (sess.duration_minutes || 0), 0);
    document.getElementById('studyTime').textContent = Math.round(totalMins / 60);
    
    const weekMins = filterByDate(state.studySessions)
        .reduce((s, sess) => s + (sess.duration_minutes || 0), 0);
    document.getElementById('weeklyTime').textContent = Math.round(weekMins / 60) + 'h';
    
    // Streak
    document.getElementById('streakDays').textContent = state.stats?.current_streak || 0;
    document.getElementById('bestStreak').textContent = (state.stats?.longest_streak || 0) + ' days';
}

function renderChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    if (state.chart) state.chart.destroy();
    
    const results = filterByDate(state.quizResults);
    
    if (results.length === 0) {
        ctx.parentElement.innerHTML = `
            <div class="flex items-center justify-center h-full text-slate-400">
                <div class="text-center">
                    <i class="fas fa-chart-line text-4xl mb-2"></i>
                    <p>No quiz data yet</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Group by date
    const byDate = {};
    results.forEach(r => {
        const date = new Date(r.created_at).toLocaleDateString();
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push((r.score / r.total_questions) * 100);
    });
    
    const labels = Object.keys(byDate).slice(-15);
    const data = labels.map(d => Math.round(byDate[d].reduce((a, b) => a + b, 0) / byDate[d].length));
    
    state.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => new Date(l).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Score %',
                data: data,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderSubjects() {
    const container = document.getElementById('subjectsContainer');
    const progress = state.subjectProgress;
    
    if (progress.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-500">
                <i class="fas fa-book text-4xl mb-3"></i>
                <p>No subject data yet. Complete quizzes to see progress!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = progress.map(s => {
        const avg = Math.round(s.average_percentage || 0);
        const color = getSubjectColor(s.subject);
        return `
            <div class="bg-slate-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-slate-700">${s.subject}</span>
                    <span class="text-sm font-bold" style="color: ${color}">${avg}%</span>
                </div>
                <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" style="width: ${avg}%; background: ${color}"></div>
                </div>
                <div class="flex justify-between mt-2 text-xs text-slate-500">
                    <span>${s.total_quizzes || 0} quizzes</span>
                    <span>Best: ${Math.round(s.best_score || 0)}%</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderRecent() {
    const container = document.getElementById('recentContainer');
    const results = state.quizResults.slice(0, 10);
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-slate-500">
                <i class="fas fa-clipboard-list text-4xl mb-3"></i>
                <p>No quizzes taken yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = results.map(r => {
        const score = Math.round((r.score / r.total_questions) * 100);
        const passed = score >= 50;
        return `
            <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div class="w-10 h-10 rounded-full flex items-center justify-center ${passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}">
                    <i class="fas ${passed ? 'fa-check' : 'fa-times'}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="font-medium text-slate-700 truncate">${r.quiz_name || 'Quiz'}</div>
                    <div class="text-sm text-slate-500">${r.subject || 'Multiple'}</div>
                </div>
                <div class="text-right">
                    <div class="font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}">${score}%</div>
                    <div class="text-xs text-slate-400">${timeAgo(r.created_at)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderStrengthsWeaknesses() {
    const sorted = [...state.subjectProgress].sort((a, b) => 
        (b.average_percentage || 0) - (a.average_percentage || 0)
    );
    
    // Strengths
    const strengthsContainer = document.getElementById('strengthsContainer');
    const strengths = sorted.filter(s => (s.average_percentage || 0) >= 70).slice(0, 3);
    
    if (strengths.length === 0) {
        strengthsContainer.innerHTML = `<p class="text-sm text-slate-500 text-center py-4">Keep practicing to build strengths!</p>`;
    } else {
        strengthsContainer.innerHTML = strengths.map(s => `
            <div class="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <span class="text-xl">💪</span>
                <div class="flex-1">
                    <div class="font-medium text-slate-700">${s.subject}</div>
                    <div class="text-sm text-emerald-600">${Math.round(s.average_percentage)}% avg</div>
                </div>
            </div>
        `).join('');
    }
    
    // Weaknesses
    const weaknessesContainer = document.getElementById('weaknessesContainer');
    const weaknesses = sorted.filter(s => (s.average_percentage || 0) < 60).slice(0, 3);
    
    if (weaknesses.length === 0) {
        weaknessesContainer.innerHTML = `<p class="text-sm text-slate-500 text-center py-4">🎉 No major weak areas!</p>`;
    } else {
        weaknessesContainer.innerHTML = weaknesses.map(w => `
            <div class="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <span class="text-xl">⚠️</span>
                <div class="flex-1">
                    <div class="font-medium text-slate-700">${w.subject}</div>
                    <div class="text-sm text-red-600">${Math.round(w.average_percentage)}% avg</div>
                </div>
                <a href="../cbt/cbt.html" class="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">Practice</a>
            </div>
        `).join('');
    }
}

function renderGoals() {
    const container = document.getElementById('goalsContainer');
    const goals = state.goals;
    
    if (goals.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <p class="text-slate-500 mb-2">No active goals</p>
                <a href="../student-dashboard.html" class="text-sky-600 text-sm hover:underline">Set goals →</a>
            </div>
        `;
        return;
    }
    
    const icons = {
        score_target: '📊', study_hours: '⏰', quiz_count: '📝', 
        streak_days: '🔥', subject_mastery: '🏆'
    };
    
    container.innerHTML = goals.map(g => {
        const progress = Math.min(Math.round((g.current_value / g.target_value) * 100), 100);
        const color = progress >= 75 ? 'bg-emerald-500' : progress >= 50 ? 'bg-amber-500' : 'bg-red-500';
        return `
            <div class="bg-slate-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <span>${icons[g.goal_type] || '🎯'}</span>
                        <span class="font-medium text-slate-700">${g.title}</span>
                    </div>
                    <span class="text-sm font-semibold">${progress}%</span>
                </div>
                <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full ${color} rounded-full" style="width: ${progress}%"></div>
                </div>
                <div class="flex justify-between text-xs text-slate-500 mt-2">
                    <span>${g.current_value || 0} ${g.unit}</span>
                    <span>Target: ${g.target_value} ${g.unit}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderInsights() {
    const container = document.getElementById('insightsContainer');
    const insights = [];
    
    // Trend insight
    if (state.quizResults.length >= 2) {
        const recent = state.quizResults.slice(0, 5);
        const older = state.quizResults.slice(5, 10);
        if (older.length > 0) {
            const recentAvg = recent.reduce((s, r) => s + r.score / r.total_questions, 0) / recent.length;
            const olderAvg = older.reduce((s, r) => s + r.score / r.total_questions, 0) / older.length;
            const change = ((recentAvg - olderAvg) / olderAvg) * 100;
            
            if (change > 5) {
                insights.push({ icon: '📈', text: `Scores up ${Math.round(change)}%! Keep it up!`, type: 'success' });
            } else if (change < -5) {
                insights.push({ icon: '📉', text: `Scores dropped ${Math.round(Math.abs(change))}%. Review study approach.`, type: 'warning' });
            }
        }
    }
    
    // Streak insight
    if (state.stats?.current_streak >= 7) {
        insights.push({ icon: '🔥', text: `${state.stats.current_streak}-day streak! Amazing consistency!`, type: 'success' });
    }
    
    // Weak subject
    const weak = state.subjectProgress.find(s => (s.average_percentage || 0) < 50);
    if (weak) {
        insights.push({ icon: '💡', text: `Focus on ${weak.subject} to improve overall.`, type: 'info' });
    }
    
    if (insights.length === 0) {
        insights.push({ icon: '🎯', text: 'Complete more quizzes for personalized insights!', type: 'info' });
    }
    
    const colors = { success: 'bg-emerald-50 border-emerald-200', warning: 'bg-amber-50 border-amber-200', info: 'bg-sky-50 border-sky-200' };
    
    container.innerHTML = insights.map(i => `
        <div class="flex items-start gap-3 p-4 rounded-lg border ${colors[i.type]}">
            <span class="text-xl">${i.icon}</span>
            <p class="text-slate-700 text-sm">${i.text}</p>
        </div>
    `).join('');
}

// ============================================
// DATE RANGE
// ============================================
function setDateRange(range) {
    state.dateRange = range;
    
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.range === range);
    });
    
    renderStats();
    renderChart();
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', () => setDateRange(btn.dataset.range));
    });
});

// Expose
window.LearningReport = {
    refresh: init,
    setDateRange
};

console.log('✅ Learning Report loaded');
