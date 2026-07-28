// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from '../../js/firebase-config.js';
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true
  });
} catch (err) {
  console.warn('App Check not configured:', err.message);
}

// UI helper functions
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

// Animation helper
function animateProgress(id, targetWidth) {
  const element = document.getElementById(id);
  if (!element) return;

  element.style.width = '0%';
  setTimeout(() => {
    element.style.transition = 'width 1s ease-in-out';
    element.style.width = `${targetWidth}%`;
  }, 100);
}

// Data loading functions
async function loadUserData(userId) {
  const userDoc = await getDoc(doc(db, 'students', userId));
  return userDoc.data();
}

async function loadActivityData(userId) {
  const activityDoc = await getDoc(doc(db, 'student_activities', userId));
  return activityDoc.data() || {
    weeklyProgress: 0,
    completedTasks: 0,
    totalTasks: 25,
    mockTests: [],
    lastLogin: new Date().toISOString()
  };
}

async function loadNotifications(userId) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Main dashboard initialization
async function initDashboard(user) {
  try {
    // Load user data
    const userData = await loadUserData(user.uid);
    if (!userData) {
      window.location.replace('../general/profile-setup.html');
      return;
    }

    // Update user info
    setText('student-name', userData.name || 'Student');
    setText('student-level', userData.level || 'SS 3/WAEC');
    
    const avatarUrl = userData.avatarUrl || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'Student')}&background=2563eb&color=fff`;
    const avatarImg = document.getElementById('user-avatar');
    if (avatarImg) avatarImg.src = avatarUrl;

    // Load activity data
    const activityData = await loadActivityData(user.uid);
    
    // Update progress
    setText('ai-weekly-progress', `${activityData.weeklyProgress}%`);
    setText('ai-weekly-tasks', `${activityData.completedTasks}/${activityData.totalTasks} Tasks Completed`);
    animateProgress('ai-weekly-bar', activityData.weeklyProgress);

    // Update mock test scores
    if (activityData.mockTests?.length > 0) {
      const average = activityData.mockTests.reduce((sum, test) => sum + test.score, 0) / activityData.mockTests.length;
      setText('ai-mock-score', `${Math.round(average)}%`);
      setText('ai-mock-label', 'Average Score Across Subjects');
      animateProgress('ai-mock-bar', average);
    }

    // Update welcome message
    const greeting = getGreeting();
    setText('ai-welcome-message', `${greeting}! Your personalized learning journey continues.`);

    // Update notifications
    const notificationCount = await loadNotifications(user.uid);
    setText('notification-count', notificationCount.toString());

    // Show dashboard
    document.getElementById('auth-loading').style.display = 'none';
    document.querySelector('main').style.visibility = 'visible';

  } catch (error) {
    console.error('Error initializing dashboard:', error);
    document.getElementById('auth-loading').innerHTML = `
      <div class="text-center p-8">
        <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
        <p class="text-gray-600 mb-4">${error.message || 'Please try again'}</p>
        <button onclick="window.location.reload()" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
          Retry
        </button>
      </div>
    `;
  }
}

// Initialize authentication check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace('../general/login.html');
    return;
  }
  
  // Initialize dashboard once authenticated
  initDashboard(user);
});

