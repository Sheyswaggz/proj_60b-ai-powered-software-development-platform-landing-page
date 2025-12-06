/**
 * Animation Utilities for Scroll-Triggered Effects
 * Provides Intersection Observer implementation for scroll animations,
 * fade-in effects, and performance-optimized animation controls.
 *
 * @module animations
 * @generated-from task-id:TASK-002
 * @modifies hero-section.js
 */

/**
 * Animation state management
 * @private
 */
const ANIMATION_STATE = {
  observers: new WeakMap(),
  activeAnimations: new Set(),
  performanceMode: 'auto',
  initialized: false,
};

/**
 * Default animation configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  threshold: [0, 0.25, 0.5, 0.75, 1],
  rootMargin: '0px 0px -10% 0px',
  animationDuration: 600,
  animationDelay: 0,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  once: true,
  enableLogging: false,
});

/**
 * Animation presets for common effects
 * @private
 */
const ANIMATION_PRESETS = Object.freeze({
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeInUp: {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  fadeInDown: {
    from: { opacity: 0, transform: 'translateY(-30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  fadeInLeft: {
    from: { opacity: 0, transform: 'translateX(-30px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  fadeInRight: {
    from: { opacity: 0, transform: 'translateX(30px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
});

/**
 * Structured logger for animation events
 * @private
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {Object} context - Additional context data
 */
const log = (level, message, context = {}) => {
  if (!DEFAULT_CONFIG.enableLogging && level !== 'error') {
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    module: 'animations',
    context,
  };

  if (level === 'error') {
    console.error(`[${timestamp}] ANIMATIONS ERROR:`, message, context);
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] ANIMATIONS WARN:`, message, context);
  } else {
    console.info(`[${timestamp}] ANIMATIONS INFO:`, message, context);
  }

  return logEntry;
};

/**
 * Detect reduced motion preference
 * @private
 * @returns {boolean} True if user prefers reduced motion
 */
const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Detect device performance capabilities
 * @private
 * @returns {string} Performance mode: 'high', 'medium', or 'low'
 */
const detectPerformanceMode = () => {
  if (typeof navigator === 'undefined') {
    return 'medium';
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'low';
    }
    if (effectiveType === '3g') {
      return 'medium';
    }
  }

  const memory = navigator.deviceMemory;
  if (memory && memory < 4) {
    return 'low';
  }

  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) {
    return 'medium';
  }

  return 'high';
};

/**
 * Validate animation configuration
 * @private
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validated configuration
 * @throws {TypeError} If configuration is invalid
 */
const validateConfig = config => {
  if (config === null || typeof config !== 'object') {
    throw new TypeError('Animation configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (!Array.isArray(validated.threshold)) {
    throw new TypeError('threshold must be an array');
  }

  if (typeof validated.rootMargin !== 'string') {
    throw new TypeError('rootMargin must be a string');
  }

  if (typeof validated.animationDuration !== 'number' || validated.animationDuration < 0) {
    throw new TypeError('animationDuration must be a non-negative number');
  }

  if (typeof validated.animationDelay !== 'number' || validated.animationDelay < 0) {
    throw new TypeError('animationDelay must be a non-negative number');
  }

  if (typeof validated.animationEasing !== 'string') {
    throw new TypeError('animationEasing must be a string');
  }

  if (typeof validated.once !== 'boolean') {
    throw new TypeError('once must be a boolean');
  }

  return validated;
};

/**
 * Apply animation styles to element
 * @private
 * @param {HTMLElement} element - Target element
 * @param {Object} styles - Style object to apply
 * @param {number} duration - Animation duration in ms
 * @param {string} easing - Animation easing function
 */
const applyAnimationStyles = (element, styles, duration, easing) => {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError('element must be an HTMLElement');
  }

  const styleEntries = Object.entries(styles);

  element.style.transition = `all ${duration}ms ${easing}`;

  requestAnimationFrame(() => {
    for (const [property, value] of styleEntries) {
      element.style[property] = value;
    }
  });
};

/**
 * Create animation callback for intersection observer
 * @private
 * @param {Object} config - Animation configuration
 * @param {Object} preset - Animation preset
 * @returns {Function} Intersection observer callback
 */
const createAnimationCallback = (config, preset) => entries => {
  for (const entry of entries) {
    const element = entry.target;

    if (entry.isIntersecting) {
      const delay = config.animationDelay;

      const animationId = setTimeout(() => {
        try {
          applyAnimationStyles(element, preset.to, config.animationDuration, config.animationEasing);

          element.setAttribute('data-animated', 'true');

          ANIMATION_STATE.activeAnimations.delete(animationId);

          log('info', 'Animation triggered', {
            element: element.tagName,
            intersectionRatio: entry.intersectionRatio,
          });

          if (config.once) {
            const observer = ANIMATION_STATE.observers.get(element);
            if (observer) {
              observer.unobserve(element);
            }
          }
        } catch (error) {
          log('error', 'Animation application failed', {
            element: element.tagName,
            error: error.message,
            stack: error.stack,
          });
        }
      }, delay);

      ANIMATION_STATE.activeAnimations.add(animationId);
    } else if (!config.once && element.getAttribute('data-animated') === 'true') {
      try {
        applyAnimationStyles(element, preset.from, config.animationDuration, config.animationEasing);

        element.setAttribute('data-animated', 'false');

        log('info', 'Animation reversed', {
          element: element.tagName,
        });
      } catch (error) {
        log('error', 'Animation reversal failed', {
          element: element.tagName,
          error: error.message,
        });
      }
    }
  }
};

/**
 * Initialize animation system
 * @private
 */
const initializeAnimationSystem = () => {
  if (ANIMATION_STATE.initialized) {
    return;
  }

  ANIMATION_STATE.performanceMode = detectPerformanceMode();

  log('info', 'Animation system initialized', {
    performanceMode: ANIMATION_STATE.performanceMode,
    reducedMotion: prefersReducedMotion(),
  });

  ANIMATION_STATE.initialized = true;
};

/**
 * Create scroll-triggered animation observer
 * @param {HTMLElement|string} element - Target element or selector
 * @param {Object} options - Animation options
 * @param {string} [options.preset='fadeIn'] - Animation preset name
 * @param {Object} [options.config] - Custom configuration
 * @returns {Object} Observer control object with disconnect method
 * @throws {Error} If element not found or IntersectionObserver not supported
 */
export const createScrollAnimation = (element, options = {}) => {
  initializeAnimationSystem();

  if (typeof IntersectionObserver === 'undefined') {
    const error = new Error('IntersectionObserver is not supported in this browser');
    log('error', 'IntersectionObserver not supported', {
      userAgent: navigator.userAgent,
    });
    throw error;
  }

  if (prefersReducedMotion()) {
    log('info', 'Animation skipped due to reduced motion preference');
    return {
      disconnect: () => {},
    };
  }

  let targetElement = element;
  if (typeof element === 'string') {
    targetElement = document.querySelector(element);
    if (!targetElement) {
      throw new Error(`Element not found: ${element}`);
    }
  }

  if (!(targetElement instanceof HTMLElement)) {
    throw new TypeError('element must be an HTMLElement or valid selector');
  }

  const presetName = options.preset || 'fadeIn';
  const preset = ANIMATION_PRESETS[presetName];

  if (!preset) {
    throw new Error(`Unknown animation preset: ${presetName}`);
  }

  const config = validateConfig(options.config || {});

  applyAnimationStyles(targetElement, preset.from, 0, 'none');

  const callback = createAnimationCallback(config, preset);

  const observerOptions = {
    threshold: config.threshold,
    rootMargin: config.rootMargin,
  };

  const observer = new IntersectionObserver(callback, observerOptions);

  observer.observe(targetElement);

  ANIMATION_STATE.observers.set(targetElement, observer);

  log('info', 'Scroll animation created', {
    element: targetElement.tagName,
    preset: presetName,
    config: {
      duration: config.animationDuration,
      delay: config.animationDelay,
      once: config.once,
    },
  });

  return {
    disconnect: () => {
      observer.disconnect();
      ANIMATION_STATE.observers.delete(targetElement);
      log('info', 'Animation observer disconnected', {
        element: targetElement.tagName,
      });
    },
  };
};

/**
 * Create multiple scroll animations with staggered delays
 * @param {Array<HTMLElement|string>} elements - Array of elements or selectors
 * @param {Object} options - Animation options
 * @param {number} [options.stagger=100] - Delay between each animation in ms
 * @returns {Object} Control object with disconnectAll method
 */
export const createStaggeredAnimations = (elements, options = {}) => {
  if (!Array.isArray(elements)) {
    throw new TypeError('elements must be an array');
  }

  const stagger = options.stagger || 100;
  const observers = [];

  for (const [index, element] of elements.entries()) {
    try {
      const animationOptions = {
        ...options,
        config: {
          ...options.config,
          animationDelay: (options.config?.animationDelay || 0) + index * stagger,
        },
      };

      const observer = createScrollAnimation(element, animationOptions);
      observers.push(observer);
    } catch (error) {
      log('error', 'Failed to create staggered animation', {
        index,
        element: typeof element === 'string' ? element : element.tagName,
        error: error.message,
      });
    }
  }

  return {
    disconnectAll: () => {
      for (const observer of observers) {
        observer.disconnect();
      }
      log('info', 'All staggered animations disconnected', {
        count: observers.length,
      });
    },
  };
};

/**
 * Cleanup all active animations
 * @returns {void}
 */
export const cleanupAnimations = () => {
  for (const animationId of ANIMATION_STATE.activeAnimations) {
    clearTimeout(animationId);
  }

  ANIMATION_STATE.activeAnimations.clear();

  log('info', 'All animations cleaned up');
};

/**
 * Get available animation presets
 * @returns {Array<string>} Array of preset names
 */
export const getAvailablePresets = () => Object.keys(ANIMATION_PRESETS);

/**
 * Check if animations are supported and enabled
 * @returns {Object} Support status
 */
export const getAnimationSupport = () => ({
  intersectionObserver: typeof IntersectionObserver !== 'undefined',
  reducedMotion: prefersReducedMotion(),
  performanceMode: ANIMATION_STATE.performanceMode,
  supported: typeof IntersectionObserver !== 'undefined' && !prefersReducedMotion(),
});

export { ANIMATION_PRESETS };