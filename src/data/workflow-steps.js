/**
 * Workflow Steps Data Configuration
 * 
 * Complete workflow step definitions with titles, descriptions, icons, timing,
 * dependencies, and animation configurations for the AI development process.
 * 
 * @generated-from: task-id:TASK-003
 * @modifies: workflow-section.js
 * @dependencies: ["workflow-step.js"]
 */

/**
 * Workflow step data structure
 * @typedef {Object} WorkflowStepData
 * @property {string} id - Unique step identifier
 * @property {string} title - Step title
 * @property {string} description - Step description
 * @property {string} icon - SVG icon markup
 * @property {number} order - Display order (1-based)
 * @property {string[]} dependencies - IDs of prerequisite steps
 * @property {Object} animation - Animation configuration
 * @property {number} animation.delay - Animation delay in ms
 * @property {number} animation.duration - Animation duration in ms
 * @property {string} animation.easing - CSS easing function
 * @property {Object} metadata - Additional step metadata
 */

/**
 * Animation timing configuration
 * @type {Object}
 */
const ANIMATION_CONFIG = Object.freeze({
  BASE_DELAY: 100,
  STEP_DELAY_INCREMENT: 150,
  DEFAULT_DURATION: 600,
  STAGGER_MULTIPLIER: 1.2,
  EASING: {
    SMOOTH: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    EASE_OUT: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  },
});

/**
 * SVG icon definitions for workflow steps
 * @type {Object.<string, string>}
 */
const STEP_ICONS = Object.freeze({
  IDEA: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  `,
  REQUIREMENTS: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `,
  PLANNING: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  `,
  CODE_GENERATION: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  `,
  TESTING: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
  MONITORING: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `,
});

/**
 * Complete workflow steps data
 * @type {WorkflowStepData[]}
 */
const WORKFLOW_STEPS = Object.freeze([
  {
    id: 'idea-input',
    title: 'Idea Input',
    description: 'Share your vision through natural conversation. Our AI understands your goals, constraints, and requirements to kickstart the development process.',
    icon: STEP_ICONS.IDEA,
    order: 1,
    dependencies: [],
    animation: {
      delay: ANIMATION_CONFIG.BASE_DELAY,
      duration: ANIMATION_CONFIG.DEFAULT_DURATION,
      easing: ANIMATION_CONFIG.EASING.BOUNCE,
    },
    metadata: {
      category: 'input',
      estimatedTime: '5-10 minutes',
      userInteraction: 'high',
      automationLevel: 'assisted',
      keyFeatures: [
        'Natural language processing',
        'Context understanding',
        'Requirement extraction',
        'Goal clarification',
      ],
    },
  },
  {
    id: 'requirements-gathering',
    title: 'Requirements Gathering',
    description: 'AI analyzes your input and generates comprehensive technical requirements, user stories, and acceptance criteria with intelligent suggestions.',
    icon: STEP_ICONS.REQUIREMENTS,
    order: 2,
    dependencies: ['idea-input'],
    animation: {
      delay: ANIMATION_CONFIG.BASE_DELAY + ANIMATION_CONFIG.STEP_DELAY_INCREMENT,
      duration: ANIMATION_CONFIG.DEFAULT_DURATION,
      easing: ANIMATION_CONFIG.EASING.SMOOTH,
    },
    metadata: {
      category: 'analysis',
      estimatedTime: '2-5 minutes',
      userInteraction: 'medium',
      automationLevel: 'high',
      keyFeatures: [
        'Automated requirement generation',
        'User story creation',
        'Acceptance criteria definition',
        'Technical specification',
      ],
    },
  },
  {
    id: 'project-planning',
    title: 'Project Planning',
    description: 'Intelligent task breakdown, sprint planning, and resource allocation. AI creates a detailed roadmap with milestones and dependencies.',
    icon: STEP_ICONS.PLANNING,
    order: 3,
    dependencies: ['requirements-gathering'],
    animation: {
      delay: ANIMATION_CONFIG.BASE_DELAY + ANIMATION_CONFIG.STEP_DELAY_INCREMENT * 2,
      duration: ANIMATION_CONFIG.DEFAULT_DURATION,
      easing: ANIMATION_CONFIG.EASING.SMOOTH,
    },
    metadata: {
      category: 'planning',
      estimatedTime: '3-7 minutes',
      userInteraction: 'medium',
      automationLevel: 'high',
      keyFeatures: [
        'Task decomposition',
        'Sprint planning',
        'Dependency mapping',
        'Timeline estimation',
      ],
    },
  },
  {
    id: 'code-generation',
    title: 'Code Generation',
    description: 'Production-ready code generated following best practices, design patterns, and your project conventions. Complete with tests and documentation.',
    icon: STEP_ICONS.CODE_GENERATION,
    order: 4,
    dependencies: ['project-planning'],
    animation: {
      delay: ANIMATION_CONFIG.BASE_DELAY + ANIMATION_CONFIG.STEP_DELAY_INCREMENT * 3,
      duration: ANIMATION_CONFIG.DEFAULT_DURATION * ANIMATION_CONFIG.STAGGER_MULTIPLIER,
      easing: ANIMATION_CONFIG.EASING.EASE_OUT,
    },
    metadata: {
      category: 'development',
      estimatedTime: '10-30 minutes',
      userInteraction: 'low',
      automationLevel: 'very-high',
      keyFeatures: [
        'Production-ready code',
        'Best practices enforcement',
        'Automated testing',
        'Documentation generation',
      ],
    },
  },
  {
    id: 'testing-deployment',
    title: 'Testing & Deployment',
    description: 'Automated testing suite execution, quality checks, and seamless deployment. Continuous integration ensures code quality and reliability.',
    icon: STEP_ICONS.TESTING,
    order: 5,
    dependencies: ['code-generation'],
    animation: {
      delay: ANIMATION_CONFIG.BASE_DELAY + ANIMATION_CONFIG.STEP_DELAY_INCREMENT * 4,
      duration: ANIMATION_CONFIG.DEFAULT_DURATION,
      easing: ANIMATION_CONFIG.EASING.SMOOTH,
    },
    metadata: {
      category: 'quality-assurance',
      estimatedTime: '5-15 minutes',
      userInteraction: 'low',
      automationLevel: 'very-high',
      keyFeatures: [
        'Automated test execution',
        'Quality gate checks',
        'CI/CD integration',
        'Deployment automation',
      ],
    },
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Optimization',
    description: 'Real-time performance monitoring, error tracking, and AI-powered optimization suggestions. Continuous improvement of your application.',
    icon: STEP_ICONS.MONITORING,
    order: 6,
    dependencies: ['testing-deployment'],
    animation: {
      delay: ANIMATION_CONFIG.BASE_DELAY + ANIMATION_CONFIG.STEP_DELAY_INCREMENT * 5,
      duration: ANIMATION_CONFIG.DEFAULT_DURATION,
      easing: ANIMATION_CONFIG.EASING.BOUNCE,
    },
    metadata: {
      category: 'operations',
      estimatedTime: 'Continuous',
      userInteraction: 'low',
      automationLevel: 'high',
      keyFeatures: [
        'Performance monitoring',
        'Error tracking',
        'Usage analytics',
        'Optimization recommendations',
      ],
    },
  },
]);

/**
 * Validates workflow step data structure
 * @param {Object} step - Step to validate
 * @returns {boolean} True if valid
 * @throws {TypeError} If validation fails
 */
const validateStep = (step) => {
  if (!step || typeof step !== 'object') {
    throw new TypeError('Workflow step must be an object');
  }

  const requiredFields = ['id', 'title', 'description', 'icon', 'order', 'dependencies', 'animation', 'metadata'];
  
  for (const field of requiredFields) {
    if (!(field in step)) {
      throw new TypeError(`Workflow step missing required field: ${field}`);
    }
  }

  if (typeof step.id !== 'string' || !step.id.trim()) {
    throw new TypeError('Step id must be a non-empty string');
  }

  if (typeof step.title !== 'string' || !step.title.trim()) {
    throw new TypeError('Step title must be a non-empty string');
  }

  if (typeof step.description !== 'string' || !step.description.trim()) {
    throw new TypeError('Step description must be a non-empty string');
  }

  if (typeof step.icon !== 'string' || !step.icon.trim()) {
    throw new TypeError('Step icon must be a non-empty string');
  }

  if (typeof step.order !== 'number' || step.order < 1) {
    throw new TypeError('Step order must be a positive number');
  }

  if (!Array.isArray(step.dependencies)) {
    throw new TypeError('Step dependencies must be an array');
  }

  if (!step.animation || typeof step.animation !== 'object') {
    throw new TypeError('Step animation must be an object');
  }

  if (typeof step.animation.delay !== 'number' || step.animation.delay < 0) {
    throw new TypeError('Animation delay must be a non-negative number');
  }

  if (typeof step.animation.duration !== 'number' || step.animation.duration <= 0) {
    throw new TypeError('Animation duration must be a positive number');
  }

  if (typeof step.animation.easing !== 'string' || !step.animation.easing.trim()) {
    throw new TypeError('Animation easing must be a non-empty string');
  }

  if (!step.metadata || typeof step.metadata !== 'object') {
    throw new TypeError('Step metadata must be an object');
  }

  return true;
};

/**
 * Validates workflow step dependencies
 * @param {WorkflowStepData[]} steps - All workflow steps
 * @returns {boolean} True if all dependencies valid
 * @throws {Error} If circular or missing dependencies found
 */
const validateDependencies = (steps) => {
  const stepIds = new Set(steps.map((step) => step.id));
  const visited = new Set();
  const recursionStack = new Set();

  const hasCycle = (stepId, dependencies) => {
    if (recursionStack.has(stepId)) {
      return true;
    }

    if (visited.has(stepId)) {
      return false;
    }

    visited.add(stepId);
    recursionStack.add(stepId);

    const step = steps.find((s) => s.id === stepId);
    if (step) {
      for (const depId of step.dependencies) {
        if (hasCycle(depId, dependencies)) {
          return true;
        }
      }
    }

    recursionStack.delete(stepId);
    return false;
  };

  for (const step of steps) {
    for (const depId of step.dependencies) {
      if (!stepIds.has(depId)) {
        throw new Error(`Step "${step.id}" has missing dependency: "${depId}"`);
      }
    }

    if (hasCycle(step.id, step.dependencies)) {
      throw new Error(`Circular dependency detected for step: "${step.id}"`);
    }
  }

  return true;
};

/**
 * Gets workflow step by ID
 * @param {string} stepId - Step identifier
 * @returns {WorkflowStepData|null} Step data or null if not found
 */
export const getStepById = (stepId) => {
  if (typeof stepId !== 'string' || !stepId.trim()) {
    return null;
  }

  return WORKFLOW_STEPS.find((step) => step.id === stepId) || null;
};

/**
 * Gets workflow steps by order
 * @param {number[]} orders - Array of order numbers
 * @returns {WorkflowStepData[]} Matching steps
 */
export const getStepsByOrder = (orders) => {
  if (!Array.isArray(orders)) {
    return [];
  }

  return WORKFLOW_STEPS.filter((step) => orders.includes(step.order));
};

/**
 * Gets all workflow steps
 * @returns {WorkflowStepData[]} All workflow steps
 */
export const getAllSteps = () => {
  return [...WORKFLOW_STEPS];
};

/**
 * Gets total number of workflow steps
 * @returns {number} Total step count
 */
export const getTotalSteps = () => {
  return WORKFLOW_STEPS.length;
};

/**
 * Gets workflow step dependencies
 * @param {string} stepId - Step identifier
 * @returns {WorkflowStepData[]} Array of dependency steps
 */
export const getStepDependencies = (stepId) => {
  const step = getStepById(stepId);
  if (!step) {
    return [];
  }

  return step.dependencies
    .map((depId) => getStepById(depId))
    .filter((dep) => dep !== null);
};

/**
 * Gets workflow steps that depend on given step
 * @param {string} stepId - Step identifier
 * @returns {WorkflowStepData[]} Array of dependent steps
 */
export const getStepDependents = (stepId) => {
  if (typeof stepId !== 'string' || !stepId.trim()) {
    return [];
  }

  return WORKFLOW_STEPS.filter((step) => step.dependencies.includes(stepId));
};

/**
 * Gets animation configuration for step
 * @param {string} stepId - Step identifier
 * @returns {Object|null} Animation config or null if not found
 */
export const getStepAnimation = (stepId) => {
  const step = getStepById(stepId);
  return step ? { ...step.animation } : null;
};

/**
 * Gets workflow steps sorted by order
 * @returns {WorkflowStepData[]} Sorted steps
 */
export const getStepsSortedByOrder = () => {
  return [...WORKFLOW_STEPS].sort((a, b) => a.order - b.order);
};

/**
 * Validates all workflow steps
 * @returns {boolean} True if all steps valid
 * @throws {Error} If validation fails
 */
export const validateWorkflowSteps = () => {
  try {
    for (const step of WORKFLOW_STEPS) {
      validateStep(step);
    }

    validateDependencies(WORKFLOW_STEPS);

    const orders = WORKFLOW_STEPS.map((step) => step.order);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      throw new Error('Duplicate step orders detected');
    }

    const expectedOrders = Array.from({ length: WORKFLOW_STEPS.length }, (_, i) => i + 1);
    for (const expectedOrder of expectedOrders) {
      if (!orders.includes(expectedOrder)) {
        throw new Error(`Missing step with order: ${expectedOrder}`);
      }
    }

    return true;
  } catch (error) {
    throw new Error(`Workflow steps validation failed: ${error.message}`, {
      cause: error,
    });
  }
};

validateWorkflowSteps();

export { WORKFLOW_STEPS, ANIMATION_CONFIG, STEP_ICONS };
export default WORKFLOW_STEPS;