// Centralized user data caching module
const USER_CACHE_KEY = 'cachedUserData';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds
const GLOBAL_USER_KEY = 'globalUserData'; // For immediate access

// Set global user data for immediate access
export function setGlobalUserData(userData) {
    if (!userData) return;
    window[GLOBAL_USER_KEY] = userData;
}

// Get global user data (fastest possible access)
export function getGlobalUserData() {
    return window[GLOBAL_USER_KEY] || null;
}

export function getCachedUserData(uid) {
    // First check global memory cache (fastest)
    const globalData = getGlobalUserData();
    if (globalData && globalData.uid === uid) {
        return globalData;
    }

    // Then check localStorage
    try {
        const cached = localStorage.getItem(`${USER_CACHE_KEY}_${uid}`);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        
        // Check if cache is expired
        if (Date.now() - timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(`${USER_CACHE_KEY}_${uid}`);
            return null;
        }

        // Update global cache for faster subsequent access
        setGlobalUserData(data);
        return data;
    } catch (e) {
        console.warn('Error reading from cache:', e);
        return null;
    }
}

export function cacheUserData(uid, userData) {
  try {
    const cacheEntry = {
      data: userData,
      timestamp: Date.now()
    };
    localStorage.setItem(`${USER_CACHE_KEY}_${uid}`, JSON.stringify(cacheEntry));
  } catch (e) {
    console.warn('Error writing to cache:', e);
  }
}

export function clearUserCache(uid) {
  try {
    localStorage.removeItem(`${USER_CACHE_KEY}_${uid}`);
  } catch (e) {
    console.warn('Error clearing cache:', e);
  }
}
