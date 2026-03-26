/**
 * Statsig Service Layer
 *
 * Service layer for Statsig SDK initialization and experiment management.
 * Implements lazy loading of the SDK, user identity management, experiment evaluation,
 * and event tracking with comprehensive error handling and performance monitoring.
 */

import { getStatsigConfig } from '../utils/statsig-config.js';
import { getUserIdentity } from '../utils/user-identity.js';

/**
 * Service state
 */
const STATE = {
  initialized: false,
  initializing: false,
  statsigClient: null,
  userIdentity: null,
  initializationError: null,
  initStartTime: null,
  sdkLoadTime: null,
  initCompleteTime: null,
};

/**
 * Error types for categorizing failures
 */
const ErrorTypes = Object.freeze({
  SDK_LOAD_FAILED: 'SDK_LOAD_FAILED',
  INITIALIZATION_FAILED: 'INITIALIZATION_FAILED',
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  INVALID_CONFIG: 'INVALID_CONFIG',
  EXPERIMENT_EVAL_FAILED: 'EXPERIMENT_EVAL_FAILED',
  EVENT_LOG_FAILED: 'EVENT_LOG_FAILED',
});

/**
 * Create a structured error with type and context
 * @param {string} type - Error type
 * @param {string} message - Error message
 * @param {Error} [cause] - Original error
 * @returns {Error} Structured error
 */
const createError = (type, message, cause = null) => {
  const error = new Error(message);
  error.type = type;
  if (cause) {
    error.cause = cause;
  }
  return error;
};

/**
 * Lazy load the Statsig SDK using dynamic import
 * @returns {Promise<Object>} Statsig SDK module
 */
const loadStatsigSDK = async () => {
  const loadStart = performance.now();

  try {
    console.log('[Statsig Service] Loading Statsig SDK...');

    const statsigModule = await import('statsig-js');

    STATE.sdkLoadTime = performance.now() - loadStart;
    console.log(`[Statsig Service] SDK loaded successfully in ${STATE.sdkLoadTime.toFixed(2)}ms`);

    return statsigModule.default || statsigModule;
  } catch (error) {
    STATE.sdkLoadTime = performance.now() - loadStart;
    console.error('[Statsig Service] Failed to load Statsig SDK:', error);
    throw createError(ErrorTypes.SDK_LOAD_FAILED, 'Failed to load Statsig SDK', error);
  }
};

/**
 * Initialize the Statsig service
 * This function should be called after page load to avoid blocking critical rendering
 * @returns {Promise<boolean>} True if initialization succeeded, false otherwise
 */
export const initializeStatsig = async () => {
  if (STATE.initialized) {
    console.warn('[Statsig Service] Already initialized');
    return true;
  }

  if (STATE.initializing) {
    console.warn('[Statsig Service] Initialization already in progress');
    return false;
  }

  STATE.initializing = true;
  STATE.initStartTime = performance.now();

  try {
    const config = getStatsigConfig();

    if (!config.enabled) {
      console.warn('[Statsig Service] Statsig is disabled in configuration');
      STATE.initializing = false;
      return false;
    }

    if (!config.clientKey) {
      const error = createError(
        ErrorTypes.INVALID_CONFIG,
        'Statsig client key is not configured'
      );
      STATE.initializationError = error;
      STATE.initializing = false;
      console.error('[Statsig Service] Configuration error:', error);
      return false;
    }

    console.log(`[Statsig Service] Initializing with environment: ${config.environment}`);

    try {
      STATE.userIdentity = getUserIdentity();
      console.log('[Statsig Service] User identity obtained:', {
        userID: STATE.userIdentity.userID,
        isNewUser: STATE.userIdentity.custom?.isNewUser,
      });
    } catch (error) {
      console.error('[Statsig Service] Failed to get user identity:', error);
      STATE.initializationError = error;
      STATE.initializing = false;
      return false;
    }

    let Statsig;
    try {
      Statsig = await loadStatsigSDK();
    } catch (error) {
      STATE.initializationError = error;
      STATE.initializing = false;
      return false;
    }

    try {
      await Statsig.initialize(config.clientKey, STATE.userIdentity, config.options);

      STATE.statsigClient = Statsig;
      STATE.initialized = true;
      STATE.initializing = false;
      STATE.initCompleteTime = performance.now() - STATE.initStartTime;

      console.log(
        `[Statsig Service] Initialized successfully in ${STATE.initCompleteTime.toFixed(2)}ms`
      );
      console.log('[Statsig Service] Performance metrics:', {
        sdkLoadTime: `${STATE.sdkLoadTime.toFixed(2)}ms`,
        totalInitTime: `${STATE.initCompleteTime.toFixed(2)}ms`,
      });

      return true;
    } catch (error) {
      const wrappedError = createError(
        ErrorTypes.INITIALIZATION_FAILED,
        'Failed to initialize Statsig client',
        error
      );
      STATE.initializationError = wrappedError;
      STATE.initializing = false;
      console.error('[Statsig Service] Initialization failed:', error);
      return false;
    }
  } catch (error) {
    const wrappedError = createError(
      ErrorTypes.INITIALIZATION_FAILED,
      'Unexpected error during initialization',
      error
    );
    STATE.initializationError = wrappedError;
    STATE.initializing = false;
    console.error('[Statsig Service] Unexpected initialization error:', error);
    return false;
  }
};

/**
 * Check if a feature gate is enabled
 * @param {string} gateName - Name of the feature gate
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.defaultValue=false] - Default value if check fails
 * @returns {boolean} True if gate is enabled, false otherwise
 */
export const checkGate = (gateName, options = {}) => {
  const { defaultValue = false } = options;

  if (!STATE.initialized) {
    console.warn(
      `[Statsig Service] Cannot check gate "${gateName}" - service not initialized. Returning default: ${defaultValue}`
    );
    return defaultValue;
  }

  try {
    const isEnabled = STATE.statsigClient.checkGate(gateName);
    console.log(`[Statsig Service] Gate "${gateName}" check result: ${isEnabled}`);
    return isEnabled;
  } catch (error) {
    console.error(`[Statsig Service] Error checking gate "${gateName}":`, error);
    return defaultValue;
  }
};

/**
 * Get an experiment configuration
 * @param {string} experimentName - Name of the experiment
 * @param {Object} [options] - Additional options
 * @param {*} [options.defaultValue=null] - Default value if retrieval fails
 * @returns {Object|null} Experiment configuration or default value
 */
export const getExperiment = (experimentName, options = {}) => {
  const { defaultValue = null } = options;

  if (!STATE.initialized) {
    console.warn(
      `[Statsig Service] Cannot get experiment "${experimentName}" - service not initialized. Returning default.`
    );
    return defaultValue;
  }

  try {
    const experiment = STATE.statsigClient.getExperiment(experimentName);
    console.log(`[Statsig Service] Retrieved experiment "${experimentName}"`);
    return experiment;
  } catch (error) {
    console.error(`[Statsig Service] Error getting experiment "${experimentName}":`, error);
    return defaultValue;
  }
};

/**
 * Get a dynamic config value
 * @param {string} configName - Name of the config
 * @param {Object} [options] - Additional options
 * @param {*} [options.defaultValue=null] - Default value if retrieval fails
 * @returns {Object|null} Config value or default value
 */
export const getConfig = (configName, options = {}) => {
  const { defaultValue = null } = options;

  if (!STATE.initialized) {
    console.warn(
      `[Statsig Service] Cannot get config "${configName}" - service not initialized. Returning default.`
    );
    return defaultValue;
  }

  try {
    const config = STATE.statsigClient.getConfig(configName);
    console.log(`[Statsig Service] Retrieved config "${configName}"`);
    return config;
  } catch (error) {
    console.error(`[Statsig Service] Error getting config "${configName}":`, error);
    return defaultValue;
  }
};

/**
 * Get a parameter value from an experiment
 * @param {string} experimentName - Name of the experiment
 * @param {string} parameterName - Name of the parameter
 * @param {*} defaultValue - Default value if parameter not found
 * @returns {*} Parameter value or default
 */
export const getExperimentParameter = (experimentName, parameterName, defaultValue) => {
  if (!STATE.initialized) {
    console.warn(
      `[Statsig Service] Cannot get parameter "${parameterName}" from experiment "${experimentName}" - service not initialized. Returning default.`
    );
    return defaultValue;
  }

  try {
    const experiment = STATE.statsigClient.getExperiment(experimentName);

    if (!experiment) {
      console.warn(
        `[Statsig Service] Experiment "${experimentName}" not found. Returning default value for "${parameterName}".`
      );
      return defaultValue;
    }

    const value = experiment.get(parameterName, defaultValue);
    console.log(
      `[Statsig Service] Retrieved parameter "${parameterName}" from experiment "${experimentName}":`,
      value
    );
    return value;
  } catch (error) {
    console.error(
      `[Statsig Service] Error getting parameter "${parameterName}" from experiment "${experimentName}":`,
      error
    );
    return defaultValue;
  }
};

/**
 * Log a custom event
 * @param {string} eventName - Name of the event
 * @param {*} [value=null] - Event value (string, number, or null)
 * @param {Object} [metadata=null] - Additional event metadata
 * @returns {boolean} True if event was logged successfully
 */
export const logEvent = (eventName, value = null, metadata = null) => {
  if (!STATE.initialized) {
    console.warn(
      `[Statsig Service] Cannot log event "${eventName}" - service not initialized`
    );
    return false;
  }

  try {
    STATE.statsigClient.logEvent(eventName, value, metadata);
    console.log(`[Statsig Service] Event logged: "${eventName}"`, { value, metadata });
    return true;
  } catch (error) {
    console.error(`[Statsig Service] Error logging event "${eventName}":`, error);
    return false;
  }
};

/**
 * Update user properties
 * @param {Object} properties - User properties to update
 * @returns {boolean} True if update was successful
 */
export const updateUser = properties => {
  if (!STATE.initialized) {
    console.warn('[Statsig Service] Cannot update user - service not initialized');
    return false;
  }

  try {
    const updatedIdentity = {
      ...STATE.userIdentity,
      custom: {
        ...STATE.userIdentity.custom,
        ...properties,
      },
    };

    STATE.statsigClient.updateUser(updatedIdentity);
    STATE.userIdentity = updatedIdentity;

    console.log('[Statsig Service] User properties updated:', properties);
    return true;
  } catch (error) {
    console.error('[Statsig Service] Error updating user:', error);
    return false;
  }
};

/**
 * Get the current initialization status
 * @returns {Object} Status object with initialization state
 */
export const getStatus = () => ({
  initialized: STATE.initialized,
  initializing: STATE.initializing,
  hasError: STATE.initializationError !== null,
  error: STATE.initializationError,
  metrics: {
    sdkLoadTime: STATE.sdkLoadTime,
    totalInitTime: STATE.initCompleteTime,
  },
  userIdentity: STATE.userIdentity
    ? {
        userID: STATE.userIdentity.userID,
        isNewUser: STATE.userIdentity.custom?.isNewUser,
      }
    : null,
});

/**
 * Shutdown the Statsig client and clean up resources
 * @returns {Promise<boolean>} True if shutdown was successful
 */
export const shutdown = async () => {
  if (!STATE.initialized) {
    console.warn('[Statsig Service] Cannot shutdown - not initialized');
    return false;
  }

  try {
    console.log('[Statsig Service] Shutting down...');
    await STATE.statsigClient.shutdown();

    STATE.initialized = false;
    STATE.statsigClient = null;

    console.log('[Statsig Service] Shutdown complete');
    return true;
  } catch (error) {
    console.error('[Statsig Service] Error during shutdown:', error);
    return false;
  }
};

/**
 * Export service interface
 */
export default {
  initializeStatsig,
  checkGate,
  getExperiment,
  getConfig,
  getExperimentParameter,
  logEvent,
  updateUser,
  getStatus,
  shutdown,
};
