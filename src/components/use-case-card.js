/**
 * Use Case Card Component
 * 
 * Reusable card component for displaying individual use case scenarios with
 * problem-solution format, measurable metrics, and visual elements. Features
 * hover effects, responsive design, and accessibility compliance.
 * 
 * @generated-from: task-id:TASK-006
 * @modifies: use-cases-section.js
 * @dependencies: []
 */

/**
 * Use case card configuration
 * @typedef {Object} UseCaseCardConfig
 * @property {string} id - Unique use case identifier
 * @property {string} title - Use case title
 * @property {string} segment - Target user segment
 * @property {string} problem - Problem description
 * @property {string} solution - Solution description
 * @property {Array<Metric>} metrics - Measurable outcomes
 * @property {string} icon - Icon identifier
 * @property {number} order - Display order
 * @property {boolean} [enableHover=true] - Enable hover effects
 * @property {boolean} [enableMetricAnimation=true] - Enable metric counter animation
 */

/**
 * Metric configuration
 * @typedef {Object} Metric
 * @property {string} label - Metric label
 * @property {string} value - Metric display value
 * @property {string} unit - Metric unit
 * @property {number} target - Target number for animation
 */

/**
 * Icon SVG paths mapping
 * @private
 */
const ICON_PATHS = Object.freeze({
  rocket: 'M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25',
  building: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z',
  user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  users: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
});

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
    component: 'use-case-card',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
    console.log('[UseCaseCard]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'use_case_card',
      ...context,
    });
  }
};

/**
 * Validates use case card configuration
 * @param {Object} config - Configuration to validate
 * @returns {UseCaseCardConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Use case card configuration must be an object');
  }

  if (typeof config.id !== 'string' || !config.id.trim()) {
    throw new TypeError('Use case card id must be a non-empty string');
  }

  if (typeof config.title !== 'string' || !config.title.trim()) {
    throw new TypeError('Use case card title must be a non-empty string');
  }

  if (typeof config.segment !== 'string' || !config.segment.trim()) {
    throw new TypeError('Use case card segment must be a non-empty string');
  }

  if (typeof config.problem !== 'string' || !config.problem.trim()) {
    throw new TypeError('Use case card problem must be a non-empty string');
  }

  if (typeof config.solution !== 'string' || !config.solution.trim()) {
    throw new TypeError('Use case card solution must be a non-empty string');
  }

  if (!Array.isArray(config.metrics) || config.metrics.length === 0) {
    throw new TypeError('Use case card metrics must be a non-empty array');
  }

  config.metrics.forEach((metric, index) => {
    if (!metric || typeof metric !== 'object') {
      throw new TypeError(`Metric at index ${index} must be an object`);
    }
    if (typeof metric.label !== 'string' || !metric.label.trim()) {
      throw new TypeError(`Metric at index ${index} must have valid label`);
    }
    if (typeof metric.value !== 'string' || !metric.value.trim()) {
      throw new TypeError(`Metric at index ${index} must have valid value`);
    }
    if (typeof metric.unit !== 'string') {
      throw new TypeError(`Metric at index ${index} must have valid unit`);
    }
    if (typeof metric.target !== 'number' || metric.target < 0) {
      throw new TypeError(`Metric at index ${index} must have valid target number`);
    }
  });

  if (typeof config.icon !== 'string' || !config.icon.trim()) {
    throw new TypeError('Use case card icon must be a non-empty string');
  }

  if (typeof config.order !== 'number' || config.order < 1) {
    throw new TypeError('Use case card order must be a number >= 1');
  }

  return {
    ...config,
    enableHover: config.enableHover !== false,
    enableMetricAnimation: config.enableMetricAnimation !== false,
  };
};

/**
 * Creates icon SVG HTML
 * @param {string} iconName - Icon name
 * @returns {string} Icon SVG HTML
 */
const createIconHTML = (iconName) => {
  const path = ICON_PATHS[iconName] || ICON_PATHS.rocket;
  return `
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}" />
    </svg>
  `;
};

/**
 * Creates metrics HTML
 * @param {Array<Metric>} metrics - Metrics array
 * @param {boolean} enableAnimation - Enable animation
 * @returns {string} Metrics HTML
 */
const createMetricsHTML = (metrics, enableAnimation) => {
  return metrics
    .map(
      (metric) => `
        <div class="metric-item text-center">
          <div 
            class="metric-value text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2"
            ${enableAnimation ? `data-target="${metric.target}" data-unit="${metric.unit}"` : ''}
          >
            ${enableAnimation ? `0${metric.unit}` : metric.value}
          </div>
          <div class="metric-label text-sm text-neutral-600 dark:text-neutral-400">
            ${metric.label}
          </div>
        </div>
      `
    )
    .join('');
};

/**
 * Creates use case card HTML
 * @param {UseCaseCardConfig} config - Card configuration
 * @returns {string} Card HTML
 */
const createUseCaseCardHTML = (config) => {
  const metricsHTML = createMetricsHTML(config.metrics, config.enableMetricAnimation);
  const hoverClass = config.enableHover ? 'hover:shadow-2xl transform hover:-translate-y-2' : '';

  return `
    <div 
      class="use-case-card bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl ${hoverClass} transition-all duration-300"
      data-use-case-id="${config.id}"
      role="article"
      aria-labelledby="use-case-${config.id}-title"
    >
      <!-- Icon and Segment -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white">
          ${createIconHTML(config.icon)}
        </div>
        <div>
          <div class="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
            ${config.segment}
          </div>
          <h3 
            id="use-case-${config.id}-title"
            class="text-2xl font-bold text-neutral-900 dark:text-white"
          >
            ${config.title}
          </h3>
        </div>
      </div>

      <!-- Problem -->
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
          Challenge
        </h4>
        <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          ${config.problem}
        </p>
      </div>

      <!-- Solution -->
      <div class="mb-8">
        <h4 class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
          Solution
        </h4>
        <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          ${config.solution}
        </p>
      </div>

      <!-- Metrics -->
      <div class="border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <h4 class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4 text-center">
          Measurable Impact
        </h4>
        <div class="grid grid-cols-3 gap-4">
          ${metricsHTML}
        </div>
      </div>
    </div>
  `;
};

/**
 * Animates metric counter with easing
 * @param {HTMLElement} element - Metric element
 * @param {number} target - Target value
 * @param {string} unit - Unit string
 * @param {number} duration - Animation duration in ms
 */
const animateMetricCounter = (element, target, unit, duration = 2000) => {
  const startTime = performance.now();
  const startValue = 0;

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

    element.textContent = `${currentValue}${unit}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = `${target}${unit}`;
    }
  };

  requestAnimationFrame(animate);
};

/**
 * Initializes metric counter animations
 * @param {HTMLElement} cardElement - Card element
 * @param {UseCaseCardConfig} config - Configuration
 * @returns {Function} Cleanup function
 */
const initializeMetricAnimations = (cardElement, config) => {
  if (!config.enableMetricAnimation) {
    return () => {};
  }

  const metricElements = cardElement.querySelectorAll('.metric-value[data-target]');
  const observers = [];

  metricElements.forEach((element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const unit = element.getAttribute('data-unit');

    if (isNaN(target)) {
      logEvent('metric_animation_error', {
        use_case_id: config.id,
        error: 'Invalid target value',
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !element.hasAttribute('data-animated')) {
            element.setAttribute('data-animated', 'true');
            animateMetricCounter(element, target, unit);
            observer.unobserve(element);

            logEvent('metric_animated', {
              use_case_id: config.id,
              metric_target: target,
              metric_unit: unit,
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    observers.push(observer);
  });

  return () => {
    observers.forEach((observer) => observer.disconnect());
  };
};

/**
 * Initializes card interactions
 * @param {HTMLElement} cardElement - Card element
 * @param {UseCaseCardConfig} config - Configuration
 * @returns {Function} Cleanup function
 */
const initializeCardInteractions = (cardElement, config) => {
  const handleCardClick = () => {
    logEvent('use_case_card_clicked', {
      use_case_id: config.id,
      segment: config.segment,
    });
  };

  const handleCardHover = () => {
    logEvent('use_case_card_hovered', {
      use_case_id: config.id,
      segment: config.segment,
    });
  };

  cardElement.addEventListener('click', handleCardClick);
  cardElement.addEventListener('mouseenter', handleCardHover, { once: true });

  return () => {
    cardElement.removeEventListener('click', handleCardClick);
    cardElement.removeEventListener('mouseenter', handleCardHover);
  };
};

/**
 * Creates and renders use case card
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} config - Card configuration
 * @returns {Object} Card instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const createUseCaseCard = (target, config) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Use case card target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const validatedConfig = validateConfig(config);

    const cardHTML = createUseCaseCardHTML(validatedConfig);
    targetElement.innerHTML = cardHTML;

    const cardElement = targetElement.querySelector('.use-case-card');
    if (!cardElement) {
      throw new Error('Failed to create use case card element');
    }

    const cleanupFunctions = [];

    const animationCleanup = initializeMetricAnimations(cardElement, validatedConfig);
    cleanupFunctions.push(animationCleanup);

    const interactionCleanup = initializeCardInteractions(cardElement, validatedConfig);
    cleanupFunctions.push(interactionCleanup);

    const renderTime = performance.now() - startTime;
    logEvent('use_case_card_rendered', {
      use_case_id: validatedConfig.id,
      render_time_ms: renderTime.toFixed(2),
      metric_count: validatedConfig.metrics.length,
    });

    return {
      element: cardElement,
      config: validatedConfig,
      cleanup: () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
        logEvent('use_case_card_cleanup', {
          use_case_id: validatedConfig.id,
        });
      },
    };
  } catch (error) {
    logEvent('use_case_card_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create use case card: ${error.message}`, {
      cause: error,
    });
  }
};

export default createUseCaseCard;