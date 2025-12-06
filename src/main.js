import './style.css';

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Mobile menu toggle
const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
  });
}

// Navbar scroll effect
const navbar = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    navbar?.classList.remove('shadow-lg');
    return;
  }
  
  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling down
    navbar?.classList.add('shadow-lg');
  } else if (currentScroll < lastScroll) {
    // Scrolling up
    console.log('Scrolling up');
  }
  console.log('Current scroll:', currentScroll);
  lastScroll = currentScroll;
  console.log('Last scroll:', lastScroll);
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
  observer.observe(section);
});

// Form validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    const email = data.email;
    if (email && !isValidEmail(email)) {
      showError(form, 'Please enter a valid email address');
      return;
    }
    
    // Simulate form submission
    showSuccess(form, 'Thank you! We\'ll be in touch soon.');
    form.reset();
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(form, message) {
  const errorDiv = form.querySelector('[data-error]') || createMessageDiv(form, 'error');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 5000);
}

function showSuccess(form, message) {
  const successDiv = form.querySelector('[data-success]') || createMessageDiv(form, 'success');
  successDiv.textContent = message;
  successDiv.classList.remove('hidden');
  setTimeout(() => successDiv.classList.add('hidden'), 5000);
}

function createMessageDiv(form, type) {
  const div = document.createElement('div');
  div.setAttribute(`data-${type}`, '');
  div.className = `mt-4 p-4 rounded-lg ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} hidden`;
  form.appendChild(div);
  return div;
}

// Initialize animations on page load
const observer2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

const animatedElements = document.querySelectorAll('[data-animate]');
animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer2.observe(el);
});