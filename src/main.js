import './style.css';

/**
 * Application entry point
 * Initializes the landing page application with error handling and logging
 */

// Application state
const APP_STATE = {
  initialized: false,
  startTime: performance.now(),
  errors: [],
};

/**
 * Structured logger for application events
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {Object} context - Additional context data
 */
const log = (level, message, context = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    context: {
      ...context,
      uptime: performance.now() - APP_STATE.startTime,
    },
  };

  if (level === 'error') {
    APP_STATE.errors.push(logEntry);
    console.error(`[${timestamp}] ERROR:`, message, context);
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] WARN:`, message, context);
  } else {
    console.info(`[${timestamp}] INFO:`, message, context);
  }
};

/**
 * Error handler for uncaught errors
 * @param {ErrorEvent} event - Error event
 */
const handleGlobalError = event => {
  log('error', 'Uncaught error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack,
  });

  event.preventDefault();
};

/**
 * Error handler for unhandled promise rejections
 * @param {PromiseRejectionEvent} event - Promise rejection event
 */
const handleUnhandledRejection = event => {
  log('error', 'Unhandled promise rejection', {
    reason: event.reason,
    promise: event.promise,
  });

  event.preventDefault();
};

/**
 * Initialize global error handlers
 */
const initializeErrorHandlers = () => {
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  log('info', 'Global error handlers initialized');
};

/**
 * Validate browser environment and capabilities
 * @returns {Object} Validation result with status and missing features
 */
const validateEnvironment = () => {
  const requiredFeatures = {
    localStorage: typeof Storage !== 'undefined',
    fetch: typeof fetch === 'function',
    promise: typeof Promise !== 'undefined',
    es6: (() => {
      try {
        // eslint-disable-next-line no-new-func
        new Function('(a = 0) => a');
        return true;
      } catch {
        return false;
      }
    })(),
  };

  const missingFeatures = Object.entries(requiredFeatures)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  const isValid = missingFeatures.length === 0;

  if (!isValid) {
    log('error', 'Browser environment validation failed', {
      missingFeatures,
    });
  } else {
    log('info', 'Browser environment validated successfully');
  }

  return {
    isValid,
    missingFeatures,
  };
};

/**
 * Initialize application DOM elements and event listeners
 */
const initializeDOM = () => {
  const app = document.querySelector('#app');

  if (!app) {
    throw new Error('Application root element #app not found');
  }

  log('info', 'DOM initialized', {
    appElement: app.tagName,
  });
};

/**
 * Performance monitoring
 */
const initializePerformanceMonitoring = () => {
  if (typeof PerformanceObserver === 'undefined') {
    log('warn', 'PerformanceObserver not supported');
    return;
  }

  try {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          log('info', 'Navigation timing', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            domInteractive: entry.domInteractive - entry.fetchStart,
          });
        }

        if (entry.entryType === 'paint') {
          log('info', 'Paint timing', {
            name: entry.name,
            startTime: entry.startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint'] });

    log('info', 'Performance monitoring initialized');
  } catch (error) {
    log('error', 'Failed to initialize performance monitoring', {
      error: error.message,
    });
  }
};

/**
 * Initialize application
 * Main initialization function that orchestrates all setup steps
 */
const initializeApp = () => {
  try {
    log('info', 'Application initialization started');

    const validation = validateEnvironment();
    if (!validation.isValid) {
      throw new Error(
        `Browser environment validation failed. Missing features: ${validation.missingFeatures.join(', ')}`
      );
    }

    initializeErrorHandlers();

    initializeDOM();

    initializePerformanceMonitoring();

    APP_STATE.initialized = true;

    log('info', 'Application initialized successfully', {
      initTime: performance.now() - APP_STATE.startTime,
    });
  } catch (error) {
    log('error', 'Application initialization failed', {
      error: error.message,
      stack: error.stack,
    });

    const app = document.querySelector('#app');
    if (app) {
      app.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #dc2626;">
          <h1>Application Error</h1>
          <p>Failed to initialize application. Please refresh the page or contact support.</p>
          <details style="margin-top: 1rem; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
            <summary style="cursor: pointer;">Error Details</summary>
            <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow: auto;">${error.message}\n\n${error.stack}</pre>
          </details>
        </div>
      `;
    }

    throw error;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

export { APP_STATE, log };