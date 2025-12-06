/**
 * Contact Form Component
 * 
 * Production-ready contact form with comprehensive validation, error handling,
 * accessibility features, and analytics integration. Implements progressive
 * enhancement with client-side validation and proper error recovery.
 * 
 * @generated-from: task-id:TASK-007
 * @modifies: index.html
 * @dependencies: ["TASK-006"]
 */

/**
 * Form field configuration
 * @typedef {Object} FormField
 * @property {string} name - Field name
 * @property {string} type - Input type
 * @property {string} label - Field label
 * @property {string} placeholder - Placeholder text
 * @property {boolean} required - Required field
 * @property {Function} validate - Validation function
 * @property {string} errorMessage - Error message
 * @property {string} [autocomplete] - Autocomplete attribute
 * @property {number} [minLength] - Minimum length
 * @property {number} [maxLength] - Maximum length
 * @property {number} [rows] - Textarea rows
 */

/**
 * Contact form configuration
 * @typedef {Object} ContactFormConfig
 * @property {string} [submitUrl] - Form submission URL
 * @property {string} [method='POST'] - HTTP method
 * @property {boolean} [enableAnalytics=true] - Enable analytics tracking
 * @property {Function} [onSuccess] - Success callback
 * @property {Function} [onError] - Error callback
 * @property {Function} [onSubmit] - Submit callback
 * @property {Object} [customFields] - Custom field configurations
 * @property {boolean} [showSuccessMessage=true] - Show success message
 * @property {boolean} [resetOnSuccess=true] - Reset form on success
 * @property {number} [submitTimeout=30000] - Submit timeout in ms
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Form validation result
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Validation status
 * @property {string} [error] - Error message
 */

/**
 * Default form fields configuration
 * @private
 */
const DEFAULT_FIELDS = Object.freeze([
  {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
    autocomplete: 'name',
    minLength: 2,
    maxLength: 100,
    validate: (value) => {
      if (!value || value.trim().length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' };
      }
      if (value.length > 100) {
        return { valid: false, error: 'Name must not exceed 100 characters' };
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return { valid: false, error: 'Name contains invalid characters' };
      }
      return { valid: true };
    },
    errorMessage: 'Please enter your full name',
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'john@example.com',
    required: true,
    autocomplete: 'email',
    maxLength: 254,
    validate: (value) => {
      if (!value || !value.trim()) {
        return { valid: false, error: 'Email is required' };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, error: 'Please enter a valid email address' };
      }
      if (value.length > 254) {
        return { valid: false, error: 'Email must not exceed 254 characters' };
      }
      return { valid: true };
    },
    errorMessage: 'Please enter a valid email address',
  },
  {
    name: 'company',
    type: 'text',
    label: 'Company',
    placeholder: 'Acme Inc.',
    required: false,
    autocomplete: 'organization',
    maxLength: 100,
    validate: (value) => {
      if (!value || !value.trim()) {
        return { valid: true };
      }
      if (value.length > 100) {
        return { valid: false, error: 'Company name must not exceed 100 characters' };
      }
      return { valid: true };
    },
    errorMessage: 'Please enter a valid company name',
  },
  {
    name: 'message',
    type: 'textarea',
    label: 'Message',
    placeholder: 'Tell us about your project...',
    required: true,
    minLength: 10,
    maxLength: 1000,
    rows: 5,
    validate: (value) => {
      if (!value || value.trim().length < 10) {
        return { valid: false, error: 'Message must be at least 10 characters' };
      }
      if (value.length > 1000) {
        return { valid: false, error: 'Message must not exceed 1000 characters' };
      }
      return { valid: true };
    },
    errorMessage: 'Please enter your message (minimum 10 characters)',
  },
]);

/**
 * Default configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  submitUrl: '/api/contact',
  method: 'POST',
  enableAnalytics: true,
  showSuccessMessage: true,
  resetOnSuccess: true,
  submitTimeout: 30000,
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
    component: 'contact-form',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[ContactForm]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'contact_form',
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
 * Validates form configuration
 * @param {Object} config - Configuration to validate
 * @returns {ContactFormConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Contact form configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (validated.submitUrl !== undefined && typeof validated.submitUrl !== 'string') {
    throw new TypeError('submitUrl must be a string');
  }

  if (validated.method !== undefined && !['GET', 'POST', 'PUT'].includes(validated.method)) {
    throw new TypeError('method must be GET, POST, or PUT');
  }

  if (typeof validated.enableAnalytics !== 'boolean') {
    throw new TypeError('enableAnalytics must be a boolean');
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

  return validated;
};

/**
 * Creates form field HTML
 * @param {FormField} field - Field configuration
 * @returns {string} Field HTML
 */
const createFieldHTML = (field) => {
  const {
    name,
    type,
    label,
    placeholder,
    required,
    autocomplete,
    minLength,
    maxLength,
    rows,
  } = field;

  const fieldId = `contact-form-${name}`;
  const errorId = `${fieldId}-error`;
  const requiredAttr = required ? 'required' : '';
  const ariaRequired = required ? 'true' : 'false';
  const autocompleteAttr = autocomplete ? `autocomplete="${autocomplete}"` : '';
  const minLengthAttr = minLength ? `minlength="${minLength}"` : '';
  const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';

  const labelHTML = `
    <label for="${fieldId}" class="form-label">
      ${sanitizeHTML(label)}
      ${required ? '<span class="required-indicator" aria-label="required">*</span>' : ''}
    </label>
  `;

  let inputHTML;
  if (type === 'textarea') {
    inputHTML = `
      <textarea
        id="${fieldId}"
        name="${name}"
        class="form-input"
        placeholder="${sanitizeHTML(placeholder)}"
        rows="${rows || 5}"
        ${requiredAttr}
        ${autocompleteAttr}
        ${minLengthAttr}
        ${maxLengthAttr}
        aria-required="${ariaRequired}"
        aria-invalid="false"
        aria-describedby="${errorId}"
      ></textarea>
    `;
  } else {
    inputHTML = `
      <input
        type="${type}"
        id="${fieldId}"
        name="${name}"
        class="form-input"
        placeholder="${sanitizeHTML(placeholder)}"
        ${requiredAttr}
        ${autocompleteAttr}
        ${minLengthAttr}
        ${maxLengthAttr}
        aria-required="${ariaRequired}"
        aria-invalid="false"
        aria-describedby="${errorId}"
      />
    `;
  }

  return `
    <div class="form-field" data-field="${name}">
      ${labelHTML}
      ${inputHTML}
      <div id="${errorId}" class="form-error" role="alert" aria-live="polite"></div>
    </div>
  `;
};

/**
 * Creates complete form HTML
 * @param {ContactFormConfig} config - Form configuration
 * @param {FormField[]} fields - Form fields
 * @returns {string} Form HTML
 */
const createFormHTML = (config, fields) => {
  const fieldsHTML = fields.map(createFieldHTML).join('');
  const additionalClasses = config.className || '';

  return `
    <form 
      class="contact-form ${additionalClasses}" 
      data-contact-form="true"
      novalidate
      aria-label="Contact form"
    >
      <div class="form-fields">
        ${fieldsHTML}
      </div>

      <div class="form-actions">
        <button 
          type="submit" 
          class="btn btn-primary btn-lg"
          data-submit-button="true"
        >
          <span class="button-text">Send Message</span>
          <svg class="button-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      <div class="form-message" role="status" aria-live="polite" aria-atomic="true"></div>
    </form>
  `;
};

/**
 * Validates single field
 * @param {HTMLElement} fieldElement - Field element
 * @param {FormField} fieldConfig - Field configuration
 * @returns {ValidationResult} Validation result
 */
const validateField = (fieldElement, fieldConfig) => {
  const input = fieldElement.querySelector('input, textarea');
  const value = input.value.trim();

  const result = fieldConfig.validate(value);

  const errorElement = fieldElement.querySelector('.form-error');
  
  if (!result.valid) {
    input.setAttribute('aria-invalid', 'true');
    fieldElement.classList.add('has-error');
    errorElement.textContent = result.error || fieldConfig.errorMessage;
    
    logEvent('form_field_validation_error', {
      field: fieldConfig.name,
      error: result.error,
    });
  } else {
    input.setAttribute('aria-invalid', 'false');
    fieldElement.classList.remove('has-error');
    errorElement.textContent = '';
  }

  return result;
};

/**
 * Validates entire form
 * @param {HTMLFormElement} formElement - Form element
 * @param {FormField[]} fields - Field configurations
 * @returns {boolean} Validation status
 */
const validateForm = (formElement, fields) => {
  let isValid = true;
  const errors = [];

  fields.forEach((fieldConfig) => {
    const fieldElement = formElement.querySelector(`[data-field="${fieldConfig.name}"]`);
    if (!fieldElement) {
      logEvent('form_field_missing', { field: fieldConfig.name });
      return;
    }

    const result = validateField(fieldElement, fieldConfig);
    if (!result.valid) {
      isValid = false;
      errors.push({
        field: fieldConfig.name,
        error: result.error,
      });
    }
  });

  if (!isValid) {
    logEvent('form_validation_failed', {
      error_count: errors.length,
      errors,
    });

    const firstErrorField = formElement.querySelector('.has-error input, .has-error textarea');
    if (firstErrorField) {
      firstErrorField.focus();
    }
  }

  return isValid;
};

/**
 * Shows form message
 * @param {HTMLElement} messageElement - Message element
 * @param {string} message - Message text
 * @param {'success' | 'error' | 'info'} type - Message type
 */
const showMessage = (messageElement, message, type = 'info') => {
  messageElement.textContent = sanitizeHTML(message);
  messageElement.className = `form-message form-message-${type}`;
  messageElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
};

/**
 * Clears form message
 * @param {HTMLElement} messageElement - Message element
 */
const clearMessage = (messageElement) => {
  messageElement.textContent = '';
  messageElement.className = 'form-message';
};

/**
 * Sets form loading state
 * @param {HTMLFormElement} formElement - Form element
 * @param {boolean} loading - Loading state
 */
const setLoadingState = (formElement, loading) => {
  const submitButton = formElement.querySelector('[data-submit-button]');
  const inputs = formElement.querySelectorAll('input, textarea, button');

  if (loading) {
    formElement.classList.add('is-loading');
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    
    const buttonText = submitButton.querySelector('.button-text');
    buttonText.textContent = 'Sending...';

    inputs.forEach((input) => {
      input.disabled = true;
    });
  } else {
    formElement.classList.remove('is-loading');
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
    
    const buttonText = submitButton.querySelector('.button-text');
    buttonText.textContent = 'Send Message';

    inputs.forEach((input) => {
      input.disabled = false;
    });
  }
};

/**
 * Submits form data
 * @param {string} url - Submission URL
 * @param {Object} data - Form data
 * @param {string} method - HTTP method
 * @param {number} timeout - Request timeout
 * @returns {Promise<Object>} Response data
 */
const submitFormData = async (url, data, method, timeout) => {
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
 * Handles form submission
 * @param {Event} event - Submit event
 * @param {HTMLFormElement} formElement - Form element
 * @param {ContactFormConfig} config - Form configuration
 * @param {FormField[]} fields - Field configurations
 */
const handleSubmit = async (event, formElement, config, fields) => {
  event.preventDefault();

  const messageElement = formElement.querySelector('.form-message');
  clearMessage(messageElement);

  if (!validateForm(formElement, fields)) {
    return;
  }

  const formData = {};
  fields.forEach((field) => {
    const input = formElement.querySelector(`[name="${field.name}"]`);
    formData[field.name] = input.value.trim();
  });

  logEvent('form_submit_attempt', {
    fields: Object.keys(formData),
  });

  if (config.onSubmit) {
    try {
      const shouldContinue = await config.onSubmit(formData);
      if (shouldContinue === false) {
        logEvent('form_submit_cancelled');
        return;
      }
    } catch (error) {
      logEvent('form_submit_callback_error', {
        error_message: error.message,
      });
    }
  }

  setLoadingState(formElement, true);

  try {
    const response = await submitFormData(
      config.submitUrl,
      formData,
      config.method,
      config.submitTimeout
    );

    logEvent('form_submit_success', {
      response_time_ms: performance.now(),
    });

    if (config.showSuccessMessage) {
      showMessage(
        messageElement,
        'Thank you for your message! We\'ll get back to you soon.',
        'success'
      );
    }

    if (config.resetOnSuccess) {
      formElement.reset();
      formElement.querySelectorAll('.has-error').forEach((field) => {
        field.classList.remove('has-error');
        const input = field.querySelector('input, textarea');
        input.setAttribute('aria-invalid', 'false');
        field.querySelector('.form-error').textContent = '';
      });
    }

    if (config.onSuccess) {
      try {
        await config.onSuccess(response, formData);
      } catch (error) {
        logEvent('form_success_callback_error', {
          error_message: error.message,
        });
      }
    }
  } catch (error) {
    logEvent('form_submit_error', {
      error_message: error.message,
      error_stack: error.stack,
    });

    showMessage(
      messageElement,
      error.message || 'Failed to send message. Please try again.',
      'error'
    );

    if (config.onError) {
      try {
        await config.onError(error, formData);
      } catch (callbackError) {
        logEvent('form_error_callback_error', {
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
 * @param {ContactFormConfig} config - Form configuration
 * @param {FormField[]} fields - Field configurations
 * @returns {Function} Cleanup function
 */
const attachEventListeners = (formElement, config, fields) => {
  const submitHandler = (event) => handleSubmit(event, formElement, config, fields);
  
  const blurHandlers = new Map();
  
  fields.forEach((fieldConfig) => {
    const fieldElement = formElement.querySelector(`[data-field="${fieldConfig.name}"]`);
    if (!fieldElement) return;

    const input = fieldElement.querySelector('input, textarea');
    const blurHandler = () => validateField(fieldElement, fieldConfig);
    
    input.addEventListener('blur', blurHandler);
    blurHandlers.set(input, blurHandler);
  });

  formElement.addEventListener('submit', submitHandler);

  return () => {
    formElement.removeEventListener('submit', submitHandler);
    blurHandlers.forEach((handler, input) => {
      input.removeEventListener('blur', handler);
    });
    blurHandlers.clear();
  };
};

/**
 * Creates contact form and renders it into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} customConfig - Form configuration
 * @returns {Object} Form instance with methods
 * @throws {Error} If target not found or configuration invalid
 */
export const createContactForm = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Contact form target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);
    const fields = config.customFields || DEFAULT_FIELDS;

    const formHTML = createFormHTML(config, fields);
    targetElement.innerHTML = formHTML;

    const formElement = targetElement.querySelector('[data-contact-form]');
    if (!formElement) {
      throw new Error('Failed to create contact form element');
    }

    const cleanup = attachEventListeners(formElement, config, fields);

    const renderTime = performance.now() - startTime;
    logEvent('contact_form_rendered', {
      render_time_ms: renderTime.toFixed(2),
      field_count: fields.length,
    });

    return {
      element: formElement,
      config,
      fields,
      reset: () => {
        formElement.reset();
        formElement.querySelectorAll('.has-error').forEach((field) => {
          field.classList.remove('has-error');
          const input = field.querySelector('input, textarea');
          input.setAttribute('aria-invalid', 'false');
          field.querySelector('.form-error').textContent = '';
        });
        const messageElement = formElement.querySelector('.form-message');
        clearMessage(messageElement);
        logEvent('contact_form_reset');
      },
      validate: () => validateForm(formElement, fields),
      getData: () => {
        const data = {};
        fields.forEach((field) => {
          const input = formElement.querySelector(`[name="${field.name}"]`);
          data[field.name] = input.value.trim();
        });
        return data;
      },
      cleanup: () => {
        cleanup();
        logEvent('contact_form_cleanup');
      },
    };
  } catch (error) {
    logEvent('contact_form_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create contact form: ${error.message}`, {
      cause: error,
    });
  }
};

export default createContactForm;