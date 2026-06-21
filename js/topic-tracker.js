/**
 * Topic Tracker - Tracks user progress through educational topics
 * Integrates with Supabase for persistent storage
 * 
 * Features:
 * - Tracks sections viewed
 * - Tracks time spent on topic
 * - "Complete" button that activates when all sections viewed
 * - Syncs progress to Supabase
 */

import { getSupabase } from './supabase-client.js';

class TopicTracker {
    constructor(config = {}) {
        this.topicId = config.topicId || this.extractTopicId();
        this.topicTitle = config.topicTitle || document.title.split('|')[0].trim();
        this.subject = config.subject || this.extractSubject();
        this.sections = config.sections || [];
        this.sectionsViewed = new Set();
        this.startTime = Date.now();
        this.totalTimeSpent = 0;
        this.isActive = true;
        this.completionThreshold = config.completionThreshold || 0.8; // 80% of sections must be viewed
        this.onProgressUpdate = config.onProgressUpdate || null;
        this.onComplete = config.onComplete || null;
        this.quizRequired = config.quizRequired !== false;
        this.quizPassed = false;
        
        this.init();
    }

    extractTopicId() {
        // Extract from URL path
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        return filename || 'unknown-topic';
    }

    extractSubject() {
        // Extract subject from URL path
        const path = window.location.pathname;
        const parts = path.split('/');
        const subjectsIndex = parts.indexOf('subjects');
        if (subjectsIndex !== -1 && parts.length > subjectsIndex + 1) {
            return parts[subjectsIndex + 1];
        }
        return 'general';
    }

    async init() {
        // Load existing progress from Supabase
        await this.loadProgress();
        
        // Setup visibility tracking
        this.setupVisibilityTracking();
        
        // Setup section observers
        this.setupSectionObservers();
        
        // Setup activity tracking
        this.setupActivityTracking();
        
        // Setup beforeunload to save progress
        window.addEventListener('beforeunload', () => this.saveProgress());
        
        // Save progress periodically
        setInterval(() => this.saveProgress(), 30000); // Every 30 seconds
        
        console.log('TopicTracker initialized for:', this.topicId);
    }

    async loadProgress() {
        try {
            const supabase = await getSupabase();
            if (!supabase) {
                console.warn('TopicTracker: Supabase not available, using session storage');
                this.loadFromSession();
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.warn('TopicTracker: User not authenticated');
                this.loadFromSession();
                return;
            }

            const { data, error } = await supabase
                .from('topic_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('topic_id', this.topicId)
                .single();

            if (data && !error) {
                this.sectionsViewed = new Set(data.sections_viewed || []);
                this.totalTimeSpent = data.time_spent || 0;
                this.quizPassed = data.quiz_passed || false;
                this.updateUI();
            }
        } catch (err) {
            console.warn('TopicTracker: Could not load progress from Supabase:', err);
            this.loadFromSession();
        }
    }

    loadFromSession() {
        const saved = sessionStorage.getItem(`topic_progress_${this.topicId}`);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.sectionsViewed = new Set(data.sectionsViewed || []);
                this.totalTimeSpent = data.totalTimeSpent || 0;
                this.quizPassed = data.quizPassed || false;
                this.updateUI();
            } catch (e) {
                console.warn('Failed to parse session progress:', e);
            }
        }
    }

    setupVisibilityTracking() {
        // Track if tab is visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                this.recordTime();
            } else {
                this.isActive = true;
                this.startTime = Date.now();
            }
        });
    }

    setupSectionObservers() {
        if (!this.sections.length) {
            // Auto-detect sections if not provided
            this.sections = Array.from(document.querySelectorAll('section[id], [data-section-id]'))
                .map(el => el.id || el.dataset.sectionId);
        }

        if (!this.sections.length) {
            // Create sections based on headings
            const headings = document.querySelectorAll('h2[id], h3[id]');
            this.sections = Array.from(headings).map(h => h.id);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id || entry.target.dataset.sectionId;
                    if (sectionId) {
                        this.markSectionViewed(sectionId);
                    }
                }
            });
        }, { threshold: 0.5 }); // 50% visible

        // Observe all sections
        this.sections.forEach(sectionId => {
            const el = document.getElementById(sectionId) || 
                       document.querySelector(`[data-section-id="${sectionId}"]`);
            if (el) {
                observer.observe(el);
            }
        });
    }

    setupActivityTracking() {
        // Track user activity (scroll, click, keypress)
        let activityTimeout;
        const resetActivity = () => {
            this.isActive = true;
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                this.isActive = false;
            }, 60000); // Consider inactive after 1 minute of no activity
        };

        ['scroll', 'click', 'keypress', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetActivity, { passive: true });
        });
    }

    markSectionViewed(sectionId) {
        if (!this.sectionsViewed.has(sectionId)) {
            this.sectionsViewed.add(sectionId);
            this.updateUI();
            this.saveProgress();
            
            if (this.onProgressUpdate) {
                this.onProgressUpdate(this.getProgress());
            }
        }
    }

    getProgress() {
        if (!this.sections.length) return 100;
        return (this.sectionsViewed.size / this.sections.length) * 100;
    }

    isComplete() {
        return this.getProgress() >= this.completionThreshold * 100;
    }

    canComplete() {
        return this.isComplete() && (!this.quizRequired || this.quizPassed);
    }

    recordTime() {
        if (this.isActive) {
            const elapsed = Date.now() - this.startTime;
            this.totalTimeSpent += elapsed;
            this.startTime = Date.now();
        }
    }

    async saveProgress() {
        this.recordTime();
        
        const progressData = {
            sectionsViewed: Array.from(this.sectionsViewed),
            totalTimeSpent: this.totalTimeSpent,
            quizPassed: this.quizPassed
        };

        // Save to session storage as backup
        sessionStorage.setItem(`topic_progress_${this.topicId}`, JSON.stringify(progressData));

        try {
            const supabase = await getSupabase();
            if (!supabase) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const upsertData = {
                user_id: user.id,
                topic_id: this.topicId,
                topic_title: this.topicTitle,
                subject: this.subject,
                sections_viewed: Array.from(this.sectionsViewed),
                total_sections: this.sections.length,
                progress_percent: Math.round(this.getProgress()),
                time_spent: this.totalTimeSpent,
                quiz_passed: this.quizPassed,
                last_accessed: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('topic_progress')
                .upsert(upsertData, { onConflict: 'user_id,topic_id' });

            if (error) {
                console.warn('TopicTracker: Failed to save progress:', error);
            }
        } catch (err) {
            console.warn('TopicTracker: Save error:', err);
        }
    }

    async markQuizPassed(score) {
        this.quizPassed = true;
        await this.saveProgress();
        this.updateUI();
        
        if (this.onComplete) {
            this.onComplete({ score, completed: true });
        }
    }

    updateUI() {
        // Update progress bar if exists
        const progressBar = document.getElementById('topic-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${this.getProgress()}%`;
        }

        // Update progress text if exists
        const progressText = document.getElementById('topic-progress-text');
        if (progressText) {
            progressText.textContent = `${Math.round(this.getProgress())}% Complete`;
        }

        // Update complete button
        const completeBtn = document.getElementById('topic-complete-btn');
        if (completeBtn) {
            if (this.isComplete()) {
                completeBtn.disabled = false;
                completeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                completeBtn.classList.add('hover:bg-green-600');
                
                if (this.quizPassed) {
                    completeBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Completed!';
                    completeBtn.classList.add('bg-green-500');
                } else if (this.quizRequired) {
                    completeBtn.innerHTML = '<i class="fas fa-clipboard-check mr-2"></i>Take Quiz to Complete';
                    completeBtn.classList.add('bg-amber-500');
                }
            } else {
                completeBtn.disabled = true;
                completeBtn.classList.add('opacity-50', 'cursor-not-allowed');
                completeBtn.innerHTML = `<i class="fas fa-lock mr-2"></i>Complete (${Math.round(this.getProgress())}% viewed)`;
            }
        }

        // Update sections with viewed indicator
        this.sectionsViewed.forEach(sectionId => {
            const heading = document.querySelector(`#${sectionId} h2, #${sectionId} h3, [data-section-id="${sectionId}"] h2, [data-section-id="${sectionId}"] h3`);
            if (heading && !heading.querySelector('.viewed-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'viewed-indicator text-green-500 ml-2';
                indicator.innerHTML = '<i class="fas fa-check-circle"></i>';
                heading.appendChild(indicator);
            }
        });
    }

    getTimeSpentFormatted() {
        const totalSeconds = Math.floor(this.totalTimeSpent / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds}s`;
    }
}

// Export for ES modules
export { TopicTracker };

// Also expose globally for non-module usage
window.TopicTracker = TopicTracker;
