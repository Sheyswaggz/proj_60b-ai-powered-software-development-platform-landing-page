/**
 * Demo Section Component
 * 
 * Interactive demo section with tabbed interface for video demonstration and 
 * step-by-step walkthrough. Provides hands-on experience of platform capabilities
 * with responsive layout, progress tracking, and accessibility features.
 * 
 * @generated-from: task-id:TASK-005
 * @modifies: index.html
 * @dependencies: ["TASK-004"]
 */

import { createScrollAnimation, createStaggeredAnimations } from '../utils/animations.js';

/**
 * Demo tab types
 * @typedef {'video' | 'walkthrough'} DemoTab
 */

/**
 * Demo step configuration
 * @typedef {Object} DemoStep
 * @property {string} id - Unique step identifier
 * @property {string} title - Step title
 * @property {string} description - Step description
 * @property {string} image - Step image URL
 * @property {number} order - Display order
 */

/**
 * Video configuration
 * @typedef {Object} VideoConfig
 * @property {string} url - Video URL
 * @property {string} poster - Poster image URL
 * @property {string} title - Video title
 * @property {number} duration - Video duration in seconds
 */

/**
 * Demo section configuration
 * @typedef {Object} DemoConfig
 * @property {string} title - Section title
 * @property {string} subtitle - Section subtitle
 * @property {VideoConfig} video - Video configuration
 * @property {Array<DemoStep>} steps - Walkthrough steps
 * @property {DemoTab} defaultTab - Default active tab
 * @property {boolean} enableAnimations - Enable scroll animations
 * @property {boolean} autoplay - Enable video autoplay
 */

/**
 * Default demo steps
 * @type {Array<DemoStep>}
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
  },
]);

/**
 * Default demo configuration
 * @type {DemoConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  title: 'See It In Action',
  subtitle: 'Experience the power of AI-driven development through our interactive demo',
  video: {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    poster: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"%3E%3Crect fill="%23000" width="800" height="450"/%3E%3Cpolygon fill="%23fff" points="300,150 300,300 500,225"/%3E%3C/svg%3E',
    title: 'Platform Demo Video',
    duration: 180,
  },
  steps: DEFAULT_STEPS,
  defaultTab: 'video',
  enableAnimations: true,
  autoplay: false,
});

/**
 * Feature flag for interactive demo
 * @returns {boolean} True if demo enabled
 */
const isDemoEnabled = () => {
  try {
    const flagValue = localStorage.getItem('interactive_demo');
    return flagValue !== 'off';
  } catch (error) {
    console.warn('[DemoSection] Failed to read feature flag:', error);
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
    component: 'demo-section',
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[DemoSection]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'demo',
      ...context,
    });
  }
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates demo configuration
 * @param {Object} config - Configuration to validate
 * @returns {DemoConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Demo configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.title !== 'string' || !validated.title.trim()) {
    throw new TypeError('Title must be a non-empty string');
  }

  if (typeof validated.subtitle !== 'string' || !validated.subtitle.trim()) {
    throw new TypeError('Subtitle must be a non-empty string');
  }

  if (!validated.video || typeof validated.video !== 'object') {
    throw new TypeError('Video configuration must be an object');
  }

  if (typeof validated.video.url !== 'string' || !isValidUrl(validated.video.url)) {
    throw new TypeError('Video URL must be a valid URL string');
  }

  if (typeof validated.video.poster !== 'string') {
    throw new TypeError('Video poster must be a string');
  }

  if (typeof validated.video.title !== 'string' || !validated.video.title.trim()) {
    throw new TypeError('Video title must be a non-empty string');
  }

  if (typeof validated.video.duration !== 'number' || validated.video.duration <= 0) {
    throw new TypeError('Video duration must be a positive number');
  }

  if (!Array.isArray(validated.steps) || validated.steps.length === 0) {
    throw new TypeError('Steps must be a non-empty array');
  }

  validated.steps.forEach((step, index) => {
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
  });

  if (!['video', 'walkthrough'].includes(validated.defaultTab)) {
    throw new TypeError('defaultTab must be "video" or "walkthrough"');
  }

  if (typeof validated.enableAnimations !== 'boolean') {
    throw new TypeError('enableAnimations must be a boolean');
  }

  if (typeof validated.autoplay !== 'boolean') {
    throw new TypeError('autoplay must be a boolean');
  }

  return validated;
};

/**
 * Creates video player HTML
 * @param {VideoConfig} video - Video configuration
 * @param {boolean} autoplay - Enable autoplay
 * @returns {string} Video player HTML
 */
const createVideoHTML = (video, autoplay) => {
  const autoplayParam = autoplay ? '&autoplay=1' : '';
  
  return `
    <div class="demo-video-container relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl">
      <iframe
        class="absolute inset-0 w-full h-full"
        src="${video.url}?rel=0${autoplayParam}"
        title="${video.title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <div class="absolute inset-0 bg-neutral-900 flex items-center justify-center demo-video-loading">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    </div>
  `;
};

/**
 * Creates walkthrough step HTML
 * @param {DemoStep} step - Step configuration
 * @param {number} index - Step index
 * @param {number} total - Total steps
 * @returns {string} Step HTML
 */
const createStepHTML = (step, index, total) => {
  return `
    <div 
      class="demo-step opacity-0 transition-opacity duration-500"
      data-step-id="${step.id}"
      data-step-order="${step.order}"
      role="article"
      aria-labelledby="step-${step.id}-title"
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
            id="step-${step.id}-title"
            class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white"
          >
            ${step.title}
          </h3>
          
          <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            ${step.description}
          </p>
        </div>
      </div>
    </div>
  `;
};

/**
 * Creates walkthrough navigation HTML
 * @param {number} totalSteps - Total number of steps
 * @returns {string} Navigation HTML
 */
const createNavigationHTML = (totalSteps) => {
  return `
    <div class="demo-navigation flex items-center justify-between mt-12">
      <button
        class="demo-nav-btn demo-prev-btn btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous step"
        disabled
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <div class="demo-progress flex items-center gap-2" role="progressbar" aria-valuemin="1" aria-valuemax="${totalSteps}" aria-valuenow="1">
        ${Array.from({ length: totalSteps }, (_, i) => `
          <button
            class="demo-progress-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary-500 w-8' : 'bg-neutral-300 dark:bg-neutral-600'}"
            data-step-index="${i}"
            aria-label="Go to step ${i + 1}"
          ></button>
        `).join('')}
      </div>

      <button
        class="demo-nav-btn demo-next-btn btn btn-primary"
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
 * Creates demo section HTML
 * @param {DemoConfig} config - Demo configuration
 * @returns {string} Section HTML
 */
const createDemoHTML = (config) => {
  const { title, subtitle, video, steps, defaultTab } = config;

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const stepsHTML = sortedSteps
    .map((step, index) => createStepHTML(step, index, sortedSteps.length))
    .join('');

  return `
    <section 
      id="demo"
      class="relative py-20 md:py-32 bg-white dark:bg-neutral-900 overflow-hidden"
      aria-labelledby="demo-title"
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
            id="demo-title"
            class="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-neutral-900 dark:text-white"
          >
            <span class="gradient-text">${title}</span>
          </h2>
          
          <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
            ${subtitle}
          </p>
        </div>

        <!-- Tab Navigation -->
        <div class="flex justify-center mb-12" role="tablist" aria-label="Demo content tabs">
          <div class="inline-flex bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-2 gap-2">
            <button
              class="demo-tab px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${defaultTab === 'video' ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-lg' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}"
              data-tab="video"
              role="tab"
              aria-selected="${defaultTab === 'video'}"
              aria-controls="demo-video-panel"
            >
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Video Demo
            </button>
            <button
              class="demo-tab px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${defaultTab === 'walkthrough' ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-lg' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}"
              data-tab="walkthrough"
              role="tab"
              aria-selected="${defaultTab === 'walkthrough'}"
              aria-controls="demo-walkthrough-panel"
            >
              <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Interactive Walkthrough
            </button>
          </div>
        </div>

        <!-- Tab Panels -->
        <div class="demo-content">
          <!-- Video Panel -->
          <div
            id="demo-video-panel"
            class="demo-panel ${defaultTab === 'video' ? '' : 'hidden'}"
            role="tabpanel"
            aria-labelledby="demo-video-tab"
          >
            ${createVideoHTML(video, config.autoplay)}
          </div>

          <!-- Walkthrough Panel -->
          <div
            id="demo-walkthrough-panel"
            class="demo-panel ${defaultTab === 'walkthrough' ? '' : 'hidden'}"
            role="tabpanel"
            aria-labelledby="demo-walkthrough-tab"
          >
            <div class="demo-steps-container">
              ${stepsHTML}
            </div>
            ${createNavigationHTML(sortedSteps.length)}
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <a
            href="#signup"
            class="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            aria-label="Start your free trial"
          >
            Start Your Free Trial
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
 * Demo state management
 * @param {HTMLElement} demoElement - Demo section element
 * @param {DemoConfig} config - Demo configuration
 * @returns {Object} State management object
 */
const createDemoState = (demoElement, config) => {
  const state = {
    currentTab: config.defaultTab,
    currentStep: 0,
    totalSteps: config.steps.length,
    videoPlayed: false,
    completedSteps: new Set(),
  };

  const updateStep = (newStep) => {
    if (newStep < 0 || newStep >= state.totalSteps) {
      return;
    }

    const steps = demoElement.querySelectorAll('.demo-step');
    const progressDots = demoElement.querySelectorAll('.demo-progress-dot');
    const prevBtn = demoElement.querySelector('.demo-prev-btn');
    const nextBtn = demoElement.querySelector('.demo-next-btn');
    const progressBar = demoElement.querySelector('.demo-progress');

    steps[state.currentStep]?.classList.remove('opacity-100');
    steps[state.currentStep]?.classList.add('opacity-0');

    state.currentStep = newStep;
    state.completedSteps.add(newStep);

    steps[newStep]?.classList.remove('opacity-0');
    steps[newStep]?.classList.add('opacity-100');

    progressDots.forEach((dot, index) => {
      if (index === newStep) {
        dot.classList.add('bg-primary-500', 'w-8');
        dot.classList.remove('bg-neutral-300', 'dark:bg-neutral-600', 'w-3');
      } else {
        dot.classList.remove('bg-primary-500', 'w-8');
        dot.classList.add('bg-neutral-300', 'dark:bg-neutral-600', 'w-3');
      }
    });

    if (prevBtn) {
      prevBtn.disabled = newStep === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = newStep === state.totalSteps - 1;
    }

    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(newStep + 1));
    }

    logEvent('demo_step_changed', {
      step: newStep + 1,
      total_steps: state.totalSteps,
      step_id: config.steps[newStep]?.id,
    });
  };

  const switchTab = (tab) => {
    if (!['video', 'walkthrough'].includes(tab)) {
      return;
    }

    const tabs = demoElement.querySelectorAll('.demo-tab');
    const panels = demoElement.querySelectorAll('.demo-panel');

    tabs.forEach((tabElement) => {
      const tabName = tabElement.getAttribute('data-tab');
      const isActive = tabName === tab;
      
      if (isActive) {
        tabElement.classList.add('bg-white', 'dark:bg-neutral-700', 'text-primary-600', 'dark:text-primary-400', 'shadow-lg');
        tabElement.classList.remove('text-neutral-600', 'dark:text-neutral-400');
      } else {
        tabElement.classList.remove('bg-white', 'dark:bg-neutral-700', 'text-primary-600', 'dark:text-primary-400', 'shadow-lg');
        tabElement.classList.add('text-neutral-600', 'dark:text-neutral-400');
      }
      
      tabElement.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
      const panelId = panel.getAttribute('id');
      const isActive = panelId === `demo-${tab}-panel`;
      
      if (isActive) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    state.currentTab = tab;

    logEvent('demo_tab_changed', {
      tab,
      previous_tab: state.currentTab,
    });
  };

  return {
    state,
    updateStep,
    switchTab,
  };
};

/**
 * Initializes demo section interactions
 * @param {HTMLElement} demoElement - Demo section element
 * @param {DemoConfig} config - Demo configuration
 * @returns {Function} Cleanup function
 */
const initializeDemo = (demoElement, config) => {
  const startTime = performance.now();
  const cleanupFunctions = [];

  const { state, updateStep, switchTab } = createDemoState(demoElement, config);

  const tabs = demoElement.querySelectorAll('.demo-tab');
  tabs.forEach((tab) => {
    const handleTabClick = () => {
      const tabName = tab.getAttribute('data-tab');
      switchTab(tabName);
    };

    tab.addEventListener('click', handleTabClick);
    cleanupFunctions.push(() => tab.removeEventListener('click', handleTabClick));
  });

  const prevBtn = demoElement.querySelector('.demo-prev-btn');
  const nextBtn = demoElement.querySelector('.demo-next-btn');

  if (prevBtn) {
    const handlePrev = () => {
      updateStep(state.currentStep - 1);
    };

    prevBtn.addEventListener('click', handlePrev);
    cleanupFunctions.push(() => prevBtn.removeEventListener('click', handlePrev));
  }

  if (nextBtn) {
    const handleNext = () => {
      updateStep(state.currentStep + 1);
    };

    nextBtn.addEventListener('click', handleNext);
    cleanupFunctions.push(() => nextBtn.removeEventListener('click', handleNext));
  }

  const progressDots = demoElement.querySelectorAll('.demo-progress-dot');
  progressDots.forEach((dot) => {
    const handleDotClick = () => {
      const stepIndex = parseInt(dot.getAttribute('data-step-index'), 10);
      updateStep(stepIndex);
    };

    dot.addEventListener('click', handleDotClick);
    cleanupFunctions.push(() => dot.removeEventListener('click', handleDotClick));
  });

  const videoIframe = demoElement.querySelector('iframe');
  if (videoIframe) {
    const handleVideoLoad = () => {
      const loadingOverlay = demoElement.querySelector('.demo-video-loading');
      if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
      }

      if (!state.videoPlayed) {
        state.videoPlayed = true;
        logEvent('demo_video_loaded', {
          video_url: config.video.url,
        });
      }
    };

    videoIframe.addEventListener('load', handleVideoLoad);
    cleanupFunctions.push(() => videoIframe.removeEventListener('load', handleVideoLoad));
  }

  const handleKeyboard = (event) => {
    if (state.currentTab !== 'walkthrough') {
      return;
    }

    if (event.key === 'ArrowLeft' && state.currentStep > 0) {
      event.preventDefault();
      updateStep(state.currentStep - 1);
    } else if (event.key === 'ArrowRight' && state.currentStep < state.totalSteps - 1) {
      event.preventDefault();
      updateStep(state.currentStep + 1);
    }
  };

  document.addEventListener('keydown', handleKeyboard);
  cleanupFunctions.push(() => document.removeEventListener('keydown', handleKeyboard));

  updateStep(0);

  if (config.enableAnimations) {
    try {
      const steps = demoElement.querySelectorAll('.demo-step');
      const stepsArray = Array.from(steps);

      if (stepsArray.length > 0) {
        const stepAnimations = createStaggeredAnimations(stepsArray, {
          preset: 'fadeInUp',
          stagger: 150,
          config: {
            animationDuration: 600,
            once: true,
          },
        });

        cleanupFunctions.push(() => {
          stepAnimations.disconnectAll();
        });
      }

      logEvent('demo_animations_initialized', {
        step_count: steps.length,
      });
    } catch (error) {
      logEvent('demo_animations_error', {
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  const renderTime = performance.now() - startTime;
  logEvent('demo_initialized', {
    render_time_ms: renderTime.toFixed(2),
    total_steps: state.totalSteps,
    default_tab: config.defaultTab,
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('demo_cleanup', {
      completed_steps: state.completedSteps.size,
      video_played: state.videoPlayed,
    });
  };
};

/**
 * Renders demo section into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration
 * @returns {Object} Demo instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const renderDemoSection = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    if (!isDemoEnabled()) {
      logEvent('demo_disabled', {
        reason: 'feature_flag_off',
      });
      return {
        element: null,
        config: null,
        cleanup: () => {},
      };
    }

    const targetElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Demo section target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const demoHTML = createDemoHTML(config);
    targetElement.innerHTML = demoHTML;

    const demoElement = targetElement.querySelector('#demo');
    if (!demoElement) {
      throw new Error('Failed to create demo section element');
    }

    const cleanup = initializeDemo(demoElement, config);

    const totalTime = performance.now() - startTime;
    logEvent('demo_rendered', {
      total_time_ms: totalTime.toFixed(2),
      step_count: config.steps.length,
      default_tab: config.defaultTab,
    });

    return {
      element: demoElement,
      config,
      cleanup,
    };
  } catch (error) {
    logEvent('demo_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to render demo section: ${error.message}`, {
      cause: error,
    });
  }
};

export default renderDemoSection;