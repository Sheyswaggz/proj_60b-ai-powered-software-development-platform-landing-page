/**
 * Newsletter Signup Component
 *
 * Production-ready newsletter signup form with comprehensive validation,
 * GDPR compliance, error handling, accessibility features, analytics
 * integration, and A/B testing experiment support. Implements progressive
 * enhancement with client-side validation and proper error recovery.
 *
 * @generated-from: task-id:TASK-007
 * @modifies: index.html
 * @dependencies: ["TASK-006", "experiment-manager.js", "newsletter-config.js", "event-tracking.js"]
 */

/**
 * Newsletter signup configuration
 * @typedef {Object} NewsletterConfig
 * @property {string} [submitUrl='/api/newsletter'] - Submission endpoint
 * @property {string} [method='POST'] - HTTP method
 * @property {boolean} [enableAnalytics=true] - Enable analytics tracking
 * @property {boolean} [requireConsent=true] - Require GDPR consent
 * @property {Function} [onSuccess] - Success callback
 * @property {Function} [onError] - Error callback
 * @property {Function} [onSubmit] - Submit callback
 * @property {boolean} [showSuccessMessage=true] - Show success message
 * @property {boolean} [resetOnSuccess=true] - Reset form on success
 * @property {number} [submitTimeout=30000] - Submit timeout in ms
 * @property {string} [className] - Additional CSS classes
 * @property {string} [placeholder='Enter your email'] - Email placeholder
 * @property {string} [buttonText='Subscribe'] - Submit button text
 * @property {string} [consentText] - Custom consent text
 * @property {boolean} [enableExperiment=false] - Enable A/B testing experiment
 * @property {string} [experimentId='newsletter_signup_optimization'] - Experiment ID
 * @property {string} [userId] - User ID for experiment assignment
 */

/**
 * Validation result
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Validation status
 * @property {string} [error] - Error message
 */

/**
 * Default configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  submitUrl: '/api/newsletter',
  method: 'POST',
  enableAnalytics: true,
  requireConsent: true,
  showSuccessMessage: true,
  resetOnSuccess: true,
  submitTimeout: 30000,
  placeholder: 'Enter your email',
  buttonText: 'Subscribe',
  consentText: 'I agree to receive marketing emails and accept the privacy policy',
  enableExperiment: false,
  experimentId: 'newsletter_signup_optimization',
  userId: null,
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
    component: 'newsletter-signup',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[NewsletterSignup]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'newsletter',
      ...context,
    });
  }
};

/**
 * Sanitizes HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeHTML = (str) => {
  if (typeof str !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Validates email address
 * @param {string} email - Email to validate
 * @returns {ValidationResult} Validation result
 */
const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'Email must not exceed 254 characters' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  const localPart = trimmedEmail.split('@')[0];
  if (localPart.length > 64) {
    return { valid: false, error: 'Email local part too long' };
  }

  const domainPart = trimmedEmail.split('@')[1];
  if (domainPart.length > 255) {
    return { valid: false, error: 'Email domain too long' };
  }

  const invalidPatterns = [
    /\.\./,
    /^[.-]/,
    /[.-]$/,
    /@.*@/,
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(trimmedEmail)) {
      return { valid: false, error: 'Email contains invalid patterns' };
    }
  }

  return { valid: true };
};

/**
 * Validates configuration
 * @param {Object} config - Configuration to validate
 * @returns {NewsletterConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Newsletter signup configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.submitUrl !== 'string') {
    throw new TypeError('submitUrl must be a string');
  }

  if (!['GET', 'POST', 'PUT'].includes(validated.method)) {
    throw new TypeError('method must be GET, POST, or PUT');
  }

  if (typeof validated.enableAnalytics !== 'boolean') {
    throw new TypeError('enableAnalytics must be a boolean');
  }

  if (typeof validated.requireConsent !== 'boolean') {
    throw new TypeError('requireConsent must be a boolean');
  }

  if (validated.onSuccess !== undefined && typeof validated.onSuccess !== 'function') {
    throw new TypeError('onSuccess must be a function');
  }

  if (validated.onError !== undefined && typeof validated.onError !== 'function') {
    throw new TypeError('onError must be a function');
  }

  if (validated.onSubmit !== undefined && typeof validated.onSubmit !== 'function') {
    throw new TypeError('onSubmit must be a function');
  }

  if (typeof validated.showSuccessMessage !== 'boolean') {
    throw new TypeError('showSuccessMessage must be a boolean');
  }

  if (typeof validated.resetOnSuccess !== 'boolean') {
    throw new TypeError('resetOnSuccess must be a boolean');
  }

  if (typeof validated.submitTimeout !== 'number' || validated.submitTimeout <= 0) {
    throw new TypeError('submitTimeout must be a positive number');
  }

  if (typeof validated.placeholder !== 'string') {
    throw new TypeError('placeholder must be a string');
  }

  if (typeof validated.buttonText !== 'string') {
    throw new TypeError('buttonText must be a string');
  }

  if (validated.consentText !== undefined && typeof validated.consentText !== 'string') {
    throw new TypeError('consentText must be a string');
  }

  return validated;
};

/**
 * Creates newsletter signup form HTML
 * @param {NewsletterConfig} config - Form configuration
 * @param {Object|null} variant - Experiment variant configuration
 * @returns {string} Form HTML
 */
const createFormHTML = (config, variant = null) => {
  const effectiveConfig = variant
    ? {
        ...config,
        placeholder: variant.placeholder || config.placeholder,
        buttonText: variant.buttonText || config.buttonText,
        consentText: variant.consentText || config.consentText,
      }
    : config;

  const additionalClasses = effectiveConfig.className || '';
  const layoutClass = variant?.formLayout === 'vertical' ? 'layout-vertical' : 'layout-horizontal';
  const spacingClass = variant?.styling?.spacing
    ? `spacing-${variant.styling.spacing}`
    : 'spacing-normal';
  const consentText =
    effectiveConfig.consentText || effectiveConfig.requireConsent
      ? DEFAULT_CONFIG.consentText
      : '';

  const headlineHTML = variant
    ? `
    <div class="newsletter-header">
      <h3 class="newsletter-headline ${variant.styling?.headlineSize || 'text-2xl'}">${sanitizeHTML(variant.headline)}</h3>
      <p class="newsletter-subheadline ${variant.styling?.subheadlineSize || 'text-base'}">${sanitizeHTML(variant.subheadline)}</p>
      ${
        variant.showIncentive && variant.incentiveText
          ? `<div class="newsletter-incentive">${sanitizeHTML(variant.incentiveText)}</div>`
          : ''
      }
    </div>
  `
    : '';

  return `
    <form
      class="newsletter-signup ${additionalClasses} ${layoutClass} ${spacingClass}"
      data-newsletter-form="true"
      data-variant-id="${variant?.id || 'default'}"
      novalidate
      aria-label="Newsletter signup form"
    >
      <div class="newsletter-content">
        ${headlineHTML}
        <div class="newsletter-input-wrapper">
          <label for="newsletter-email" class="sr-only">Email Address</label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            class="newsletter-input ${variant?.styling?.inputStyle || 'default'}"
            placeholder="${sanitizeHTML(effectiveConfig.placeholder)}"
            required
            maxlength="254"
            autocomplete="email"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="newsletter-error newsletter-consent"
          />
          <button
            type="submit"
            class="newsletter-button ${variant?.styling?.buttonStyle || 'primary'}"
            data-submit-button="true"
          >
            <span class="button-text">${sanitizeHTML(effectiveConfig.buttonText)}</span>
            <svg class="button-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        ${
          effectiveConfig.requireConsent
            ? `
          <div class="newsletter-consent">
            <label class="consent-label">
              <input
                type="checkbox"
                id="newsletter-consent"
                name="consent"
                class="consent-checkbox"
                required
                aria-required="true"
              />
              <span class="consent-text">${sanitizeHTML(consentText)}</span>
            </label>
          </div>
        `
            : ''
        }

        <div id="newsletter-error" class="newsletter-error" role="alert" aria-live="polite"></div>
        <div class="newsletter-message" role="status" aria-live="polite" aria-atomic="true"></div>
      </div>
    </form>
  `;
};

/**
 * Shows form message
 * @param {HTMLElement} messageElement - Message element
 * @param {string} message - Message text
 * @param {'success' | 'error' | 'info'} type - Message type
 */
const showMessage = (messageElement, message, type = 'info') => {
  messageElement.textContent = sanitizeHTML(message);
  messageElement.className = `newsletter-message newsletter-message-${type}`;
  messageElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
};

/**
 * Clears form message
 * @param {HTMLElement} messageElement - Message element
 */
const clearMessage = (messageElement) => {
  messageElement.textContent = '';
  messageElement.className = 'newsletter-message';
};

/**
 * Shows error message
 * @param {HTMLElement} errorElement - Error element
 * @param {string} error - Error message
 */
const showError = (errorElement, error) => {
  errorElement.textContent = sanitizeHTML(error);
  errorElement.style.display = 'block';
};

/**
 * Clears error message
 * @param {HTMLElement} errorElement - Error element
 */
const clearError = (errorElement) => {
  errorElement.textContent = '';
  errorElement.style.display = 'none';
};

/**
 * Sets form loading state
 * @param {HTMLFormElement} formElement - Form element
 * @param {boolean} loading - Loading state
 */
const setLoadingState = (formElement, loading) => {
  const submitButton = formElement.querySelector('[data-submit-button]');
  const emailInput = formElement.querySelector('#newsletter-email');
  const consentCheckbox = formElement.querySelector('#newsletter-consent');

  if (loading) {
    formElement.classList.add('is-loading');
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    emailInput.disabled = true;
    
    if (consentCheckbox) {
      consentCheckbox.disabled = true;
    }

    const buttonText = submitButton.querySelector('.button-text');
    buttonText.textContent = 'Subscribing...';
  } else {
    formElement.classList.remove('is-loading');
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
    emailInput.disabled = false;
    
    if (consentCheckbox) {
      consentCheckbox.disabled = false;
    }

    const buttonText = submitButton.querySelector('.button-text');
    buttonText.textContent = formElement.dataset.originalButtonText || 'Subscribe';
  }
};

/**
 * Submits newsletter signup
 * @param {string} url - Submission URL
 * @param {Object} data - Form data
 * @param {string} method - HTTP method
 * @param {number} timeout - Request timeout
 * @returns {Promise<Object>} Response data
 */
const submitSignup = async (url, data, method, timeout) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    
    throw error;
  }
};

/**
 * Validates form
 * @param {HTMLFormElement} formElement - Form element
 * @param {NewsletterConfig} config - Form configuration
 * @returns {Object|null} Form data if valid, null otherwise
 */
const validateForm = (formElement, config) => {
  const emailInput = formElement.querySelector('#newsletter-email');
  const consentCheckbox = formElement.querySelector('#newsletter-consent');
  const errorElement = formElement.querySelector('#newsletter-error');

  clearError(errorElement);

  const emailValidation = validateEmail(emailInput.value);
  if (!emailValidation.valid) {
    emailInput.setAttribute('aria-invalid', 'true');
    showError(errorElement, emailValidation.error);
    emailInput.focus();
    
    logEvent('newsletter_validation_error', {
      field: 'email',
      error: emailValidation.error,
    });
    
    return null;
  }

  if (config.requireConsent && consentCheckbox && !consentCheckbox.checked) {
    showError(errorElement, 'Please accept the privacy policy to continue');
    consentCheckbox.focus();
    
    logEvent('newsletter_validation_error', {
      field: 'consent',
      error: 'Consent not provided',
    });
    
    return null;
  }

  emailInput.setAttribute('aria-invalid', 'false');

  return {
    email: emailInput.value.trim(),
    consent: config.requireConsent ? consentCheckbox?.checked : true,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Handles form submission
 * @param {Event} event - Submit event
 * @param {HTMLFormElement} formElement - Form element
 * @param {NewsletterConfig} config - Form configuration
 * @param {Object|null} experimentContext - Experiment context
 */
const handleSubmit = async (event, formElement, config, experimentContext = null) => {
  event.preventDefault();

  const messageElement = formElement.querySelector('.newsletter-message');
  const errorElement = formElement.querySelector('#newsletter-error');

  clearMessage(messageElement);
  clearError(errorElement);

  const formData = validateForm(formElement, config);
  if (!formData) {
    return;
  }

  const eventProps = {
    email_domain: formData.email.split('@')[1],
    ...(experimentContext
      ? {
          experimentId: experimentContext.experimentId,
          variantId: experimentContext.variantId,
        }
      : {}),
  };

  logEvent('newsletter_submit_attempt', eventProps);

  if (typeof window !== 'undefined' && window.trackNewsletterSubmitAttempt) {
    window.trackNewsletterSubmitAttempt(eventProps);
  }

  if (config.onSubmit) {
    try {
      const shouldContinue = await config.onSubmit(formData);
      if (shouldContinue === false) {
        logEvent('newsletter_submit_cancelled');
        return;
      }
    } catch (error) {
      logEvent('newsletter_submit_callback_error', {
        error_message: error.message,
      });
    }
  }

  setLoadingState(formElement, true);

  const startTime = performance.now();

  try {
    const submitData = {
      ...formData,
      ...(experimentContext
        ? {
            experiment: {
              id: experimentContext.experimentId,
              variant: experimentContext.variantId,
            },
          }
        : {}),
    };

    const response = await submitSignup(
      config.submitUrl,
      submitData,
      config.method,
      config.submitTimeout
    );

    const responseTime = performance.now() - startTime;

    const successProps = {
      response_time_ms: responseTime.toFixed(2),
      ...(experimentContext
        ? {
            experimentId: experimentContext.experimentId,
            variantId: experimentContext.variantId,
          }
        : {}),
    };

    logEvent('newsletter_submit_success', successProps);

    if (typeof window !== 'undefined' && window.trackNewsletterSubmitSuccess) {
      window.trackNewsletterSubmitSuccess({
        ...successProps,
        emailDomain: formData.email.split('@')[1],
        responseTime,
      });
    }

    if (config.showSuccessMessage) {
      showMessage(
        messageElement,
        'Thank you for subscribing! Please check your email to confirm.',
        'success'
      );
    }

    if (config.resetOnSuccess) {
      formElement.reset();
      const emailInput = formElement.querySelector('#newsletter-email');
      emailInput.setAttribute('aria-invalid', 'false');
    }

    if (config.onSuccess) {
      try {
        await config.onSuccess(response, formData);
      } catch (error) {
        logEvent('newsletter_success_callback_error', {
          error_message: error.message,
        });
      }
    }
  } catch (error) {
    const errorProps = {
      error_message: error.message,
      error_stack: error.stack,
      ...(experimentContext
        ? {
            experimentId: experimentContext.experimentId,
            variantId: experimentContext.variantId,
          }
        : {}),
    };

    logEvent('newsletter_submit_error', errorProps);

    if (typeof window !== 'undefined' && window.trackNewsletterSubmitError) {
      window.trackNewsletterSubmitError({
        error: error.message,
        ...(experimentContext
          ? {
              experimentId: experimentContext.experimentId,
              variantId: experimentContext.variantId,
            }
          : {}),
      });
    }

    showMessage(
      messageElement,
      error.message || 'Failed to subscribe. Please try again.',
      'error'
    );

    if (config.onError) {
      try {
        await config.onError(error, formData);
      } catch (callbackError) {
        logEvent('newsletter_error_callback_error', {
          error_message: callbackError.message,
        });
      }
    }
  } finally {
    setLoadingState(formElement, false);
  }
};

/**
 * Attaches event listeners to form
 * @param {HTMLFormElement} formElement - Form element
 * @param {NewsletterConfig} config - Form configuration
 * @param {Object|null} experimentContext - Experiment context
 * @returns {Function} Cleanup function
 */
const attachEventListeners = (formElement, config, experimentContext = null) => {
  const submitHandler = event => handleSubmit(event, formElement, config, experimentContext);

  const emailInput = formElement.querySelector('#newsletter-email');
  const errorElement = formElement.querySelector('#newsletter-error');
  const consentCheckbox = formElement.querySelector('#newsletter-consent');

  const inputHandler = () => {
    if (errorElement.textContent) {
      clearError(errorElement);
      emailInput.setAttribute('aria-invalid', 'false');
    }
  };

  const blurHandler = () => {
    const value = emailInput.value.trim();
    if (value) {
      const validation = validateEmail(value);
      if (!validation.valid) {
        emailInput.setAttribute('aria-invalid', 'true');
        showError(errorElement, validation.error);

        if (typeof window !== 'undefined' && window.trackNewsletterValidationError) {
          window.trackNewsletterValidationError({
            field: 'email',
            error: validation.error,
            ...(experimentContext
              ? {
                  experimentId: experimentContext.experimentId,
                  variantId: experimentContext.variantId,
                }
              : {}),
          });
        }
      }
    }
  };

  const focusHandler = () => {
    if (typeof window !== 'undefined' && window.trackNewsletterFormFocus) {
      window.trackNewsletterFormFocus({
        field: 'email',
        ...(experimentContext
          ? {
              experimentId: experimentContext.experimentId,
              variantId: experimentContext.variantId,
            }
          : {}),
      });
    }
  };

  const consentChangeHandler = () => {
    if (consentCheckbox && consentCheckbox.checked) {
      if (typeof window !== 'undefined' && window.trackNewsletterConsentAccepted) {
        window.trackNewsletterConsentAccepted({
          ...(experimentContext
            ? {
                experimentId: experimentContext.experimentId,
                variantId: experimentContext.variantId,
              }
            : {}),
        });
      }
    }
  };

  formElement.addEventListener('submit', submitHandler);
  emailInput.addEventListener('input', inputHandler);
  emailInput.addEventListener('blur', blurHandler);
  emailInput.addEventListener('focus', focusHandler);

  if (consentCheckbox) {
    consentCheckbox.addEventListener('change', consentChangeHandler);
  }

  const submitButton = formElement.querySelector('[data-submit-button]');
  const buttonText = submitButton.querySelector('.button-text');
  formElement.dataset.originalButtonText = buttonText.textContent;

  return () => {
    formElement.removeEventListener('submit', submitHandler);
    emailInput.removeEventListener('input', inputHandler);
    emailInput.removeEventListener('blur', blurHandler);
    emailInput.removeEventListener('focus', focusHandler);

    if (consentCheckbox) {
      consentCheckbox.removeEventListener('change', consentChangeHandler);
    }
  };
};

/**
 * Gets experiment variant for user
 * @param {NewsletterConfig} config - Configuration
 * @returns {Object|null} Experiment variant or null
 * @private
 */
const getExperimentVariant = async config => {
  if (!config.enableExperiment) {
    return null;
  }

  try {
    if (typeof window !== 'undefined' && window.getVariantForUser) {
      const variant = window.getVariantForUser(config.experimentId, config.userId);

      if (variant && typeof window.trackExperimentExposure === 'function') {
        window.trackExperimentExposure({
          experimentId: config.experimentId,
          variantId: variant.id,
        });
      }

      return variant;
    }

    return null;
  } catch (error) {
    logEvent('experiment_variant_error', {
      experimentId: config.experimentId,
      error: error.message,
    });
    return null;
  }
};

/**
 * Creates newsletter signup form and renders it into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} customConfig - Form configuration
 * @returns {Promise<Object>} Form instance with methods
 * @throws {Error} If target not found or configuration invalid
 */
export const createNewsletterSignup = async (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Newsletter signup target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const variant = await getExperimentVariant(config);

    const experimentContext = variant
      ? {
          experimentId: config.experimentId,
          variantId: variant.id,
          variantName: variant.name,
        }
      : null;

    const formHTML = createFormHTML(config, variant);
    targetElement.innerHTML = formHTML;

    const formElement = targetElement.querySelector('[data-newsletter-form]');
    if (!formElement) {
      throw new Error('Failed to create newsletter signup form element');
    }

    const cleanup = attachEventListeners(formElement, config, experimentContext);

    const renderTime = performance.now() - startTime;
    const renderProps = {
      render_time_ms: renderTime.toFixed(2),
      require_consent: config.requireConsent,
      ...(experimentContext
        ? {
            experimentId: experimentContext.experimentId,
            variantId: experimentContext.variantId,
          }
        : {}),
    };

    logEvent('newsletter_signup_rendered', renderProps);

    if (typeof window !== 'undefined' && window.trackNewsletterFormView) {
      window.trackNewsletterFormView({
        ...(experimentContext
          ? {
              experimentId: experimentContext.experimentId,
              variantId: experimentContext.variantId,
            }
          : {}),
      });
    }

    return {
      element: formElement,
      config,
      variant,
      experimentContext,
      reset: () => {
        formElement.reset();
        const emailInput = formElement.querySelector('#newsletter-email');
        const errorElement = formElement.querySelector('#newsletter-error');
        const messageElement = formElement.querySelector('.newsletter-message');

        emailInput.setAttribute('aria-invalid', 'false');
        clearError(errorElement);
        clearMessage(messageElement);

        logEvent('newsletter_signup_reset');
      },
      validate: () => {
        const formData = validateForm(formElement, config);
        return formData !== null;
      },
      getData: () => {
        const emailInput = formElement.querySelector('#newsletter-email');
        const consentCheckbox = formElement.querySelector('#newsletter-consent');

        return {
          email: emailInput.value.trim(),
          consent: config.requireConsent ? consentCheckbox?.checked : true,
        };
      },
      cleanup: () => {
        cleanup();
        logEvent('newsletter_signup_cleanup');
      },
    };
  } catch (error) {
    logEvent('newsletter_signup_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create newsletter signup: ${error.message}`, {
      cause: error,
    });
  }
};

export default createNewsletterSignup;