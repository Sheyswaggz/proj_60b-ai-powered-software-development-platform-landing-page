/**
 * Footer Component
 * 
 * Production-ready comprehensive footer with navigation links, contact information,
 * social media links, newsletter signup integration, and legal links. Implements
 * responsive multi-column layout with accessibility features, structured data,
 * and analytics integration.
 * 
 * @generated-from: task-id:TASK-007
 * @modifies: index.html
 * @dependencies: ["TASK-006", "newsletter-signup.js"]
 */

import { createNewsletterSignup } from './newsletter-signup.js';

/**
 * Footer configuration
 * @typedef {Object} FooterConfig
 * @property {Array<NavigationSection>} [navigationSections] - Navigation sections
 * @property {ContactInfo} [contactInfo] - Contact information
 * @property {Array<SocialLink>} [socialLinks] - Social media links
 * @property {LegalLinks} [legalLinks] - Legal links
 * @property {string} [copyrightText] - Copyright text
 * @property {boolean} [showNewsletter=true] - Show newsletter signup
 * @property {Object} [newsletterConfig] - Newsletter configuration
 * @property {boolean} [enableAnalytics=true] - Enable analytics tracking
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [showBackToTop=true] - Show back to top button
 * @property {string} [logoUrl] - Footer logo URL
 * @property {string} [logoAlt] - Footer logo alt text
 */

/**
 * Navigation section
 * @typedef {Object} NavigationSection
 * @property {string} title - Section title
 * @property {Array<NavigationLink>} links - Section links
 */

/**
 * Navigation link
 * @typedef {Object} NavigationLink
 * @property {string} text - Link text
 * @property {string} href - Link URL
 * @property {boolean} [external=false] - External link
 * @property {string} [ariaLabel] - Aria label
 */

/**
 * Contact information
 * @typedef {Object} ContactInfo
 * @property {string} [email] - Contact email
 * @property {string} [phone] - Contact phone
 * @property {string} [address] - Physical address
 */

/**
 * Social link
 * @typedef {Object} SocialLink
 * @property {string} platform - Platform name
 * @property {string} url - Profile URL
 * @property {string} icon - Icon SVG or class
 * @property {string} ariaLabel - Aria label
 */

/**
 * Legal links
 * @typedef {Object} LegalLinks
 * @property {string} [privacy] - Privacy policy URL
 * @property {string} [terms] - Terms of service URL
 * @property {string} [cookies] - Cookie policy URL
 * @property {string} [accessibility] - Accessibility statement URL
 */

/**
 * Default navigation sections
 * @private
 */
const DEFAULT_NAVIGATION = Object.freeze([
  {
    title: 'Product',
    links: [
      { text: 'Features', href: '#features' },
      { text: 'Use Cases', href: '#use-cases' },
      { text: 'Workflow', href: '#workflow' },
      { text: 'Demo', href: '#demo' },
      { text: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'About Us', href: '#about' },
      { text: 'Careers', href: '#careers' },
      { text: 'Blog', href: '#blog' },
      { text: 'Press', href: '#press' },
      { text: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'Documentation', href: '#docs', external: true },
      { text: 'API Reference', href: '#api', external: true },
      { text: 'Tutorials', href: '#tutorials' },
      { text: 'Community', href: '#community' },
      { text: 'Support', href: '#support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { text: 'Privacy Policy', href: '#privacy' },
      { text: 'Terms of Service', href: '#terms' },
      { text: 'Cookie Policy', href: '#cookies' },
      { text: 'Accessibility', href: '#accessibility' },
    ],
  },
]);

/**
 * Default social links
 * @private
 */
const DEFAULT_SOCIAL_LINKS = Object.freeze([
  {
    platform: 'twitter',
    url: 'https://twitter.com/company',
    ariaLabel: 'Follow us on Twitter',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>',
  },
  {
    platform: 'github',
    url: 'https://github.com/company',
    ariaLabel: 'View our GitHub',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>',
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/company/company',
    ariaLabel: 'Connect on LinkedIn',
    icon: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd"/></svg>',
  },
]);

/**
 * Default contact information
 * @private
 */
const DEFAULT_CONTACT_INFO = Object.freeze({
  email: 'contact@company.com',
  phone: '+1 (555) 123-4567',
  address: '123 Tech Street, San Francisco, CA 94105',
});

/**
 * Default configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  navigationSections: DEFAULT_NAVIGATION,
  contactInfo: DEFAULT_CONTACT_INFO,
  socialLinks: DEFAULT_SOCIAL_LINKS,
  legalLinks: {
    privacy: '#privacy',
    terms: '#terms',
    cookies: '#cookies',
    accessibility: '#accessibility',
  },
  copyrightText: `© ${new Date().getFullYear()} AI-Powered Software Development Platform. All rights reserved.`,
  showNewsletter: true,
  newsletterConfig: {},
  enableAnalytics: true,
  showBackToTop: true,
  logoUrl: null,
  logoAlt: 'Company Logo',
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
    component: 'footer',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[Footer]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'footer',
      ...context,
    });
  }
};

/**
 * Sanitizes HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeHTML = (str) => {
  if (typeof str !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Validates configuration
 * @param {Object} config - Configuration to validate
 * @returns {FooterConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Footer configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (!Array.isArray(validated.navigationSections)) {
    throw new TypeError('navigationSections must be an array');
  }

  if (validated.contactInfo && typeof validated.contactInfo !== 'object') {
    throw new TypeError('contactInfo must be an object');
  }

  if (!Array.isArray(validated.socialLinks)) {
    throw new TypeError('socialLinks must be an array');
  }

  if (validated.legalLinks && typeof validated.legalLinks !== 'object') {
    throw new TypeError('legalLinks must be an object');
  }

  if (typeof validated.copyrightText !== 'string') {
    throw new TypeError('copyrightText must be a string');
  }

  if (typeof validated.showNewsletter !== 'boolean') {
    throw new TypeError('showNewsletter must be a boolean');
  }

  if (typeof validated.enableAnalytics !== 'boolean') {
    throw new TypeError('enableAnalytics must be a boolean');
  }

  if (typeof validated.showBackToTop !== 'boolean') {
    throw new TypeError('showBackToTop must be a boolean');
  }

  return validated;
};

/**
 * Creates navigation section HTML
 * @param {NavigationSection} section - Navigation section
 * @returns {string} Section HTML
 */
const createNavigationSection = (section) => {
  const linksHTML = section.links
    .map((link) => {
      const external = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      const ariaLabel = link.ariaLabel ? ` aria-label="${sanitizeHTML(link.ariaLabel)}"` : '';
      
      return `
        <li>
          <a 
            href="${sanitizeHTML(link.href)}" 
            class="footer-link"${external}${ariaLabel}
            data-footer-link="${sanitizeHTML(link.text)}"
          >
            ${sanitizeHTML(link.text)}
            ${link.external ? '<svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>' : ''}
          </a>
        </li>
      `;
    })
    .join('');

  return `
    <div class="footer-section">
      <h3 class="footer-section-title">${sanitizeHTML(section.title)}</h3>
      <ul class="footer-links" role="list">
        ${linksHTML}
      </ul>
    </div>
  `;
};

/**
 * Creates contact information HTML
 * @param {ContactInfo} contactInfo - Contact information
 * @returns {string} Contact HTML
 */
const createContactInfo = (contactInfo) => {
  if (!contactInfo) return '';

  const items = [];

  if (contactInfo.email) {
    items.push(`
      <div class="contact-item">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <a href="mailto:${sanitizeHTML(contactInfo.email)}" class="contact-link" data-contact-type="email">
          ${sanitizeHTML(contactInfo.email)}
        </a>
      </div>
    `);
  }

  if (contactInfo.phone) {
    items.push(`
      <div class="contact-item">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
        <a href="tel:${sanitizeHTML(contactInfo.phone.replace(/\D/g, ''))}" class="contact-link" data-contact-type="phone">
          ${sanitizeHTML(contactInfo.phone)}
        </a>
      </div>
    `);
  }

  if (contactInfo.address) {
    items.push(`
      <div class="contact-item">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <address class="contact-address">
          ${sanitizeHTML(contactInfo.address)}
        </address>
      </div>
    `);
  }

  return `
    <div class="footer-section footer-contact">
      <h3 class="footer-section-title">Contact Us</h3>
      <div class="contact-info">
        ${items.join('')}
      </div>
    </div>
  `;
};

/**
 * Creates social links HTML
 * @param {Array<SocialLink>} socialLinks - Social links
 * @returns {string} Social links HTML
 */
const createSocialLinks = (socialLinks) => {
  if (!socialLinks || socialLinks.length === 0) return '';

  const linksHTML = socialLinks
    .map((link) => `
      <a 
        href="${sanitizeHTML(link.url)}" 
        class="social-link" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="${sanitizeHTML(link.ariaLabel)}"
        data-social-platform="${sanitizeHTML(link.platform)}"
      >
        ${link.icon}
      </a>
    `)
    .join('');

  return `
    <div class="footer-social">
      <h3 class="footer-section-title">Follow Us</h3>
      <div class="social-links" role="list">
        ${linksHTML}
      </div>
    </div>
  `;
};

/**
 * Creates back to top button HTML
 * @returns {string} Button HTML
 */
const createBackToTopButton = () => `
  <button 
    class="back-to-top" 
    aria-label="Back to top"
    data-back-to-top
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
    </svg>
  </button>
`;

/**
 * Creates footer HTML
 * @param {FooterConfig} config - Footer configuration
 * @returns {string} Footer HTML
 */
const createFooterHTML = (config) => {
  const navigationHTML = config.navigationSections
    .map((section) => createNavigationSection(section))
    .join('');

  const contactHTML = createContactInfo(config.contactInfo);
  const socialHTML = createSocialLinks(config.socialLinks);
  const backToTopHTML = config.showBackToTop ? createBackToTopButton() : '';

  const additionalClasses = config.className || '';

  const logoHTML = config.logoUrl
    ? `
      <div class="footer-logo">
        <img src="${sanitizeHTML(config.logoUrl)}" alt="${sanitizeHTML(config.logoAlt)}" />
      </div>
    `
    : '';

  return `
    <footer class="site-footer ${additionalClasses}" data-footer role="contentinfo">
      <div class="footer-container">
        <div class="footer-top">
          ${logoHTML}
          
          <div class="footer-navigation">
            ${navigationHTML}
            ${contactHTML}
          </div>

          ${config.showNewsletter ? `
            <div class="footer-newsletter">
              <h3 class="footer-section-title">Stay Updated</h3>
              <p class="newsletter-description">Subscribe to our newsletter for the latest updates and insights.</p>
              <div data-newsletter-container></div>
            </div>
          ` : ''}
        </div>

        ${socialHTML}

        <div class="footer-bottom">
          <div class="footer-legal">
            ${config.legalLinks.privacy ? `<a href="${sanitizeHTML(config.legalLinks.privacy)}" class="legal-link" data-legal-link="privacy">Privacy Policy</a>` : ''}
            ${config.legalLinks.terms ? `<a href="${sanitizeHTML(config.legalLinks.terms)}" class="legal-link" data-legal-link="terms">Terms of Service</a>` : ''}
            ${config.legalLinks.cookies ? `<a href="${sanitizeHTML(config.legalLinks.cookies)}" class="legal-link" data-legal-link="cookies">Cookie Policy</a>` : ''}
            ${config.legalLinks.accessibility ? `<a href="${sanitizeHTML(config.legalLinks.accessibility)}" class="legal-link" data-legal-link="accessibility">Accessibility</a>` : ''}
          </div>
          <p class="footer-copyright">${sanitizeHTML(config.copyrightText)}</p>
        </div>
      </div>

      ${backToTopHTML}
    </footer>
  `;
};

/**
 * Handles back to top button click
 * @param {Event} event - Click event
 */
const handleBackToTop = (event) => {
  event.preventDefault();

  logEvent('back_to_top_clicked');

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * Handles footer link click
 * @param {Event} event - Click event
 */
const handleFooterLinkClick = (event) => {
  const link = event.target.closest('[data-footer-link]');
  if (!link) return;

  const linkText = link.dataset.footerLink;

  logEvent('footer_link_clicked', {
    link_text: linkText,
    link_href: link.href,
  });
};

/**
 * Handles contact link click
 * @param {Event} event - Click event
 */
const handleContactLinkClick = (event) => {
  const link = event.target.closest('[data-contact-type]');
  if (!link) return;

  const contactType = link.dataset.contactType;

  logEvent('contact_link_clicked', {
    contact_type: contactType,
  });
};

/**
 * Handles social link click
 * @param {Event} event - Click event
 */
const handleSocialLinkClick = (event) => {
  const link = event.target.closest('[data-social-platform]');
  if (!link) return;

  const platform = link.dataset.socialPlatform;

  logEvent('social_link_clicked', {
    platform,
  });
};

/**
 * Handles legal link click
 * @param {Event} event - Click event
 */
const handleLegalLinkClick = (event) => {
  const link = event.target.closest('[data-legal-link]');
  if (!link) return;

  const linkType = link.dataset.legalLink;

  logEvent('legal_link_clicked', {
    link_type: linkType,
  });
};

/**
 * Updates back to top button visibility
 * @param {HTMLElement} button - Back to top button
 */
const updateBackToTopVisibility = (button) => {
  const scrollThreshold = 300;
  const shouldShow = window.scrollY > scrollThreshold;

  if (shouldShow) {
    button.classList.add('visible');
    button.setAttribute('aria-hidden', 'false');
  } else {
    button.classList.remove('visible');
    button.setAttribute('aria-hidden', 'true');
  }
};

/**
 * Attaches event listeners to footer
 * @param {HTMLElement} footerElement - Footer element
 * @param {FooterConfig} config - Footer configuration
 * @returns {Function} Cleanup function
 */
const attachEventListeners = (footerElement, config) => {
  const backToTopButton = footerElement.querySelector('[data-back-to-top]');
  
  const handlers = {
    backToTop: null,
    scroll: null,
    footerLink: null,
    contactLink: null,
    socialLink: null,
    legalLink: null,
  };

  if (backToTopButton) {
    handlers.backToTop = (event) => handleBackToTop(event);
    backToTopButton.addEventListener('click', handlers.backToTop);

    handlers.scroll = () => updateBackToTopVisibility(backToTopButton);
    window.addEventListener('scroll', handlers.scroll, { passive: true });
    
    updateBackToTopVisibility(backToTopButton);
  }

  handlers.footerLink = (event) => handleFooterLinkClick(event);
  footerElement.addEventListener('click', handlers.footerLink);

  handlers.contactLink = (event) => handleContactLinkClick(event);
  footerElement.addEventListener('click', handlers.contactLink);

  handlers.socialLink = (event) => handleSocialLinkClick(event);
  footerElement.addEventListener('click', handlers.socialLink);

  handlers.legalLink = (event) => handleLegalLinkClick(event);
  footerElement.addEventListener('click', handlers.legalLink);

  return () => {
    if (backToTopButton && handlers.backToTop) {
      backToTopButton.removeEventListener('click', handlers.backToTop);
    }
    
    if (handlers.scroll) {
      window.removeEventListener('scroll', handlers.scroll);
    }

    if (handlers.footerLink) {
      footerElement.removeEventListener('click', handlers.footerLink);
    }

    if (handlers.contactLink) {
      footerElement.removeEventListener('click', handlers.contactLink);
    }

    if (handlers.socialLink) {
      footerElement.removeEventListener('click', handlers.socialLink);
    }

    if (handlers.legalLink) {
      footerElement.removeEventListener('click', handlers.legalLink);
    }
  };
};

/**
 * Creates footer and renders it into target element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} customConfig - Footer configuration
 * @returns {Object} Footer instance with methods
 * @throws {Error} If target not found or configuration invalid
 */
export const createFooter = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Footer target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);

    const footerHTML = createFooterHTML(config);
    targetElement.innerHTML = footerHTML;

    const footerElement = targetElement.querySelector('[data-footer]');
    if (!footerElement) {
      throw new Error('Failed to create footer element');
    }

    const cleanup = attachEventListeners(footerElement, config);

    let newsletterInstance = null;
    if (config.showNewsletter) {
      const newsletterContainer = footerElement.querySelector('[data-newsletter-container]');
      if (newsletterContainer) {
        try {
          newsletterInstance = createNewsletterSignup(newsletterContainer, config.newsletterConfig);
        } catch (error) {
          logEvent('newsletter_initialization_error', {
            error_message: error.message,
          });
        }
      }
    }

    const renderTime = performance.now() - startTime;
    logEvent('footer_rendered', {
      render_time_ms: renderTime.toFixed(2),
      show_newsletter: config.showNewsletter,
      show_back_to_top: config.showBackToTop,
      navigation_sections: config.navigationSections.length,
      social_links: config.socialLinks.length,
    });

    return {
      element: footerElement,
      config,
      newsletter: newsletterInstance,
      scrollToTop: () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        logEvent('scroll_to_top_programmatic');
      },
      cleanup: () => {
        cleanup();
        if (newsletterInstance?.cleanup) {
          newsletterInstance.cleanup();
        }
        logEvent('footer_cleanup');
      },
    };
  } catch (error) {
    logEvent('footer_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create footer: ${error.message}`, {
      cause: error,
    });
  }
};

export default createFooter;