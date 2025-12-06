/**
 * CTA Button Component
 * 
 * Reusable call-to-action button with multiple variants, loading states,
 * hover effects, and comprehensive accessibility features. Includes click
 * tracking and analytics integration.
 * 
 * @generated-from: task-id:TASK-007
 * @modifies: index.html
 * @dependencies: ["TASK-006"]
 */

/**
 * Button variant types
 * @typedef {'primary' | 'secondary' | 'outline' | 'ghost'} ButtonVariant
 */

/**
 * Button size types
 * @typedef {'sm' | 'md' | 'lg' | 'xl'} ButtonSize
 */

/**
 * CTA button configuration
 * @typedef {Object} CTAButtonConfig
 * @property {string} text - Button text content
 * @property {string} [href] - Link URL (creates anchor instead of button)
 * @property {ButtonVariant} [variant='primary'] - Button style variant
 * @property {ButtonSize} [size='md'] - Button size
 * @property {string} [icon] - Icon identifier (optional)
 * @property {'left' | 'right'} [iconPosition='right'] - Icon position
 * @property {boolean} [loading=false] - Loading state
 * @property {boolean} [disabled=false] - Disabled state
 * @property {boolean} [fullWidth=false] - Full width button
 * @property {string} [ariaLabel] - Custom aria-label
 * @property {Function} [onClick] - Click handler
 * @property {Object} [analytics] - Analytics configuration
 * @property {string} [analytics.event] - Analytics event name
 * @property {Object} [analytics.properties] - Analytics event properties
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [attributes] - Additional HTML attributes
 */

/**
 * Icon SVG paths
 * @private
 */
const ICON_PATHS = Object.freeze({
  arrow: 'M13 7l5 5m0 0l-5 5m5-5H6',
  'arrow-up': 'M7 11l5-5m0 0l5 5m-5-5v12',
  check: 'M5 13l4 4L19 7',
  'external-link': 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  play: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  rocket: 'M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
});

/**
 * Size class mappings
 * @private
 */
const SIZE_CLASSES = Object.freeze({
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
});

/**
 * Icon size mappings
 * @private
 */
const ICON_SIZES = Object.freeze({
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
});

/**
 * Default configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  variant: 'primary',
  size: 'md',
  iconPosition: 'right',
  loading: false,
  disabled: false,
  fullWidth: false,
  analytics: {
    event: 'cta_click',
    properties: {},
  },
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
    component: 'cta-button',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[CTAButton]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'cta',
      ...context,
    });
  }
};

/**
 * Validates button configuration
 * @param {Object} config - Configuration to validate
 * @returns {CTAButtonConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('CTA button configuration must be an object');
  }

  if (typeof config.text !== 'string' || !config.text.trim()) {
    throw new TypeError('Button text must be a non-empty string');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (validated.href !== undefined && typeof validated.href !== 'string') {
    throw new TypeError('href must be a string');
  }

  const validVariants = ['primary', 'secondary', 'outline', 'ghost'];
  if (!validVariants.includes(validated.variant)) {
    throw new TypeError(`variant must be one of: ${validVariants.join(', ')}`);
  }

  const validSizes = ['sm', 'md', 'lg', 'xl'];
  if (!validSizes.includes(validated.size)) {
    throw new TypeError(`size must be one of: ${validSizes.join(', ')}`);
  }

  if (validated.icon !== undefined && typeof validated.icon !== 'string') {
    throw new TypeError('icon must be a string');
  }

  const validIconPositions = ['left', 'right'];
  if (!validIconPositions.includes(validated.iconPosition)) {
    throw new TypeError(`iconPosition must be one of: ${validIconPositions.join(', ')}`);
  }

  if (typeof validated.loading !== 'boolean') {
    throw new TypeError('loading must be a boolean');
  }

  if (typeof validated.disabled !== 'boolean') {
    throw new TypeError('disabled must be a boolean');
  }

  if (typeof validated.fullWidth !== 'boolean') {
    throw new TypeError('fullWidth must be a boolean');
  }

  if (validated.onClick !== undefined && typeof validated.onClick !== 'function') {
    throw new TypeError('onClick must be a function');
  }

  if (validated.analytics && typeof validated.analytics !== 'object') {
    throw new TypeError('analytics must be an object');
  }

  return validated;
};

/**
 * Creates icon SVG HTML
 * @param {string} iconName - Icon name
 * @param {ButtonSize} size - Icon size
 * @returns {string} Icon SVG HTML
 */
const createIconHTML = (iconName, size) => {
  const path = ICON_PATHS[iconName] || ICON_PATHS.arrow;
  const sizeClass = ICON_SIZES[size];

  return `
    <svg class="${sizeClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}" />
    </svg>
  `;
};

/**
 * Creates loading spinner HTML
 * @param {ButtonSize} size - Spinner size
 * @returns {string} Spinner HTML
 */
const createSpinnerHTML = (size) => {
  const sizeClass = ICON_SIZES[size];

  return `
    <svg class="${sizeClass} animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `;
};

/**
 * Gets variant CSS classes
 * @param {ButtonVariant} variant - Button variant
 * @returns {string} CSS classes
 */
const getVariantClasses = (variant) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };

  return variants[variant] || variants.primary;
};

/**
 * Creates button HTML
 * @param {CTAButtonConfig} config - Button configuration
 * @returns {string} Button HTML
 */
const createButtonHTML = (config) => {
  const {
    text,
    href,
    variant,
    size,
    icon,
    iconPosition,
    loading,
    disabled,
    fullWidth,
    ariaLabel,
    className,
    attributes,
  } = config;

  const tag = href ? 'a' : 'button';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = SIZE_CLASSES[size];
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';
  const additionalClasses = className || '';

  const iconHTML = icon && !loading ? createIconHTML(icon, size) : '';
  const spinnerHTML = loading ? createSpinnerHTML(size) : '';

  const contentHTML = `
    ${loading ? spinnerHTML : ''}
    ${!loading && icon && iconPosition === 'left' ? iconHTML : ''}
    <span class="${loading ? 'opacity-0' : ''}">${text}</span>
    ${!loading && icon && iconPosition === 'right' ? iconHTML : ''}
  `;

  const baseAttributes = {
    class: `btn ${variantClasses} ${sizeClasses} ${widthClass} ${disabledClass} ${additionalClasses}`.trim(),
    'aria-label': ariaLabel || text,
    'data-cta-button': 'true',
    'data-variant': variant,
    'data-size': size,
    ...(attributes || {}),
  };

  if (tag === 'button') {
    baseAttributes.type = 'button';
    baseAttributes.disabled = disabled || loading;
  } else {
    baseAttributes.href = href;
    baseAttributes.role = 'button';
    if (disabled || loading) {
      baseAttributes['aria-disabled'] = 'true';
      baseAttributes.tabindex = '-1';
    }
  }

  if (loading) {
    baseAttributes['aria-busy'] = 'true';
  }

  const attributesString = Object.entries(baseAttributes)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      return `${key}="${value}"`;
    })
    .filter(Boolean)
    .join(' ');

  return `<${tag} ${attributesString}>${contentHTML}</${tag}>`;
};

/**
 * Attaches event listeners to button
 * @param {HTMLElement} buttonElement - Button element
 * @param {CTAButtonConfig} config - Button configuration
 * @returns {Function} Cleanup function
 */
const attachEventListeners = (buttonElement, config) => {
  const { onClick, analytics, disabled, loading, href } = config;

  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }

    const clickContext = {
      button_text: config.text,
      button_variant: config.variant,
      button_size: config.size,
      has_icon: !!config.icon,
      timestamp: new Date().toISOString(),
    };

    logEvent(analytics.event, {
      ...clickContext,
      ...analytics.properties,
    });

    if (onClick) {
      try {
        onClick(event);
      } catch (error) {
        logEvent('cta_click_error', {
          error_message: error.message,
          error_stack: error.stack,
          ...clickContext,
        });
        throw error;
      }
    }

    if (href && href.startsWith('#')) {
      event.preventDefault();
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        targetElement.focus({ preventScroll: true });
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (buttonElement.tagName === 'A') {
        event.preventDefault();
        handleClick(event);
      }
    }
  };

  buttonElement.addEventListener('click', handleClick);
  buttonElement.addEventListener('keydown', handleKeyDown);

  return () => {
    buttonElement.removeEventListener('click', handleClick);
    buttonElement.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Creates CTA button and renders it into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} customConfig - Button configuration
 * @returns {Object} Button instance with update and cleanup methods
 * @throws {Error} If target not found or configuration invalid
 */
export const createCTAButton = (target, customConfig) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `CTA button target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const buttonHTML = createButtonHTML(config);
    targetElement.innerHTML = buttonHTML;

    const buttonElement = targetElement.querySelector('[data-cta-button]');
    if (!buttonElement) {
      throw new Error('Failed to create CTA button element');
    }

    const cleanup = attachEventListeners(buttonElement, config);

    const renderTime = performance.now() - startTime;
    logEvent('cta_button_rendered', {
      render_time_ms: renderTime.toFixed(2),
      variant: config.variant,
      size: config.size,
      has_icon: !!config.icon,
      has_href: !!config.href,
    });

    return {
      element: buttonElement,
      config,
      update: (newConfig) => {
        cleanup();
        const updatedConfig = validateConfig({ ...config, ...newConfig });
        const updatedHTML = createButtonHTML(updatedConfig);
        targetElement.innerHTML = updatedHTML;
        const updatedElement = targetElement.querySelector('[data-cta-button]');
        const newCleanup = attachEventListeners(updatedElement, updatedConfig);
        
        logEvent('cta_button_updated', {
          variant: updatedConfig.variant,
          size: updatedConfig.size,
        });

        return {
          element: updatedElement,
          config: updatedConfig,
          update: (nextConfig) => this.update(nextConfig),
          cleanup: newCleanup,
        };
      },
      cleanup: () => {
        cleanup();
        logEvent('cta_button_cleanup');
      },
    };
  } catch (error) {
    logEvent('cta_button_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create CTA button: ${error.message}`, {
      cause: error,
    });
  }
};

export default createCTAButton;