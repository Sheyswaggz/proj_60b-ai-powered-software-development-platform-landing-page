/**
 * Event Tracking Service
 *
 * Centralized event tracking service for analytics and experiment metrics.
 * Handles newsletter signup conversion events, form submissions, validation
 * errors, and ensures proper attribution to experiment variants.
 *
 * @generated-from: task-id:c03a1995-6478-4b2e-a8c0-abbd07d3c751
 * @dependencies: ["experiment-manager.js", "newsletter-config.js"]
 */

/**
 * Event types
 * @enum {string}
 */
export const EventType = Object.freeze({
  NEWSLETTER_FORM_VIEW: 'newsletter_form_view',
  NEWSLETTER_FORM_FOCUS: 'newsletter_form_focus',
  NEWSLETTER_SUBMIT_ATTEMPT: 'newsletter_submit_attempt',
  NEWSLETTER_VALIDATION_ERROR: 'newsletter_validation_error',
  NEWSLETTER_SUBMIT_SUCCESS: 'newsletter_submit_success',
  NEWSLETTER_SUBMIT_ERROR: 'newsletter_submit_error',
  NEWSLETTER_CONSENT_ACCEPTED: 'newsletter_consent_accepted',
  EXPERIMENT_ASSIGNED: 'experiment_assigned',
  EXPERIMENT_EXPOSED: 'experiment_exposed',
});

/**
 * Event tracking configuration
 * @private
 */
const TRACKING_CONFIG = Object.freeze({
  enabled: true,
  batchSize: 10,
  batchTimeout: 5000,
  enableConsoleLog: typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production',
  enableGoogleAnalytics: true,
  enableCustomEndpoint: false,
  customEndpoint: '/api/events',
});

/**
 * Event queue for batching
 * @private
 */
const eventQueue = [];

/**
 * Batch timer ID
 * @private
 */
let batchTimerId = null;

/**
 * Event counter for tracking
 * @private
 */
let eventCounter = 0;

/**
 * Generates unique event ID
 * @returns {string} Event ID
 * @private
 */
const generateEventId = () => {
  eventCounter += 1;
  return `evt_${Date.now()}_${eventCounter}`;
};

/**
 * Gets session ID from localStorage or creates new one
 * @returns {string} Session ID
 * @private
 */
const getSessionId = () => {
  if (typeof window === 'undefined') {
    return 'server-session';
  }

  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Gets user ID from localStorage
 * @returns {string|null} User ID or null
 * @private
 */
const getUserId = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('experiment_user_id') || null;
};

/**
 * Structured console logger
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Log data
 * @private
 */
const log = (level, message, data = {}) => {
  if (!TRACKING_CONFIG.enableConsoleLog) {
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: 'event-tracking',
    message,
    ...data,
  };

  console.log(`[EventTracking:${level}]`, logEntry);
};

/**
 * Sends events to Google Analytics
 * @param {Object[]} events - Events to send
 * @private
 */
const sendToGoogleAnalytics = events => {
  if (!TRACKING_CONFIG.enableGoogleAnalytics || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  for (const event of events) {
    try {
      window.gtag('event', event.type, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.properties,
      });
    } catch (error) {
      log('error', 'Failed to send event to Google Analytics', {
        eventId: event.id,
        error: error.message,
      });
    }
  }
};

/**
 * Sends events to custom endpoint
 * @param {Object[]} events - Events to send
 * @returns {Promise<void>}
 * @private
 */
const sendToCustomEndpoint = async events => {
  if (!TRACKING_CONFIG.enableCustomEndpoint) {
    return;
  }

  try {
    const response = await fetch(TRACKING_CONFIG.customEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    log('info', 'Events sent to custom endpoint', { count: events.length });
  } catch (error) {
    log('error', 'Failed to send events to custom endpoint', {
      error: error.message,
      eventCount: events.length,
    });
  }
};

/**
 * Flushes event queue
 * @private
 */
const flushQueue = () => {
  if (eventQueue.length === 0) {
    return;
  }

  const eventsToSend = [...eventQueue];
  eventQueue.length = 0;

  if (batchTimerId) {
    clearTimeout(batchTimerId);
    batchTimerId = null;
  }

  sendToGoogleAnalytics(eventsToSend);
  sendToCustomEndpoint(eventsToSend).catch(error => {
    log('error', 'Queue flush error', { error: error.message });
  });

  log('info', 'Event queue flushed', { eventCount: eventsToSend.length });
};

/**
 * Schedules queue flush
 * @private
 */
const scheduleFlush = () => {
  if (batchTimerId) {
    return;
  }

  batchTimerId = setTimeout(() => {
    flushQueue();
  }, TRACKING_CONFIG.batchTimeout);
};

/**
 * Tracks an event
 * @param {string} type - Event type
 * @param {Object} properties - Event properties
 * @param {Object} [options] - Tracking options
 * @param {boolean} [options.immediate=false] - Send immediately without batching
 */
export const trackEvent = (type, properties = {}, options = {}) => {
  if (!TRACKING_CONFIG.enabled) {
    return;
  }

  if (!type || typeof type !== 'string') {
    log('error', 'Invalid event type', { type });
    return;
  }

  const event = {
    id: generateEventId(),
    type,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    userId: getUserId(),
    category: properties.category || 'engagement',
    label: properties.label || type,
    value: properties.value || 0,
    properties: {
      ...properties,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    },
  };

  if (options.immediate) {
    sendToGoogleAnalytics([event]);
    sendToCustomEndpoint([event]).catch(error => {
      log('error', 'Immediate send error', { error: error.message });
    });
    log('info', 'Event tracked immediately', { eventId: event.id, type });
  } else {
    eventQueue.push(event);
    log('info', 'Event queued', { eventId: event.id, type, queueSize: eventQueue.length });

    if (eventQueue.length >= TRACKING_CONFIG.batchSize) {
      flushQueue();
    } else {
      scheduleFlush();
    }
  }
};

/**
 * Tracks newsletter form view
 * @param {Object} properties - Event properties
 * @param {string} [properties.experimentId] - Experiment ID
 * @param {string} [properties.variantId] - Variant ID
 */
export const trackNewsletterFormView = properties => {
  trackEvent(EventType.NEWSLETTER_FORM_VIEW, {
    category: 'newsletter',
    label: 'form_view',
    ...properties,
  });
};

/**
 * Tracks newsletter form focus
 * @param {Object} properties - Event properties
 * @param {string} [properties.experimentId] - Experiment ID
 * @param {string} [properties.variantId] - Variant ID
 * @param {string} [properties.field] - Field name
 */
export const trackNewsletterFormFocus = properties => {
  trackEvent(EventType.NEWSLETTER_FORM_FOCUS, {
    category: 'newsletter',
    label: 'form_focus',
    ...properties,
  });
};

/**
 * Tracks newsletter submit attempt
 * @param {Object} properties - Event properties
 * @param {string} [properties.experimentId] - Experiment ID
 * @param {string} [properties.variantId] - Variant ID
 * @param {string} [properties.emailDomain] - Email domain
 */
export const trackNewsletterSubmitAttempt = properties => {
  trackEvent(EventType.NEWSLETTER_SUBMIT_ATTEMPT, {
    category: 'newsletter',
    label: 'submit_attempt',
    value: 1,
    ...properties,
  });
};

/**
 * Tracks newsletter validation error
 * @param {Object} properties - Event properties
 * @param {string} properties.field - Field with error
 * @param {string} properties.error - Error message
 * @param {string} [properties.experimentId] - Experiment ID
 * @param {string} [properties.variantId] - Variant ID
 */
export const trackNewsletterValidationError = properties => {
  if (!properties.field || !properties.error) {
    log('error', 'Validation error tracking missing required fields', properties);
    return;
  }

  trackEvent(EventType.NEWSLETTER_VALIDATION_ERROR, {
    category: 'newsletter',
    label: `validation_error_${properties.field}`,
    ...properties,
  });
};

/**
 * Tracks newsletter submit success (conversion)
 * @param {Object} properties - Event properties
 * @param {string} [properties.experimentId] - Experiment ID
 * @param {string} [properties.variantId] - Variant ID
 * @param {string} [properties.emailDomain] - Email domain
 * @param {number} [properties.responseTime] - Response time in ms
 */
export const trackNewsletterSubmitSuccess = properties => {
  trackEvent(
    EventType.NEWSLETTER_SUBMIT_SUCCESS,
    {
      category: 'newsletter',
      label: 'conversion',
      value: 1,
      ...properties,
    },
    { immediate: true }
  );
};

/**
 * Tracks newsletter submit error
 * @param {Object} properties - Event properties
 * @param {string} properties.error - Error message
 * @param {string} [properties.experimentId] - Experiment ID
 * @param {string} [properties.variantId] - Variant ID
 */
export const trackNewsletterSubmitError = properties => {
  if (!properties.error) {
    log('error', 'Submit error tracking missing error message', properties);
    return;
  }

  trackEvent(EventType.NEWSLETTER_SUBMIT_ERROR, {
    category: 'newsletter',
    label: 'submit_error',
    ...properties,
  });
};

/**
 * Tracks consent acceptance
 * @param {Object} properties - Event properties
 * @param {string} [properties.experimentId] - Experiment ID
 * @param {string} [properties.variantId] - Variant ID
 */
export const trackNewsletterConsentAccepted = properties => {
  trackEvent(EventType.NEWSLETTER_CONSENT_ACCEPTED, {
    category: 'newsletter',
    label: 'consent_accepted',
    value: 1,
    ...properties,
  });
};

/**
 * Tracks experiment assignment
 * @param {Object} properties - Event properties
 * @param {string} properties.experimentId - Experiment ID
 * @param {string} properties.variantId - Variant ID
 */
export const trackExperimentAssignment = properties => {
  if (!properties.experimentId || !properties.variantId) {
    log('error', 'Experiment assignment tracking missing required fields', properties);
    return;
  }

  trackEvent(
    EventType.EXPERIMENT_ASSIGNED,
    {
      category: 'experiment',
      label: `${properties.experimentId}_${properties.variantId}`,
      ...properties,
    },
    { immediate: true }
  );
};

/**
 * Tracks experiment exposure
 * @param {Object} properties - Event properties
 * @param {string} properties.experimentId - Experiment ID
 * @param {string} properties.variantId - Variant ID
 */
export const trackExperimentExposure = properties => {
  if (!properties.experimentId || !properties.variantId) {
    log('error', 'Experiment exposure tracking missing required fields', properties);
    return;
  }

  trackEvent(EventType.EXPERIMENT_EXPOSED, {
    category: 'experiment',
    label: `exposed_${properties.experimentId}_${properties.variantId}`,
    value: 1,
    ...properties,
  });
};

/**
 * Flushes all queued events immediately
 */
export const flush = () => {
  flushQueue();
};

/**
 * Gets current queue size
 * @returns {number} Queue size
 */
export const getQueueSize = () => eventQueue.length;

/**
 * Clears event queue
 */
export const clearQueue = () => {
  eventQueue.length = 0;
  if (batchTimerId) {
    clearTimeout(batchTimerId);
    batchTimerId = null;
  }
  log('info', 'Event queue cleared');
};

/**
 * Updates tracking configuration
 * @param {Object} config - Configuration updates
 */
export const updateConfig = config => {
  if (!config || typeof config !== 'object') {
    return;
  }

  Object.assign(TRACKING_CONFIG, config);
  log('info', 'Tracking configuration updated', config);
};

/**
 * Enables event tracking
 */
export const enable = () => {
  TRACKING_CONFIG.enabled = true;
  log('info', 'Event tracking enabled');
};

/**
 * Disables event tracking
 */
export const disable = () => {
  TRACKING_CONFIG.enabled = false;
  flushQueue();
  log('info', 'Event tracking disabled');
};

/**
 * Default export
 */
export default {
  EventType,
  trackEvent,
  trackNewsletterFormView,
  trackNewsletterFormFocus,
  trackNewsletterSubmitAttempt,
  trackNewsletterValidationError,
  trackNewsletterSubmitSuccess,
  trackNewsletterSubmitError,
  trackNewsletterConsentAccepted,
  trackExperimentAssignment,
  trackExperimentExposure,
  flush,
  getQueueSize,
  clearQueue,
  updateConfig,
  enable,
  disable,
};
