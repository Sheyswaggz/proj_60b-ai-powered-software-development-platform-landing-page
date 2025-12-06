/**
 * Newsletter Signup Component
 * 
 * Production-ready newsletter signup form with comprehensive validation,
 * GDPR compliance, error handling, accessibility features, and analytics
 * integration. Implements progressive enhancement with client-side validation
 * and proper error recovery.
 * 
 * @generated-from: task-id:TASK-007
 * @modifies: index.html
 * @dependencies: ["TASK-006"]
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
 * @returns {string} Form HTML
 */
const createFormHTML = (config) => {
  const additionalClasses = config.className || '';
  const consentText = config.consentText || config.requireConsent ? DEFAULT_CONFIG.consentText : '';

  return `
    <form 
      class="newsletter-signup ${additionalClasses}" 
      data-newsletter-form="true"
      novalidate
      aria-label="Newsletter signup form"
    >
      <div class="newsletter-content">
        <div class="newsletter-input-wrapper">
          <label for="newsletter-email" class="sr-only">Email Address</label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            class="newsletter-input"
            placeholder="${sanitizeHTML(config.placeholder)}"
            required
            maxlength="254"
            autocomplete="email"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="newsletter-error newsletter-consent"
          />
          <button 
            type="submit" 
            class="newsletter-button"
            data-submit-button="true"
          >
            <span class="button-text">${sanitizeHTML(config.buttonText)}</span>
            <svg class="button-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        ${config.requireConsent ? `
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
        ` : ''}

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
 */
const handleSubmit = async (event, formElement, config) => {
  event.preventDefault();

  const messageElement = formElement.querySelector('.newsletter-message');
  const errorElement = formElement.querySelector('#newsletter-error');
  
  clearMessage(messageElement);
  clearError(errorElement);

  const formData = validateForm(formElement, config);
  if (!formData) {
    return;
  }

  logEvent('newsletter_submit_attempt', {
    email_domain: formData.email.split('@')[1],
  });

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

  try {
    const response = await submitSignup(
      config.submitUrl,
      formData,
      config.method,
      config.submitTimeout
    );

    logEvent('newsletter_submit_success', {
      response_time_ms: performance.now(),
    });

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
    logEvent('newsletter_submit_error', {
      error_message: error.message,
      error_stack: error.stack,
    });

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
 * @returns {Function} Cleanup function
 */
const attachEventListeners = (formElement, config) => {
  const submitHandler = (event) => handleSubmit(event, formElement, config);
  
  const emailInput = formElement.querySelector('#newsletter-email');
  const errorElement = formElement.querySelector('#newsletter-error');

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
      }
    }
  };

  formElement.addEventListener('submit', submitHandler);
  emailInput.addEventListener('input', inputHandler);
  emailInput.addEventListener('blur', blurHandler);

  const submitButton = formElement.querySelector('[data-submit-button]');
  const buttonText = submitButton.querySelector('.button-text');
  formElement.dataset.originalButtonText = buttonText.textContent;

  return () => {
    formElement.removeEventListener('submit', submitHandler);
    emailInput.removeEventListener('input', inputHandler);
    emailInput.removeEventListener('blur', blurHandler);
  };
};

/**
 * Creates newsletter signup form and renders it into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} customConfig - Form configuration
 * @returns {Object} Form instance with methods
 * @throws {Error} If target not found or configuration invalid
 */
export const createNewsletterSignup = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Newsletter signup target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const formHTML = createFormHTML(config);
    targetElement.innerHTML = formHTML;

    const formElement = targetElement.querySelector('[data-newsletter-form]');
    if (!formElement) {
      throw new Error('Failed to create newsletter signup form element');
    }

    const cleanup = attachEventListeners(formElement, config);

    const renderTime = performance.now() - startTime;
    logEvent('newsletter_signup_rendered', {
      render_time_ms: renderTime.toFixed(2),
      require_consent: config.requireConsent,
    });

    return {
      element: formElement,
      config,
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