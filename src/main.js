import './style.css';

/**
 * Main application entry point
 * Initializes the landing page with interactive features
 */

// Configuration
const CONFIG = {
  animationDuration: 300,
  scrollOffset: 80,
  debounceDelay: 150,
};

// State management
const state = {
  isMenuOpen: false,
  currentSection: 'hero',
  scrollPosition: 0,
};

/**
 * Initialize the application
 */
function init() {
  setupEventListeners();
  setupIntersectionObserver();
  updateActiveNavLink();
  console.log('Application initialized successfully');
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
  // Mobile menu toggle
  const menuButton = document.querySelector('[data-menu-toggle]');
  if (menuButton) {
    menuButton.addEventListener('click', toggleMobileMenu);
    console.log('Mobile menu listener attached');
  }

  console.log('Event listeners setup complete');
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  state.isMenuOpen = !state.isMenuOpen;
  const menu = document.querySelector('[data-mobile-menu]');
  const button = document.querySelector('[data-menu-toggle]');

  if (menu && button) {
    menu.classList.toggle('hidden', !state.isMenuOpen);
    button.setAttribute('aria-expanded', state.isMenuOpen.toString());
  }
}

/**
 * Setup Intersection Observer for scroll animations
 */
function setupIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(handleIntersection, options);

  // Observe all sections
  const sections = document.querySelectorAll('section[id]');
  sections.forEach((section) => observer.observe(section));
}

/**
 * Handle intersection observer callback
 */
function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      state.currentSection = entry.target.id;
      updateActiveNavLink();
    }
  });
}

/**
 * Update active navigation link based on current section
 */
function updateActiveNavLink() {
  const links = document.querySelectorAll('nav a[href^="#"]');

  links.forEach((link) => {
    const { href } = link;
    const targetId = href.substring(href.indexOf('#') + 1);

    if (targetId === state.currentSection) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { init, toggleMobileMenu, updateActiveNavLink, debounce };