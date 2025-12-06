/**
 * Interactive Walkthrough Component
 * 
 * Step-by-step interactive demo with platform interface mockups, navigation controls,
 * and progress indicators. Includes keyboard navigation and screen reader support.
 * 
 * @generated-from: task-id:TASK-005
 * @modifies: index.html
 * @dependencies: ["TASK-004"]
 */

/**
 * Walkthrough step configuration
 * @typedef {Object} WalkthroughStep
 * @property {string} id - Unique step identifier
 * @property {string} title - Step title
 * @property {string} description - Step description
 * @property {string} image - Step image URL
 * @property {number} order - Display order
 * @property {string} [action] - Optional action button text
 * @property {string} [actionUrl] - Optional action button URL
 */

/**
 * Walkthrough configuration
 * @typedef {Object} WalkthroughConfig
 * @property {Array<WalkthroughStep>} steps - Walkthrough steps
 * @property {boolean} enableKeyboard - Enable keyboard navigation
 * @property {boolean} enableProgress - Show progress indicators
 * @property {boolean} autoAdvance - Auto-advance after delay
 * @property {number} autoAdvanceDelay - Auto-advance delay in ms
 * @property {boolean} loop - Loop back to first step after last
 * @property {Function} [onStepChange] - Step change callback
 * @property {Function} [onComplete] - Completion callback
 */

/**
 * Default walkthrough steps
 * @type {Array<WalkthroughStep>}
 */
const DEFAULT_STEPS = Object.freeze([
  {
    id: 'step-1',
    title: 'Define Your Requirements',
    description: 'Start by describing your project requirements in natural language. Our AI understands context and technical specifications.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3ERequirements Input%3C/text%3E%3C/svg%3E',
    order: 1,
  },
  {
    id: 'step-2',
    title: 'AI Generates Code',
    description: 'Watch as our AI generates production-ready code following best practices, with comprehensive error handling and documentation.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3ECode Generation%3C/text%3E%3C/svg%3E',
    order: 2,
  },
  {
    id: 'step-3',
    title: 'Automated Testing',
    description: 'Comprehensive test suites are automatically generated and executed, ensuring high code quality and coverage.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3EAutomated Testing%3C/text%3E%3C/svg%3E',
    order: 3,
  },
  {
    id: 'step-4',
    title: 'Deploy with Confidence',
    description: 'One-click deployment to your preferred platform with automated monitoring and rollback capabilities.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3EDeployment%3C/text%3E%3C/svg%3E',
    order: 4,
    action: 'Start Free Trial',
    actionUrl: '#signup',
  },
]);

/**
 * Default walkthrough configuration
 * @type {WalkthroughConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  steps: DEFAULT_STEPS,
  enableKeyboard: true,
  enableProgress: true,
  autoAdvance: false,
  autoAdvanceDelay: 5000,
  loop: false,
  onStepChange: null,
  onComplete: null,
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
    component: 'interactive-walkthrough',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
    console.log('[InteractiveWalkthrough]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'walkthrough',
      ...context,
    });
  }
};

/**
 * Validates walkthrough step
 * @param {Object} step - Step to validate
 * @param {number} index - Step index
 * @throws {TypeError} If step invalid
 */
const validateStep = (step, index) => {
  if (!step || typeof step !== 'object') {
    throw new TypeError(`Step at index ${index} must be an object`);
  }

  if (typeof step.id !== 'string' || !step.id.trim()) {
    throw new TypeError(`Step at index ${index} must have valid id`);
  }

  if (typeof step.title !== 'string' || !step.title.trim()) {
    throw new TypeError(`Step at index ${index} must have valid title`);
  }

  if (typeof step.description !== 'string' || !step.description.trim()) {
    throw new TypeError(`Step at index ${index} must have valid description`);
  }

  if (typeof step.image !== 'string' || !step.image.trim()) {
    throw new TypeError(`Step at index ${index} must have valid image`);
  }

  if (typeof step.order !== 'number' || step.order < 1) {
    throw new TypeError(`Step at index ${index} must have valid order`);
  }

  if (step.action !== undefined && (typeof step.action !== 'string' || !step.action.trim())) {
    throw new TypeError(`Step at index ${index} action must be a non-empty string`);
  }

  if (step.actionUrl !== undefined && (typeof step.actionUrl !== 'string' || !step.actionUrl.trim())) {
    throw new TypeError(`Step at index ${index} actionUrl must be a non-empty string`);
  }
};

/**
 * Validates walkthrough configuration
 * @param {Object} config - Configuration to validate
 * @returns {WalkthroughConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Walkthrough configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (!Array.isArray(validated.steps) || validated.steps.length === 0) {
    throw new TypeError('Steps must be a non-empty array');
  }

  validated.steps.forEach((step, index) => validateStep(step, index));

  if (typeof validated.enableKeyboard !== 'boolean') {
    throw new TypeError('enableKeyboard must be a boolean');
  }

  if (typeof validated.enableProgress !== 'boolean') {
    throw new TypeError('enableProgress must be a boolean');
  }

  if (typeof validated.autoAdvance !== 'boolean') {
    throw new TypeError('autoAdvance must be a boolean');
  }

  if (typeof validated.autoAdvanceDelay !== 'number' || validated.autoAdvanceDelay < 0) {
    throw new TypeError('autoAdvanceDelay must be a non-negative number');
  }

  if (typeof validated.loop !== 'boolean') {
    throw new TypeError('loop must be a boolean');
  }

  if (validated.onStepChange !== null && typeof validated.onStepChange !== 'function') {
    throw new TypeError('onStepChange must be a function or null');
  }

  if (validated.onComplete !== null && typeof validated.onComplete !== 'function') {
    throw new TypeError('onComplete must be a function or null');
  }

  return validated;
};

/**
 * Creates step HTML
 * @param {WalkthroughStep} step - Step configuration
 * @param {number} index - Step index
 * @param {number} total - Total steps
 * @returns {string} Step HTML
 */
const createStepHTML = (step, index, total) => {
  const actionButton = step.action && step.actionUrl
    ? `
      <a
        href="${step.actionUrl}"
        class="btn btn-primary inline-flex items-center gap-2 mt-4"
        aria-label="${step.action}"
      >
        ${step.action}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    `
    : '';

  return `
    <div 
      class="walkthrough-step opacity-0 transition-opacity duration-500"
      data-step-id="${step.id}"
      data-step-order="${step.order}"
      role="article"
      aria-labelledby="walkthrough-step-${step.id}-title"
      aria-describedby="walkthrough-step-${step.id}-description"
    >
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <!-- Step Image -->
        <div class="order-2 md:order-1">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl bg-neutral-100 dark:bg-neutral-800">
            <img
              src="${step.image}"
              alt="${step.title}"
              class="w-full h-auto"
              loading="lazy"
            />
            <div class="absolute top-4 left-4 bg-primary-500 text-white px-4 py-2 rounded-full font-bold text-sm">
              Step ${index + 1} of ${total}
            </div>
          </div>
        </div>

        <!-- Step Content -->
        <div class="order-1 md:order-2 space-y-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl text-white font-bold text-2xl">
            ${index + 1}
          </div>
          
          <h3 
            id="walkthrough-step-${step.id}-title"
            class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white"
          >
            ${step.title}
          </h3>
          
          <p 
            id="walkthrough-step-${step.id}-description"
            class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed"
          >
            ${step.description}
          </p>

          ${actionButton}
        </div>
      </div>
    </div>
  `;
};

/**
 * Creates navigation controls HTML
 * @param {number} totalSteps - Total number of steps
 * @param {boolean} enableProgress - Show progress indicators
 * @returns {string} Navigation HTML
 */
const createNavigationHTML = (totalSteps, enableProgress) => {
  const progressIndicators = enableProgress
    ? `
      <div 
        class="walkthrough-progress flex items-center gap-2" 
        role="progressbar" 
        aria-valuemin="1" 
        aria-valuemax="${totalSteps}" 
        aria-valuenow="1"
        aria-label="Walkthrough progress"
      >
        ${Array.from({ length: totalSteps }, (_, i) => `
          <button
            class="walkthrough-progress-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary-500 w-8' : 'bg-neutral-300 dark:bg-neutral-600'}"
            data-step-index="${i}"
            aria-label="Go to step ${i + 1}"
          ></button>
        `).join('')}
      </div>
    `
    : '<div class="walkthrough-progress-spacer"></div>';

  return `
    <div class="walkthrough-navigation flex items-center justify-between mt-12">
      <button
        class="walkthrough-nav-btn walkthrough-prev-btn btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous step"
        disabled
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      ${progressIndicators}

      <button
        class="walkthrough-nav-btn walkthrough-next-btn btn btn-primary"
        aria-label="Next step"
      >
        Next
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  `;
};

/**
 * Walkthrough state management
 * @param {HTMLElement} container - Container element
 * @param {WalkthroughConfig} config - Walkthrough configuration
 * @returns {Object} State management object
 */
const createWalkthroughState = (container, config) => {
  const sortedSteps = [...config.steps].sort((a, b) => a.order - b.order);
  
  const state = {
    currentStep: 0,
    totalSteps: sortedSteps.length,
    completedSteps: new Set([0]),
    autoAdvanceTimer: null,
    startTime: Date.now(),
    stepTimes: [],
  };

  /**
   * Updates current step
   * @param {number} newStep - New step index
   */
  const updateStep = (newStep) => {
    if (newStep < 0 || newStep >= state.totalSteps) {
      return;
    }

    const steps = container.querySelectorAll('.walkthrough-step');
    const progressDots = container.querySelectorAll('.walkthrough-progress-dot');
    const prevBtn = container.querySelector('.walkthrough-prev-btn');
    const nextBtn = container.querySelector('.walkthrough-next-btn');
    const progressBar = container.querySelector('.walkthrough-progress');

    const currentStepTime = Date.now() - state.startTime;
    state.stepTimes.push({
      step: state.currentStep,
      duration: currentStepTime,
    });

    steps[state.currentStep]?.classList.remove('opacity-100');
    steps[state.currentStep]?.classList.add('opacity-0');

    state.currentStep = newStep;
    state.completedSteps.add(newStep);
    state.startTime = Date.now();

    steps[newStep]?.classList.remove('opacity-0');
    steps[newStep]?.classList.add('opacity-100');

    if (config.enableProgress) {
      progressDots.forEach((dot, index) => {
        if (index === newStep) {
          dot.classList.add('bg-primary-500', 'w-8');
          dot.classList.remove('bg-neutral-300', 'dark:bg-neutral-600', 'w-3');
        } else {
          dot.classList.remove('bg-primary-500', 'w-8');
          dot.classList.add('bg-neutral-300', 'dark:bg-neutral-600', 'w-3');
        }
      });
    }

    if (prevBtn) {
      prevBtn.disabled = newStep === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = newStep === state.totalSteps - 1;
      if (newStep === state.totalSteps - 1) {
        nextBtn.textContent = 'Complete';
      } else {
        nextBtn.innerHTML = `
          Next
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        `;
      }
    }

    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(newStep + 1));
    }

    if (config.autoAdvance && newStep < state.totalSteps - 1) {
      clearTimeout(state.autoAdvanceTimer);
      state.autoAdvanceTimer = setTimeout(() => {
        updateStep(newStep + 1);
      }, config.autoAdvanceDelay);
    }

    if (typeof config.onStepChange === 'function') {
      try {
        config.onStepChange(newStep, sortedSteps[newStep]);
      } catch (error) {
        logEvent('walkthrough_callback_error', {
          callback: 'onStepChange',
          error_message: error.message,
        });
      }
    }

    logEvent('walkthrough_step_changed', {
      step: newStep + 1,
      total_steps: state.totalSteps,
      step_id: sortedSteps[newStep]?.id,
      completion_percentage: Math.round(((newStep + 1) / state.totalSteps) * 100),
    });

    if (newStep === state.totalSteps - 1) {
      logEvent('walkthrough_completed', {
        total_time_ms: state.stepTimes.reduce((sum, t) => sum + t.duration, 0),
        step_times: state.stepTimes,
        completed_steps: state.completedSteps.size,
      });

      if (typeof config.onComplete === 'function') {
        try {
          config.onComplete(state);
        } catch (error) {
          logEvent('walkthrough_callback_error', {
            callback: 'onComplete',
            error_message: error.message,
          });
        }
      }
    }
  };

  /**
   * Navigates to previous step
   */
  const previousStep = () => {
    if (state.currentStep > 0) {
      updateStep(state.currentStep - 1);
    }
  };

  /**
   * Navigates to next step
   */
  const nextStep = () => {
    if (state.currentStep < state.totalSteps - 1) {
      updateStep(state.currentStep + 1);
    } else if (config.loop) {
      updateStep(0);
    }
  };

  /**
   * Navigates to specific step
   * @param {number} stepIndex - Target step index
   */
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < state.totalSteps) {
      updateStep(stepIndex);
    }
  };

  /**
   * Clears auto-advance timer
   */
  const clearAutoAdvance = () => {
    if (state.autoAdvanceTimer) {
      clearTimeout(state.autoAdvanceTimer);
      state.autoAdvanceTimer = null;
    }
  };

  return {
    state,
    updateStep,
    previousStep,
    nextStep,
    goToStep,
    clearAutoAdvance,
  };
};

/**
 * Initializes walkthrough interactions
 * @param {HTMLElement} container - Container element
 * @param {WalkthroughConfig} config - Walkthrough configuration
 * @returns {Function} Cleanup function
 */
const initializeWalkthrough = (container, config) => {
  const startTime = performance.now();
  const cleanupFunctions = [];

  const { state, updateStep, previousStep, nextStep, goToStep, clearAutoAdvance } = 
    createWalkthroughState(container, config);

  const prevBtn = container.querySelector('.walkthrough-prev-btn');
  const nextBtn = container.querySelector('.walkthrough-next-btn');

  if (prevBtn) {
    const handlePrev = () => {
      clearAutoAdvance();
      previousStep();
    };

    prevBtn.addEventListener('click', handlePrev);
    cleanupFunctions.push(() => prevBtn.removeEventListener('click', handlePrev));
  }

  if (nextBtn) {
    const handleNext = () => {
      clearAutoAdvance();
      nextStep();
    };

    nextBtn.addEventListener('click', handleNext);
    cleanupFunctions.push(() => nextBtn.removeEventListener('click', handleNext));
  }

  if (config.enableProgress) {
    const progressDots = container.querySelectorAll('.walkthrough-progress-dot');
    progressDots.forEach((dot) => {
      const handleDotClick = () => {
        clearAutoAdvance();
        const stepIndex = parseInt(dot.getAttribute('data-step-index'), 10);
        goToStep(stepIndex);
      };

      dot.addEventListener('click', handleDotClick);
      cleanupFunctions.push(() => dot.removeEventListener('click', handleDotClick));
    });
  }

  if (config.enableKeyboard) {
    const handleKeyboard = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        clearAutoAdvance();
        previousStep();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        clearAutoAdvance();
        nextStep();
      } else if (event.key === 'Home') {
        event.preventDefault();
        clearAutoAdvance();
        goToStep(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        clearAutoAdvance();
        goToStep(state.totalSteps - 1);
      } else if (event.key >= '1' && event.key <= '9') {
        const stepIndex = parseInt(event.key, 10) - 1;
        if (stepIndex < state.totalSteps) {
          event.preventDefault();
          clearAutoAdvance();
          goToStep(stepIndex);
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    cleanupFunctions.push(() => document.removeEventListener('keydown', handleKeyboard));
  }

  updateStep(0);

  const renderTime = performance.now() - startTime;
  logEvent('walkthrough_initialized', {
    render_time_ms: renderTime.toFixed(2),
    total_steps: state.totalSteps,
    keyboard_enabled: config.enableKeyboard,
    progress_enabled: config.enableProgress,
    auto_advance: config.autoAdvance,
  });

  return () => {
    clearAutoAdvance();
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('walkthrough_cleanup', {
      completed_steps: state.completedSteps.size,
      final_step: state.currentStep + 1,
    });
  };
};

/**
 * Creates interactive walkthrough component
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration
 * @returns {Object} Walkthrough instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const createInteractiveWalkthrough = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Walkthrough target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);
    const sortedSteps = [...config.steps].sort((a, b) => a.order - b.order);

    const stepsHTML = sortedSteps
      .map((step, index) => createStepHTML(step, index, sortedSteps.length))
      .join('');

    const walkthroughHTML = `
      <div class="interactive-walkthrough" role="region" aria-label="Interactive walkthrough">
        <div class="walkthrough-steps-container">
          ${stepsHTML}
        </div>
        ${createNavigationHTML(sortedSteps.length, config.enableProgress)}
      </div>
    `;

    targetElement.innerHTML = walkthroughHTML;

    const walkthroughElement = targetElement.querySelector('.interactive-walkthrough');
    if (!walkthroughElement) {
      throw new Error('Failed to create walkthrough element');
    }

    const cleanup = initializeWalkthrough(walkthroughElement, config);

    const totalTime = performance.now() - startTime;
    logEvent('walkthrough_created', {
      total_time_ms: totalTime.toFixed(2),
      step_count: sortedSteps.length,
    });

    return {
      element: walkthroughElement,
      config,
      cleanup,
    };
  } catch (error) {
    logEvent('walkthrough_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create interactive walkthrough: ${error.message}`, {
      cause: error,
    });
  }
};

export default createInteractiveWalkthrough;