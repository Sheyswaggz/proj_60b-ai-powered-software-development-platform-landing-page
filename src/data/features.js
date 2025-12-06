/**
 * Features Data Configuration
 * 
 * Comprehensive feature definitions for the AI-powered software development platform.
 * Includes feature metadata, benefits, icons, and display configuration.
 * 
 * @generated-from: task-id:TASK-004
 * @modifies: features-section.js
 * @dependencies: []
 */

/**
 * Feature category enumeration
 * @readonly
 * @enum {string}
 */
const FEATURE_CATEGORIES = Object.freeze({
  DEVELOPMENT: 'development',
  TESTING: 'testing',
  DEPLOYMENT: 'deployment',
  MONITORING: 'monitoring',
  COLLABORATION: 'collaboration',
  SECURITY: 'security',
});

/**
 * Feature priority levels
 * @readonly
 * @enum {number}
 */
const FEATURE_PRIORITY = Object.freeze({
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
});

/**
 * SVG icon definitions for features
 * @readonly
 */
const FEATURE_ICONS = Object.freeze({
  CODE_GENERATION: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  `,
  AUTOMATED_TESTING: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
  DEPLOYMENT_AUTOMATION: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  `,
  CONTINUOUS_MONITORING: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `,
  INTELLIGENT_DEBUGGING: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  `,
  CODE_REVIEW: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  `,
  SECURITY_SCANNING: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  `,
  PERFORMANCE_OPTIMIZATION: `
    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  `,
});

/**
 * Platform features configuration
 * @type {Array<Object>}
 */
const FEATURES = Object.freeze([
  {
    id: 'intelligent-code-generation',
    title: 'Intelligent Code Generation',
    description: 'AI-powered code generation that understands context, follows best practices, and produces production-ready code across multiple languages and frameworks.',
    benefits: [
      'Generate complete features from natural language descriptions',
      'Context-aware code that follows project conventions',
      'Support for 50+ programming languages and frameworks',
      'Automatic documentation and test generation',
    ],
    icon: FEATURE_ICONS.CODE_GENERATION,
    category: FEATURE_CATEGORIES.DEVELOPMENT,
    priority: FEATURE_PRIORITY.CRITICAL,
    order: 1,
    metadata: {
      tags: ['ai', 'code-generation', 'productivity'],
      releaseVersion: '1.0.0',
      betaFeature: false,
    },
  },
  {
    id: 'automated-testing',
    title: 'Automated Testing Suite',
    description: 'Comprehensive automated testing with intelligent test generation, coverage analysis, and continuous quality assurance across your entire codebase.',
    benefits: [
      'Auto-generate unit, integration, and e2e tests',
      'Achieve 90%+ code coverage automatically',
      'Intelligent test case prioritization',
      'Real-time test execution and reporting',
    ],
    icon: FEATURE_ICONS.AUTOMATED_TESTING,
    category: FEATURE_CATEGORIES.TESTING,
    priority: FEATURE_PRIORITY.CRITICAL,
    order: 2,
    metadata: {
      tags: ['testing', 'quality-assurance', 'automation'],
      releaseVersion: '1.0.0',
      betaFeature: false,
    },
  },
  {
    id: 'deployment-automation',
    title: 'Deployment Automation',
    description: 'Streamlined deployment pipelines with zero-downtime releases, automatic rollbacks, and multi-environment management for seamless production deployments.',
    benefits: [
      'One-click deployments to any environment',
      'Automatic rollback on failure detection',
      'Blue-green and canary deployment strategies',
      'Infrastructure as code integration',
    ],
    icon: FEATURE_ICONS.DEPLOYMENT_AUTOMATION,
    category: FEATURE_CATEGORIES.DEPLOYMENT,
    priority: FEATURE_PRIORITY.HIGH,
    order: 3,
    metadata: {
      tags: ['deployment', 'ci-cd', 'devops'],
      releaseVersion: '1.0.0',
      betaFeature: false,
    },
  },
  {
    id: 'continuous-monitoring',
    title: 'Continuous Monitoring',
    description: 'Real-time application monitoring with intelligent alerting, performance analytics, and proactive issue detection to ensure optimal system health.',
    benefits: [
      'Real-time performance metrics and dashboards',
      'Intelligent anomaly detection and alerting',
      'Distributed tracing across microservices',
      'Custom metric tracking and visualization',
    ],
    icon: FEATURE_ICONS.CONTINUOUS_MONITORING,
    category: FEATURE_CATEGORIES.MONITORING,
    priority: FEATURE_PRIORITY.HIGH,
    order: 4,
    metadata: {
      tags: ['monitoring', 'observability', 'analytics'],
      releaseVersion: '1.0.0',
      betaFeature: false,
    },
  },
  {
    id: 'intelligent-debugging',
    title: 'Intelligent Debugging',
    description: 'AI-assisted debugging that identifies root causes, suggests fixes, and provides step-by-step resolution guidance for complex issues.',
    benefits: [
      'Automatic root cause analysis',
      'AI-powered fix suggestions',
      'Interactive debugging sessions',
      'Historical issue pattern recognition',
    ],
    icon: FEATURE_ICONS.INTELLIGENT_DEBUGGING,
    category: FEATURE_CATEGORIES.DEVELOPMENT,
    priority: FEATURE_PRIORITY.HIGH,
    order: 5,
    metadata: {
      tags: ['debugging', 'ai', 'troubleshooting'],
      releaseVersion: '1.1.0',
      betaFeature: false,
    },
  },
  {
    id: 'automated-code-review',
    title: 'Automated Code Review',
    description: 'Intelligent code review system that analyzes pull requests, identifies issues, suggests improvements, and ensures code quality standards.',
    benefits: [
      'Instant code quality analysis',
      'Security vulnerability detection',
      'Best practice recommendations',
      'Automated style and convention enforcement',
    ],
    icon: FEATURE_ICONS.CODE_REVIEW,
    category: FEATURE_CATEGORIES.COLLABORATION,
    priority: FEATURE_PRIORITY.MEDIUM,
    order: 6,
    metadata: {
      tags: ['code-review', 'quality', 'collaboration'],
      releaseVersion: '1.2.0',
      betaFeature: false,
    },
  },
  {
    id: 'security-scanning',
    title: 'Security Scanning',
    description: 'Comprehensive security analysis with vulnerability detection, dependency scanning, and compliance checking to protect your applications.',
    benefits: [
      'Automated vulnerability scanning',
      'Dependency security analysis',
      'Compliance reporting and tracking',
      'Real-time security alerts',
    ],
    icon: FEATURE_ICONS.SECURITY_SCANNING,
    category: FEATURE_CATEGORIES.SECURITY,
    priority: FEATURE_PRIORITY.CRITICAL,
    order: 7,
    metadata: {
      tags: ['security', 'compliance', 'scanning'],
      releaseVersion: '1.0.0',
      betaFeature: false,
    },
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Automated performance analysis and optimization recommendations to ensure your applications run at peak efficiency.',
    benefits: [
      'Automatic performance bottleneck detection',
      'Code optimization suggestions',
      'Resource usage analysis',
      'Load testing and benchmarking',
    ],
    icon: FEATURE_ICONS.PERFORMANCE_OPTIMIZATION,
    category: FEATURE_CATEGORIES.MONITORING,
    priority: FEATURE_PRIORITY.MEDIUM,
    order: 8,
    metadata: {
      tags: ['performance', 'optimization', 'efficiency'],
      releaseVersion: '1.3.0',
      betaFeature: true,
    },
  },
]);

/**
 * Validates feature configuration structure
 * @param {Object} feature - Feature to validate
 * @returns {boolean} True if valid
 * @throws {TypeError} If feature invalid
 */
const validateFeature = (feature) => {
  if (!feature || typeof feature !== 'object') {
    throw new TypeError('Feature must be an object');
  }

  const requiredFields = ['id', 'title', 'description', 'benefits', 'icon', 'category', 'priority', 'order'];
  
  for (const field of requiredFields) {
    if (!(field in feature)) {
      throw new TypeError(`Feature missing required field: ${field}`);
    }
  }

  if (typeof feature.id !== 'string' || !feature.id.trim()) {
    throw new TypeError('Feature id must be non-empty string');
  }

  if (typeof feature.title !== 'string' || !feature.title.trim()) {
    throw new TypeError('Feature title must be non-empty string');
  }

  if (typeof feature.description !== 'string' || !feature.description.trim()) {
    throw new TypeError('Feature description must be non-empty string');
  }

  if (!Array.isArray(feature.benefits) || feature.benefits.length === 0) {
    throw new TypeError('Feature benefits must be non-empty array');
  }

  feature.benefits.forEach((benefit, index) => {
    if (typeof benefit !== 'string' || !benefit.trim()) {
      throw new TypeError(`Benefit at index ${index} must be non-empty string`);
    }
  });

  if (typeof feature.icon !== 'string' || !feature.icon.trim()) {
    throw new TypeError('Feature icon must be non-empty string');
  }

  if (!Object.values(FEATURE_CATEGORIES).includes(feature.category)) {
    throw new TypeError(`Invalid feature category: ${feature.category}`);
  }

  if (!Object.values(FEATURE_PRIORITY).includes(feature.priority)) {
    throw new TypeError(`Invalid feature priority: ${feature.priority}`);
  }

  if (typeof feature.order !== 'number' || feature.order < 1) {
    throw new TypeError('Feature order must be positive number');
  }

  return true;
};

/**
 * Validates all features configuration
 * @returns {Object} Validation result
 * @throws {Error} If validation fails
 */
const validateAllFeatures = () => {
  const startTime = performance.now();
  const errors = [];
  const warnings = [];

  const seenIds = new Set();
  const seenOrders = new Set();

  FEATURES.forEach((feature, index) => {
    try {
      validateFeature(feature);

      if (seenIds.has(feature.id)) {
        errors.push(`Duplicate feature id: ${feature.id}`);
      }
      seenIds.add(feature.id);

      if (seenOrders.has(feature.order)) {
        warnings.push(`Duplicate feature order: ${feature.order}`);
      }
      seenOrders.add(feature.order);

    } catch (error) {
      errors.push(`Feature at index ${index}: ${error.message}`);
    }
  });

  const validationTime = performance.now() - startTime;

  if (errors.length > 0) {
    throw new Error(`Feature validation failed:\n${errors.join('\n')}`);
  }

  return {
    valid: true,
    featureCount: FEATURES.length,
    warnings,
    validationTimeMs: validationTime.toFixed(2),
  };
};

/**
 * Gets feature by ID
 * @param {string} featureId - Feature identifier
 * @returns {Object|null} Feature object or null if not found
 */
export const getFeatureById = (featureId) => {
  if (typeof featureId !== 'string' || !featureId.trim()) {
    throw new TypeError('Feature ID must be non-empty string');
  }

  return FEATURES.find((feature) => feature.id === featureId) || null;
};

/**
 * Gets features by category
 * @param {string} category - Feature category
 * @returns {Array<Object>} Array of features in category
 */
export const getFeaturesByCategory = (category) => {
  if (!Object.values(FEATURE_CATEGORIES).includes(category)) {
    throw new TypeError(`Invalid category: ${category}`);
  }

  return FEATURES.filter((feature) => feature.category === category);
};

/**
 * Gets features by priority
 * @param {number} priority - Feature priority level
 * @returns {Array<Object>} Array of features with priority
 */
export const getFeaturesByPriority = (priority) => {
  if (!Object.values(FEATURE_PRIORITY).includes(priority)) {
    throw new TypeError(`Invalid priority: ${priority}`);
  }

  return FEATURES.filter((feature) => feature.priority === priority);
};

/**
 * Gets features sorted by order
 * @returns {Array<Object>} Features sorted by display order
 */
export const getFeaturesSortedByOrder = () => {
  return [...FEATURES].sort((a, b) => a.order - b.order);
};

/**
 * Gets features sorted by priority
 * @returns {Array<Object>} Features sorted by priority
 */
export const getFeaturesSortedByPriority = () => {
  return [...FEATURES].sort((a, b) => a.priority - b.priority);
};

/**
 * Gets all features
 * @returns {Array<Object>} All features
 */
export const getAllFeatures = () => {
  return [...FEATURES];
};

/**
 * Gets total feature count
 * @returns {number} Total number of features
 */
export const getTotalFeatures = () => {
  return FEATURES.length;
};

/**
 * Gets feature categories
 * @returns {Object} Feature categories enum
 */
export const getFeatureCategories = () => {
  return { ...FEATURE_CATEGORIES };
};

/**
 * Gets feature priorities
 * @returns {Object} Feature priorities enum
 */
export const getFeaturePriorities = () => {
  return { ...FEATURE_PRIORITY };
};

/**
 * Gets beta features
 * @returns {Array<Object>} Array of beta features
 */
export const getBetaFeatures = () => {
  return FEATURES.filter((feature) => feature.metadata?.betaFeature === true);
};

/**
 * Gets features by release version
 * @param {string} version - Release version
 * @returns {Array<Object>} Features in release version
 */
export const getFeaturesByVersion = (version) => {
  if (typeof version !== 'string' || !version.trim()) {
    throw new TypeError('Version must be non-empty string');
  }

  return FEATURES.filter((feature) => feature.metadata?.releaseVersion === version);
};

/**
 * Searches features by keyword
 * @param {string} keyword - Search keyword
 * @returns {Array<Object>} Matching features
 */
export const searchFeatures = (keyword) => {
  if (typeof keyword !== 'string' || !keyword.trim()) {
    return [];
  }

  const searchTerm = keyword.toLowerCase();

  return FEATURES.filter((feature) => {
    return (
      feature.title.toLowerCase().includes(searchTerm) ||
      feature.description.toLowerCase().includes(searchTerm) ||
      feature.benefits.some((benefit) => benefit.toLowerCase().includes(searchTerm)) ||
      feature.metadata?.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  });
};

validateAllFeatures();

export { FEATURES, FEATURE_CATEGORIES, FEATURE_PRIORITY, FEATURE_ICONS, validateAllFeatures };

export default FEATURES;