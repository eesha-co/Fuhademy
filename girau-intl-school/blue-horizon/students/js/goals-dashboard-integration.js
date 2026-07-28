/**
 * ============================================
 * JUANOVA CORTEX - GOALS DASHBOARD INTEGRATION
 * Integrates goals modal and display with your dashboard
 * ============================================
 * 
 * Add this to your dashboard after loading:
 * - goals-manager.js
 * - goals-modal.js
 * 
 * Usage: Add <script src="./js/goals-dashboard-integration.js"></script>
 *        after your other scripts
 */

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        // Where to insert the goals section on the dashboard
        // Options: 'after-hero', 'before-subjects', 'after-subjects', 'custom'
        insertPosition: 'after-hero',
        
        // Auto-check for goals on page load
        autoCheckOnLoad: true,
        
        // Delay before showing modal (ms) - for better UX
        modalDelay: 1500,
        
        // Show welcome message for first-time users
        showWelcomeMessage: true
    };
    
    // ============================================
    // STATE
    // ============================================
    let goalsIntegrationState = {
        initialized: false,
        hasCheckedGoals: false,
        userGoals: [],
        isFirstTime: false
    };
    
    // ============================================
    // CREATE GOALS SECTION HTML
    // ============================================
    function createGoalsSectionHTML() {
        return `
            <!-- Goals Section -->
            <section id="goalsDashboardSection" class="space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-slate-800">
                        <span class="mr-2">🎯</span>Your Learning Goals
                    </h3>
                    <button id="editGoalsBtn" class="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Edit Goals
                    </button>
                </div>
                
                <!-- Goals Cards Container -->
                <div id="goalsCardsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Loading skeletons -->
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm animate-pulse">
                        <div class="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                        <div class="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div class="h-2 bg-slate-200 rounded w-full"></div>
                    </div>
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm animate-pulse">
                        <div class="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                        <div class="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div class="h-2 bg-slate-200 rounded w-full"></div>
                    </div>
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm animate-pulse">
                        <div class="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                        <div class="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div class="h-2 bg-slate-200 rounded w-full"></div>
                    </div>
                    <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm animate-pulse">
                        <div class="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                        <div class="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div class="h-2 bg-slate-200 rounded w-full"></div>
                    </div>
                </div>
                
                <!-- Empty State (hidden by default) -->
                <div id="emptyGoalsState" class="hidden bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 text-center border border-sky-100">
                    <div class="text-5xl mb-4">🎯</div>
                    <h4 class="text-lg font-bold text-slate-800 mb-2">Set Your Learning Goals</h4>
                    <p class="text-slate-600 mb-4 max-w-md mx-auto">
                        Define your targets and we'll help you track your progress. 
                        Stay motivated with personalized goal tracking!
                    </p>
                    <button id="createGoalsFromEmptyBtn" class="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                        Create Learning Plan
                    </button>
                </div>
            </section>
        `;
    }
    
    // ============================================
    // INSERT GOALS SECTION INTO DASHBOARD
    // ============================================
    function insertGoalsSection() {
        // Check if section already exists
        if (document.getElementById('goalsDashboardSection')) {
            console.log('Goals section already exists');
            return;
        }
        
        const mainContent = document.querySelector('main') || document.querySelector('#main-content');
        if (!mainContent) {
            console.warn('Main content area not found');
            return;
        }
        
        // Find insertion point based on config
        let insertTarget = null;
        let insertMethod = 'afterend';
        
        switch (CONFIG.insertPosition) {
            case 'after-hero':
                // Find hero section and insert after
                const heroSection = mainContent.querySelector('section') || mainContent.querySelector('.bg-gradient-to-r');
                if (heroSection) {
                    insertTarget = heroSection;
                }
                break;
                
            case 'before-subjects':
                // Find subjects section and insert before
                const subjectsHeading = Array.from(mainContent.querySelectorAll('h3'))
                    .find(h => h.textContent.toLowerCase().includes('subject'));
                if (subjectsHeading) {
                    insertTarget = subjectsHeading.closest('section') || subjectsHeading.parentElement;
                    insertMethod = 'beforebegin';
                }
                break;
                
            case 'after-subjects':
                // Find subjects section and insert after
                const subjectsSection = Array.from(mainContent.querySelectorAll('h3'))
                    .find(h => h.textContent.toLowerCase().includes('subject'));
                if (subjectsSection) {
                    insertTarget = subjectsSection.closest('section') || subjectsSection.parentElement;
                }
                break;
                
            default:
                // Default to after first section
                insertTarget = mainContent.querySelector('section');
        }
        
        if (!insertTarget) {
            // Fallback: prepend to main content
            mainContent.insertAdjacentHTML('afterbegin', createGoalsSectionHTML());
        } else {
            insertTarget.insertAdjacentHTML(insertMethod, createGoalsSectionHTML());
        }
        
        console.log('✅ Goals section inserted');
    }
    
    // ============================================
    // RENDER GOALS
    // ============================================
    function renderGoals(goals) {
        const container = document.getElementById('goalsCardsContainer');
        const emptyState = document.getElementById('emptyGoalsState');
        
        if (!container) return;
        
        if (!goals || goals.length === 0) {
            container.classList.add('hidden');
            emptyState?.classList.remove('hidden');
            return;
        }
        
        container.classList.remove('hidden');
        emptyState?.classList.add('hidden');
        
        // Render goal cards
        container.innerHTML = goals.map(goal => {
            const formatted = window.GoalsManager.formatGoal(goal);
            const progress = formatted.progress;
            
            // Progress bar color based on progress
            let progressColorClass = 'bg-emerald-500';
            let bgColorClass = 'bg-emerald-100';
            if (progress < 50) {
                progressColorClass = 'bg-red-500';
                bgColorClass = 'bg-red-100';
            } else if (progress < 75) {
                progressColorClass = 'bg-amber-500';
                bgColorClass = 'bg-amber-100';
            }
            
            return `
                <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-2xl">${formatted.icon}</span>
                        ${formatted.isCompleted ? 
                            '<span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">✓ Complete</span>' : 
                            `<span class="text-xs text-slate-400 font-medium">${progress}%</span>`
                        }
                    </div>
                    <div class="text-xs text-slate-500 mb-1">${formatted.typeLabel}</div>
                    <div class="font-semibold text-slate-800 mb-3 truncate" title="${goal.title}">${goal.title}</div>
                    
                    <!-- Progress Bar -->
                    <div class="h-2 ${bgColorClass} rounded-full overflow-hidden mb-2">
                        <div class="h-full ${progressColorClass} rounded-full transition-all duration-500" 
                             style="width: ${progress}%"></div>
                    </div>
                    
                    <!-- Progress Text -->
                    <div class="flex justify-between text-xs text-slate-500">
                        <span>${goal.current_value} ${goal.unit}</span>
                        <span>${goal.target_value} ${goal.unit}</span>
                    </div>
                    
                    ${formatted.daysRemaining !== null ? `
                        <div class="mt-2 text-xs ${formatted.isOverdue ? 'text-red-500' : 'text-slate-400'}">
                            ${formatted.isOverdue ? '⚠️ Overdue' : `📅 ${formatted.daysRemaining} days left`}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
    
    // ============================================
    // LOAD AND CHECK GOALS
    // ============================================
    async function loadAndCheckGoals() {
        if (!window.GoalsManager) {
            console.warn('GoalsManager not loaded. Make sure goals-manager.js is included.');
            return;
        }
        
        console.log('🔍 Checking for user goals...');
        
        try {
            const result = await window.GoalsManager.checkUserGoals();
            
            goalsIntegrationState.hasCheckedGoals = true;
            goalsIntegrationState.isFirstTime = result.firstTime;
            goalsIntegrationState.userGoals = result.goals || [];
            
            // Insert goals section if not present
            insertGoalsSection();
            
            if (result.error) {
                console.warn('Goals check error:', result.error);
                
                // If table doesn't exist, show empty state
                if (result.error === 'table_not_found') {
                    const container = document.getElementById('goalsCardsContainer');
                    const emptyState = document.getElementById('emptyGoalsState');
                    container?.classList.add('hidden');
                    emptyState?.classList.remove('hidden');
                    
                    // Add a note about running SQL
                    const note = document.createElement('p');
                    note.className = 'text-xs text-amber-600 mt-2';
                    note.textContent = 'Note: Goals table not found. Please run the SQL setup script in Supabase.';
                    emptyState?.appendChild(note);
                }
                return;
            }
            
            // Render existing goals
            renderGoals(result.goals);
            
            // Show modal if first time user
            if (result.firstTime && CONFIG.autoCheckOnLoad && window.GoalsModal) {
                console.log('👋 First time user - showing goals modal');
                
                setTimeout(() => {
                    window.GoalsModal.open();
                }, CONFIG.modalDelay);
            }
            
        } catch (err) {
            console.error('Error loading goals:', err);
        }
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    function attachEventHandlers() {
        // Edit goals button
        document.getElementById('editGoalsBtn')?.addEventListener('click', () => {
            if (window.GoalsModal) {
                window.GoalsModal.open();
            }
        });
        
        // Create goals from empty state
        document.getElementById('createGoalsFromEmptyBtn')?.addEventListener('click', () => {
            if (window.GoalsModal) {
                window.GoalsModal.open();
            }
        });
        
        // Listen for goals created event
        window.addEventListener('goalsCreated', () => {
            console.log('🎉 Goals created, reloading...');
            loadAndCheckGoals();
        });
        
        // Listen for goals modal close
        window.addEventListener('goalsModalClosed', () => {
            loadAndCheckGoals();
        });
    }
    
    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        if (goalsIntegrationState.initialized) return;
        
        console.log('🚀 Initializing Goals Dashboard Integration...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // Small delay to ensure other scripts have initialized
                setTimeout(() => {
                    insertGoalsSection();
                    attachEventHandlers();
                    
                    if (CONFIG.autoCheckOnLoad) {
                        loadAndCheckGoals();
                    }
                    
                    goalsIntegrationState.initialized = true;
                }, 100);
            });
        } else {
            // DOM already loaded
            setTimeout(() => {
                insertGoalsSection();
                attachEventHandlers();
                
                if (CONFIG.autoCheckOnLoad) {
                    loadAndCheckGoals();
                }
                
                goalsIntegrationState.initialized = true;
            }, 100);
        }
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    window.GoalsDashboard = {
        init,
        loadAndCheckGoals,
        renderGoals,
        refresh: loadAndCheckGoals,
        state: goalsIntegrationState,
        config: CONFIG
    };
    
    // Auto-initialize
    init();
    
})();
