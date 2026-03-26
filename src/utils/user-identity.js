/**
 * User Identity Management
 *
 * Privacy-compliant anonymous user identification system using stable session identifiers.
 * Generates and persists anonymous user IDs using crypto.randomUUID() with localStorage primary
 * and sessionStorage fallback. Includes user ID validation and regeneration logic.
 */

/**
 * Storage keys for user identification
 * @enum {string}
 */
const STORAGE_KEYS = Object.freeze({
  USER_ID: 'statsig_user_id',
  USER_ID_CREATED_AT: 'statsig_user_id_created_at',
  SESSION_ID: 'statsig_session_id',
});

/**
 * User ID format: UUID v4
 * Example: 550e8400-e29b-41d4-a716-446655440000
 */
const USER_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Maximum age for user IDs (365 days in milliseconds)
 * After this period, a new ID will be generated
 */
const MAX_USER_ID_AGE = 365 * 24 * 60 * 60 * 1000;

/**
 * Check if crypto.randomUUID is available
 * @returns {boolean} True if crypto.randomUUID is supported
 */
const isCryptoAvailable = () =>
  typeof crypto !== 'undefined' &&
  typeof crypto.randomUUID === 'function';

/**
 * Check if localStorage is available and writable
 * @returns {boolean} True if localStorage is accessible
 */
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if sessionStorage is available and writable
 * @returns {boolean} True if sessionStorage is accessible
 */
const isSessionStorageAvailable = () => {
  try {
    const testKey = '__test_session__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate a new UUID v4 user ID
 * @returns {string} New UUID v4 user ID
 */
const generateUserId = () => {
  if (!isCryptoAvailable()) {
    console.error(
      '[User Identity] crypto.randomUUID is not available. Cannot generate user ID.'
    );
    throw new Error('Crypto API not available for user ID generation');
  }

  try {
    return crypto.randomUUID();
  } catch (error) {
    console.error('[User Identity] Failed to generate user ID:', error);
    throw new Error('Failed to generate user ID');
  }
};

/**
 * Validate a user ID format
 * @param {string} userId - User ID to validate
 * @returns {boolean} True if user ID is valid UUID v4
 */
const validateUserId = userId => {
  if (!userId || typeof userId !== 'string') {
    return false;
  }

  return USER_ID_REGEX.test(userId);
};

/**
 * Get an item from storage with fallback
 * @param {string} key - Storage key
 * @returns {string|null} Stored value or null
 */
const getStorageItem = key => {
  try {
    if (isLocalStorageAvailable()) {
      const value = localStorage.getItem(key);
      if (value) {
        return value;
      }
    }
  } catch (error) {
    console.warn('[User Identity] localStorage read error:', error);
  }

  try {
    if (isSessionStorageAvailable()) {
      return sessionStorage.getItem(key);
    }
  } catch (error) {
    console.warn('[User Identity] sessionStorage read error:', error);
  }

  return null;
};

/**
 * Set an item in storage with fallback
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
const setStorageItem = (key, value) => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
      return;
    }
  } catch (error) {
    console.warn('[User Identity] localStorage write error, trying sessionStorage:', error);
  }

  try {
    if (isSessionStorageAvailable()) {
      sessionStorage.setItem(key, value);
    } else {
      console.error('[User Identity] No storage available for persisting user ID');
    }
  } catch (error) {
    console.error('[User Identity] sessionStorage write error:', error);
  }
};

/**
 * Check if a user ID has expired
 * @param {string|null} createdAtStr - Timestamp when user ID was created
 * @returns {boolean} True if user ID has expired
 */
const isUserIdExpired = createdAtStr => {
  if (!createdAtStr) {
    return true;
  }

  try {
    const createdAt = parseInt(createdAtStr, 10);

    if (isNaN(createdAt)) {
      return true;
    }

    const now = Date.now();
    const age = now - createdAt;

    return age > MAX_USER_ID_AGE;
  } catch {
    return true;
  }
};

/**
 * Get or create a persistent anonymous user ID
 * @returns {{ userId: string, isNewUser: boolean }} User ID and whether it's newly created
 */
const getUserId = () => {
  const existingUserId = getStorageItem(STORAGE_KEYS.USER_ID);
  const createdAt = getStorageItem(STORAGE_KEYS.USER_ID_CREATED_AT);

  if (existingUserId && validateUserId(existingUserId) && !isUserIdExpired(createdAt)) {
    return {
      userId: existingUserId,
      isNewUser: false,
    };
  }

  if (existingUserId && !validateUserId(existingUserId)) {
    console.warn('[User Identity] Invalid user ID found in storage, regenerating');
  }

  if (existingUserId && isUserIdExpired(createdAt)) {
    console.warn('[User Identity] User ID expired, regenerating');
  }

  try {
    const newUserId = generateUserId();
    const now = Date.now().toString();

    setStorageItem(STORAGE_KEYS.USER_ID, newUserId);
    setStorageItem(STORAGE_KEYS.USER_ID_CREATED_AT, now);

    console.warn('[User Identity] Generated new user ID');

    return {
      userId: newUserId,
      isNewUser: true,
    };
  } catch (error) {
    console.error('[User Identity] Failed to create user ID:', error);
    throw error;
  }
};

/**
 * Get or create a session ID (regenerated each page load)
 * @returns {string} Session ID
 */
const getSessionId = () => {
  const existingSessionId = getStorageItem(STORAGE_KEYS.SESSION_ID);

  if (existingSessionId && validateUserId(existingSessionId)) {
    return existingSessionId;
  }

  try {
    const newSessionId = generateUserId();
    setStorageItem(STORAGE_KEYS.SESSION_ID, newSessionId);

    return newSessionId;
  } catch (error) {
    console.error('[User Identity] Failed to create session ID:', error);
    throw error;
  }
};

/**
 * Force regeneration of user ID (for privacy compliance or user request)
 * @returns {string} New user ID
 */
const regenerateUserId = () => {
  console.warn('[User Identity] Forcing user ID regeneration');

  try {
    const newUserId = generateUserId();
    const now = Date.now().toString();

    setStorageItem(STORAGE_KEYS.USER_ID, newUserId);
    setStorageItem(STORAGE_KEYS.USER_ID_CREATED_AT, now);

    return newUserId;
  } catch (error) {
    console.error('[User Identity] Failed to regenerate user ID:', error);
    throw error;
  }
};

/**
 * Get complete user identity object for Statsig
 * @returns {Object} User identity object with userID and custom properties
 */
const getUserIdentity = () => {
  try {
    const { userId, isNewUser } = getUserId();
    const sessionId = getSessionId();

    return {
      userID: userId,
      custom: {
        sessionID: sessionId,
        isNewUser,
        createdAt: getStorageItem(STORAGE_KEYS.USER_ID_CREATED_AT) || Date.now().toString(),
      },
    };
  } catch (error) {
    console.error('[User Identity] Failed to build user identity:', error);

    const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      userID: fallbackId,
      custom: {
        sessionID: fallbackId,
        isNewUser: true,
        createdAt: Date.now().toString(),
        isFallback: true,
      },
    };
  }
};

/**
 * Clear all stored user identity data
 * This is useful for privacy compliance (user data deletion)
 */
const clearUserIdentity = () => {
  console.warn('[User Identity] Clearing all user identity data');

  try {
    if (isLocalStorageAvailable()) {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.warn('[User Identity] Error clearing localStorage:', error);
  }

  try {
    if (isSessionStorageAvailable()) {
      Object.values(STORAGE_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.warn('[User Identity] Error clearing sessionStorage:', error);
  }
};

/**
 * Export main functions
 */
export { getUserIdentity, getUserId, getSessionId, regenerateUserId, clearUserIdentity };

/**
 * Export validation and utility functions for testing
 */
export { validateUserId, isUserIdExpired };

/**
 * Default export - the main getUserIdentity function
 */
export default getUserIdentity;
