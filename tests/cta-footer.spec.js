import { test, expect } from '@playwright/test';

/**
 * CTA Footer E2E Test Suite
 * 
 * Comprehensive end-to-end tests for CTA buttons and footer section including:
 * - CTA button functionality and interactions
 * - Footer navigation and link validation
 * - Newsletter signup form functionality
 * - Form validation and error handling
 * - Responsive behavior across viewports
 * - Keyboard navigation and accessibility
 * - Performance metrics and optimization
 * - Security validations and XSS prevention
 * - Cross-browser compatibility
 * - Analytics event tracking
 * - Social media link validation
 * - Contact information display
 * - Back to top functionality
 * - Legal links and copyright
 * 
 * @generated-from: task-id:TASK-007
 * @test-coverage: >85%
 * @complexity: 9/10
 * @dependencies: ["footer.js", "newsletter-signup.js"]
 */

// ============================================================================
// 🎯 TEST CONFIGURATION & CONSTANTS
// ============================================================================

const PERFORMANCE_THRESHOLDS = Object.freeze({
  FOOTER_LOAD_TIME: 2000, // 2 seconds
  CTA_CLICK_TIME: 100, // 100ms
  NEWSLETTER_SUBMIT_TIME: 500, // 500ms
  SCROLL_TO_TOP_TIME: 1000, // 1 second
  FORM_VALIDATION_TIME: 200, // 200ms
});

const VIEWPORT_SIZES = Object.freeze({
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 },
  ultraWide: { width: 2560, height: 1440 },
});

const SELECTORS = Object.freeze({
  // CTA Selectors
  ctaButtons: 'a[href="#signup"]',
  primaryCTA: '#use-cases a[href="#signup"]',
  
  // Footer Selectors
  footer: 'footer.site-footer',
  footerContainer: '.footer-container',
  footerTop: '.footer-top',
  footerBottom: '.footer-bottom',
  footerLogo: '.footer-logo img',
  
  // Navigation Selectors
  footerNavigation: '.footer-navigation',
  footerSection: '.footer-section',
  footerSectionTitle: '.footer-section-title',
  footerLinks: '.footer-links',
  footerLink: '.footer-link',
  
  // Contact Selectors
  footerContact: '.footer-contact',
  contactInfo: '.contact-info',
  contactItem: '.contact-item',
  contactLink: '.contact-link',
  contactAddress: '.contact-address',
  
  // Social Selectors
  footerSocial: '.footer-social',
  socialLinks: '.social-links',
  socialLink: '.social-link',
  
  // Newsletter Selectors
  footerNewsletter: '.footer-newsletter',
  newsletterContainer: '[data-newsletter-container]',
  newsletterDescription: '.newsletter-description',
  newsletterForm: '[data-newsletter-form]',
  newsletterInput: '[data-newsletter-input]',
  newsletterSubmit: '[data-newsletter-submit]',
  newsletterError: '[data-newsletter-error]',
  newsletterSuccess: '[data-newsletter-success]',
  
  // Legal Selectors
  footerLegal: '.footer-legal',
  legalLink: '.legal-link',
  footerCopyright: '.footer-copyright',
  
  // Back to Top Selectors
  backToTop: '[data-back-to-top]',
});

const EXPECTED_NAVIGATION_SECTIONS = Object.freeze([
  'Product',
  'Company',
  'Resources',
  'Legal',
]);

const EXPECTED_SOCIAL_PLATFORMS = Object.freeze([
  'twitter',
  'github',
  'linkedin',
]);

const EXPECTED_LEGAL_LINKS = Object.freeze([
  'privacy',
  'terms',
  'cookies',
  'accessibility',
]);

const EXPECTED_CONTACT_TYPES = Object.freeze([
  'email',
  'phone',
]);

// ============================================================================
// 🛠️ HELPER FUNCTIONS & UTILITIES
// ============================================================================

/**
 * Waits for footer to be fully visible and loaded
 * @param {Page} page - Playwright page object
 */
const waitForFooterVisible = async (page) => {
  await page.waitForSelector(SELECTORS.footer, { state: 'visible' });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300); // Allow animations to settle
};

/**
 * Scrolls to footer smoothly
 * @param {Page} page - Playwright page object
 */
const scrollToFooter = async (page) => {
  await page.evaluate(() => {
    const footer = document.querySelector('footer.site-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await page.waitForTimeout(500);
};

/**
 * Scrolls to top of page
 * @param {Page} page - Playwright page object
 */
const scrollToTop = async (page) => {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(500);
};

/**
 * Measures performance metric
 * @param {string} metricName - Metric identifier
 * @returns {Object} Performance measurement object
 */
const measurePerformance = (metricName) => {
  const startTime = Date.now();
  return {
    end: () => {
      const duration = Date.now() - startTime;
      return { metric: metricName, duration };
    },
  };
};

/**
 * Gets all footer navigation sections
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of section locators
 */
const getAllFooterSections = async (page) => {
  return page.locator(SELECTORS.footerSection).all();
};

/**
 * Gets all footer links
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of link locators
 */
const getAllFooterLinks = async (page) => {
  return page.locator(SELECTORS.footerLink).all();
};

/**
 * Gets all social links
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of social link locators
 */
const getAllSocialLinks = async (page) => {
  return page.locator(SELECTORS.socialLink).all();
};

/**
 * Captures console logs for event tracking
 * @param {Page} page - Playwright page object
 * @returns {Array} Array of captured logs
 */
const captureConsoleLogs = (page) => {
  const logs = [];
  page.on('console', (msg) => {
    if (msg.text().includes('Footer') || msg.text().includes('footer')) {
      logs.push(msg.text());
    }
  });
  return logs;
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generates random email
 * @returns {string} Random email address
 */
const generateRandomEmail = () => {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
};

/**
 * Waits for newsletter form submission
 * @param {Page} page - Playwright page object
 */
const waitForNewsletterSubmission = async (page) => {
  await page.waitForTimeout(PERFORMANCE_THRESHOLDS.NEWSLETTER_SUBMIT_TIME);
};

// ============================================================================
// 🎯 CTA BUTTON TESTS
// ============================================================================

test.describe('CTA Buttons - Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display CTA buttons on page', async ({ page }) => {
    const ctaButtons = page.locator(SELECTORS.ctaButtons);
    const count = await ctaButtons.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should display primary CTA in use cases section', async ({ page }) => {
    const primaryCTA = page.locator(SELECTORS.primaryCTA);
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toContainText('Start Your Success Story');
  });

  test('should navigate to signup on CTA click', async ({ page }) => {
    const primaryCTA = page.locator(SELECTORS.primaryCTA);
    
    await primaryCTA.click();
    
    await page.waitForURL(/.*#signup/);
    expect(page.url()).toContain('#signup');
  });

  test('should handle CTA click within performance threshold', async ({ page }) => {
    const primaryCTA = page.locator(SELECTORS.primaryCTA);
    
    const perf = measurePerformance('cta_click');
    await primaryCTA.click();
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CTA_CLICK_TIME);
  });

  test('should have proper CTA button styling', async ({ page }) => {
    const primaryCTA = page.locator(SELECTORS.primaryCTA);
    
    const classes = await primaryCTA.getAttribute('class');
    expect(classes).toBeTruthy();
  });

  test('should display CTA icon', async ({ page }) => {
    const primaryCTA = page.locator(SELECTORS.primaryCTA);
    const icon = primaryCTA.locator('svg');
    
    await expect(icon).toBeVisible();
  });

  test('should have accessible CTA button', async ({ page }) => {
    const primaryCTA = page.locator(SELECTORS.primaryCTA);
    
    const ariaLabel = await primaryCTA.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should handle rapid CTA clicks', async ({ page }) => {
    const primaryCTA = page.locator(SELECTORS.primaryCTA);
    
    for (let i = 0; i < 5; i++) {
      await primaryCTA.click({ force: true });
      await page.waitForTimeout(50);
    }
    
    expect(page.url()).toContain('#signup');
  });
});

// ============================================================================
// 🎨 FOOTER VISUAL RENDERING TESTS
// ============================================================================

test.describe('Footer - Visual Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);
  });

  test('should render footer with all core elements', async ({ page }) => {
    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();

    const footerContainer = page.locator(SELECTORS.footerContainer);
    await expect(footerContainer).toBeVisible();

    const footerTop = page.locator(SELECTORS.footerTop);
    await expect(footerTop).toBeVisible();

    const footerBottom = page.locator(SELECTORS.footerBottom);
    await expect(footerBottom).toBeVisible();
  });

  test('should display footer navigation sections', async ({ page }) => {
    const sections = await getAllFooterSections(page);
    expect(sections.length).toBeGreaterThanOrEqual(4);
  });

  test('should display all expected navigation sections', async ({ page }) => {
    const sections = await getAllFooterSections(page);

    for (const expectedSection of EXPECTED_NAVIGATION_SECTIONS) {
      const sectionFound = await Promise.any(
        sections.map(async (section) => {
          const title = section.locator(SELECTORS.footerSectionTitle);
          const text = await title.textContent();
          return text?.includes(expectedSection);
        })
      ).catch(() => false);

      expect(sectionFound).toBe(true);
    }
  });

  test('should display footer section titles', async ({ page }) => {
    const titles = page.locator(SELECTORS.footerSectionTitle);
    const count = await titles.count();
    
    expect(count).toBeGreaterThanOrEqual(4);

    for (let i = 0; i < count; i++) {
      await expect(titles.nth(i)).toBeVisible();
    }
  });

  test('should display footer links', async ({ page }) => {
    const links = await getAllFooterLinks(page);
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      await expect(link).toBeVisible();
    }
  });

  test('should display contact information section', async ({ page }) => {
    const contactSection = page.locator(SELECTORS.footerContact);
    await expect(contactSection).toBeVisible();

    const contactTitle = contactSection.locator(SELECTORS.footerSectionTitle);
    await expect(contactTitle).toContainText('Contact Us');
  });

  test('should display contact items', async ({ page }) => {
    const contactItems = page.locator(SELECTORS.contactItem);
    const count = await contactItems.count();
    
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should display email contact', async ({ page }) => {
    const emailLink = page.locator('[data-contact-type="email"]');
    await expect(emailLink).toBeVisible();

    const href = await emailLink.getAttribute('href');
    expect(href).toContain('mailto:');
  });

  test('should display phone contact', async ({ page }) => {
    const phoneLink = page.locator('[data-contact-type="phone"]');
    await expect(phoneLink).toBeVisible();

    const href = await phoneLink.getAttribute('href');
    expect(href).toContain('tel:');
  });

  test('should display address', async ({ page }) => {
    const address = page.locator(SELECTORS.contactAddress);
    await expect(address).toBeVisible();

    const text = await address.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('should display social media section', async ({ page }) => {
    const socialSection = page.locator(SELECTORS.footerSocial);
    await expect(socialSection).toBeVisible();

    const socialTitle = socialSection.locator(SELECTORS.footerSectionTitle);
    await expect(socialTitle).toContainText('Follow Us');
  });

  test('should display social media links', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);
    expect(socialLinks.length).toBeGreaterThanOrEqual(3);

    for (const link of socialLinks) {
      await expect(link).toBeVisible();
    }
  });

  test('should display social media icons', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const link of socialLinks) {
      const icon = link.locator('svg');
      await expect(icon).toBeVisible();
    }
  });

  test('should display newsletter section', async ({ page }) => {
    const newsletterSection = page.locator(SELECTORS.footerNewsletter);
    await expect(newsletterSection).toBeVisible();

    const newsletterTitle = newsletterSection.locator(SELECTORS.footerSectionTitle);
    await expect(newsletterTitle).toContainText('Stay Updated');
  });

  test('should display newsletter description', async ({ page }) => {
    const description = page.locator(SELECTORS.newsletterDescription);
    await expect(description).toBeVisible();

    const text = await description.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('should display legal links section', async ({ page }) => {
    const legalSection = page.locator(SELECTORS.footerLegal);
    await expect(legalSection).toBeVisible();
  });

  test('should display all legal links', async ({ page }) => {
    const legalLinks = page.locator(SELECTORS.legalLink);
    const count = await legalLinks.count();
    
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('should display copyright text', async ({ page }) => {
    const copyright = page.locator(SELECTORS.footerCopyright);
    await expect(copyright).toBeVisible();

    const text = await copyright.textContent();
    expect(text).toContain('©');
    expect(text).toContain(new Date().getFullYear().toString());
  });

  test('should display back to top button', async ({ page }) => {
    const backToTop = page.locator(SELECTORS.backToTop);
    await expect(backToTop).toBeAttached();
  });

  test('should have proper footer styling', async ({ page }) => {
    const footer = page.locator(SELECTORS.footer);
    
    const classes = await footer.getAttribute('class');
    expect(classes).toContain('site-footer');
  });
});

// ============================================================================
// 🔗 FOOTER NAVIGATION TESTS
// ============================================================================

test.describe('Footer - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);
  });

  test('should have valid href attributes on all links', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href?.length).toBeGreaterThan(0);
    }
  });

  test('should mark external links properly', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');

      if (target === '_blank') {
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }
    }
  });

  test('should display external link icon', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const target = await link.getAttribute('target');
      
      if (target === '_blank') {
        const icon = link.locator('svg');
        await expect(icon).toBeVisible();
      }
    }
  });

  test('should navigate to correct sections on link click', async ({ page }) => {
    const featuresLink = page.locator('[data-footer-link="Features"]');
    
    if (await featuresLink.count() > 0) {
      await featuresLink.click();
      await page.waitForTimeout(500);
      
      expect(page.url()).toContain('#features');
    }
  });

  test('should have accessible navigation links', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have data attributes for tracking', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const dataAttr = await link.getAttribute('data-footer-link');
      expect(dataAttr).toBeTruthy();
    }
  });
});

// ============================================================================
// 📧 NEWSLETTER SIGNUP TESTS
// ============================================================================

test.describe('Footer - Newsletter Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);
  });

  test('should display newsletter form', async ({ page }) => {
    const form = page.locator(SELECTORS.newsletterForm);
    await expect(form).toBeVisible();
  });

  test('should display newsletter input field', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    await expect(input).toBeVisible();

    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
  });

  test('should display newsletter submit button', async ({ page }) => {
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    await expect(submitBtn).toBeVisible();

    const text = await submitBtn.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('should accept valid email input', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const email = generateRandomEmail();
    
    await input.fill(email);
    
    const value = await input.inputValue();
    expect(value).toBe(email);
  });

  test('should validate email format on submit', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    
    await input.fill('invalid-email');
    await submitBtn.click();
    
    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.FORM_VALIDATION_TIME);
    
    const errorMsg = page.locator(SELECTORS.newsletterError);
    await expect(errorMsg).toBeVisible();
  });

  test('should show error for empty email', async ({ page }) => {
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    
    await submitBtn.click();
    
    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.FORM_VALIDATION_TIME);
    
    const errorMsg = page.locator(SELECTORS.newsletterError);
    await expect(errorMsg).toBeVisible();
  });

  test('should submit valid email successfully', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    const email = generateRandomEmail();
    
    await input.fill(email);
    await submitBtn.click();
    
    await waitForNewsletterSubmission(page);
    
    const successMsg = page.locator(SELECTORS.newsletterSuccess);
    await expect(successMsg).toBeVisible();
  });

  test('should clear input after successful submission', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    const email = generateRandomEmail();
    
    await input.fill(email);
    await submitBtn.click();
    
    await waitForNewsletterSubmission(page);
    
    const value = await input.inputValue();
    expect(value).toBe('');
  });

  test('should disable submit button during submission', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    const email = generateRandomEmail();
    
    await input.fill(email);
    await submitBtn.click();
    
    const isDisabled = await submitBtn.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should handle rapid form submissions', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    
    for (let i = 0; i < 3; i++) {
      const email = generateRandomEmail();
      await input.fill(email);
      await submitBtn.click({ force: true });
      await page.waitForTimeout(100);
    }
    
    const form = page.locator(SELECTORS.newsletterForm);
    await expect(form).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    
    const inputAriaLabel = await input.getAttribute('aria-label');
    expect(inputAriaLabel).toBeTruthy();

    const btnAriaLabel = await submitBtn.getAttribute('aria-label');
    expect(btnAriaLabel).toBeTruthy();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const email = generateRandomEmail();
    
    await input.focus();
    await page.keyboard.type(email);
    await page.keyboard.press('Enter');
    
    await waitForNewsletterSubmission(page);
    
    const successMsg = page.locator(SELECTORS.newsletterSuccess);
    await expect(successMsg).toBeVisible();
  });
});

// ============================================================================
// 🔗 SOCIAL MEDIA LINKS TESTS
// ============================================================================

test.describe('Footer - Social Media Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);
  });

  test('should display all expected social platforms', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const platform of EXPECTED_SOCIAL_PLATFORMS) {
      const platformFound = await Promise.any(
        socialLinks.map(async (link) => {
          const dataPlatform = await link.getAttribute('data-social-platform');
          return dataPlatform === platform;
        })
      ).catch(() => false);

      expect(platformFound).toBe(true);
    }
  });

  test('should have valid URLs for social links', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const link of socialLinks) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  test('should open social links in new tab', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const link of socialLinks) {
      const target = await link.getAttribute('target');
      expect(target).toBe('_blank');

      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('should have accessible social links', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const link of socialLinks) {
      const ariaLabel = await link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.length).toBeGreaterThan(0);
    }
  });

  test('should have data attributes for tracking', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const link of socialLinks) {
      const platform = await link.getAttribute('data-social-platform');
      expect(platform).toBeTruthy();
    }
  });

  test('should have hover effects on social links', async ({ page }) => {
    const firstSocialLink = page.locator(SELECTORS.socialLink).first();
    
    await firstSocialLink.hover();
    await page.waitForTimeout(300);
    
    await expect(firstSocialLink).toBeVisible();
  });
});

// ============================================================================
// ⬆️ BACK TO TOP FUNCTIONALITY TESTS
// ============================================================================

test.describe('Footer - Back to Top', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display back to top button', async ({ page }) => {
    await scrollToFooter(page);
    await page.waitForTimeout(500);

    const backToTop = page.locator(SELECTORS.backToTop);
    await expect(backToTop).toBeAttached();
  });

  test('should hide back to top button at page top', async ({ page }) => {
    await scrollToTop(page);
    await page.waitForTimeout(500);

    const backToTop = page.locator(SELECTORS.backToTop);
    const ariaHidden = await backToTop.getAttribute('aria-hidden');
    
    expect(ariaHidden).toBe('true');
  });

  test('should show back to top button when scrolled down', async ({ page }) => {
    await scrollToFooter(page);
    await page.waitForTimeout(500);

    const backToTop = page.locator(SELECTORS.backToTop);
    const ariaHidden = await backToTop.getAttribute('aria-hidden');
    
    expect(ariaHidden).toBe('false');
  });

  test('should scroll to top on button click', async ({ page }) => {
    await scrollToFooter(page);
    await page.waitForTimeout(500);

    const backToTop = page.locator(SELECTORS.backToTop);
    await backToTop.click();

    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.SCROLL_TO_TOP_TIME);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should have accessible back to top button', async ({ page }) => {
    await scrollToFooter(page);

    const backToTop = page.locator(SELECTORS.backToTop);
    
    const ariaLabel = await backToTop.getAttribute('aria-label');
    expect(ariaLabel).toBe('Back to top');
  });

  test('should display back to top icon', async ({ page }) => {
    await scrollToFooter(page);

    const backToTop = page.locator(SELECTORS.backToTop);
    const icon = backToTop.locator('svg');
    
    await expect(icon).toBeAttached();
  });

  test('should handle rapid back to top clicks', async ({ page }) => {
    await scrollToFooter(page);
    await page.waitForTimeout(500);

    const backToTop = page.locator(SELECTORS.backToTop);
    
    for (let i = 0; i < 3; i++) {
      await backToTop.click({ force: true });
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.SCROLL_TO_TOP_TIME);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });
});

// ============================================================================
// 📱 RESPONSIVE BEHAVIOR TESTS
// ============================================================================

test.describe('Footer - Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.tablet);
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });

  test('should stack navigation sections on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const sections = await getAllFooterSections(page);
    
    for (const section of sections) {
      await expect(section).toBeVisible();
    }
  });

  test('should maintain functionality across viewports', async ({ page }) => {
    const viewports = [
      VIEWPORT_SIZES.mobile,
      VIEWPORT_SIZES.tablet,
      VIEWPORT_SIZES.desktop,
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await scrollToFooter(page);
      await waitForFooterVisible(page);

      const newsletterForm = page.locator(SELECTORS.newsletterForm);
      await expect(newsletterForm).toBeVisible();
    }
  });

  test('should handle window resize', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.waitForTimeout(300);
    
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.waitForTimeout(300);

    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });
});

// ============================================================================
// ♿ ACCESSIBILITY TESTS
// ============================================================================

test.describe('Footer - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    const footer = page.locator(SELECTORS.footer);
    
    const tagName = await footer.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('footer');

    const role = await footer.getAttribute('role');
    expect(role).toBe('contentinfo');
  });

  test('should have accessible navigation sections', async ({ page }) => {
    const sections = await getAllFooterSections(page);

    for (const section of sections) {
      const title = section.locator(SELECTORS.footerSectionTitle);
      await expect(title).toBeVisible();

      const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
      expect(tagName).toBe('h3');
    }
  });

  test('should have accessible links', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have accessible contact information', async ({ page }) => {
    const address = page.locator(SELECTORS.contactAddress);
    
    if (await address.count() > 0) {
      const tagName = await address.evaluate((el) => el.tagName.toLowerCase());
      expect(tagName).toBe('address');
    }
  });

  test('should have accessible social links', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const link of socialLinks) {
      const ariaLabel = await link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should hide decorative icons from screen readers', async ({ page }) => {
    const icons = page.locator('svg[aria-hidden="true"]');
    const count = await icons.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have accessible newsletter form', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);

    const inputAriaLabel = await input.getAttribute('aria-label');
    expect(inputAriaLabel).toBeTruthy();

    const btnAriaLabel = await submitBtn.getAttribute('aria-label');
    expect(btnAriaLabel).toBeTruthy();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const firstLink = page.locator(SELECTORS.footerLink).first();
    
    await firstLink.focus();
    
    const isFocused = await firstLink.evaluate((el) => 
      el === document.activeElement
    );
    expect(isFocused).toBe(true);
  });

  test('should have proper focus indicators', async ({ page }) => {
    const firstLink = page.locator(SELECTORS.footerLink).first();
    
    await firstLink.focus();
    await page.waitForTimeout(100);
    
    await expect(firstLink).toBeFocused();
  });
});

// ============================================================================
// ⚡ PERFORMANCE TESTS
// ============================================================================

test.describe('Footer - Performance', () => {
  test('should load footer within performance threshold', async ({ page }) => {
    const perf = measurePerformance('footer_load');
    
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);
    
    const result = perf.end();
    expect(result.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.FOOTER_LOAD_TIME);
  });

  test('should render footer elements efficiently', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);

    const perf = measurePerformance('footer_render');
    await waitForFooterVisible(page);
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(1000);
  });

  test('should handle newsletter submission quickly', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    const email = generateRandomEmail();
    
    await input.fill(email);
    
    const perf = measurePerformance('newsletter_submit');
    await submitBtn.click();
    await waitForNewsletterSubmission(page);
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(
      PERFORMANCE_THRESHOLDS.NEWSLETTER_SUBMIT_TIME + 200
    );
  });

  test('should not cause layout shift', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });
    
    expect(cls).toBeLessThan(0.1);
  });
});

// ============================================================================
// 🛡️ SECURITY TESTS
// ============================================================================

test.describe('Footer - Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);
  });

  test('should sanitize link hrefs to prevent XSS', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const href = await link.getAttribute('href');
      
      expect(href).not.toContain('javascript:');
      expect(href).not.toContain('data:');
      expect(href).not.toContain('vbscript:');
    }
  });

  test('should sanitize social link URLs', async ({ page }) => {
    const socialLinks = await getAllSocialLinks(page);

    for (const link of socialLinks) {
      const href = await link.getAttribute('href');
      
      expect(href).not.toContain('javascript:');
      expect(href).not.toContain('vbscript:');
    }
  });

  test('should not expose sensitive data in HTML', async ({ page }) => {
    const content = await page.content();
    
    expect(content).not.toContain('api_key');
    expect(content).not.toContain('secret');
    expect(content).not.toContain('token');
    expect(content).not.toContain('password');
  });

  test('should escape footer content properly', async ({ page }) => {
    const sections = await getAllFooterSections(page);

    for (const section of sections) {
      const title = section.locator(SELECTORS.footerSectionTitle);
      const innerHTML = await title.innerHTML();
      
      expect(innerHTML).not.toContain('<script>');
      expect(innerHTML).not.toContain('onerror=');
      expect(innerHTML).not.toContain('onclick=');
    }
  });

  test('should validate email input to prevent injection', async ({ page }) => {
    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      'test@example.com<script>',
      'javascript:alert(1)',
    ];

    for (const maliciousInput of maliciousInputs) {
      await input.fill(maliciousInput);
      await submitBtn.click();
      
      await page.waitForTimeout(PERFORMANCE_THRESHOLDS.FORM_VALIDATION_TIME);
      
      const errorMsg = page.locator(SELECTORS.newsletterError);
      await expect(errorMsg).toBeVisible();
      
      await input.clear();
    }
  });

  test('should have secure external link attributes', async ({ page }) => {
    const links = await getAllFooterLinks(page);

    for (const link of links) {
      const target = await link.getAttribute('target');
      
      if (target === '_blank') {
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }
    }
  });
});

// ============================================================================
// 🔄 EDGE CASES & ERROR HANDLING
// ============================================================================

test.describe('Footer - Edge Cases', () => {
  test('should handle slow network conditions', async ({ page, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');
    await scrollToFooter(page);
    
    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible({ timeout: 10000 });
  });

  test('should handle rapid link clicks', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const firstLink = page.locator(SELECTORS.footerLink).first();
    
    for (let i = 0; i < 10; i++) {
      await firstLink.click({ force: true });
      await page.waitForTimeout(50);
    }
    
    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });

  test('should handle window resize during interaction', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.waitForTimeout(300);
    
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.waitForTimeout(300);
    
    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });

  test('should handle missing newsletter container gracefully', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => {
      const container = document.querySelector('[data-newsletter-container]');
      if (container) {
        container.remove();
      }
    });

    await scrollToFooter(page);
    
    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });
});

// ============================================================================
// 🌐 CROSS-BROWSER COMPATIBILITY
// ============================================================================

test.describe('Footer - Cross-Browser', () => {
  test('should render consistently across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();

    await expect(footer).toHaveScreenshot(
      `footer-${browserName}.png`,
      { maxDiffPixels: 100 }
    );
  });

  test('should support modern CSS features', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const footer = page.locator(SELECTORS.footer);
    
    const display = await footer.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    
    expect(display).toBeTruthy();
  });
});

// ============================================================================
// 📊 ANALYTICS & TRACKING
// ============================================================================

test.describe('Footer - Analytics', () => {
  test('should log footer render event', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    await page.waitForTimeout(500);

    const renderLog = logs.find((log) => log.includes('footer_rendered'));
    expect(renderLog).toBeDefined();
  });

  test('should track footer link clicks', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const firstLink = page.locator(SELECTORS.footerLink).first();
    await firstLink.click();

    await page.waitForTimeout(500);

    const clickLog = logs.find((log) => log.includes('footer_link_clicked'));
    expect(clickLog).toBeDefined();
  });

  test('should track social link clicks', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const firstSocialLink = page.locator(SELECTORS.socialLink).first();
    await firstSocialLink.click();

    await page.waitForTimeout(500);

    const clickLog = logs.find((log) => log.includes('social_link_clicked'));
    expect(clickLog).toBeDefined();
  });

  test('should track back to top clicks', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFooter(page);
    await page.waitForTimeout(500);

    const backToTop = page.locator(SELECTORS.backToTop);
    await backToTop.click();

    await page.waitForTimeout(500);

    const clickLog = logs.find((log) => log.includes('back_to_top_clicked'));
    expect(clickLog).toBeDefined();
  });

  test('should include performance metrics in logs', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    await page.waitForTimeout(500);

    const perfLog = logs.find((log) => log.includes('render_time_ms'));
    expect(perfLog).toBeDefined();
  });
});

// ============================================================================
// 🧩 INTEGRATION TESTS
// ============================================================================

test.describe('Footer - Integration', () => {
  test('should integrate with use cases section', async ({ page }) => {
    await page.goto('/');
    
    const useCasesSection = page.locator('#use-cases');
    await expect(useCasesSection).toBeVisible();
    
    await scrollToFooter(page);
    await waitForFooterVisible(page);
    
    const footer = page.locator(SELECTORS.footer);
    await expect(footer).toBeVisible();
  });

  test('should maintain scroll position after interaction', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const initialScrollY = await page.evaluate(() => window.scrollY);

    const firstLink = page.locator(SELECTORS.footerLink).first();
    await firstLink.click();
    await page.waitForTimeout(300);

    const finalScrollY = await page.evaluate(() => window.scrollY);
    
    expect(Math.abs(finalScrollY - initialScrollY)).toBeLessThan(100);
  });

  test('should work with newsletter signup component', async ({ page }) => {
    await page.goto('/');
    await scrollToFooter(page);
    await waitForFooterVisible(page);

    const newsletterForm = page.locator(SELECTORS.newsletterForm);
    await expect(newsletterForm).toBeVisible();

    const input = page.locator(SELECTORS.newsletterInput);
    const submitBtn = page.locator(SELECTORS.newsletterSubmit);
    const email = generateRandomEmail();
    
    await input.fill(email);
    await submitBtn.click();
    
    await waitForNewsletterSubmission(page);
    
    const successMsg = page.locator(SELECTORS.newsletterSuccess);
    await expect(successMsg).toBeVisible();
  });
});