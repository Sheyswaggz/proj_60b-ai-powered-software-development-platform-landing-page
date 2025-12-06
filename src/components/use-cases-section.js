/**
 * Use Cases Section Component
 * 
 * Displays real-world scenarios demonstrating platform value across different
 * user segments (startups, enterprises, freelancers, development teams).
 * Features problem-solution format with measurable outcomes, animated metrics,
 * testimonial carousel, and responsive design.
 * 
 * @generated-from: task-id:TASK-006
 * @modifies: index.html
 * @dependencies: ["TASK-005"]
 */

import { createScrollAnimation, createStaggeredAnimations } from '../utils/animations.js';

/**
 * Use case configuration
 * @typedef {Object} UseCase
 * @property {string} id - Unique use case identifier
 * @property {string} title - Use case title
 * @property {string} segment - Target user segment
 * @property {string} problem - Problem description
 * @property {string} solution - Solution description
 * @property {Array<Metric>} metrics - Measurable outcomes
 * @property {string} icon - Icon identifier
 * @property {number} order - Display order
 */

/**
 * Metric configuration
 * @typedef {Object} Metric
 * @property {string} label - Metric label
 * @property {string} value - Metric value
 * @property {string} unit - Metric unit
 * @property {number} target - Target number for animation
 */

/**
 * Testimonial configuration
 * @typedef {Object} Testimonial
 * @property {string} id - Unique testimonial identifier
 * @property {string} quote - Testimonial quote
 * @property {string} author - Author name
 * @property {string} role - Author role
 * @property {string} company - Company name
 * @property {string} avatar - Avatar URL
 * @property {string} segment - Related user segment
 */

/**
 * Use cases section configuration
 * @typedef {Object} UseCasesConfig
 * @property {string} title - Section title
 * @property {string} subtitle - Section subtitle
 * @property {Array<UseCase>} useCases - Use cases array
 * @property {Array<Testimonial>} testimonials - Testimonials array
 * @property {boolean} enableAnimations - Enable scroll animations
 * @property {boolean} enableMetricCounters - Enable animated metric counters
 * @property {number} carouselInterval - Testimonial carousel interval in ms
 */

/**
 * Default use cases
 * @type {Array<UseCase>}
 */
const DEFAULT_USE_CASES = Object.freeze([
  {
    id: 'startup',
    title: 'Rapid MVP Development',
    segment: 'Startups',
    problem: 'Limited resources and tight deadlines make it challenging to build and iterate on product ideas quickly.',
    solution: 'AI-powered code generation accelerates development from weeks to days, allowing rapid prototyping and market validation.',
    metrics: [
      { label: 'Development Time', value: '75%', unit: '%', target: 75 },
      { label: 'Cost Reduction', value: '60%', unit: '%', target: 60 },
      { label: 'Time to Market', value: '10', unit: 'days', target: 10 },
    ],
    icon: 'rocket',
    order: 1,
  },
  {
    id: 'enterprise',
    title: 'Legacy System Modernization',
    segment: 'Enterprises',
    problem: 'Maintaining and modernizing legacy codebases requires significant time and specialized knowledge.',
    solution: 'Automated code analysis and refactoring tools modernize legacy systems while maintaining business logic integrity.',
    metrics: [
      { label: 'Migration Speed', value: '5x', unit: 'x', target: 5 },
      { label: 'Bug Reduction', value: '80%', unit: '%', target: 80 },
      { label: 'Test Coverage', value: '95%', unit: '%', target: 95 },
    ],
    icon: 'building',
    order: 2,
  },
  {
    id: 'freelancer',
    title: 'Scale Your Client Work',
    segment: 'Freelancers',
    problem: 'Managing multiple client projects simultaneously while maintaining quality and meeting deadlines is overwhelming.',
    solution: 'Automated code generation and testing enable handling more projects with consistent quality and faster delivery.',
    metrics: [
      { label: 'Project Capacity', value: '3x', unit: 'x', target: 3 },
      { label: 'Client Satisfaction', value: '98%', unit: '%', target: 98 },
      { label: 'Revenue Growth', value: '150%', unit: '%', target: 150 },
    ],
    icon: 'user',
    order: 3,
  },
  {
    id: 'team',
    title: 'Accelerate Team Productivity',
    segment: 'Development Teams',
    problem: 'Repetitive coding tasks and inconsistent code quality slow down team velocity and increase technical debt.',
    solution: 'Standardized code generation and automated testing ensure consistency while freeing developers for complex problem-solving.',
    metrics: [
      { label: 'Team Velocity', value: '40%', unit: '%', target: 40 },
      { label: 'Code Quality', value: '90%', unit: '%', target: 90 },
      { label: 'Technical Debt', value: '50%', unit: '%', target: 50 },
    ],
    icon: 'users',
    order: 4,
  },
]);

/**
 * Default testimonials
 * @type {Array<Testimonial>}
 */
const DEFAULT_TESTIMONIALS = Object.freeze([
  {
    id: 'testimonial-1',
    quote: 'This platform cut our MVP development time from 3 months to 3 weeks. We validated our idea and secured funding faster than we ever imagined.',
    author: 'Sarah Chen',
    role: 'Co-Founder & CTO',
    company: 'TechStart Inc.',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle fill="%234f46e5" cx="50" cy="50" r="50"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%23fff"%3ESC%3C/text%3E%3C/svg%3E',
    segment: 'startup',
  },
  {
    id: 'testimonial-2',
    quote: 'Migrating our 15-year-old monolith seemed impossible. The AI-powered refactoring tools made it manageable and we completed it 5x faster than estimated.',
    author: 'Michael Rodriguez',
    role: 'VP of Engineering',
    company: 'Global Finance Corp',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle fill="%2310b981" cx="50" cy="50" r="50"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%23fff"%3EMR%3C/text%3E%3C/svg%3E',
    segment: 'enterprise',
  },
  {
    id: 'testimonial-3',
    quote: 'I tripled my client capacity without sacrificing quality. The automated testing gives me confidence to deliver faster while maintaining my reputation.',
    author: 'Emily Watson',
    role: 'Full-Stack Developer',
    company: 'Independent Consultant',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle fill="%23f59e0b" cx="50" cy="50" r="50"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%23fff"%3EEW%3C/text%3E%3C/svg%3E',
    segment: 'freelancer',
  },
  {
    id: 'testimonial-4',
    quote: 'Our team velocity increased by 40% and code quality improved dramatically. Developers focus on architecture while AI handles boilerplate.',
    author: 'David Kim',
    role: 'Engineering Manager',
    company: 'CloudScale Solutions',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle fill="%23ef4444" cx="50" cy="50" r="50"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%23fff"%3EDK%3C/text%3E%3C/svg%3E',
    segment: 'team',
  },
]);

/**
 * Default configuration
 * @type {UseCasesConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  title: 'Real-World Success Stories',
  subtitle: 'See how teams across industries are transforming their development workflow',
  useCases: DEFAULT_USE_CASES,
  testimonials: DEFAULT_TESTIMONIALS,
  enableAnimations: true,
  enableMetricCounters: true,
  carouselInterval: 5000,
});

/**
 * Icon SVG paths
 * @private
 */
const ICON_PATHS = Object.freeze({
  rocket: 'M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25',
  building: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z',
  user: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  users: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
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
    component: 'use-cases-section',
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[UseCasesSection]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'use_cases',
      ...context,
    });
  }
};

/**
 * Validates use cases configuration
 * @param {Object} config - Configuration to validate
 * @returns {UseCasesConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Use cases configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.title !== 'string' || !validated.title.trim()) {
    throw new TypeError('Title must be a non-empty string');
  }

  if (typeof validated.subtitle !== 'string' || !validated.subtitle.trim()) {
    throw new TypeError('Subtitle must be a non-empty string');
  }

  if (!Array.isArray(validated.useCases) || validated.useCases.length === 0) {
    throw new TypeError('Use cases must be a non-empty array');
  }

  validated.useCases.forEach((useCase, index) => {
    if (!useCase || typeof useCase !== 'object') {
      throw new TypeError(`Use case at index ${index} must be an object`);
    }
    if (typeof useCase.id !== 'string' || !useCase.id.trim()) {
      throw new TypeError(`Use case at index ${index} must have valid id`);
    }
    if (typeof useCase.title !== 'string' || !useCase.title.trim()) {
      throw new TypeError(`Use case at index ${index} must have valid title`);
    }
    if (typeof useCase.segment !== 'string' || !useCase.segment.trim()) {
      throw new TypeError(`Use case at index ${index} must have valid segment`);
    }
    if (typeof useCase.problem !== 'string' || !useCase.problem.trim()) {
      throw new TypeError(`Use case at index ${index} must have valid problem`);
    }
    if (typeof useCase.solution !== 'string' || !useCase.solution.trim()) {
      throw new TypeError(`Use case at index ${index} must have valid solution`);
    }
    if (!Array.isArray(useCase.metrics) || useCase.metrics.length === 0) {
      throw new TypeError(`Use case at index ${index} must have valid metrics array`);
    }
    if (typeof useCase.order !== 'number' || useCase.order < 1) {
      throw new TypeError(`Use case at index ${index} must have valid order`);
    }
  });

  if (!Array.isArray(validated.testimonials) || validated.testimonials.length === 0) {
    throw new TypeError('Testimonials must be a non-empty array');
  }

  validated.testimonials.forEach((testimonial, index) => {
    if (!testimonial || typeof testimonial !== 'object') {
      throw new TypeError(`Testimonial at index ${index} must be an object`);
    }
    if (typeof testimonial.id !== 'string' || !testimonial.id.trim()) {
      throw new TypeError(`Testimonial at index ${index} must have valid id`);
    }
    if (typeof testimonial.quote !== 'string' || !testimonial.quote.trim()) {
      throw new TypeError(`Testimonial at index ${index} must have valid quote`);
    }
    if (typeof testimonial.author !== 'string' || !testimonial.author.trim()) {
      throw new TypeError(`Testimonial at index ${index} must have valid author`);
    }
  });

  if (typeof validated.enableAnimations !== 'boolean') {
    throw new TypeError('enableAnimations must be a boolean');
  }

  if (typeof validated.enableMetricCounters !== 'boolean') {
    throw new TypeError('enableMetricCounters must be a boolean');
  }

  if (typeof validated.carouselInterval !== 'number' || validated.carouselInterval < 1000) {
    throw new TypeError('carouselInterval must be a number >= 1000');
  }

  return validated;
};

/**
 * Creates icon SVG HTML
 * @param {string} iconName - Icon name
 * @returns {string} Icon SVG HTML
 */
const createIconHTML = (iconName) => {
  const path = ICON_PATHS[iconName] || ICON_PATHS.rocket;
  return `
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}" />
    </svg>
  `;
};

/**
 * Creates use case card HTML
 * @param {UseCase} useCase - Use case configuration
 * @returns {string} Use case card HTML
 */
const createUseCaseHTML = (useCase) => {
  const metricsHTML = useCase.metrics
    .map(
      (metric) => `
        <div class="metric-item text-center">
          <div 
            class="metric-value text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2"
            data-target="${metric.target}"
            data-unit="${metric.unit}"
          >
            0${metric.unit}
          </div>
          <div class="metric-label text-sm text-neutral-600 dark:text-neutral-400">
            ${metric.label}
          </div>
        </div>
      `
    )
    .join('');

  return `
    <div 
      class="use-case-card bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      data-use-case-id="${useCase.id}"
      role="article"
      aria-labelledby="use-case-${useCase.id}-title"
    >
      <!-- Icon and Segment -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white">
          ${createIconHTML(useCase.icon)}
        </div>
        <div>
          <div class="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
            ${useCase.segment}
          </div>
          <h3 
            id="use-case-${useCase.id}-title"
            class="text-2xl font-bold text-neutral-900 dark:text-white"
          >
            ${useCase.title}
          </h3>
        </div>
      </div>

      <!-- Problem -->
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
          Challenge
        </h4>
        <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          ${useCase.problem}
        </p>
      </div>

      <!-- Solution -->
      <div class="mb-8">
        <h4 class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
          Solution
        </h4>
        <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          ${useCase.solution}
        </p>
      </div>

      <!-- Metrics -->
      <div class="border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <h4 class="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4 text-center">
          Measurable Impact
        </h4>
        <div class="grid grid-cols-3 gap-4">
          ${metricsHTML}
        </div>
      </div>
    </div>
  `;
};

/**
 * Creates testimonial card HTML
 * @param {Testimonial} testimonial - Testimonial configuration
 * @returns {string} Testimonial card HTML
 */
const createTestimonialHTML = (testimonial) => {
  return `
    <div 
      class="testimonial-card bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl"
      data-testimonial-id="${testimonial.id}"
      data-segment="${testimonial.segment}"
      role="article"
    >
      <!-- Quote -->
      <div class="mb-6">
        <svg class="w-12 h-12 text-primary-500 opacity-50 mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p class="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
          "${testimonial.quote}"
        </p>
      </div>

      <!-- Author -->
      <div class="flex items-center gap-4">
        <img 
          src="${testimonial.avatar}" 
          alt="${testimonial.author}"
          class="w-16 h-16 rounded-full"
          loading="lazy"
        />
        <div>
          <div class="font-bold text-neutral-900 dark:text-white">
            ${testimonial.author}
          </div>
          <div class="text-sm text-neutral-600 dark:text-neutral-400">
            ${testimonial.role}
          </div>
          <div class="text-sm text-primary-600 dark:text-primary-400">
            ${testimonial.company}
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Creates use cases section HTML
 * @param {UseCasesConfig} config - Section configuration
 * @returns {string} Section HTML
 */
const createUseCasesHTML = (config) => {
  const { title, subtitle, useCases, testimonials } = config;

  const sortedUseCases = [...useCases].sort((a, b) => a.order - b.order);
  const useCasesHTML = sortedUseCases.map((useCase) => createUseCaseHTML(useCase)).join('');

  const testimonialsHTML = testimonials.map((testimonial) => createTestimonialHTML(testimonial)).join('');

  return `
    <section 
      id="use-cases"
      class="relative py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900 overflow-hidden"
      aria-labelledby="use-cases-title"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10" aria-hidden="true">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      </div>

      <!-- Content Container -->
      <div class="container relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 
            id="use-cases-title"
            class="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-neutral-900 dark:text-white"
          >
            <span class="gradient-text">${title}</span>
          </h2>
          
          <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
            ${subtitle}
          </p>
        </div>

        <!-- Use Cases Grid -->
        <div class="grid md:grid-cols-2 gap-8 mb-20">
          ${useCasesHTML}
        </div>

        <!-- Testimonials Section -->
        <div class="max-w-4xl mx-auto">
          <h3 class="text-3xl md:text-4xl font-bold text-center text-neutral-900 dark:text-white mb-12">
            What Our Users Say
          </h3>

          <!-- Testimonial Carousel -->
          <div class="testimonial-carousel relative">
            <div class="testimonial-track">
              ${testimonialsHTML}
            </div>

            <!-- Carousel Navigation -->
            <div class="flex items-center justify-center gap-4 mt-8">
              <button
                class="carousel-btn carousel-prev-btn w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-neutral-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous testimonial"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div class="carousel-indicators flex gap-2" role="tablist" aria-label="Testimonial indicators">
                ${testimonials
                  .map(
                    (_, index) => `
                  <button
                    class="carousel-indicator w-3 h-3 rounded-full transition-all duration-300 ${
                      index === 0 ? 'bg-primary-500 w-8' : 'bg-neutral-300 dark:bg-neutral-600'
                    }"
                    data-index="${index}"
                    aria-label="Go to testimonial ${index + 1}"
                    role="tab"
                    aria-selected="${index === 0}"
                  ></button>
                `
                  )
                  .join('')}
              </div>

              <button
                class="carousel-btn carousel-next-btn w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-neutral-900 dark:text-white"
                aria-label="Next testimonial"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <a
            href="#signup"
            class="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            aria-label="Start your success story"
          >
            Start Your Success Story
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
 * Animates metric counter
 * @param {HTMLElement} element - Metric element
 * @param {number} target - Target value
 * @param {string} unit - Unit string
 * @param {number} duration - Animation duration in ms
 */
const animateMetricCounter = (element, target, unit, duration = 2000) => {
  const startTime = performance.now();
  const startValue = 0;

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

    element.textContent = `${currentValue}${unit}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.textContent = `${target}${unit}`;
    }
  };

  requestAnimationFrame(animate);
};

/**
 * Initializes metric counters
 * @param {HTMLElement} sectionElement - Section element
 * @param {UseCasesConfig} config - Configuration
 * @returns {Function} Cleanup function
 */
const initializeMetricCounters = (sectionElement, config) => {
  if (!config.enableMetricCounters) {
    return () => {};
  }

  const metricElements = sectionElement.querySelectorAll('.metric-value');
  const observers = [];

  metricElements.forEach((element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const unit = element.getAttribute('data-unit');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !element.hasAttribute('data-animated')) {
            element.setAttribute('data-animated', 'true');
            animateMetricCounter(element, target, unit);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    observers.push(observer);
  });

  return () => {
    observers.forEach((observer) => observer.disconnect());
  };
};

/**
 * Initializes testimonial carousel
 * @param {HTMLElement} sectionElement - Section element
 * @param {UseCasesConfig} config - Configuration
 * @returns {Function} Cleanup function
 */
const initializeTestimonialCarousel = (sectionElement, config) => {
  const track = sectionElement.querySelector('.testimonial-track');
  const cards = sectionElement.querySelectorAll('.testimonial-card');
  const prevBtn = sectionElement.querySelector('.carousel-prev-btn');
  const nextBtn = sectionElement.querySelector('.carousel-next-btn');
  const indicators = sectionElement.querySelectorAll('.carousel-indicator');

  if (!track || cards.length === 0) {
    return () => {};
  }

  let currentIndex = 0;
  let autoplayInterval = null;

  const updateCarousel = (newIndex) => {
    if (newIndex < 0 || newIndex >= cards.length) {
      return;
    }

    cards.forEach((card, index) => {
      if (index === newIndex) {
        card.style.display = 'block';
        card.style.opacity = '0';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 500ms ease-in-out';
          card.style.opacity = '1';
        });
      } else {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'none';
        }, 500);
      }
    });

    indicators.forEach((indicator, index) => {
      if (index === newIndex) {
        indicator.classList.add('bg-primary-500', 'w-8');
        indicator.classList.remove('bg-neutral-300', 'dark:bg-neutral-600', 'w-3');
        indicator.setAttribute('aria-selected', 'true');
      } else {
        indicator.classList.remove('bg-primary-500', 'w-8');
        indicator.classList.add('bg-neutral-300', 'dark:bg-neutral-600', 'w-3');
        indicator.setAttribute('aria-selected', 'false');
      }
    });

    if (prevBtn) {
      prevBtn.disabled = newIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = newIndex === cards.length - 1;
    }

    currentIndex = newIndex;

    logEvent('testimonial_changed', {
      index: newIndex,
      testimonial_id: cards[newIndex].getAttribute('data-testimonial-id'),
    });
  };

  const startAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }

    autoplayInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % cards.length;
      updateCarousel(nextIndex);
    }, config.carouselInterval);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      updateCarousel(currentIndex - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      updateCarousel(currentIndex + 1);
      startAutoplay();
    });
  }

  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      stopAutoplay();
      const index = parseInt(indicator.getAttribute('data-index'), 10);
      updateCarousel(index);
      startAutoplay();
    });
  });

  updateCarousel(0);
  startAutoplay();

  return () => {
    stopAutoplay();
  };
};

/**
 * Initializes use cases section
 * @param {HTMLElement} sectionElement - Section element
 * @param {UseCasesConfig} config - Configuration
 * @returns {Function} Cleanup function
 */
const initializeUseCases = (sectionElement, config) => {
  const startTime = performance.now();
  const cleanupFunctions = [];

  const metricCleanup = initializeMetricCounters(sectionElement, config);
  cleanupFunctions.push(metricCleanup);

  const carouselCleanup = initializeTestimonialCarousel(sectionElement, config);
  cleanupFunctions.push(carouselCleanup);

  if (config.enableAnimations) {
    try {
      const useCaseCards = sectionElement.querySelectorAll('.use-case-card');
      const cardsArray = Array.from(useCaseCards);

      if (cardsArray.length > 0) {
        const cardAnimations = createStaggeredAnimations(cardsArray, {
          preset: 'fadeInUp',
          stagger: 150,
          config: {
            animationDuration: 600,
            once: true,
          },
        });

        cleanupFunctions.push(() => {
          cardAnimations.disconnectAll();
        });
      }

      logEvent('use_cases_animations_initialized', {
        card_count: useCaseCards.length,
      });
    } catch (error) {
      logEvent('use_cases_animations_error', {
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  const renderTime = performance.now() - startTime;
  logEvent('use_cases_initialized', {
    render_time_ms: renderTime.toFixed(2),
    use_case_count: config.useCases.length,
    testimonial_count: config.testimonials.length,
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('use_cases_cleanup');
  };
};

/**
 * Renders use cases section into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration
 * @returns {Object} Section instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const renderUseCasesSection = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Use cases section target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const sectionHTML = createUseCasesHTML(config);
    targetElement.innerHTML = sectionHTML;

    const sectionElement = targetElement.querySelector('#use-cases');
    if (!sectionElement) {
      throw new Error('Failed to create use cases section element');
    }

    const cleanup = initializeUseCases(sectionElement, config);

    const totalTime = performance.now() - startTime;
    logEvent('use_cases_rendered', {
      total_time_ms: totalTime.toFixed(2),
      use_case_count: config.useCases.length,
      testimonial_count: config.testimonials.length,
    });

    return {
      element: sectionElement,
      config,
      cleanup,
    };
  } catch (error) {
    logEvent('use_cases_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to render use cases section: ${error.message}`, {
      cause: error,
    });
  }
};

export default renderUseCasesSection;