/**
 * Hero Section Component
 * 
 * Displays the main value proposition with headline, subheadline, CTA, and hero image.
 * Implements scroll animations, responsive design, and accessibility features.
 * 
 * @generated-from: task-id:TASK-002
 * @modifies: index.html
 * @dependencies: []
 */

/**
 * Hero section configuration
 * @typedef {Object} HeroConfig
 * @property {string} headline - Main headline text
 * @property {string} subheadline - Supporting subheadline text
 * @property {Object} cta - Call-to-action configuration
 * @property {string} cta.text - CTA button text
 * @property {string} cta.href - CTA button link
 * @property {string} cta.ariaLabel - Accessible label for CTA
 * @property {Object} image - Hero image configuration
 * @property {string} image.src - Image source URL
 * @property {string} image.alt - Image alt text
 * @property {string} image.loading - Image loading strategy
 */

/**
 * Default hero section configuration
 * @type {HeroConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  headline: 'Transform Ideas into Deployed Applications with AI',
  subheadline:
    'Experience end-to-end AI-powered software development automation. From concept to production deployment, our intelligent platform handles the entire development lifecycle—writing code, running tests, and deploying applications—so you can focus on innovation.',
  cta: {
    text: 'Get Started Free',
    href: '#signup',
    ariaLabel: 'Get started with AI-powered development for free',
  },
  image: {
    src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80',
    alt: 'AI-powered software development visualization showing code automation and deployment',
    loading: 'eager',
  },
});

/**
 * Feature flag for hero section version
 * @type {boolean}
 */
const isHeroV2Enabled = () => {
  try {
    const flagValue = localStorage.getItem('hero_section_v2');
    return flagValue !== 'off';
  } catch (error) {
    console.warn('Failed to read feature flag from localStorage:', error);
    return true;
  }
};

/**
 * Logs structured event with context
 * @param {string} event - Event name
 * @param {Object} context - Event context data
 */
const logEvent = (event, context = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    component: 'hero-section',
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[HeroSection]', logEntry);
  }
};

/**
 * Tracks CTA click events
 * @param {string} ctaText - CTA button text
 * @param {string} ctaHref - CTA button destination
 */
const trackCTAClick = (ctaText, ctaHref) => {
  logEvent('cta_click', {
    cta_text: ctaText,
    cta_href: ctaHref,
    timestamp: Date.now(),
  });

  // Send to analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: ctaText,
      value: ctaHref,
    });
  }
};

/**
 * Creates intersection observer for scroll animations
 * @param {HTMLElement} element - Element to observe
 * @param {Function} callback - Callback when element intersects
 * @returns {IntersectionObserver} Observer instance
 */
const createScrollObserver = (element, callback) => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
        logEvent('hero_visible', {
          visibility_ratio: entry.intersectionRatio,
        });
      }
    });
  }, options);

  observer.observe(element);
  return observer;
};

/**
 * Sanitizes URL to prevent XSS attacks
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL
 */
const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '#';
  }

  const trimmedUrl = url.trim();

  // Allow only safe protocols
  const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmedUrl);

  if (hasProtocol) {
    try {
      const urlObj = new URL(trimmedUrl);
      if (!safeProtocols.includes(urlObj.protocol)) {
        console.warn('Unsafe URL protocol detected:', urlObj.protocol);
        return '#';
      }
      return trimmedUrl;
    } catch (error) {
      console.warn('Invalid URL format:', error);
      return '#';
    }
  }

  // Relative URLs and anchors are safe
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#')) {
    return trimmedUrl;
  }

  // Default to anchor if uncertain
  return '#';
};

/**
 * Validates hero configuration
 * @param {Object} config - Configuration to validate
 * @returns {HeroConfig} Validated configuration
 * @throws {TypeError} If configuration is invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Hero configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.headline !== 'string' || !validated.headline.trim()) {
    throw new TypeError('Headline must be a non-empty string');
  }

  if (
    typeof validated.subheadline !== 'string' ||
    !validated.subheadline.trim()
  ) {
    throw new TypeError('Subheadline must be a non-empty string');
  }

  if (!validated.cta || typeof validated.cta !== 'object') {
    throw new TypeError('CTA configuration must be an object');
  }

  if (typeof validated.cta.text !== 'string' || !validated.cta.text.trim()) {
    throw new TypeError('CTA text must be a non-empty string');
  }

  validated.cta.href = sanitizeUrl(validated.cta.href);

  if (!validated.image || typeof validated.image !== 'object') {
    throw new TypeError('Image configuration must be an object');
  }

  if (typeof validated.image.src !== 'string' || !validated.image.src.trim()) {
    throw new TypeError('Image source must be a non-empty string');
  }

  return validated;
};

/**
 * Creates hero section HTML structure
 * @param {HeroConfig} config - Hero configuration
 * @returns {string} HTML string
 */
const createHeroHTML = (config) => {
  const { headline, subheadline, cta, image } = config;

  return `
    <section 
      id="hero" 
      class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"
      aria-labelledby="hero-headline"
      role="banner"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <!-- Content Container -->
      <div class="container relative z-10 py-20 md:py-32">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <!-- Text Content -->
          <div class="text-center lg:text-left space-y-8 animate-fade-in-up">
            
            <!-- Headline -->
            <h1 
              id="hero-headline"
              class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-balance"
            >
              <span class="gradient-text">${headline}</span>
            </h1>

            <!-- Subheadline -->
            <p class="text-lg sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed text-pretty max-w-2xl mx-auto lg:mx-0">
              ${subheadline}
            </p>

            <!-- CTA Button -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="${cta.href}"
                class="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                aria-label="${cta.ariaLabel}"
                data-hero-cta
              >
                ${cta.text}
                <svg 
                  class="w-5 h-5 ml-2 inline-block" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            <!-- Trust Indicators -->
            <div class="flex flex-wrap gap-6 justify-center lg:justify-start items-center text-sm text-neutral-600 dark:text-neutral-400 pt-4">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative animate-fade-in-up animation-delay-200">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="${image.src}"
                alt="${image.alt}"
                loading="${image.loading}"
                class="w-full h-auto object-cover aspect-video"
                width="1920"
                height="1080"
                decoding="async"
                fetchpriority="high"
              />
              
              <!-- Image Overlay Gradient -->
              <div class="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-secondary-600/20 mix-blend-multiply" aria-hidden="true"></div>
            </div>

            <!-- Floating Elements -->
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary-500 rounded-full blur-3xl opacity-30 animate-pulse" aria-hidden="true"></div>
            <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-500 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-500" aria-hidden="true"></div>
          </div>

        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  `;
};

/**
 * Initializes hero section with event listeners and animations
 * @param {HTMLElement} heroElement - Hero section element
 * @param {HeroConfig} config - Hero configuration
 * @returns {Function} Cleanup function
 */
const initializeHero = (heroElement, config) => {
  const startTime = performance.now();

  // Track CTA clicks
  const ctaButton = heroElement.querySelector('[data-hero-cta]');
  if (ctaButton) {
    const handleCTAClick = (event) => {
      trackCTAClick(config.cta.text, config.cta.href);
    };

    ctaButton.addEventListener('click', handleCTAClick);

    // Cleanup function
    return () => {
      ctaButton.removeEventListener('click', handleCTAClick);
    };
  }

  const renderTime = performance.now() - startTime;
  logEvent('hero_render', {
    render_time_ms: renderTime.toFixed(2),
  });

  return () => {};
};

/**
 * Renders hero section into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration to override defaults
 * @returns {Object} Hero section instance with cleanup method
 * @throws {Error} If target element not found or configuration invalid
 */
export const renderHeroSection = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    // Check feature flag
    if (!isHeroV2Enabled()) {
      logEvent('hero_feature_disabled', {
        reason: 'Feature flag hero_section_v2 is off',
      });
      return { cleanup: () => {} };
    }

    // Resolve target element
    const targetElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Hero section target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    // Validate and merge configuration
    const config = validateConfig(customConfig);

    // Create and inject HTML
    const heroHTML = createHeroHTML(config);
    targetElement.innerHTML = heroHTML;

    // Get hero element
    const heroElement = targetElement.querySelector('#hero');
    if (!heroElement) {
      throw new Error('Failed to create hero section element');
    }

    // Initialize interactions
    const cleanup = initializeHero(heroElement, config);

    // Setup intersection observer for visibility tracking
    const observer = createScrollObserver(heroElement, () => {
      heroElement.classList.add('hero-visible');
    });

    const totalTime = performance.now() - startTime;
    logEvent('hero_initialized', {
      total_time_ms: totalTime.toFixed(2),
    });

    // Return instance with cleanup method
    return {
      element: heroElement,
      config,
      cleanup: () => {
        cleanup();
        observer.disconnect();
        logEvent('hero_cleanup', {});
      },
    };
  } catch (error) {
    logEvent('hero_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to render hero section: ${error.message}`, {
      cause: error,
    });
  }
};

/**
 * Default export for convenience
 */
export default renderHeroSection;