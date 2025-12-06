/**
 * Feature Card Component
 * 
 * Reusable feature card with icon, title, description, and hover animations.
 * Includes accessibility features and responsive design.
 * 
 * @generated-from: task-id:TASK-004
 * @modifies: features-section.js
 * @dependencies: []
 */

/**
 * Feature card configuration
 * @typedef {Object} FeatureCardConfig
 * @property {string} id - Unique feature identifier
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 * @property {Array<string>} benefits - Feature benefits list
 * @property {string} icon - SVG icon markup
 * @property {number} order - Display order
 * @property {boolean} [enableHover=true] - Enable hover effects
 * @property {string} [variant='default'] - Card variant (default, compact, detailed)
 */

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
    component: 'feature-card',
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[FeatureCard]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'feature_card',
      ...context,
    });
  }
};

/**
 * Validates feature card configuration
 * @param {Object} config - Configuration to validate
 * @returns {FeatureCardConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Feature card configuration must be an object');
  }

  if (typeof config.id !== 'string' || !config.id.trim()) {
    throw new TypeError('Feature card must have valid id');
  }

  if (typeof config.title !== 'string' || !config.title.trim()) {
    throw new TypeError('Feature card must have valid title');
  }

  if (typeof config.description !== 'string' || !config.description.trim()) {
    throw new TypeError('Feature card must have valid description');
  }

  if (!Array.isArray(config.benefits) || config.benefits.length === 0) {
    throw new TypeError('Feature card must have valid benefits array');
  }

  config.benefits.forEach((benefit, index) => {
    if (typeof benefit !== 'string' || !benefit.trim()) {
      throw new TypeError(`Benefit at index ${index} must be a non-empty string`);
    }
  });

  if (typeof config.icon !== 'string' || !config.icon.trim()) {
    throw new TypeError('Feature card must have valid icon');
  }

  if (typeof config.order !== 'number' || config.order < 1) {
    throw new TypeError('Feature card must have valid order (positive number)');
  }

  const validated = {
    ...config,
    enableHover: config.enableHover !== false,
    variant: config.variant || 'default',
  };

  const validVariants = ['default', 'compact', 'detailed'];
  if (!validVariants.includes(validated.variant)) {
    throw new TypeError(`Invalid variant: ${validated.variant}. Must be one of: ${validVariants.join(', ')}`);
  }

  return validated;
};

/**
 * Sanitizes HTML content to prevent XSS
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHTML = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Creates benefits list HTML
 * @param {Array<string>} benefits - Benefits array
 * @param {string} featureId - Feature identifier for unique IDs
 * @returns {string} Benefits list HTML
 */
const createBenefitsHTML = (benefits, featureId) => {
  return benefits
    .map(
      (benefit, index) => `
        <li class="flex items-start gap-2" role="listitem">
          <svg 
            class="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            focusable="false"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-neutral-600 dark:text-neutral-300">${sanitizeHTML(benefit)}</span>
        </li>
      `
    )
    .join('');
};

/**
 * Creates feature card HTML
 * @param {FeatureCardConfig} config - Feature card configuration
 * @returns {string} Feature card HTML
 */
const createFeatureCardHTML = (config) => {
  const {
    id,
    title,
    description,
    benefits,
    icon,
    order,
    enableHover,
    variant,
  } = config;

  const hoverClasses = enableHover
    ? 'hover:shadow-2xl hover:border-primary-500 dark:hover:border-primary-400 group-hover:scale-110 group-hover:rotate-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:opacity-100'
    : '';

  const variantClasses = {
    default: 'p-8',
    compact: 'p-6',
    detailed: 'p-10',
  };

  const benefitsHTML = createBenefitsHTML(benefits, id);

  return `
    <div 
      class="feature-card group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg transition-all duration-300 ${variantClasses[variant]} border-2 border-transparent ${hoverClasses} h-full flex flex-col"
      data-feature-id="${id}"
      data-feature-order="${order}"
      data-feature-variant="${variant}"
      role="article"
      aria-labelledby="feature-${id}-title"
      aria-describedby="feature-${id}-description"
      tabindex="0"
    >
      <!-- Icon Container -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 transform transition-all duration-300 ${enableHover ? 'group-hover:scale-110 group-hover:rotate-3' : ''}" aria-hidden="true">
          ${icon}
        </div>
      </div>

      <!-- Feature Content -->
      <div class="flex-grow space-y-4">
        <h3 
          id="feature-${id}-title"
          class="text-2xl font-bold text-neutral-900 dark:text-white text-center transition-colors duration-300 ${enableHover ? 'group-hover:text-primary-600 dark:group-hover:text-primary-400' : ''}"
        >
          ${sanitizeHTML(title)}
        </h3>
        
        <p 
          id="feature-${id}-description"
          class="text-neutral-600 dark:text-neutral-300 leading-relaxed text-center"
        >
          ${sanitizeHTML(description)}
        </p>

        <!-- Benefits List -->
        <div class="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <ul class="space-y-3" role="list" aria-label="Feature benefits">
            ${benefitsHTML}
          </ul>
        </div>
      </div>

      <!-- Hover Effect Overlay -->
      ${enableHover ? `<div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>` : ''}
    </div>
  `;
};

/**
 * Tracks feature card interaction events
 * @param {string} featureId - Feature identifier
 * @param {string} action - Interaction action
 * @param {Object} metadata - Additional metadata
 */
const trackInteraction = (featureId, action, metadata = {}) => {
  logEvent('feature_card_interaction', {
    feature_id: featureId,
    action,
    timestamp: Date.now(),
    ...metadata,
  });
};

/**
 * Initializes feature card interactions
 * @param {HTMLElement} cardElement - Feature card element
 * @param {FeatureCardConfig} config - Feature card configuration
 * @returns {Function} Cleanup function
 */
const initializeFeatureCard = (cardElement, config) => {
  const startTime = performance.now();
  const cleanupFunctions = [];

  const featureId = config.id;
  let hoverStartTime = null;
  let focusStartTime = null;

  const handleMouseEnter = () => {
    hoverStartTime = Date.now();
    trackInteraction(featureId, 'hover_start');
  };

  const handleMouseLeave = () => {
    if (hoverStartTime) {
      const hoverDuration = Date.now() - hoverStartTime;
      trackInteraction(featureId, 'hover_end', { duration_ms: hoverDuration });
      hoverStartTime = null;
    }
  };

  const handleClick = (event) => {
    trackInteraction(featureId, 'click', {
      target: event.target.tagName,
      ctrl_key: event.ctrlKey,
      shift_key: event.shiftKey,
    });
  };

  const handleFocus = () => {
    focusStartTime = Date.now();
    trackInteraction(featureId, 'focus');
  };

  const handleBlur = () => {
    if (focusStartTime) {
      const focusDuration = Date.now() - focusStartTime;
      trackInteraction(featureId, 'blur', { duration_ms: focusDuration });
      focusStartTime = null;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      trackInteraction(featureId, 'keyboard_activate', { key: event.key });
      cardElement.click();
    }
  };

  if (config.enableHover) {
    cardElement.addEventListener('mouseenter', handleMouseEnter);
    cardElement.addEventListener('mouseleave', handleMouseLeave);
    cleanupFunctions.push(() => {
      cardElement.removeEventListener('mouseenter', handleMouseEnter);
      cardElement.removeEventListener('mouseleave', handleMouseLeave);
    });
  }

  cardElement.addEventListener('click', handleClick);
  cardElement.addEventListener('focus', handleFocus);
  cardElement.addEventListener('blur', handleBlur);
  cardElement.addEventListener('keydown', handleKeyDown);

  cleanupFunctions.push(() => {
    cardElement.removeEventListener('click', handleClick);
    cardElement.removeEventListener('focus', handleFocus);
    cardElement.removeEventListener('blur', handleBlur);
    cardElement.removeEventListener('keydown', handleKeyDown);
  });

  const initTime = performance.now() - startTime;
  logEvent('feature_card_initialized', {
    feature_id: featureId,
    init_time_ms: initTime.toFixed(2),
    variant: config.variant,
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('feature_card_cleanup', { feature_id: featureId });
  };
};

/**
 * Creates and renders a feature card
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} config - Feature card configuration
 * @returns {Object} Feature card instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const createFeatureCard = (target, config) => {
  const startTime = performance.now();

  try {
    const targetElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Feature card target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const validatedConfig = validateConfig(config);

    const cardHTML = createFeatureCardHTML(validatedConfig);
    targetElement.innerHTML = cardHTML;

    const cardElement = targetElement.querySelector('[data-feature-id]');
    if (!cardElement) {
      throw new Error('Failed to create feature card element');
    }

    const cleanup = initializeFeatureCard(cardElement, validatedConfig);

    const totalTime = performance.now() - startTime;
    logEvent('feature_card_rendered', {
      feature_id: validatedConfig.id,
      total_time_ms: totalTime.toFixed(2),
      variant: validatedConfig.variant,
    });

    return {
      element: cardElement,
      config: validatedConfig,
      cleanup,
      update: (newConfig) => {
        cleanup();
        return createFeatureCard(target, { ...validatedConfig, ...newConfig });
      },
    };
  } catch (error) {
    logEvent('feature_card_error', {
      error_message: error.message,
      error_stack: error.stack,
      config_id: config?.id,
    });
    throw new Error(`Failed to create feature card: ${error.message}`, {
      cause: error,
    });
  }
};

export default createFeatureCard;