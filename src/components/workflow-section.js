/**
 * Workflow Section Component
 * 
 * Displays interactive 6-stage AI development workflow visualization with animations,
 * responsive design, and accessibility features. Shows progression from idea to deployment.
 * 
 * @generated-from: task-id:TASK-003
 * @modifies: index.html
 * @dependencies: ["TASK-002"]
 */

import { createScrollAnimation, createStaggeredAnimations } from '../utils/animations.js';

/**
 * Workflow stage configuration
 * @typedef {Object} WorkflowStage
 * @property {string} id - Unique stage identifier
 * @property {string} title - Stage title
 * @property {string} description - Stage description
 * @property {string} icon - SVG icon markup
 * @property {number} order - Display order
 */

/**
 * Workflow section configuration
 * @typedef {Object} WorkflowConfig
 * @property {string} title - Section title
 * @property {string} subtitle - Section subtitle
 * @property {Array<WorkflowStage>} stages - Workflow stages
 * @property {boolean} enableAnimations - Enable scroll animations
 * @property {number} staggerDelay - Delay between stage animations
 */

/**
 * Default workflow stages configuration
 * @type {Array<WorkflowStage>}
 */
const DEFAULT_STAGES = Object.freeze([
  {
    id: 'idea-input',
    title: 'Idea Input',
    description: 'Describe your application idea in natural language. Our AI understands your vision and requirements.',
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>`,
    order: 1,
  },
  {
    id: 'requirements-gathering',
    title: 'Requirements Gathering',
    description: 'AI analyzes your input and generates comprehensive technical requirements, user stories, and acceptance criteria.',
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>`,
    order: 2,
  },
  {
    id: 'project-planning',
    title: 'Project Planning',
    description: 'Automated project structure creation, technology stack selection, and development roadmap generation.',
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>`,
    order: 3,
  },
  {
    id: 'code-generation',
    title: 'Code Generation',
    description: 'AI writes production-ready code following best practices, design patterns, and your project conventions.',
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>`,
    order: 4,
  },
  {
    id: 'testing-deployment',
    title: 'Testing & Deployment',
    description: 'Automated testing, quality assurance, and seamless deployment to production environments.',
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    order: 5,
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description: 'Continuous monitoring, performance tracking, and automated maintenance of your deployed application.',
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`,
    order: 6,
  },
]);

/**
 * Default workflow configuration
 * @type {WorkflowConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  title: 'How It Works',
  subtitle: 'From idea to production in six intelligent steps',
  stages: DEFAULT_STAGES,
  enableAnimations: true,
  staggerDelay: 150,
});

/**
 * Feature flag for workflow animations
 * @returns {boolean} True if animations enabled
 */
const isAnimationsEnabled = () => {
  try {
    const flagValue = localStorage.getItem('workflow_animations');
    return flagValue !== 'off';
  } catch (error) {
    console.warn('[WorkflowSection] Failed to read feature flag:', error);
    return true;
  }
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
    component: 'workflow-section',
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[WorkflowSection]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'workflow',
      ...context,
    });
  }
};

/**
 * Validates workflow configuration
 * @param {Object} config - Configuration to validate
 * @returns {WorkflowConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Workflow configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.title !== 'string' || !validated.title.trim()) {
    throw new TypeError('Title must be a non-empty string');
  }

  if (typeof validated.subtitle !== 'string' || !validated.subtitle.trim()) {
    throw new TypeError('Subtitle must be a non-empty string');
  }

  if (!Array.isArray(validated.stages) || validated.stages.length === 0) {
    throw new TypeError('Stages must be a non-empty array');
  }

  validated.stages.forEach((stage, index) => {
    if (!stage || typeof stage !== 'object') {
      throw new TypeError(`Stage at index ${index} must be an object`);
    }
    if (typeof stage.id !== 'string' || !stage.id.trim()) {
      throw new TypeError(`Stage at index ${index} must have valid id`);
    }
    if (typeof stage.title !== 'string' || !stage.title.trim()) {
      throw new TypeError(`Stage at index ${index} must have valid title`);
    }
    if (typeof stage.description !== 'string' || !stage.description.trim()) {
      throw new TypeError(`Stage at index ${index} must have valid description`);
    }
    if (typeof stage.icon !== 'string' || !stage.icon.trim()) {
      throw new TypeError(`Stage at index ${index} must have valid icon`);
    }
    if (typeof stage.order !== 'number' || stage.order < 1) {
      throw new TypeError(`Stage at index ${index} must have valid order`);
    }
  });

  if (typeof validated.enableAnimations !== 'boolean') {
    throw new TypeError('enableAnimations must be a boolean');
  }

  if (typeof validated.staggerDelay !== 'number' || validated.staggerDelay < 0) {
    throw new TypeError('staggerDelay must be a non-negative number');
  }

  return validated;
};

/**
 * Creates workflow stage HTML
 * @param {WorkflowStage} stage - Stage configuration
 * @param {number} totalStages - Total number of stages
 * @returns {string} Stage HTML
 */
const createStageHTML = (stage, totalStages) => {
  const isLastStage = stage.order === totalStages;

  return `
    <div 
      class="workflow-stage relative"
      data-stage-id="${stage.id}"
      data-stage-order="${stage.order}"
      role="article"
      aria-labelledby="stage-${stage.id}-title"
    >
      <!-- Stage Card -->
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-400">
        
        <!-- Stage Number Badge -->
        <div class="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
          ${stage.order}
        </div>

        <!-- Icon Container -->
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 transform hover:scale-110 transition-transform duration-300">
            ${stage.icon}
          </div>
        </div>

        <!-- Stage Content -->
        <div class="text-center space-y-4">
          <h3 
            id="stage-${stage.id}-title"
            class="text-2xl font-bold text-neutral-900 dark:text-white"
          >
            ${stage.title}
          </h3>
          
          <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            ${stage.description}
          </p>
        </div>

        <!-- Interactive Hover Effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
      </div>

      <!-- Connector Arrow -->
      ${!isLastStage ? `
        <div class="workflow-connector hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-0" aria-hidden="true">
          <svg class="w-16 h-16 text-primary-300 dark:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      ` : ''}
    </div>
  `;
};

/**
 * Creates workflow section HTML
 * @param {WorkflowConfig} config - Workflow configuration
 * @returns {string} Section HTML
 */
const createWorkflowHTML = (config) => {
  const { title, subtitle, stages } = config;

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  const stagesHTML = sortedStages
    .map((stage) => createStageHTML(stage, stages.length))
    .join('');

  return `
    <section 
      id="workflow"
      class="relative py-20 md:py-32 bg-gradient-to-b from-white via-neutral-50 to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 overflow-hidden"
      aria-labelledby="workflow-title"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10" aria-hidden="true">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <!-- Content Container -->
      <div class="container relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 
            id="workflow-title"
            class="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-neutral-900 dark:text-white"
          >
            <span class="gradient-text">${title}</span>
          </h2>
          
          <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
            ${subtitle}
          </p>
        </div>

        <!-- Workflow Stages Grid -->
        <div 
          class="workflow-stages-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative"
          role="list"
        >
          ${stagesHTML}
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <a
            href="#signup"
            class="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            aria-label="Start your AI-powered development journey"
          >
            Start Your Journey
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 animate-pulse" aria-hidden="true"></div>
      <div class="absolute bottom-20 right-10 w-40 h-40 bg-secondary-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-500" aria-hidden="true"></div>
    </section>
  `;
};

/**
 * Tracks stage interaction events
 * @param {string} stageId - Stage identifier
 * @param {string} action - Interaction action
 */
const trackStageInteraction = (stageId, action) => {
  logEvent('stage_interaction', {
    stage_id: stageId,
    action,
    timestamp: Date.now(),
  });
};

/**
 * Initializes workflow section interactions
 * @param {HTMLElement} workflowElement - Workflow section element
 * @param {WorkflowConfig} config - Workflow configuration
 * @returns {Function} Cleanup function
 */
const initializeWorkflow = (workflowElement, config) => {
  const startTime = performance.now();
  const cleanupFunctions = [];

  const stageElements = workflowElement.querySelectorAll('[data-stage-id]');

  stageElements.forEach((stageElement) => {
    const stageId = stageElement.getAttribute('data-stage-id');

    const handleMouseEnter = () => {
      trackStageInteraction(stageId, 'hover');
    };

    const handleClick = () => {
      trackStageInteraction(stageId, 'click');
    };

    stageElement.addEventListener('mouseenter', handleMouseEnter);
    stageElement.addEventListener('click', handleClick);

    cleanupFunctions.push(() => {
      stageElement.removeEventListener('mouseenter', handleMouseEnter);
      stageElement.removeEventListener('click', handleClick);
    });
  });

  if (config.enableAnimations && isAnimationsEnabled()) {
    try {
      const stageAnimations = createStaggeredAnimations(
        Array.from(stageElements),
        {
          preset: 'fadeInUp',
          stagger: config.staggerDelay,
          config: {
            animationDuration: 600,
            once: true,
          },
        }
      );

      cleanupFunctions.push(() => {
        stageAnimations.disconnectAll();
      });

      logEvent('workflow_animations_initialized', {
        stage_count: stageElements.length,
        stagger_delay: config.staggerDelay,
      });
    } catch (error) {
      logEvent('workflow_animations_error', {
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  const renderTime = performance.now() - startTime;
  logEvent('workflow_initialized', {
    render_time_ms: renderTime.toFixed(2),
    stage_count: stageElements.length,
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('workflow_cleanup', {});
  };
};

/**
 * Renders workflow section into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration
 * @returns {Object} Workflow instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const renderWorkflowSection = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Workflow section target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const workflowHTML = createWorkflowHTML(config);
    targetElement.innerHTML = workflowHTML;

    const workflowElement = targetElement.querySelector('#workflow');
    if (!workflowElement) {
      throw new Error('Failed to create workflow section element');
    }

    const cleanup = initializeWorkflow(workflowElement, config);

    const totalTime = performance.now() - startTime;
    logEvent('workflow_rendered', {
      total_time_ms: totalTime.toFixed(2),
      stage_count: config.stages.length,
    });

    return {
      element: workflowElement,
      config,
      cleanup,
    };
  } catch (error) {
    logEvent('workflow_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to render workflow section: ${error.message}`, {
      cause: error,
    });
  }
};

export default renderWorkflowSection;