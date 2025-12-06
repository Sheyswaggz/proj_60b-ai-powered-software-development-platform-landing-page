/**
 * Form Validation Utilities
 * 
 * Production-ready form validation functions with comprehensive error handling,
 * input sanitization, and validation state management. Implements defensive
 * programming with detailed error messages and security-first design.
 * 
 * @generated-from: task-id:TASK-007
 * @modifies: contact-form.js, newsletter-signup.js
 * @dependencies: []
 */

/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Validation status
 * @property {string} [error] - Error message if invalid
 * @property {*} [value] - Sanitized value if valid
 */

/**
 * Validation rule configuration
 * @typedef {Object} ValidationRule
 * @property {string} type - Rule type (required, email, minLength, etc.)
 * @property {*} [value] - Rule parameter value
 * @property {string} message - Error message
 */

/**
 * Field validation configuration
 * @typedef {Object} FieldValidation
 * @property {string} name - Field name
 * @property {ValidationRule[]} rules - Validation rules
 * @property {Function} [customValidator] - Custom validation function
 * @property {boolean} [sanitize=true] - Enable sanitization
 */

/**
 * Validation state
 * @typedef {Object} ValidationState
 * @property {Object<string, ValidationResult>} fields - Field validation results
 * @property {boolean} valid - Overall validation status
 * @property {string[]} errors - All error messages
 * @property {Object<string, *>} values - Sanitized values
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
    component: 'form-validation',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[FormValidation]', logEntry);
  }
};

/**
 * Sanitizes string input to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  
  if (div) {
    div.textContent = input;
    return div.innerHTML;
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes HTML input by stripping all tags
 * @param {string} input - Input HTML to sanitize
 * @returns {string} Plain text without HTML tags
 */
export const sanitizeHTML = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  return input.replace(/<[^>]*>/g, '');
};

/**
 * Validates required field
 * @param {*} value - Value to validate
 * @returns {ValidationResult} Validation result
 */
export const validateRequired = (value) => {
  const trimmedValue = typeof value === 'string' ? value.trim() : value;
  
  if (trimmedValue === null || trimmedValue === undefined || trimmedValue === '') {
    return {
      valid: false,
      error: 'This field is required',
    };
  }

  return {
    valid: true,
    value: trimmedValue,
  };
};

/**
 * Validates email address format
 * @param {string} email - Email to validate
 * @returns {ValidationResult} Validation result
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return {
      valid: false,
      error: 'Email is required',
    };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return {
      valid: false,
      error: 'Email is required',
    };
  }

  if (trimmedEmail.length > 254) {
    return {
      valid: false,
      error: 'Email must not exceed 254 characters',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return {
      valid: false,
      error: 'Please enter a valid email address',
    };
  }

  const [localPart, domain] = trimmedEmail.split('@');

  if (localPart.length > 64) {
    return {
      valid: false,
      error: 'Email local part must not exceed 64 characters',
    };
  }

  if (domain.length > 255) {
    return {
      valid: false,
      error: 'Email domain must not exceed 255 characters',
    };
  }

  const domainParts = domain.split('.');
  if (domainParts.some(part => part.length === 0 || part.length > 63)) {
    return {
      valid: false,
      error: 'Invalid email domain format',
    };
  }

  return {
    valid: true,
    value: trimmedEmail.toLowerCase(),
  };
};

/**
 * Validates minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {ValidationResult} Validation result
 */
export const validateMinLength = (value, minLength) => {
  if (typeof value !== 'string') {
    return {
      valid: false,
      error: 'Value must be a string',
    };
  }

  if (typeof minLength !== 'number' || minLength < 0) {
    throw new TypeError('minLength must be a non-negative number');
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length < minLength) {
    return {
      valid: false,
      error: `Must be at least ${minLength} character${minLength !== 1 ? 's' : ''}`,
    };
  }

  return {
    valid: true,
    value: trimmedValue,
  };
};

/**
 * Validates maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {ValidationResult} Validation result
 */
export const validateMaxLength = (value, maxLength) => {
  if (typeof value !== 'string') {
    return {
      valid: false,
      error: 'Value must be a string',
    };
  }

  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new TypeError('maxLength must be a non-negative number');
  }

  if (value.length > maxLength) {
    return {
      valid: false,
      error: `Must not exceed ${maxLength} character${maxLength !== 1 ? 's' : ''}`,
    };
  }

  return {
    valid: true,
    value: value,
  };
};

/**
 * Validates pattern match
 * @param {string} value - Value to validate
 * @param {RegExp|string} pattern - Pattern to match
 * @param {string} [errorMessage='Invalid format'] - Custom error message
 * @returns {ValidationResult} Validation result
 */
export const validatePattern = (value, pattern, errorMessage = 'Invalid format') => {
  if (typeof value !== 'string') {
    return {
      valid: false,
      error: 'Value must be a string',
    };
  }

  let regex;
  if (pattern instanceof RegExp) {
    regex = pattern;
  } else if (typeof pattern === 'string') {
    try {
      regex = new RegExp(pattern);
    } catch (error) {
      throw new TypeError(`Invalid pattern: ${error.message}`);
    }
  } else {
    throw new TypeError('Pattern must be a RegExp or string');
  }

  if (!regex.test(value)) {
    return {
      valid: false,
      error: errorMessage,
    };
  }

  return {
    valid: true,
    value: value,
  };
};

/**
 * Validates numeric value
 * @param {*} value - Value to validate
 * @param {Object} [options={}] - Validation options
 * @param {number} [options.min] - Minimum value
 * @param {number} [options.max] - Maximum value
 * @param {boolean} [options.integer=false] - Require integer
 * @returns {ValidationResult} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integer = false } = options;

  const num = Number(value);

  if (isNaN(num)) {
    return {
      valid: false,
      error: 'Must be a valid number',
    };
  }

  if (!isFinite(num)) {
    return {
      valid: false,
      error: 'Must be a finite number',
    };
  }

  if (integer && !Number.isInteger(num)) {
    return {
      valid: false,
      error: 'Must be an integer',
    };
  }

  if (min !== undefined && num < min) {
    return {
      valid: false,
      error: `Must be at least ${min}`,
    };
  }

  if (max !== undefined && num > max) {
    return {
      valid: false,
      error: `Must not exceed ${max}`,
    };
  }

  return {
    valid: true,
    value: num,
  };
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @param {Object} [options={}] - Validation options
 * @param {string[]} [options.protocols=['http', 'https']] - Allowed protocols
 * @param {boolean} [options.requireProtocol=true] - Require protocol
 * @returns {ValidationResult} Validation result
 */
export const validateURL = (url, options = {}) => {
  const { protocols = ['http', 'https'], requireProtocol = true } = options;

  if (!url || typeof url !== 'string') {
    return {
      valid: false,
      error: 'URL is required',
    };
  }

  const trimmedURL = url.trim();

  try {
    const urlObj = new URL(trimmedURL);

    if (requireProtocol && !urlObj.protocol) {
      return {
        valid: false,
        error: 'URL must include protocol',
      };
    }

    const protocol = urlObj.protocol.replace(':', '');
    if (protocols.length > 0 && !protocols.includes(protocol)) {
      return {
        valid: false,
        error: `Protocol must be one of: ${protocols.join(', ')}`,
      };
    }

    return {
      valid: true,
      value: trimmedURL,
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Please enter a valid URL',
    };
  }
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @param {Object} [options={}] - Validation options
 * @param {string} [options.format='international'] - Format type (international, us, etc.)
 * @returns {ValidationResult} Validation result
 */
export const validatePhone = (phone, options = {}) => {
  const { format = 'international' } = options;

  if (!phone || typeof phone !== 'string') {
    return {
      valid: false,
      error: 'Phone number is required',
    };
  }

  const trimmedPhone = phone.trim();

  const patterns = {
    international: /^\+?[1-9]\d{1,14}$/,
    us: /^(\+1)?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
  };

  const pattern = patterns[format] || patterns.international;
  const digitsOnly = trimmedPhone.replace(/[^\d+]/g, '');

  if (!pattern.test(digitsOnly)) {
    return {
      valid: false,
      error: 'Please enter a valid phone number',
    };
  }

  return {
    valid: true,
    value: digitsOnly,
  };
};

/**
 * Validates field against multiple rules
 * @param {*} value - Value to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @param {Function} [customValidator] - Custom validation function
 * @returns {ValidationResult} Validation result
 */
export const validateField = (value, rules, customValidator = null) => {
  if (!Array.isArray(rules)) {
    throw new TypeError('Rules must be an array');
  }

  let currentValue = value;

  for (const rule of rules) {
    if (!rule || typeof rule !== 'object') {
      logEvent('validation_rule_invalid', { rule });
      continue;
    }

    const { type, value: ruleValue, message } = rule;
    let result;

    switch (type) {
      case 'required':
        result = validateRequired(currentValue);
        break;

      case 'email':
        result = validateEmail(currentValue);
        break;

      case 'minLength':
        result = validateMinLength(currentValue, ruleValue);
        break;

      case 'maxLength':
        result = validateMaxLength(currentValue, ruleValue);
        break;

      case 'pattern':
        result = validatePattern(currentValue, ruleValue, message);
        break;

      case 'number':
        result = validateNumber(currentValue, ruleValue);
        break;

      case 'url':
        result = validateURL(currentValue, ruleValue);
        break;

      case 'phone':
        result = validatePhone(currentValue, ruleValue);
        break;

      default:
        logEvent('validation_rule_unknown', { type });
        continue;
    }

    if (!result.valid) {
      return {
        valid: false,
        error: message || result.error,
      };
    }

    if (result.value !== undefined) {
      currentValue = result.value;
    }
  }

  if (customValidator && typeof customValidator === 'function') {
    try {
      const customResult = customValidator(currentValue);
      if (customResult && !customResult.valid) {
        return customResult;
      }
      if (customResult && customResult.value !== undefined) {
        currentValue = customResult.value;
      }
    } catch (error) {
      logEvent('custom_validator_error', {
        error_message: error.message,
        error_stack: error.stack,
      });
      return {
        valid: false,
        error: 'Validation error occurred',
      };
    }
  }

  return {
    valid: true,
    value: currentValue,
  };
};

/**
 * Validates multiple fields
 * @param {Object<string, *>} data - Field data to validate
 * @param {FieldValidation[]} fieldValidations - Field validation configurations
 * @returns {ValidationState} Validation state
 */
export const validateForm = (data, fieldValidations) => {
  if (!data || typeof data !== 'object') {
    throw new TypeError('Data must be an object');
  }

  if (!Array.isArray(fieldValidations)) {
    throw new TypeError('Field validations must be an array');
  }

  const state = {
    fields: {},
    valid: true,
    errors: [],
    values: {},
  };

  for (const fieldValidation of fieldValidations) {
    const { name, rules, customValidator, sanitize = true } = fieldValidation;

    if (!name || typeof name !== 'string') {
      logEvent('field_validation_invalid_name', { fieldValidation });
      continue;
    }

    let value = data[name];

    if (sanitize && typeof value === 'string') {
      value = sanitizeString(value);
    }

    const result = validateField(value, rules, customValidator);

    state.fields[name] = result;

    if (!result.valid) {
      state.valid = false;
      state.errors.push(result.error);
    } else {
      state.values[name] = result.value !== undefined ? result.value : value;
    }
  }

  logEvent('form_validation_complete', {
    valid: state.valid,
    error_count: state.errors.length,
    field_count: Object.keys(state.fields).length,
  });

  return state;
};

/**
 * Creates validation state manager
 * @param {FieldValidation[]} fieldValidations - Field validation configurations
 * @returns {Object} Validation state manager
 */
export const createValidationState = (fieldValidations) => {
  if (!Array.isArray(fieldValidations)) {
    throw new TypeError('Field validations must be an array');
  }

  let currentState = {
    fields: {},
    valid: true,
    errors: [],
    values: {},
  };

  const listeners = new Set();

  const notifyListeners = () => {
    listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (error) {
        logEvent('validation_listener_error', {
          error_message: error.message,
        });
      }
    });
  };

  return {
    validate: (data) => {
      currentState = validateForm(data, fieldValidations);
      notifyListeners();
      return currentState;
    },

    validateField: (name, value) => {
      const fieldValidation = fieldValidations.find((fv) => fv.name === name);
      
      if (!fieldValidation) {
        logEvent('field_validation_not_found', { name });
        return { valid: false, error: 'Field validation not found' };
      }

      let sanitizedValue = value;
      if (fieldValidation.sanitize !== false && typeof value === 'string') {
        sanitizedValue = sanitizeString(value);
      }

      const result = validateField(
        sanitizedValue,
        fieldValidation.rules,
        fieldValidation.customValidator
      );

      currentState.fields[name] = result;
      
      if (result.valid) {
        currentState.values[name] = result.value !== undefined ? result.value : sanitizedValue;
        delete currentState.errors[name];
      } else {
        currentState.errors[name] = result.error;
        delete currentState.values[name];
      }

      currentState.valid = Object.values(currentState.fields).every((f) => f.valid);

      notifyListeners();
      return result;
    },

    getState: () => ({ ...currentState }),

    getFieldState: (name) => currentState.fields[name] || null,

    isValid: () => currentState.valid,

    getErrors: () => [...currentState.errors],

    getValues: () => ({ ...currentState.values }),

    reset: () => {
      currentState = {
        fields: {},
        valid: true,
        errors: [],
        values: {},
      };
      notifyListeners();
    },

    subscribe: (listener) => {
      if (typeof listener !== 'function') {
        throw new TypeError('Listener must be a function');
      }
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export default {
  sanitizeString,
  sanitizeHTML,
  validateRequired,
  validateEmail,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateNumber,
  validateURL,
  validatePhone,
  validateField,
  validateForm,
  createValidationState,
};