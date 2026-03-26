import './style.css';

/**
 * Main application entry point
 * Initializes the landing page with interactive features and Statsig integration
 */

// Initialize application
function initApp() {
  console.log('🚀 AI-Powered Software Development Platform - Initializing...');

  // Setup smooth scrolling for navigation links
  setupSmoothScroll();

  // Initialize intersection observer for animations
  setupScrollAnimations();

  // Setup form handlers
  setupFormHandlers();

  console.log('✅ Application initialized successfully');
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Setup scroll-triggered animations using Intersection Observer
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
}

/**
 * Setup form submission handlers
 */
function setupFormHandlers() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log('Form submitted:', data);

      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
      showNotification("Thank you! We'll be in touch soon.", 'success');
      form.reset();
    });
  });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Initialize Statsig service after page load
 * This runs after the window load event to avoid blocking critical rendering
 */
async function initializeStatsigService() {
  try {
    console.log('[Main] Starting Statsig initialization...');

    const { initializePerformanceMonitoring, trackSDKLoad, trackSDKInit } = await import(
      './utils/performance-monitor.js'
    );

    initializePerformanceMonitoring();

    const { initializeStatsig, getStatus } = await import('./services/statsig-service.js');

    const success = await initializeStatsig();

    if (success) {
      const status = getStatus();

      if (status.metrics.sdkLoadTime !== null) {
        trackSDKLoad(status.metrics.sdkLoadTime);
      }

      if (status.metrics.totalInitTime !== null) {
        trackSDKInit(status.metrics.totalInitTime);
      }

      console.log('[Main] Statsig initialization complete');
    } else {
      console.warn('[Main] Statsig initialization failed or was disabled');
    }
  } catch (error) {
    console.error('[Main] Error during Statsig initialization:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Initialize Statsig after window load (non-blocking)
if (document.readyState === 'complete') {
  initializeStatsigService();
} else {
  window.addEventListener('load', () => {
    initializeStatsigService();
  });
}
