import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Use centralized firebase config and initialize App + App Check
import { firebaseConfig } from '../js/firebase-config.js';
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// App Check initialization (reCAPTCHA v3)
try {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true
  });
} catch (err) {
  console.warn('App Check disabled or not configured:', err.message);
}

// Helper functions
function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function setBarWidth(id, width) {
  const element = document.getElementById(id);
  if (element) {
    element.style.transition = 'width 0.5s ease-in-out';
    element.style.width = width;
  }
}

function showError(message) {
  const authLoading = document.getElementById('auth-loading');
  if (authLoading) {
    authLoading.innerHTML = `
      <div class="text-center p-8">
        <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Error</h2>
        <p class="text-gray-600 mb-4">${message}</p>
        <button onclick="window.location.reload()" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
          Retry
        </button>
      </div>
    `;
  }
}

function showDashboard() {
  const authLoading = document.getElementById('auth-loading');
  const mainContent = document.querySelector('main');
  
  if (authLoading) authLoading.style.display = 'none';
  if (mainContent) mainContent.style.visibility = 'visible';
}

// Cache functions
function getCachedUserData(userId) {
  const cached = localStorage.getItem(`userData_${userId}`);
  return cached ? JSON.parse(cached) : null;
}

function cacheUserData(userId, userData) {
  localStorage.setItem(`userData_${userId}`, JSON.stringify(userData));
}

// Initialize dashboard
async function initDashboard() {
  const loadingTimeout = setTimeout(() => {
    const authLoading = document.getElementById('auth-loading');
    if (authLoading && authLoading.style.display !== 'none') {
      showError('Loading took too long. Please check your connection.');
    }
  }, 10000);

  onAuthStateChanged(auth, async (user) => {
    try {
      if (!user) {
        window.location.replace('../general/login-.html');
        return;
      }

      console.log('User authenticated:', user.uid);

      // Check for cached data and display it immediately
      const cachedData = getCachedUserData(user.uid);
      if (cachedData) {
        setText('student-name', cachedData.name || 'Student');
        setText('student-level', cachedData.level || 'SS 3/WAEC');
      }

      // Get fresh user profile
      const userDoc = await getDoc(doc(db, 'students', user.uid));
      const userData = userDoc.data();

      if (!userData) {
        showError('User profile not found. Please set up your profile first.');
        return;
      }

      // Cache the fresh data
      cacheUserData(user.uid, userData);

      // Update user info if different from cache
      setText('student-name', userData.name || 'Student');
      setText('student-level', userData.level || 'SS 3/WAEC');
      
      const userAvatar = document.getElementById('user-avatar');
      if (userAvatar) {
        userAvatar.src = userData.avatarUrl || 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'Student')}&background=2563eb&color=fff`;
      }

      // Get activity data
      const activityDoc = await getDoc(doc(db, 'student_activities', user.uid));
      let activityData = activityDoc.data() || {
        weeklyProgress: 0,
        completedTasks: 0,
        totalTasks: 25,
        mockTests: [],
        lastLogin: new Date().toISOString()
      };

      // Update progress indicators
      setText('ai-weekly-progress', `${activityData.weeklyProgress}%`);
      setText('ai-weekly-tasks', `${activityData.completedTasks}/${activityData.totalTasks} Tasks Completed`);
      
      // Animate progress bars
      setBarWidth('ai-weekly-bar', '0%');
      setTimeout(() => {
        setBarWidth('ai-weekly-bar', `${activityData.weeklyProgress}%`);
      }, 100);

      // Update mock test scores
      if (activityData.mockTests?.length > 0) {
        const average = activityData.mockTests.reduce((sum, test) => sum + test.score, 0) / activityData.mockTests.length;
        setText('ai-mock-score', `${Math.round(average)}%`);
        setText('ai-mock-label', 'Average Score Across Subjects');
        
        setBarWidth('ai-mock-bar', '0%');
        setTimeout(() => {
          setBarWidth('ai-mock-bar', `${average}%`);
        }, 100);
      }

      // Update welcome message
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
      setText('ai-welcome-message', `${greeting}! Your personalized learning journey continues.`);

      // Get notifications
      const notificationsSnap = await getDocs(
        query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          where('read', '==', false)
        )
      );
      setText('notification-count', notificationsSnap.size.toString());

      // Finally, show the dashboard
      clearTimeout(loadingTimeout);
      showDashboard();

    } catch (error) {
      console.error('Error loading dashboard:', error);
      showError(error.message || 'Error loading dashboard data');
    }
  });
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);

