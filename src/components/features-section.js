/**
 * Features Section Component
 * 
 * Displays comprehensive features showcase highlighting key platform capabilities
 * with responsive grid layout, interactive hover effects, and accessibility features.
 * 
 * @generated-from: task-id:TASK-004
 * @modifies: index.html
 * @dependencies: ["TASK-003"]
 */

import { createScrollAnimation, createStaggeredAnimations } from '../utils/animations.js';

/**
 * Feature configuration
 * @typedef {Object} Feature
 * @property {string} id - Unique feature identifier
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 * @property {Array<string>} benefits - Feature benefits list
 * @property {string} icon - SVG icon markup
 * @property {number} order - Display order
 */

/**
 * Features section configuration
 * @typedef {Object} FeaturesConfig
 * @property {string} title - Section title
 * @property {string} subtitle - Section subtitle
 * @property {Array<Feature>} features - Features list
 * @property {boolean} enableAnimations - Enable scroll animations
 * @property {number} staggerDelay - Delay between feature animations
 */

/**
 * Default features configuration
 * @type {Array<Feature>}
 */
const DEFAULT_FEATURES = Object.freeze([
  {
    id: 'code-generation',
    title: 'Intelligent Code Generation',
    description: 'AI-powered code generation that understands context, follows best practices, and produces production-ready code across multiple languages and frameworks.',
    benefits: [
      'Context-aware code suggestions',
      'Multi-language support',
      'Best practices enforcement',
      'Production-ready output',
    ],
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>`,
    order: 1,
  },
  {
    id: 'automated-testing',
    title: 'Automated Testing',
    description: 'Comprehensive test generation and execution with intelligent test case creation, coverage analysis, and continuous quality assurance.',
    benefits: [
      'Automatic test generation',
      'High coverage targets',
      'Edge case detection',
      'Continuous validation',
    ],
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
    order: 2,
  },
  {
    id: 'deployment-automation',
    title: 'Deployment Automation',
    description: 'Seamless deployment pipelines with automated builds, testing, and rollout strategies. Zero-downtime deployments with intelligent rollback capabilities.',
    benefits: [
      'One-click deployments',
      'Zero-downtime updates',
      'Automatic rollbacks',
      'Multi-environment support',
    ],
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>`,
    order: 3,
  },
  {
    id: 'continuous-monitoring',
    title: 'Continuous Monitoring',
    description: 'Real-time application monitoring with performance tracking, error detection, and automated alerting. Proactive issue resolution before users are affected.',
    benefits: [
      'Real-time metrics',
      'Automated alerts',
      'Performance insights',
      'Proactive issue detection',
    ],
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>`,
    order: 4,
  },
  {
    id: 'multi-language',
    title: 'Multi-language Support',
    description: 'Comprehensive support for modern programming languages and frameworks. Seamlessly switch between JavaScript, Python, Java, Go, and more.',
    benefits: [
      '20+ languages supported',
      'Framework-specific patterns',
      'Cross-language refactoring',
      'Consistent code quality',
    ],
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>`,
    order: 5,
  },
  {
    id: 'real-time-collaboration',
    title: 'Real-time Collaboration',
    description: 'Collaborative development environment with live code sharing, pair programming support, and team synchronization features.',
    benefits: [
      'Live code sharing',
      'Team synchronization',
      'Conflict resolution',
      'Activity tracking',
    ],
    icon: `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>`,
    order: 6,
  },
]);

/**
 * Default features section configuration
 * @type {FeaturesConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  title: 'Powerful Features',
  subtitle: 'Everything you need to build, deploy, and scale modern applications',
  features: DEFAULT_FEATURES,
  enableAnimations: true,
  staggerDelay: 100,
});

/**
 * Feature flag for animations
 * @returns {boolean} True if animations enabled
 */
const isAnimationsEnabled = () => {
  try {
    const flagValue = localStorage.getItem('features_animations');
    return flagValue !== 'off';
  } catch (error) {
    console.warn('[FeaturesSection] Failed to read feature flag:', error);
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
    component: 'features-section',
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[FeaturesSection]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'features',
      ...context,
    });
  }
};

/**
 * Validates features configuration
 * @param {Object} config - Configuration to validate
 * @returns {FeaturesConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Features configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.title !== 'string' || !validated.title.trim()) {
    throw new TypeError('Title must be a non-empty string');
  }

  if (typeof validated.subtitle !== 'string' || !validated.subtitle.trim()) {
    throw new TypeError('Subtitle must be a non-empty string');
  }

  if (!Array.isArray(validated.features) || validated.features.length === 0) {
    throw new TypeError('Features must be a non-empty array');
  }

  validated.features.forEach((feature, index) => {
    if (!feature || typeof feature !== 'object') {
      throw new TypeError(`Feature at index ${index} must be an object`);
    }
    if (typeof feature.id !== 'string' || !feature.id.trim()) {
      throw new TypeError(`Feature at index ${index} must have valid id`);
    }
    if (typeof feature.title !== 'string' || !feature.title.trim()) {
      throw new TypeError(`Feature at index ${index} must have valid title`);
    }
    if (typeof feature.description !== 'string' || !feature.description.trim()) {
      throw new TypeError(`Feature at index ${index} must have valid description`);
    }
    if (!Array.isArray(feature.benefits) || feature.benefits.length === 0) {
      throw new TypeError(`Feature at index ${index} must have valid benefits array`);
    }
    if (typeof feature.icon !== 'string' || !feature.icon.trim()) {
      throw new TypeError(`Feature at index ${index} must have valid icon`);
    }
    if (typeof feature.order !== 'number' || feature.order < 1) {
      throw new TypeError(`Feature at index ${index} must have valid order`);
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
 * Creates feature card HTML
 * @param {Feature} feature - Feature configuration
 * @returns {string} Feature card HTML
 */
const createFeatureHTML = (feature) => {
  const benefitsHTML = feature.benefits
    .map(
      (benefit) => `
        <li class="flex items-start gap-2">
          <svg class="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-neutral-600 dark:text-neutral-300">${benefit}</span>
        </li>
      `
    )
    .join('');

  return `
    <div 
      class="feature-card group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-400 h-full flex flex-col"
      data-feature-id="${feature.id}"
      data-feature-order="${feature.order}"
      role="article"
      aria-labelledby="feature-${feature.id}-title"
    >
      <!-- Icon Container -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          ${feature.icon}
        </div>
      </div>

      <!-- Feature Content -->
      <div class="flex-grow space-y-4">
        <h3 
          id="feature-${feature.id}-title"
          class="text-2xl font-bold text-neutral-900 dark:text-white text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
        >
          ${feature.title}
        </h3>
        
        <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed text-center">
          ${feature.description}
        </p>

        <!-- Benefits List -->
        <div class="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <ul class="space-y-3" role="list">
            ${benefitsHTML}
          </ul>
        </div>
      </div>

      <!-- Hover Effect Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"></div>
    </div>
  `;
};

/**
 * Creates features section HTML
 * @param {FeaturesConfig} config - Features configuration
 * @returns {string} Section HTML
 */
const createFeaturesHTML = (config) => {
  const { title, subtitle, features } = config;

  const sortedFeatures = [...features].sort((a, b) => a.order - b.order);
  const featuresHTML = sortedFeatures
    .map((feature) => createFeatureHTML(feature))
    .join('');

  return `
    <section 
      id="features"
      class="relative py-20 md:py-32 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 overflow-hidden"
      aria-labelledby="features-title"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10" aria-hidden="true">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      </div>

      <!-- Content Container -->
      <div class="container relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 
            id="features-title"
            class="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-neutral-900 dark:text-white"
          >
            <span class="gradient-text">${title}</span>
          </h2>
          
          <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
            ${subtitle}
          </p>
        </div>

        <!-- Features Grid -->
        <div 
          class="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          role="list"
        >
          ${featuresHTML}
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <a
            href="#signup"
            class="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            aria-label="Explore all features in detail"
          >
            Explore All Features
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-20 right-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 animate-pulse" aria-hidden="true"></div>
      <div class="absolute bottom-20 left-10 w-40 h-40 bg-secondary-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-500" aria-hidden="true"></div>
    </section>
  `;
};

/**
 * Tracks feature interaction events
 * @param {string} featureId - Feature identifier
 * @param {string} action - Interaction action
 */
const trackFeatureInteraction = (featureId, action) => {
  logEvent('feature_interaction', {
    feature_id: featureId,
    action,
    timestamp: Date.now(),
  });
};

/**
 * Initializes features section interactions
 * @param {HTMLElement} featuresElement - Features section element
 * @param {FeaturesConfig} config - Features configuration
 * @returns {Function} Cleanup function
 */
const initializeFeatures = (featuresElement, config) => {
  const startTime = performance.now();
  const cleanupFunctions = [];

  const featureCards = featuresElement.querySelectorAll('[data-feature-id]');

  featureCards.forEach((card) => {
    const featureId = card.getAttribute('data-feature-id');

    const handleMouseEnter = () => {
      trackFeatureInteraction(featureId, 'hover');
    };

    const handleClick = () => {
      trackFeatureInteraction(featureId, 'click');
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('click', handleClick);

    cleanupFunctions.push(() => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('click', handleClick);
    });
  });

  if (config.enableAnimations && isAnimationsEnabled()) {
    try {
      const featureAnimations = createStaggeredAnimations(
        Array.from(featureCards),
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
        featureAnimations.disconnectAll();
      });

      logEvent('features_animations_initialized', {
        feature_count: featureCards.length,
        stagger_delay: config.staggerDelay,
      });
    } catch (error) {
      logEvent('features_animations_error', {
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  const renderTime = performance.now() - startTime;
  logEvent('features_initialized', {
    render_time_ms: renderTime.toFixed(2),
    feature_count: featureCards.length,
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('features_cleanup', {});
  };
};

/**
 * Renders features section into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration
 * @returns {Object} Features instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const renderFeaturesSection = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Features section target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const featuresHTML = createFeaturesHTML(config);
    targetElement.innerHTML = featuresHTML;

    const featuresElement = targetElement.querySelector('#features');
    if (!featuresElement) {
      throw new Error('Failed to create features section element');
    }

    const cleanup = initializeFeatures(featuresElement, config);

    const totalTime = performance.now() - startTime;
    logEvent('features_rendered', {
      total_time_ms: totalTime.toFixed(2),
      feature_count: config.features.length,
    });

    return {
      element: featuresElement,
      config,
      cleanup,
    };
  } catch (error) {
    logEvent('features_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to render features section: ${error.message}`, {
      cause: error,
    });
  }
};

export default renderFeaturesSection;