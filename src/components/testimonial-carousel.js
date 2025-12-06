/**
 * Testimonial Carousel Component
 * 
 * Accessible carousel for customer testimonials with navigation controls,
 * auto-play functionality, keyboard navigation, and responsive design.
 * Implements smooth transitions with proper ARIA attributes for screen readers.
 * 
 * @generated-from: task-id:TASK-006
 * @modifies: src/components/use-cases-section.js
 * @dependencies: []
 */

/**
 * Carousel configuration
 * @typedef {Object} CarouselConfig
 * @property {Array<Testimonial>} testimonials - Array of testimonial objects
 * @property {number} interval - Auto-play interval in milliseconds
 * @property {boolean} autoplay - Enable auto-play
 * @property {boolean} loop - Enable infinite loop
 * @property {boolean} pauseOnHover - Pause auto-play on hover
 * @property {boolean} pauseOnFocus - Pause auto-play on focus
 * @property {number} transitionDuration - Transition duration in milliseconds
 * @property {string} transitionEasing - CSS easing function
 */

/**
 * Testimonial object structure
 * @typedef {Object} Testimonial
 * @property {string} id - Unique identifier
 * @property {string} quote - Testimonial quote text
 * @property {string} author - Author name
 * @property {string} role - Author role/title
 * @property {string} company - Company name
 * @property {string} avatar - Avatar image URL
 * @property {string} [segment] - Related user segment
 */

/**
 * Default configuration
 * @type {CarouselConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  testimonials: [],
  interval: 5000,
  autoplay: true,
  loop: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  transitionDuration: 500,
  transitionEasing: 'ease-in-out',
});

/**
 * Carousel state
 * @private
 */
const CarouselState = {
  currentIndex: 0,
  isTransitioning: false,
  isPaused: false,
  autoplayTimer: null,
  observers: new Set(),
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
    component: 'testimonial-carousel',
    ...context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('[TestimonialCarousel]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'testimonial_carousel',
      ...context,
    });
  }
};

/**
 * Validates carousel configuration
 * @param {Object} config - Configuration to validate
 * @returns {CarouselConfig} Validated configuration
 * @throws {TypeError} If configuration is invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Carousel configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (!Array.isArray(validated.testimonials)) {
    throw new TypeError('Testimonials must be an array');
  }

  if (validated.testimonials.length === 0) {
    throw new TypeError('Testimonials array cannot be empty');
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

  if (typeof validated.interval !== 'number' || validated.interval < 1000) {
    throw new TypeError('Interval must be a number >= 1000');
  }

  if (typeof validated.autoplay !== 'boolean') {
    throw new TypeError('Autoplay must be a boolean');
  }

  if (typeof validated.loop !== 'boolean') {
    throw new TypeError('Loop must be a boolean');
  }

  if (typeof validated.pauseOnHover !== 'boolean') {
    throw new TypeError('PauseOnHover must be a boolean');
  }

  if (typeof validated.pauseOnFocus !== 'boolean') {
    throw new TypeError('PauseOnFocus must be a boolean');
  }

  if (typeof validated.transitionDuration !== 'number' || validated.transitionDuration < 0) {
    throw new TypeError('TransitionDuration must be a non-negative number');
  }

  if (typeof validated.transitionEasing !== 'string' || !validated.transitionEasing.trim()) {
    throw new TypeError('TransitionEasing must be a non-empty string');
  }

  return validated;
};

/**
 * Creates testimonial card HTML
 * @param {Testimonial} testimonial - Testimonial data
 * @param {number} index - Card index
 * @param {boolean} isActive - Whether card is currently active
 * @returns {string} Card HTML
 */
const createTestimonialCardHTML = (testimonial, index, isActive) => {
  return `
    <div 
      class="testimonial-card ${isActive ? 'active' : ''}"
      data-testimonial-id="${testimonial.id}"
      data-index="${index}"
      role="tabpanel"
      id="testimonial-${index}"
      aria-labelledby="testimonial-indicator-${index}"
      style="display: ${isActive ? 'block' : 'none'}; opacity: ${isActive ? '1' : '0'};"
    >
      <div class="testimonial-content bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl">
        <!-- Quote Icon -->
        <svg class="w-12 h-12 text-primary-500 opacity-50 mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        
        <!-- Quote Text -->
        <blockquote class="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed italic mb-6">
          "${testimonial.quote}"
        </blockquote>
        
        <!-- Author Info -->
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
    </div>
  `;
};

/**
 * Creates carousel navigation HTML
 * @param {number} totalSlides - Total number of slides
 * @returns {string} Navigation HTML
 */
const createNavigationHTML = (totalSlides) => {
  const indicators = Array.from({ length: totalSlides }, (_, index) => `
    <button
      class="carousel-indicator w-3 h-3 rounded-full transition-all duration-300 ${
        index === 0 ? 'bg-primary-500 w-8' : 'bg-neutral-300 dark:bg-neutral-600'
      }"
      data-index="${index}"
      id="testimonial-indicator-${index}"
      aria-label="Go to testimonial ${index + 1}"
      aria-controls="testimonial-${index}"
      role="tab"
      aria-selected="${index === 0}"
    ></button>
  `).join('');

  return `
    <div class="carousel-navigation flex items-center justify-center gap-4 mt-8">
      <button
        class="carousel-btn carousel-prev-btn w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-neutral-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous testimonial"
        disabled
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="carousel-indicators flex gap-2" role="tablist" aria-label="Testimonial indicators">
        ${indicators}
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
  `;
};

/**
 * Creates complete carousel HTML
 * @param {CarouselConfig} config - Carousel configuration
 * @returns {string} Complete carousel HTML
 */
const createCarouselHTML = (config) => {
  const cardsHTML = config.testimonials
    .map((testimonial, index) => createTestimonialCardHTML(testimonial, index, index === 0))
    .join('');

  const navigationHTML = createNavigationHTML(config.testimonials.length);

  return `
    <div 
      class="testimonial-carousel relative"
      role="region"
      aria-label="Customer testimonials"
      aria-live="polite"
    >
      <div class="testimonial-track">
        ${cardsHTML}
      </div>
      ${navigationHTML}
    </div>
  `;
};

/**
 * Transitions to specified slide
 * @param {HTMLElement} carouselElement - Carousel container element
 * @param {number} newIndex - Target slide index
 * @param {CarouselConfig} config - Carousel configuration
 * @returns {Promise<void>} Resolves when transition completes
 */
const transitionToSlide = async (carouselElement, newIndex, config) => {
  if (CarouselState.isTransitioning) {
    return;
  }

  const cards = carouselElement.querySelectorAll('.testimonial-card');
  const indicators = carouselElement.querySelectorAll('.carousel-indicator');
  const prevBtn = carouselElement.querySelector('.carousel-prev-btn');
  const nextBtn = carouselElement.querySelector('.carousel-next-btn');

  if (newIndex < 0 || newIndex >= cards.length) {
    return;
  }

  CarouselState.isTransitioning = true;
  const oldIndex = CarouselState.currentIndex;

  try {
    const currentCard = cards[oldIndex];
    const nextCard = cards[newIndex];

    currentCard.style.transition = `opacity ${config.transitionDuration}ms ${config.transitionEasing}`;
    currentCard.style.opacity = '0';

    await new Promise((resolve) => setTimeout(resolve, config.transitionDuration));

    currentCard.style.display = 'none';
    currentCard.classList.remove('active');
    currentCard.setAttribute('aria-hidden', 'true');

    nextCard.style.display = 'block';
    nextCard.style.opacity = '0';
    nextCard.classList.add('active');
    nextCard.removeAttribute('aria-hidden');

    requestAnimationFrame(() => {
      nextCard.style.transition = `opacity ${config.transitionDuration}ms ${config.transitionEasing}`;
      nextCard.style.opacity = '1';
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
      prevBtn.disabled = !config.loop && newIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = !config.loop && newIndex === cards.length - 1;
    }

    CarouselState.currentIndex = newIndex;

    logEvent('testimonial_changed', {
      from_index: oldIndex,
      to_index: newIndex,
      testimonial_id: nextCard.getAttribute('data-testimonial-id'),
    });
  } catch (error) {
    logEvent('transition_error', {
      error_message: error.message,
      from_index: oldIndex,
      to_index: newIndex,
    });
    throw error;
  } finally {
    CarouselState.isTransitioning = false;
  }
};

/**
 * Starts auto-play
 * @param {HTMLElement} carouselElement - Carousel container element
 * @param {CarouselConfig} config - Carousel configuration
 */
const startAutoplay = (carouselElement, config) => {
  if (!config.autoplay || CarouselState.autoplayTimer) {
    return;
  }

  CarouselState.autoplayTimer = setInterval(() => {
    if (CarouselState.isPaused) {
      return;
    }

    const cards = carouselElement.querySelectorAll('.testimonial-card');
    let nextIndex = CarouselState.currentIndex + 1;

    if (nextIndex >= cards.length) {
      if (config.loop) {
        nextIndex = 0;
      } else {
        stopAutoplay();
        return;
      }
    }

    transitionToSlide(carouselElement, nextIndex, config);
  }, config.interval);

  logEvent('autoplay_started', {
    interval: config.interval,
  });
};

/**
 * Stops auto-play
 */
const stopAutoplay = () => {
  if (CarouselState.autoplayTimer) {
    clearInterval(CarouselState.autoplayTimer);
    CarouselState.autoplayTimer = null;
    logEvent('autoplay_stopped');
  }
};

/**
 * Pauses auto-play
 */
const pauseAutoplay = () => {
  CarouselState.isPaused = true;
  logEvent('autoplay_paused');
};

/**
 * Resumes auto-play
 */
const resumeAutoplay = () => {
  CarouselState.isPaused = false;
  logEvent('autoplay_resumed');
};

/**
 * Handles keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 * @param {HTMLElement} carouselElement - Carousel container element
 * @param {CarouselConfig} config - Carousel configuration
 */
const handleKeyboardNavigation = (event, carouselElement, config) => {
  const cards = carouselElement.querySelectorAll('.testimonial-card');

  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      if (CarouselState.currentIndex > 0 || config.loop) {
        const prevIndex = CarouselState.currentIndex === 0 ? cards.length - 1 : CarouselState.currentIndex - 1;
        transitionToSlide(carouselElement, prevIndex, config);
      }
      break;

    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      if (CarouselState.currentIndex < cards.length - 1 || config.loop) {
        const nextIndex = (CarouselState.currentIndex + 1) % cards.length;
        transitionToSlide(carouselElement, nextIndex, config);
      }
      break;

    case 'Home':
      event.preventDefault();
      transitionToSlide(carouselElement, 0, config);
      break;

    case 'End':
      event.preventDefault();
      transitionToSlide(carouselElement, cards.length - 1, config);
      break;

    default:
      break;
  }
};

/**
 * Initializes carousel event handlers
 * @param {HTMLElement} carouselElement - Carousel container element
 * @param {CarouselConfig} config - Carousel configuration
 * @returns {Function} Cleanup function
 */
const initializeEventHandlers = (carouselElement, config) => {
  const prevBtn = carouselElement.querySelector('.carousel-prev-btn');
  const nextBtn = carouselElement.querySelector('.carousel-next-btn');
  const indicators = carouselElement.querySelectorAll('.carousel-indicator');
  const cards = carouselElement.querySelectorAll('.testimonial-card');

  const handlePrevClick = () => {
    stopAutoplay();
    const prevIndex = CarouselState.currentIndex === 0 ? cards.length - 1 : CarouselState.currentIndex - 1;
    transitionToSlide(carouselElement, prevIndex, config);
    startAutoplay(carouselElement, config);
  };

  const handleNextClick = () => {
    stopAutoplay();
    const nextIndex = (CarouselState.currentIndex + 1) % cards.length;
    transitionToSlide(carouselElement, nextIndex, config);
    startAutoplay(carouselElement, config);
  };

  const handleIndicatorClick = (event) => {
    stopAutoplay();
    const index = parseInt(event.currentTarget.getAttribute('data-index'), 10);
    transitionToSlide(carouselElement, index, config);
    startAutoplay(carouselElement, config);
  };

  const handleMouseEnter = () => {
    if (config.pauseOnHover) {
      pauseAutoplay();
    }
  };

  const handleMouseLeave = () => {
    if (config.pauseOnHover) {
      resumeAutoplay();
    }
  };

  const handleFocus = () => {
    if (config.pauseOnFocus) {
      pauseAutoplay();
    }
  };

  const handleBlur = () => {
    if (config.pauseOnFocus) {
      resumeAutoplay();
    }
  };

  const handleKeydown = (event) => {
    handleKeyboardNavigation(event, carouselElement, config);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', handlePrevClick);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', handleNextClick);
  }

  indicators.forEach((indicator) => {
    indicator.addEventListener('click', handleIndicatorClick);
  });

  if (config.pauseOnHover) {
    carouselElement.addEventListener('mouseenter', handleMouseEnter);
    carouselElement.addEventListener('mouseleave', handleMouseLeave);
  }

  if (config.pauseOnFocus) {
    carouselElement.addEventListener('focusin', handleFocus);
    carouselElement.addEventListener('focusout', handleBlur);
  }

  carouselElement.addEventListener('keydown', handleKeydown);

  return () => {
    if (prevBtn) {
      prevBtn.removeEventListener('click', handlePrevClick);
    }
    if (nextBtn) {
      nextBtn.removeEventListener('click', handleNextClick);
    }
    indicators.forEach((indicator) => {
      indicator.removeEventListener('click', handleIndicatorClick);
    });
    carouselElement.removeEventListener('mouseenter', handleMouseEnter);
    carouselElement.removeEventListener('mouseleave', handleMouseLeave);
    carouselElement.removeEventListener('focusin', handleFocus);
    carouselElement.removeEventListener('focusout', handleBlur);
    carouselElement.removeEventListener('keydown', handleKeydown);
  };
};

/**
 * Creates and initializes testimonial carousel
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration
 * @returns {Object} Carousel instance with control methods
 * @throws {Error} If target not found or configuration invalid
 */
export const createTestimonialCarousel = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Testimonial carousel target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    CarouselState.currentIndex = 0;
    CarouselState.isTransitioning = false;
    CarouselState.isPaused = false;

    const carouselHTML = createCarouselHTML(config);
    targetElement.innerHTML = carouselHTML;

    const carouselElement = targetElement.querySelector('.testimonial-carousel');
    if (!carouselElement) {
      throw new Error('Failed to create carousel element');
    }

    const cleanupHandlers = initializeEventHandlers(carouselElement, config);

    startAutoplay(carouselElement, config);

    const totalTime = performance.now() - startTime;
    logEvent('carousel_initialized', {
      total_time_ms: totalTime.toFixed(2),
      testimonial_count: config.testimonials.length,
      autoplay: config.autoplay,
    });

    return {
      element: carouselElement,
      config,
      goToSlide: (index) => transitionToSlide(carouselElement, index, config),
      next: () => {
        const nextIndex = (CarouselState.currentIndex + 1) % config.testimonials.length;
        return transitionToSlide(carouselElement, nextIndex, config);
      },
      prev: () => {
        const prevIndex =
          CarouselState.currentIndex === 0 ? config.testimonials.length - 1 : CarouselState.currentIndex - 1;
        return transitionToSlide(carouselElement, prevIndex, config);
      },
      pause: pauseAutoplay,
      resume: resumeAutoplay,
      getCurrentIndex: () => CarouselState.currentIndex,
      cleanup: () => {
        stopAutoplay();
        cleanupHandlers();
        logEvent('carousel_cleanup');
      },
    };
  } catch (error) {
    logEvent('carousel_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create testimonial carousel: ${error.message}`, {
      cause: error,
    });
  }
};

export default createTestimonialCarousel;