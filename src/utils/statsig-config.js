/**
 * Statsig SDK Configuration
 *
 * Environment-based configuration module for Statsig integration.
 * Provides client keys, environment detection, and configuration validation.
 */

/**
 * Environment types supported by the configuration
 * @enum {string}
 */
const ENVIRONMENTS = Object.freeze({
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
});

/**
 * Get the current environment from environment variables
 * @returns {string} Current environment (development or production)
 */
const getCurrentEnvironment = () => {
  const env = import.meta.env.VITE_STATSIG_ENVIRONMENT;

  if (!env) {
    console.warn(
      '[Statsig Config] VITE_STATSIG_ENVIRONMENT not set, defaulting to development'
    );
    return ENVIRONMENTS.DEVELOPMENT;
  }

  const normalizedEnv = env.toLowerCase().trim();

  if (
    normalizedEnv !== ENVIRONMENTS.DEVELOPMENT &&
    normalizedEnv !== ENVIRONMENTS.PRODUCTION
  ) {
    console.warn(
      `[Statsig Config] Invalid environment "${env}", defaulting to development`
    );
    return ENVIRONMENTS.DEVELOPMENT;
  }

  return normalizedEnv;
};

/**
 * Get the client key for the current environment
 * @param {string} environment - Current environment
 * @returns {string|null} Statsig client key or null if not configured
 */
const getClientKey = environment => {
  const clientKey =
    environment === ENVIRONMENTS.PRODUCTION
      ? import.meta.env.VITE_STATSIG_CLIENT_KEY_PROD
      : import.meta.env.VITE_STATSIG_CLIENT_KEY_DEV;

  if (!clientKey) {
    const envVarName =
      environment === ENVIRONMENTS.PRODUCTION
        ? 'VITE_STATSIG_CLIENT_KEY_PROD'
        : 'VITE_STATSIG_CLIENT_KEY_DEV';

    console.error(
      `[Statsig Config] Missing required environment variable: ${envVarName}`
    );
    return null;
  }

  if (!clientKey.startsWith('client-')) {
    console.error(
      `[Statsig Config] Invalid client key format for ${environment} environment. Expected format: client-*`
    );
    return null;
  }

  return clientKey;
};

/**
 * Check if Statsig integration is enabled
 * @returns {boolean} True if Statsig is enabled, false otherwise
 */
const isStatsigEnabled = () => {
  const enabledValue = import.meta.env.VITE_ENABLE_STATSIG;

  if (enabledValue === undefined || enabledValue === null) {
    return true;
  }

  if (typeof enabledValue === 'boolean') {
    return enabledValue;
  }

  const normalizedValue = String(enabledValue).toLowerCase().trim();

  return normalizedValue === 'true' || normalizedValue === '1';
};

/**
 * Validate the Statsig configuration
 * @param {Object} config - Configuration object to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result
 */
const validateConfig = config => {
  const errors = [];

  if (!config) {
    errors.push('Configuration object is missing');
    return { isValid: false, errors };
  }

  if (!config.enabled) {
    return { isValid: true, errors: [] };
  }

  if (!config.clientKey) {
    errors.push('Client key is required when Statsig is enabled');
  }

  if (!config.environment) {
    errors.push('Environment is required');
  }

  if (
    config.environment &&
    config.environment !== ENVIRONMENTS.DEVELOPMENT &&
    config.environment !== ENVIRONMENTS.PRODUCTION
  ) {
    errors.push(`Invalid environment: ${config.environment}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Build the Statsig configuration object
 * @returns {Object} Complete Statsig configuration
 */
const buildConfig = () => {
  const environment = getCurrentEnvironment();
  const enabled = isStatsigEnabled();
  const clientKey = enabled ? getClientKey(environment) : null;

  const config = {
    enabled,
    environment,
    clientKey,
    options: {
      environment: {
        tier: environment,
      },
      disableNetworkKeepalive: false,
      initTimeoutMs: 3000,
      disableErrorLogging: false,
      disableAutoMetricsLogging: false,
    },
  };

  const validation = validateConfig(config);

  if (!validation.isValid) {
    console.error('[Statsig Config] Configuration validation failed:', validation.errors);

    if (enabled) {
      console.warn('[Statsig Config] Disabling Statsig due to configuration errors');
      config.enabled = false;
    }
  }

  return config;
};

/**
 * Get the complete Statsig configuration
 * This is the main export that should be used by consumers
 */
export const getStatsigConfig = () => {
  try {
    const config = buildConfig();

    if (config.enabled && !config.clientKey) {
      console.error(
        '[Statsig Config] Statsig is enabled but no valid client key is configured'
      );
      return {
        ...config,
        enabled: false,
      };
    }

    return config;
  } catch (error) {
    console.error('[Statsig Config] Error building configuration:', error);
    return {
      enabled: false,
      environment: ENVIRONMENTS.DEVELOPMENT,
      clientKey: null,
      options: {},
    };
  }
};

/**
 * Export environment constants for use by consumers
 */
export { ENVIRONMENTS };

/**
 * Export validation function for testing
 */
export { validateConfig };

/**
 * Default export - the config getter function
 */
export default getStatsigConfig;
