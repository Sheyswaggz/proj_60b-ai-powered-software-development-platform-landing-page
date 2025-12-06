/**
 * Workflow Step Component
 * 
 * Reusable component for individual workflow steps with icon, title, description,
 * animation states, hover effects, and comprehensive accessibility features.
 * 
 * @generated-from: task-id:TASK-003
 * @modifies: workflow-section.js
 * @dependencies: ["animations.js"]
 */

/**
 * Workflow step configuration
 * @typedef {Object} WorkflowStepConfig
 * @property {string} id - Unique step identifier
 * @property {string} title - Step title
 * @property {string} description - Step description
 * @property {string} icon - SVG icon markup
 * @property {number} order - Display order
 * @property {number} totalSteps - Total number of steps
 * @property {boolean} isActive - Whether step is currently active
 * @property {boolean} isCompleted - Whether step is completed
 * @property {Function} [onInteraction] - Interaction callback
 */

/**
 * Animation state enumeration
 * @enum {string}
 */
const AnimationState = Object.freeze({
  IDLE: 'idle',
  ENTERING: 'entering',
  ACTIVE: 'active',
  EXITING: 'exiting',
});

/**
 * Interaction event types
 * @enum {string}
 */
const InteractionType = Object.freeze({
  HOVER: 'hover',
  CLICK: 'click',
  FOCUS: 'focus',
  BLUR: 'blur',
});

/**
 * Default step configuration
 * @type {Partial<WorkflowStepConfig>}
 */
const DEFAULT_CONFIG = Object.freeze({
  isActive: false,
  isCompleted: false,
  onInteraction: null,
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
    component: 'workflow-step',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[WorkflowStep]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'workflow_step',
      ...context,
    });
  }
};

/**
 * Validates step configuration
 * @param {Object} config - Configuration to validate
 * @returns {WorkflowStepConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Workflow step configuration must be an object');
  }

  if (typeof config.id !== 'string' || !config.id.trim()) {
    throw new TypeError('Step id must be a non-empty string');
  }

  if (typeof config.title !== 'string' || !config.title.trim()) {
    throw new TypeError('Step title must be a non-empty string');
  }

  if (typeof config.description !== 'string' || !config.description.trim()) {
    throw new TypeError('Step description must be a non-empty string');
  }

  if (typeof config.icon !== 'string' || !config.icon.trim()) {
    throw new TypeError('Step icon must be a non-empty string');
  }

  if (typeof config.order !== 'number' || config.order < 1) {
    throw new TypeError('Step order must be a positive number');
  }

  if (typeof config.totalSteps !== 'number' || config.totalSteps < 1) {
    throw new TypeError('Total steps must be a positive number');
  }

  if (config.order > config.totalSteps) {
    throw new TypeError('Step order cannot exceed total steps');
  }

  if (config.isActive !== undefined && typeof config.isActive !== 'boolean') {
    throw new TypeError('isActive must be a boolean');
  }

  if (config.isCompleted !== undefined && typeof config.isCompleted !== 'boolean') {
    throw new TypeError('isCompleted must be a boolean');
  }

  if (config.onInteraction !== undefined && 
      config.onInteraction !== null && 
      typeof config.onInteraction !== 'function') {
    throw new TypeError('onInteraction must be a function or null');
  }

  return { ...DEFAULT_CONFIG, ...config };
};

/**
 * Sanitizes HTML content to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHTML = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Creates step HTML structure
 * @param {WorkflowStepConfig} config - Step configuration
 * @returns {string} Step HTML
 */
const createStepHTML = (config) => {
  const isLastStep = config.order === config.totalSteps;
  const activeClass = config.isActive ? 'workflow-step--active' : '';
  const completedClass = config.isCompleted ? 'workflow-step--completed' : '';

  return `
    <div 
      class="workflow-step relative ${activeClass} ${completedClass}"
      data-step-id="${config.id}"
      data-step-order="${config.order}"
      data-animation-state="${AnimationState.IDLE}"
      role="article"
      aria-labelledby="step-${config.id}-title"
      aria-describedby="step-${config.id}-description"
      tabindex="0"
    >
      <!-- Step Card -->
      <div class="workflow-step__card bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/20">
        
        <!-- Step Number Badge -->
        <div class="workflow-step__badge absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 transition-transform duration-300 hover:scale-110" aria-label="Step ${config.order} of ${config.totalSteps}">
          ${config.order}
        </div>

        ${config.isCompleted ? `
          <div class="workflow-step__completed-badge absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg z-10" aria-label="Completed">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ` : ''}

        <!-- Icon Container -->
        <div class="workflow-step__icon-container flex justify-center mb-6">
          <div class="workflow-step__icon w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 transform hover:scale-110 transition-transform duration-300" aria-hidden="true">
            ${config.icon}
          </div>
        </div>

        <!-- Step Content -->
        <div class="workflow-step__content text-center space-y-4">
          <h3 
            id="step-${config.id}-title"
            class="workflow-step__title text-2xl font-bold text-neutral-900 dark:text-white"
          >
            ${sanitizeHTML(config.title)}
          </h3>
          
          <p 
            id="step-${config.id}-description"
            class="workflow-step__description text-neutral-600 dark:text-neutral-300 leading-relaxed"
          >
            ${sanitizeHTML(config.description)}
          </p>
        </div>

        <!-- Interactive Hover Effect -->
        <div class="workflow-step__hover-effect absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
      </div>

      <!-- Connector Arrow -->
      ${!isLastStep ? `
        <div class="workflow-step__connector hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-0 transition-opacity duration-300" aria-hidden="true">
          <svg class="w-16 h-16 text-primary-300 dark:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      ` : ''}
    </div>
  `;
};

/**
 * Handles step interaction events
 * @param {HTMLElement} stepElement - Step element
 * @param {WorkflowStepConfig} config - Step configuration
 * @param {string} interactionType - Type of interaction
 */
const handleInteraction = (stepElement, config, interactionType) => {
  const context = {
    step_id: config.id,
    step_order: config.order,
    interaction_type: interactionType,
    is_active: config.isActive,
    is_completed: config.isCompleted,
    timestamp: Date.now(),
  };

  logEvent('step_interaction', context);

  if (typeof config.onInteraction === 'function') {
    try {
      config.onInteraction({
        stepId: config.id,
        order: config.order,
        type: interactionType,
        element: stepElement,
      });
    } catch (error) {
      logEvent('step_interaction_error', {
        ...context,
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }
};

/**
 * Updates step animation state
 * @param {HTMLElement} stepElement - Step element
 * @param {string} state - Animation state
 */
const updateAnimationState = (stepElement, state) => {
  if (!Object.values(AnimationState).includes(state)) {
    logEvent('invalid_animation_state', { state });
    return;
  }

  stepElement.setAttribute('data-animation-state', state);
  
  logEvent('animation_state_changed', {
    step_id: stepElement.getAttribute('data-step-id'),
    new_state: state,
  });
};

/**
 * Initializes step interactions and animations
 * @param {HTMLElement} stepElement - Step element
 * @param {WorkflowStepConfig} config - Step configuration
 * @returns {Function} Cleanup function
 */
const initializeStep = (stepElement, config) => {
  const cleanupFunctions = [];

  const handleMouseEnter = () => {
    handleInteraction(stepElement, config, InteractionType.HOVER);
    updateAnimationState(stepElement, AnimationState.ACTIVE);
  };

  const handleMouseLeave = () => {
    updateAnimationState(stepElement, AnimationState.IDLE);
  };

  const handleClick = (event) => {
    event.preventDefault();
    handleInteraction(stepElement, config, InteractionType.CLICK);
  };

  const handleFocus = () => {
    handleInteraction(stepElement, config, InteractionType.FOCUS);
    updateAnimationState(stepElement, AnimationState.ACTIVE);
  };

  const handleBlur = () => {
    handleInteraction(stepElement, config, InteractionType.BLUR);
    updateAnimationState(stepElement, AnimationState.IDLE);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleInteraction(stepElement, config, InteractionType.CLICK);
    }
  };

  stepElement.addEventListener('mouseenter', handleMouseEnter);
  stepElement.addEventListener('mouseleave', handleMouseLeave);
  stepElement.addEventListener('click', handleClick);
  stepElement.addEventListener('focus', handleFocus);
  stepElement.addEventListener('blur', handleBlur);
  stepElement.addEventListener('keydown', handleKeyDown);

  cleanupFunctions.push(() => {
    stepElement.removeEventListener('mouseenter', handleMouseEnter);
    stepElement.removeEventListener('mouseleave', handleMouseLeave);
    stepElement.removeEventListener('click', handleClick);
    stepElement.removeEventListener('focus', handleFocus);
    stepElement.removeEventListener('blur', handleBlur);
    stepElement.removeEventListener('keydown', handleKeyDown);
  });

  logEvent('step_initialized', {
    step_id: config.id,
    step_order: config.order,
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('step_cleanup', { step_id: config.id });
  };
};

/**
 * Creates and renders workflow step component
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} config - Step configuration
 * @returns {Object} Step instance with element, config, and cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const createWorkflowStep = (target, config) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;

    if (!targetElement) {
      throw new Error(
        `Workflow step target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const validatedConfig = validateConfig(config);

    const stepHTML = createStepHTML(validatedConfig);
    targetElement.innerHTML = stepHTML;

    const stepElement = targetElement.querySelector('[data-step-id]');
    if (!stepElement) {
      throw new Error('Failed to create workflow step element');
    }

    const cleanup = initializeStep(stepElement, validatedConfig);

    const renderTime = performance.now() - startTime;
    logEvent('step_rendered', {
      step_id: validatedConfig.id,
      render_time_ms: renderTime.toFixed(2),
    });

    return {
      element: stepElement,
      config: validatedConfig,
      cleanup,
      updateState: (updates) => {
        const newConfig = { ...validatedConfig, ...updates };
        const newInstance = createWorkflowStep(targetElement, newConfig);
        cleanup();
        return newInstance;
      },
    };
  } catch (error) {
    logEvent('step_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create workflow step: ${error.message}`, {
      cause: error,
    });
  }
};

export default createWorkflowStep;