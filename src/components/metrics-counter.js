/**
 * Metrics Counter Component
 * 
 * Animated counter component for displaying statistics with smooth easing animations.
 * Features intersection observer for viewport-triggered animations, configurable
 * duration and easing, and accessibility support. Optimized for performance with
 * requestAnimationFrame and proper cleanup.
 * 
 * @generated-from: task-id:TASK-006
 * @modifies: use-cases-section.js
 * @dependencies: []
 */

/**
 * Counter configuration
 * @typedef {Object} CounterConfig
 * @property {number} target - Target number to count to
 * @property {string} [unit=''] - Unit suffix (%, x, +, etc.)
 * @property {string} [prefix=''] - Prefix before number ($, etc.)
 * @property {number} [duration=2000] - Animation duration in ms
 * @property {string} [easing='easeOutQuart'] - Easing function name
 * @property {number} [decimals=0] - Number of decimal places
 * @property {boolean} [useGrouping=true] - Use thousand separators
 * @property {number} [threshold=0.5] - Intersection observer threshold
 * @property {boolean} [once=true] - Animate only once
 * @property {Function} [onStart] - Callback when animation starts
 * @property {Function} [onComplete] - Callback when animation completes
 * @property {Function} [onUpdate] - Callback on each frame update
 */

/**
 * Easing functions for smooth animations
 * @private
 */
const EASING_FUNCTIONS = Object.freeze({
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t),
});

/**
 * Default configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  target: 0,
  unit: '',
  prefix: '',
  duration: 2000,
  easing: 'easeOutQuart',
  decimals: 0,
  useGrouping: true,
  threshold: 0.5,
  once: true,
  onStart: null,
  onComplete: null,
  onUpdate: null,
});

/**
 * Counter state management
 * @private
 */
const COUNTER_STATE = {
  observers: new WeakMap(),
  activeAnimations: new WeakMap(),
  animatedElements: new WeakSet(),
};

/**
 * Structured event logger
 * @param {string} event - Event name
 * @param {Object} context - Event context
 */
const logEvent = (event, context = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    component: 'metrics-counter',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
    console.log('[MetricsCounter]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'metrics_counter',
      ...context,
    });
  }
};

/**
 * Validates counter configuration
 * @param {Object} config - Configuration to validate
 * @returns {CounterConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Counter configuration must be an object');
  }

  if (typeof config.target !== 'number' || !isFinite(config.target)) {
    throw new TypeError('Counter target must be a finite number');
  }

  if (config.unit !== undefined && typeof config.unit !== 'string') {
    throw new TypeError('Counter unit must be a string');
  }

  if (config.prefix !== undefined && typeof config.prefix !== 'string') {
    throw new TypeError('Counter prefix must be a string');
  }

  if (config.duration !== undefined) {
    if (typeof config.duration !== 'number' || config.duration <= 0) {
      throw new TypeError('Counter duration must be a positive number');
    }
  }

  if (config.easing !== undefined) {
    if (typeof config.easing !== 'string' || !EASING_FUNCTIONS[config.easing]) {
      throw new TypeError(`Counter easing must be one of: ${Object.keys(EASING_FUNCTIONS).join(', ')}`);
    }
  }

  if (config.decimals !== undefined) {
    if (typeof config.decimals !== 'number' || config.decimals < 0 || !Number.isInteger(config.decimals)) {
      throw new TypeError('Counter decimals must be a non-negative integer');
    }
  }

  if (config.threshold !== undefined) {
    if (typeof config.threshold !== 'number' || config.threshold < 0 || config.threshold > 1) {
      throw new TypeError('Counter threshold must be between 0 and 1');
    }
  }

  if (config.onStart !== undefined && config.onStart !== null && typeof config.onStart !== 'function') {
    throw new TypeError('Counter onStart must be a function');
  }

  if (config.onComplete !== undefined && config.onComplete !== null && typeof config.onComplete !== 'function') {
    throw new TypeError('Counter onComplete must be a function');
  }

  if (config.onUpdate !== undefined && config.onUpdate !== null && typeof config.onUpdate !== 'function') {
    throw new TypeError('Counter onUpdate must be a function');
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};

/**
 * Formats number with grouping and decimals
 * @param {number} value - Number to format
 * @param {number} decimals - Decimal places
 * @param {boolean} useGrouping - Use thousand separators
 * @returns {string} Formatted number
 */
const formatNumber = (value, decimals, useGrouping) => {
  const options = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  };

  try {
    return new Intl.NumberFormat('en-US', options).format(value);
  } catch (error) {
    logEvent('number_format_error', {
      error_message: error.message,
      value,
      decimals,
    });
    return value.toFixed(decimals);
  }
};

/**
 * Checks if user prefers reduced motion
 * @returns {boolean} True if reduced motion preferred
 */
const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  } catch (error) {
    logEvent('reduced_motion_check_error', {
      error_message: error.message,
    });
    return false;
  }
};

/**
 * Animates counter with easing function
 * @param {HTMLElement} element - Target element
 * @param {CounterConfig} config - Counter configuration
 * @returns {Object} Animation control object
 */
const animateCounter = (element, config) => {
  const startTime = performance.now();
  const startValue = 0;
  const easingFn = EASING_FUNCTIONS[config.easing];
  let animationFrameId = null;
  let isComplete = false;

  const animate = (currentTime) => {
    if (isComplete) {
      return;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / config.duration, 1);
    const easedProgress = easingFn(progress);
    const currentValue = startValue + (config.target - startValue) * easedProgress;

    const formattedValue = formatNumber(currentValue, config.decimals, config.useGrouping);
    element.textContent = `${config.prefix}${formattedValue}${config.unit}`;

    if (typeof config.onUpdate === 'function') {
      try {
        config.onUpdate(currentValue, progress);
      } catch (error) {
        logEvent('counter_update_callback_error', {
          error_message: error.message,
          error_stack: error.stack,
        });
      }
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      isComplete = true;
      const finalValue = formatNumber(config.target, config.decimals, config.useGrouping);
      element.textContent = `${config.prefix}${finalValue}${config.unit}`;

      if (typeof config.onComplete === 'function') {
        try {
          config.onComplete(config.target);
        } catch (error) {
          logEvent('counter_complete_callback_error', {
            error_message: error.message,
            error_stack: error.stack,
          });
        }
      }

      logEvent('counter_animation_complete', {
        target: config.target,
        duration: config.duration,
        actual_duration: performance.now() - startTime,
      });
    }
  };

  if (typeof config.onStart === 'function') {
    try {
      config.onStart();
    } catch (error) {
      logEvent('counter_start_callback_error', {
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  animationFrameId = requestAnimationFrame(animate);

  return {
    cancel: () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        isComplete = true;
        logEvent('counter_animation_cancelled', {
          target: config.target,
        });
      }
    },
    isComplete: () => isComplete,
  };
};

/**
 * Creates intersection observer callback
 * @param {HTMLElement} element - Target element
 * @param {CounterConfig} config - Counter configuration
 * @returns {Function} Observer callback
 */
const createObserverCallback = (element, config) => {
  return (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (config.once && COUNTER_STATE.animatedElements.has(element)) {
          return;
        }

        const existingAnimation = COUNTER_STATE.activeAnimations.get(element);
        if (existingAnimation && !existingAnimation.isComplete()) {
          return;
        }

        logEvent('counter_animation_triggered', {
          target: config.target,
          intersection_ratio: entry.intersectionRatio,
        });

        const animation = animateCounter(element, config);
        COUNTER_STATE.activeAnimations.set(element, animation);
        COUNTER_STATE.animatedElements.add(element);

        if (config.once) {
          const observer = COUNTER_STATE.observers.get(element);
          if (observer) {
            observer.unobserve(element);
          }
        }
      }
    });
  };
};

/**
 * Creates and initializes metrics counter
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} config - Counter configuration
 * @returns {Object} Counter instance with control methods
 * @throws {Error} If target not found or configuration invalid
 */
export const createMetricsCounter = (target, config) => {
  const startTime = performance.now();

  try {
    if (typeof IntersectionObserver === 'undefined') {
      throw new Error('IntersectionObserver is not supported in this browser');
    }

    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Metrics counter target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    if (!(targetElement instanceof HTMLElement)) {
      throw new TypeError('Target must be an HTMLElement or valid selector');
    }

    const validatedConfig = validateConfig(config);

    if (prefersReducedMotion()) {
      const finalValue = formatNumber(
        validatedConfig.target,
        validatedConfig.decimals,
        validatedConfig.useGrouping
      );
      targetElement.textContent = `${validatedConfig.prefix}${finalValue}${validatedConfig.unit}`;

      logEvent('counter_reduced_motion', {
        target: validatedConfig.target,
      });

      return {
        element: targetElement,
        config: validatedConfig,
        start: () => {},
        cancel: () => {},
        reset: () => {},
        cleanup: () => {},
      };
    }

    const initialValue = formatNumber(0, validatedConfig.decimals, validatedConfig.useGrouping);
    targetElement.textContent = `${validatedConfig.prefix}${initialValue}${validatedConfig.unit}`;

    const callback = createObserverCallback(targetElement, validatedConfig);

    const observerOptions = {
      threshold: validatedConfig.threshold,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    observer.observe(targetElement);

    COUNTER_STATE.observers.set(targetElement, observer);

    const renderTime = performance.now() - startTime;
    logEvent('metrics_counter_created', {
      target: validatedConfig.target,
      render_time_ms: renderTime.toFixed(2),
      duration: validatedConfig.duration,
      easing: validatedConfig.easing,
    });

    return {
      element: targetElement,
      config: validatedConfig,
      start: () => {
        const animation = animateCounter(targetElement, validatedConfig);
        COUNTER_STATE.activeAnimations.set(targetElement, animation);
        COUNTER_STATE.animatedElements.add(targetElement);
      },
      cancel: () => {
        const animation = COUNTER_STATE.activeAnimations.get(targetElement);
        if (animation) {
          animation.cancel();
        }
      },
      reset: () => {
        const animation = COUNTER_STATE.activeAnimations.get(targetElement);
        if (animation) {
          animation.cancel();
        }
        const initialValue = formatNumber(0, validatedConfig.decimals, validatedConfig.useGrouping);
        targetElement.textContent = `${validatedConfig.prefix}${initialValue}${validatedConfig.unit}`;
        COUNTER_STATE.animatedElements.delete(targetElement);
      },
      cleanup: () => {
        const observer = COUNTER_STATE.observers.get(targetElement);
        if (observer) {
          observer.disconnect();
          COUNTER_STATE.observers.delete(targetElement);
        }

        const animation = COUNTER_STATE.activeAnimations.get(targetElement);
        if (animation) {
          animation.cancel();
          COUNTER_STATE.activeAnimations.delete(targetElement);
        }

        COUNTER_STATE.animatedElements.delete(targetElement);

        logEvent('metrics_counter_cleanup', {
          target: validatedConfig.target,
        });
      },
    };
  } catch (error) {
    logEvent('metrics_counter_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create metrics counter: ${error.message}`, {
      cause: error,
    });
  }
};

/**
 * Creates multiple counters with staggered start times
 * @param {Array<{target: HTMLElement|string, config: Object}>} counters - Array of counter configs
 * @param {number} [stagger=100] - Delay between each counter in ms
 * @returns {Object} Control object with cleanup method
 */
export const createStaggeredCounters = (counters, stagger = 100) => {
  if (!Array.isArray(counters)) {
    throw new TypeError('Counters must be an array');
  }

  if (typeof stagger !== 'number' || stagger < 0) {
    throw new TypeError('Stagger must be a non-negative number');
  }

  const instances = [];

  counters.forEach((counterConfig, index) => {
    try {
      const config = {
        ...counterConfig.config,
        onStart: () => {
          if (typeof counterConfig.config?.onStart === 'function') {
            counterConfig.config.onStart();
          }
        },
      };

      const instance = createMetricsCounter(counterConfig.target, config);

      setTimeout(() => {
        const observer = COUNTER_STATE.observers.get(instance.element);
        if (observer) {
          observer.disconnect();
        }
        instance.start();
      }, index * stagger);

      instances.push(instance);
    } catch (error) {
      logEvent('staggered_counter_error', {
        index,
        error_message: error.message,
      });
    }
  });

  return {
    instances,
    cleanup: () => {
      instances.forEach((instance) => instance.cleanup());
      logEvent('staggered_counters_cleanup', {
        count: instances.length,
      });
    },
  };
};

/**
 * Get available easing functions
 * @returns {Array<string>} Array of easing function names
 */
export const getAvailableEasings = () => Object.keys(EASING_FUNCTIONS);

/**
 * Check if counter animations are supported
 * @returns {Object} Support status
 */
export const getCounterSupport = () => ({
  intersectionObserver: typeof IntersectionObserver !== 'undefined',
  requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
  reducedMotion: prefersReducedMotion(),
  supported:
    typeof IntersectionObserver !== 'undefined' &&
    typeof requestAnimationFrame !== 'undefined' &&
    !prefersReducedMotion(),
});

export default createMetricsCounter;