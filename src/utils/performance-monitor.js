/**
 * Performance Monitoring Utility
 *
 * Tracks Core Web Vitals and SDK impact using Performance Observer API.
 * Monitors LCP, CLS, FCP, FID, TTFB, and SDK initialization timing.
 * Provides bundle size impact tracking and performance budgets.
 */

/**
 * Performance metric names
 */
const MetricNames = Object.freeze({
  LCP: 'largest-contentful-paint',
  FID: 'first-input-delay',
  CLS: 'cumulative-layout-shift',
  FCP: 'first-contentful-paint',
  TTFB: 'time-to-first-byte',
  SDK_LOAD: 'sdk-load-time',
  SDK_INIT: 'sdk-init-time',
});

/**
 * Performance budgets (in milliseconds or score)
 */
const PerformanceBudgets = Object.freeze({
  [MetricNames.LCP]: 2500,
  [MetricNames.FID]: 100,
  [MetricNames.CLS]: 0.1,
  [MetricNames.FCP]: 1800,
  [MetricNames.TTFB]: 800,
  [MetricNames.SDK_LOAD]: 1000,
  [MetricNames.SDK_INIT]: 2000,
});

/**
 * Stored metrics
 */
const metrics = new Map();

/**
 * Performance observers
 */
const observers = new Map();

/**
 * Callbacks for metric updates
 */
const metricCallbacks = new Map();

/**
 * Check if Performance Observer API is supported
 * @returns {boolean} True if supported
 */
const isPerformanceObserverSupported = () =>
  typeof PerformanceObserver !== 'undefined' && typeof PerformanceObserver.supportedEntryTypes !== 'undefined';

/**
 * Check if a specific entry type is supported
 * @param {string} entryType - Performance entry type
 * @returns {boolean} True if supported
 */
const isEntryTypeSupported = entryType => {
  if (!isPerformanceObserverSupported()) {
    return false;
  }

  return PerformanceObserver.supportedEntryTypes.includes(entryType);
};

/**
 * Calculate a metric score (good, needs-improvement, poor)
 * @param {string} metricName - Name of the metric
 * @param {number} value - Metric value
 * @returns {string} Performance score
 */
const getMetricRating = (metricName, value) => {
  const budget = PerformanceBudgets[metricName];

  if (!budget) {
    return 'unknown';
  }

  if (metricName === MetricNames.CLS) {
    if (value <= 0.1) {
      return 'good';
    }
    if (value <= 0.25) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  if (value <= budget * 0.75) {
    return 'good';
  }
  if (value <= budget) {
    return 'needs-improvement';
  }
  return 'poor';
};

/**
 * Store a metric value
 * @param {string} metricName - Name of the metric
 * @param {number} value - Metric value
 * @param {Object} [metadata={}] - Additional metadata
 */
const recordMetric = (metricName, value, metadata = {}) => {
  const rating = getMetricRating(metricName, value);
  const budget = PerformanceBudgets[metricName];

  const metric = {
    name: metricName,
    value,
    rating,
    budget,
    withinBudget: budget ? value <= budget : null,
    timestamp: Date.now(),
    ...metadata,
  };

  metrics.set(metricName, metric);

  console.log(`[Performance Monitor] ${metricName}:`, {
    value: `${value.toFixed(2)}${metricName === MetricNames.CLS ? '' : 'ms'}`,
    rating,
    budget: budget ? `${budget}${metricName === MetricNames.CLS ? '' : 'ms'}` : 'N/A',
    withinBudget: metric.withinBudget,
  });

  const callbacks = metricCallbacks.get(metricName) || [];
  callbacks.forEach(callback => {
    try {
      callback(metric);
    } catch (error) {
      console.error(`[Performance Monitor] Error in metric callback for ${metricName}:`, error);
    }
  });
};

/**
 * Observe Largest Contentful Paint (LCP)
 */
const observeLCP = () => {
  if (!isEntryTypeSupported('largest-contentful-paint')) {
    console.warn('[Performance Monitor] LCP observation not supported');
    return;
  }

  try {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      if (lastEntry) {
        recordMetric(MetricNames.LCP, lastEntry.renderTime || lastEntry.loadTime, {
          element: lastEntry.element?.tagName,
          url: lastEntry.url,
        });
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.set(MetricNames.LCP, observer);
  } catch (error) {
    console.error('[Performance Monitor] Error observing LCP:', error);
  }
};

/**
 * Observe First Input Delay (FID)
 */
const observeFID = () => {
  if (!isEntryTypeSupported('first-input')) {
    console.warn('[Performance Monitor] FID observation not supported');
    return;
  }

  try {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        recordMetric(MetricNames.FID, entry.processingStart - entry.startTime, {
          eventType: entry.name,
        });
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
    observers.set(MetricNames.FID, observer);
  } catch (error) {
    console.error('[Performance Monitor] Error observing FID:', error);
  }
};

/**
 * Observe Cumulative Layout Shift (CLS)
 */
const observeCLS = () => {
  if (!isEntryTypeSupported('layout-shift')) {
    console.warn('[Performance Monitor] CLS observation not supported');
    return;
  }

  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries = [];
  const maxSessionGap = 1000;
  const maxSessionDuration = 5000;
  let prevEntryTime = 0;

  try {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          const isNewSession =
            entry.startTime - prevEntryTime > maxSessionGap ||
            entry.startTime - sessionEntries[0]?.startTime > maxSessionDuration;

          if (isNewSession) {
            sessionValue = 0;
            sessionEntries = [];
          }

          sessionValue += entry.value;
          sessionEntries.push(entry);
          prevEntryTime = entry.startTime;

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            recordMetric(MetricNames.CLS, clsValue, {
              entries: sessionEntries.length,
            });
          }
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    observers.set(MetricNames.CLS, observer);
  } catch (error) {
    console.error('[Performance Monitor] Error observing CLS:', error);
  }
};

/**
 * Observe First Contentful Paint (FCP)
 */
const observeFCP = () => {
  if (!isEntryTypeSupported('paint')) {
    console.warn('[Performance Monitor] FCP observation not supported');
    return;
  }

  try {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          recordMetric(MetricNames.FCP, entry.startTime);
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
    observers.set(MetricNames.FCP, observer);
  } catch (error) {
    console.error('[Performance Monitor] Error observing FCP:', error);
  }
};

/**
 * Measure Time to First Byte (TTFB)
 */
const measureTTFB = () => {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0];

    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      recordMetric(MetricNames.TTFB, ttfb, {
        navigationType: navigationEntry.type,
      });
    }
  } catch (error) {
    console.error('[Performance Monitor] Error measuring TTFB:', error);
  }
};

/**
 * Track SDK load time
 * @param {number} loadTime - SDK load time in milliseconds
 */
export const trackSDKLoad = loadTime => {
  if (typeof loadTime !== 'number' || loadTime < 0) {
    console.error('[Performance Monitor] Invalid SDK load time:', loadTime);
    return;
  }

  recordMetric(MetricNames.SDK_LOAD, loadTime);
};

/**
 * Track SDK initialization time
 * @param {number} initTime - SDK initialization time in milliseconds
 */
export const trackSDKInit = initTime => {
  if (typeof initTime !== 'number' || initTime < 0) {
    console.error('[Performance Monitor] Invalid SDK init time:', initTime);
    return;
  }

  recordMetric(MetricNames.SDK_INIT, initTime);
};

/**
 * Get all recorded metrics
 * @returns {Object} Map of all metrics
 */
export const getMetrics = () => {
  const result = {};

  metrics.forEach((metric, name) => {
    result[name] = { ...metric };
  });

  return result;
};

/**
 * Get a specific metric
 * @param {string} metricName - Name of the metric
 * @returns {Object|null} Metric object or null if not found
 */
export const getMetric = metricName => {
  const metric = metrics.get(metricName);
  return metric ? { ...metric } : null;
};

/**
 * Get performance summary
 * @returns {Object} Performance summary with overall rating
 */
export const getPerformanceSummary = () => {
  const allMetrics = getMetrics();
  const metricValues = Object.values(allMetrics);

  const goodCount = metricValues.filter(m => m.rating === 'good').length;
  const needsImprovementCount = metricValues.filter(m => m.rating === 'needs-improvement').length;
  const poorCount = metricValues.filter(m => m.rating === 'poor').length;

  let overallRating = 'good';
  if (poorCount > 0) {
    overallRating = 'poor';
  } else if (needsImprovementCount > 0) {
    overallRating = 'needs-improvement';
  }

  return {
    overallRating,
    metrics: allMetrics,
    counts: {
      good: goodCount,
      needsImprovement: needsImprovementCount,
      poor: poorCount,
      total: metricValues.length,
    },
  };
};

/**
 * Register a callback for metric updates
 * @param {string} metricName - Name of the metric to watch
 * @param {Function} callback - Callback function
 */
export const onMetricUpdate = (metricName, callback) => {
  if (typeof callback !== 'function') {
    console.error('[Performance Monitor] Callback must be a function');
    return;
  }

  const callbacks = metricCallbacks.get(metricName) || [];
  callbacks.push(callback);
  metricCallbacks.set(metricName, callbacks);
};

/**
 * Log performance summary to console
 */
export const logPerformanceSummary = () => {
  const summary = getPerformanceSummary();

  console.log('[Performance Monitor] === Performance Summary ===');
  console.log(`Overall Rating: ${summary.overallRating}`);
  console.log(`Total Metrics: ${summary.counts.total}`);
  console.log(`Good: ${summary.counts.good}`);
  console.log(`Needs Improvement: ${summary.counts.needsImprovement}`);
  console.log(`Poor: ${summary.counts.poor}`);
  console.log('Metrics:', summary.metrics);
};

/**
 * Initialize performance monitoring
 * This should be called as early as possible
 */
export const initializePerformanceMonitoring = () => {
  if (!isPerformanceObserverSupported()) {
    console.warn('[Performance Monitor] Performance Observer API not supported');
    return;
  }

  console.log('[Performance Monitor] Initializing performance monitoring...');

  measureTTFB();
  observeLCP();
  observeFID();
  observeCLS();
  observeFCP();

  console.log('[Performance Monitor] Performance monitoring initialized');
};

/**
 * Disconnect all observers and clean up
 */
export const cleanup = () => {
  observers.forEach((observer, name) => {
    try {
      observer.disconnect();
      console.log(`[Performance Monitor] Disconnected observer: ${name}`);
    } catch (error) {
      console.error(`[Performance Monitor] Error disconnecting observer ${name}:`, error);
    }
  });

  observers.clear();
  metricCallbacks.clear();
  console.log('[Performance Monitor] Cleanup complete');
};

/**
 * Export default interface
 */
export default {
  initializePerformanceMonitoring,
  trackSDKLoad,
  trackSDKInit,
  getMetrics,
  getMetric,
  getPerformanceSummary,
  onMetricUpdate,
  logPerformanceSummary,
  cleanup,
  MetricNames,
  PerformanceBudgets,
};
