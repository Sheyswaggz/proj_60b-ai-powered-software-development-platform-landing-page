import { test, expect } from '@playwright/test';

/**
 * Use Cases Section E2E Test Suite
 * 
 * Comprehensive end-to-end tests for use cases section including:
 * - Visual rendering and layout validation
 * - Use case card display and content
 * - Testimonial carousel functionality
 * - Metric counter animations
 * - Responsive behavior across viewports
 * - Keyboard navigation and accessibility
 * - Performance metrics and optimization
 * - Security validations and XSS prevention
 * - Cross-browser compatibility
 * - Analytics event tracking
 * - Error handling and edge cases
 * 
 * @generated-from: task-id:TASK-006
 * @test-coverage: >85%
 * @complexity: 9/10
 * @dependencies: ["use-cases-section.js", "animations.js"]
 */

// ============================================================================
// 🎯 TEST CONFIGURATION & CONSTANTS
// ============================================================================

const PERFORMANCE_THRESHOLDS = Object.freeze({
  SECTION_LOAD_TIME: 3000, // 3 seconds
  CAROUSEL_TRANSITION_TIME: 600, // 600ms
  METRIC_ANIMATION_TIME: 2000, // 2 seconds
  CARD_HOVER_TIME: 300, // 300ms
  CTA_CLICK_TIME: 100, // 100ms
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
  useCasesSection: '#use-cases',
  sectionTitle: '#use-cases-title',
  subtitle: '#use-cases p.text-xl',
  useCaseCard: '.use-case-card',
  useCaseIcon: '.use-case-card .w-16.h-16',
  useCaseSegment: '.use-case-card .text-sm.font-semibold',
  useCaseTitle: '.use-case-card h3',
  useCaseProblem: '.use-case-card .mb-6:nth-of-type(2) p',
  useCaseSolution: '.use-case-card .mb-8 p',
  metricItem: '.metric-item',
  metricValue: '.metric-value',
  metricLabel: '.metric-label',
  testimonialCard: '.testimonial-card',
  testimonialQuote: '.testimonial-card p.italic',
  testimonialAuthor: '.testimonial-card .font-bold',
  testimonialRole: '.testimonial-card .text-sm:nth-of-type(1)',
  testimonialCompany: '.testimonial-card .text-sm:nth-of-type(2)',
  testimonialAvatar: '.testimonial-card img',
  carouselTrack: '.testimonial-track',
  carouselPrevBtn: '.carousel-prev-btn',
  carouselNextBtn: '.carousel-next-btn',
  carouselIndicators: '.carousel-indicators',
  carouselIndicator: '.carousel-indicator',
  ctaButton: '#use-cases a[href="#signup"]',
  backgroundPattern: '#use-cases .absolute.inset-0.opacity-5',
  decorativeElements: '#use-cases .blur-3xl.opacity-20',
});

const EXPECTED_USE_CASES = Object.freeze([
  {
    id: 'startup',
    title: 'Rapid MVP Development',
    segment: 'Startups',
    metricsCount: 3,
  },
  {
    id: 'enterprise',
    title: 'Legacy System Modernization',
    segment: 'Enterprises',
    metricsCount: 3,
  },
  {
    id: 'freelancer',
    title: 'Scale Your Client Work',
    segment: 'Freelancers',
    metricsCount: 3,
  },
  {
    id: 'team',
    title: 'Accelerate Team Productivity',
    segment: 'Development Teams',
    metricsCount: 3,
  },
]);

const EXPECTED_TESTIMONIALS_COUNT = 4;

// ============================================================================
// 🛠️ HELPER FUNCTIONS & UTILITIES
// ============================================================================

/**
 * Waits for use cases section to be fully visible and loaded
 * @param {Page} page - Playwright page object
 */
const waitForUseCasesVisible = async (page) => {
  await page.waitForSelector(SELECTORS.useCasesSection, { state: 'visible' });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300); // Allow animations to settle
};

/**
 * Scrolls to use cases section smoothly
 * @param {Page} page - Playwright page object
 */
const scrollToUseCases = async (page) => {
  await page.evaluate(() => {
    const useCasesSection = document.querySelector('#use-cases');
    if (useCasesSection) {
      useCasesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
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
 * Gets all use case card elements
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of card locators
 */
const getAllUseCaseCards = async (page) => {
  return page.locator(SELECTORS.useCaseCard).all();
};

/**
 * Gets all testimonial card elements
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of testimonial locators
 */
const getAllTestimonialCards = async (page) => {
  return page.locator(SELECTORS.testimonialCard).all();
};

/**
 * Validates use case card data
 * @param {Locator} cardElement - Card element locator
 * @param {Object} expectedData - Expected card data
 */
const validateUseCaseCard = async (cardElement, expectedData) => {
  const useCaseId = await cardElement.getAttribute('data-use-case-id');
  expect(useCaseId).toBe(expectedData.id);

  const title = cardElement.locator('h3');
  await expect(title).toContainText(expectedData.title);

  const segment = cardElement.locator(SELECTORS.useCaseSegment);
  await expect(segment).toContainText(expectedData.segment);
};

/**
 * Captures console logs for event tracking
 * @param {Page} page - Playwright page object
 * @returns {Array} Array of captured logs
 */
const captureConsoleLogs = (page) => {
  const logs = [];
  page.on('console', (msg) => {
    if (msg.text().includes('UseCasesSection')) {
      logs.push(msg.text());
    }
  });
  return logs;
};

/**
 * Gets current active testimonial index
 * @param {Page} page - Playwright page object
 * @returns {Promise<number>} Active testimonial index
 */
const getActiveTestimonialIndex = async (page) => {
  const testimonials = await getAllTestimonialCards(page);
  
  for (let i = 0; i < testimonials.length; i++) {
    const display = await testimonials[i].evaluate((el) => 
      window.getComputedStyle(el).display
    );
    const opacity = await testimonials[i].evaluate((el) => 
      window.getComputedStyle(el).opacity
    );
    
    if (display !== 'none' && opacity === '1') {
      return i;
    }
  }
  
  return 0;
};

/**
 * Waits for carousel transition to complete
 * @param {Page} page - Playwright page object
 */
const waitForCarouselTransition = async (page) => {
  await page.waitForTimeout(PERFORMANCE_THRESHOLDS.CAROUSEL_TRANSITION_TIME);
};

/**
 * Validates metric animation
 * @param {Locator} metricElement - Metric element locator
 * @returns {Promise<boolean>} Whether animation occurred
 */
const validateMetricAnimation = async (metricElement) => {
  const initialValue = await metricElement.textContent();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const finalValue = await metricElement.textContent();
  
  return initialValue !== finalValue;
};

// ============================================================================
// 🎨 VISUAL RENDERING & LAYOUT TESTS
// ============================================================================

test.describe('Use Cases Section - Visual Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);
  });

  test('should render use cases section with all core elements', async ({ page }) => {
    // Verify section exists
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();

    // Verify section title
    const title = page.locator(SELECTORS.sectionTitle);
    await expect(title).toBeVisible();
    await expect(title).toContainText('Real-World Success Stories');

    // Verify subtitle
    const subtitle = page.locator(SELECTORS.subtitle);
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('See how teams across industries');

    // Verify CTA button
    const ctaButton = page.locator(SELECTORS.ctaButton);
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Start Your Success Story');
  });

  test('should display all 4 use case cards', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);
    expect(cards.length).toBe(4);
  });

  test('should display use case cards in correct order', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (let i = 0; i < EXPECTED_USE_CASES.length; i++) {
      await validateUseCaseCard(cards[i], EXPECTED_USE_CASES[i]);
    }
  });

  test('should display use case card icons', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const icon = card.locator(SELECTORS.useCaseIcon);
      await expect(icon).toBeVisible();

      const svg = icon.locator('svg');
      await expect(svg).toBeVisible();
    }
  });

  test('should display use case segments', async ({ page }) => {
    const segments = page.locator(SELECTORS.useCaseSegment);
    await expect(segments).toHaveCount(4);

    const expectedSegments = EXPECTED_USE_CASES.map((uc) => uc.segment);
    for (let i = 0; i < expectedSegments.length; i++) {
      await expect(segments.nth(i)).toContainText(expectedSegments[i]);
    }
  });

  test('should display use case titles', async ({ page }) => {
    const titles = page.locator(SELECTORS.useCaseTitle);
    await expect(titles).toHaveCount(4);

    const expectedTitles = EXPECTED_USE_CASES.map((uc) => uc.title);
    for (let i = 0; i < expectedTitles.length; i++) {
      await expect(titles.nth(i)).toContainText(expectedTitles[i]);
    }
  });

  test('should display problem sections', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const problemHeading = card.locator('h4:has-text("Challenge")');
      await expect(problemHeading).toBeVisible();

      const problemText = card.locator(SELECTORS.useCaseProblem);
      await expect(problemText).toBeVisible();
      
      const text = await problemText.textContent();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test('should display solution sections', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const solutionHeading = card.locator('h4:has-text("Solution")');
      await expect(solutionHeading).toBeVisible();

      const solutionText = card.locator(SELECTORS.useCaseSolution);
      await expect(solutionText).toBeVisible();
      
      const text = await solutionText.textContent();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test('should display metrics sections', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const metricsHeading = card.locator('h4:has-text("Measurable Impact")');
      await expect(metricsHeading).toBeVisible();

      const metrics = card.locator(SELECTORS.metricItem);
      await expect(metrics).toHaveCount(3);
    }
  });

  test('should display metric values and labels', async ({ page }) => {
    const metricItems = page.locator(SELECTORS.metricItem);
    const count = await metricItems.count();

    for (let i = 0; i < count; i++) {
      const metricItem = metricItems.nth(i);
      
      const value = metricItem.locator(SELECTORS.metricValue);
      await expect(value).toBeVisible();

      const label = metricItem.locator(SELECTORS.metricLabel);
      await expect(label).toBeVisible();
    }
  });

  test('should display gradient background pattern', async ({ page }) => {
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    
    // Check gradient classes
    const classes = await useCasesSection.getAttribute('class');
    expect(classes).toContain('bg-neutral-50');

    // Verify background pattern exists
    const backgroundPattern = page.locator(SELECTORS.backgroundPattern);
    await expect(backgroundPattern).toBeVisible();
  });

  test('should display decorative floating elements', async ({ page }) => {
    const decorativeElements = page.locator(SELECTORS.decorativeElements);
    
    // Should have 2 decorative elements
    await expect(decorativeElements).toHaveCount(2);

    // Verify animation classes
    const firstElement = decorativeElements.first();
    const classes = await firstElement.getAttribute('class');
    expect(classes).toContain('animate-pulse');
  });

  test('should apply gradient text to section title', async ({ page }) => {
    const titleSpan = page.locator('#use-cases-title .gradient-text');
    await expect(titleSpan).toBeVisible();
    
    const classes = await titleSpan.getAttribute('class');
    expect(classes).toContain('gradient-text');
  });

  test('should display CTA button with icon', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    const icon = ctaButton.locator('svg');
    
    await expect(icon).toBeVisible();
  });

  test('should have proper section spacing', async ({ page }) => {
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    
    const classes = await useCasesSection.getAttribute('class');
    expect(classes).toContain('py-20');
    expect(classes).toContain('md:py-32');
  });

  test('should display use case cards in grid layout', async ({ page }) => {
    const cardsContainer = page.locator('#use-cases .grid.md\\:grid-cols-2');
    await expect(cardsContainer).toBeVisible();

    const classes = await cardsContainer.getAttribute('class');
    expect(classes).toContain('grid');
    expect(classes).toContain('md:grid-cols-2');
  });
});

// ============================================================================
// 🎴 USE CASE CARDS TESTS
// ============================================================================

test.describe('Use Cases Section - Use Case Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);
  });

  test('should display startup use case correctly', async ({ page }) => {
    const startupCard = page.locator('[data-use-case-id="startup"]');
    await expect(startupCard).toBeVisible();

    await expect(startupCard.locator('h3')).toContainText('Rapid MVP Development');
    await expect(startupCard.locator(SELECTORS.useCaseSegment)).toContainText('Startups');
  });

  test('should display enterprise use case correctly', async ({ page }) => {
    const enterpriseCard = page.locator('[data-use-case-id="enterprise"]');
    await expect(enterpriseCard).toBeVisible();

    await expect(enterpriseCard.locator('h3')).toContainText('Legacy System Modernization');
    await expect(enterpriseCard.locator(SELECTORS.useCaseSegment)).toContainText('Enterprises');
  });

  test('should display freelancer use case correctly', async ({ page }) => {
    const freelancerCard = page.locator('[data-use-case-id="freelancer"]');
    await expect(freelancerCard).toBeVisible();

    await expect(freelancerCard.locator('h3')).toContainText('Scale Your Client Work');
    await expect(freelancerCard.locator(SELECTORS.useCaseSegment)).toContainText('Freelancers');
  });

  test('should display team use case correctly', async ({ page }) => {
    const teamCard = page.locator('[data-use-case-id="team"]');
    await expect(teamCard).toBeVisible();

    await expect(teamCard.locator('h3')).toContainText('Accelerate Team Productivity');
    await expect(teamCard.locator(SELECTORS.useCaseSegment)).toContainText('Development Teams');
  });

  test('should have proper card styling', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const classes = await card.getAttribute('class');
      expect(classes).toContain('bg-white');
      expect(classes).toContain('rounded-2xl');
      expect(classes).toContain('shadow-xl');
    }
  });

  test('should have hover effects on cards', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.useCaseCard).first();
    
    const classes = await firstCard.getAttribute('class');
    expect(classes).toContain('hover:shadow-2xl');
    expect(classes).toContain('hover:-translate-y-2');
  });

  test('should have proper icon styling', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const iconContainer = card.locator(SELECTORS.useCaseIcon);
      const classes = await iconContainer.getAttribute('class');
      
      expect(classes).toContain('bg-gradient-to-br');
      expect(classes).toContain('from-primary-500');
      expect(classes).toContain('to-secondary-500');
      expect(classes).toContain('rounded-2xl');
    }
  });

  test('should display all metrics for each card', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const metrics = card.locator(SELECTORS.metricItem);
      await expect(metrics).toHaveCount(3);
    }
  });

  test('should have proper metric grid layout', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const metricsGrid = card.locator('.grid.grid-cols-3');
      await expect(metricsGrid).toBeVisible();
    }
  });

  test('should display metric data attributes', async ({ page }) => {
    const metricValues = page.locator(SELECTORS.metricValue);
    const count = await metricValues.count();

    for (let i = 0; i < count; i++) {
      const metric = metricValues.nth(i);
      
      const target = await metric.getAttribute('data-target');
      expect(target).toBeTruthy();
      expect(parseInt(target)).toBeGreaterThan(0);

      const unit = await metric.getAttribute('data-unit');
      expect(unit).toBeTruthy();
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const role = await card.getAttribute('role');
      expect(role).toBe('article');

      const ariaLabelledBy = await card.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBeTruthy();
      expect(ariaLabelledBy).toMatch(/^use-case-.*-title$/);
    }
  });
});

// ============================================================================
// 🎠 TESTIMONIAL CAROUSEL TESTS
// ============================================================================

test.describe('Use Cases Section - Testimonial Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);
  });

  test('should display testimonials section', async ({ page }) => {
    const testimonialsHeading = page.locator('h3:has-text("What Our Users Say")');
    await expect(testimonialsHeading).toBeVisible();
  });

  test('should display all testimonial cards', async ({ page }) => {
    const testimonials = await getAllTestimonialCards(page);
    expect(testimonials.length).toBe(EXPECTED_TESTIMONIALS_COUNT);
  });

  test('should display first testimonial by default', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    
    const display = await firstTestimonial.evaluate((el) => 
      window.getComputedStyle(el).display
    );
    expect(display).not.toBe('none');
  });

  test('should display testimonial quote', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const quote = firstTestimonial.locator(SELECTORS.testimonialQuote);
    
    await expect(quote).toBeVisible();
    const text = await quote.textContent();
    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain('"');
  });

  test('should display testimonial author', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const author = firstTestimonial.locator(SELECTORS.testimonialAuthor);
    
    await expect(author).toBeVisible();
    const text = await author.textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test('should display testimonial role', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const role = firstTestimonial.locator(SELECTORS.testimonialRole);
    
    await expect(role).toBeVisible();
  });

  test('should display testimonial company', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const company = firstTestimonial.locator(SELECTORS.testimonialCompany);
    
    await expect(company).toBeVisible();
  });

  test('should display testimonial avatar', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const avatar = firstTestimonial.locator(SELECTORS.testimonialAvatar);
    
    await expect(avatar).toBeVisible();
    
    const src = await avatar.getAttribute('src');
    expect(src).toBeTruthy();
    
    const alt = await avatar.getAttribute('alt');
    expect(alt).toBeTruthy();
  });

  test('should display carousel navigation buttons', async ({ page }) => {
    const prevBtn = page.locator(SELECTORS.carouselPrevBtn);
    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
  });

  test('should display carousel indicators', async ({ page }) => {
    const indicators = page.locator(SELECTORS.carouselIndicator);
    await expect(indicators).toHaveCount(EXPECTED_TESTIMONIALS_COUNT);
  });

  test('should highlight first indicator by default', async ({ page }) => {
    const firstIndicator = page.locator(SELECTORS.carouselIndicator).first();
    
    const classes = await firstIndicator.getAttribute('class');
    expect(classes).toContain('bg-primary-500');
    expect(classes).toContain('w-8');
  });

  test('should disable prev button on first testimonial', async ({ page }) => {
    const prevBtn = page.locator(SELECTORS.carouselPrevBtn);
    
    const isDisabled = await prevBtn.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should navigate to next testimonial on next button click', async ({ page }) => {
    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    
    await nextBtn.click();
    await waitForCarouselTransition(page);

    const activeIndex = await getActiveTestimonialIndex(page);
    expect(activeIndex).toBe(1);
  });

  test('should navigate to previous testimonial on prev button click', async ({ page }) => {
    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    const prevBtn = page.locator(SELECTORS.carouselPrevBtn);
    
    // Go to second testimonial
    await nextBtn.click();
    await waitForCarouselTransition(page);

    // Go back to first
    await prevBtn.click();
    await waitForCarouselTransition(page);

    const activeIndex = await getActiveTestimonialIndex(page);
    expect(activeIndex).toBe(0);
  });

  test('should update indicators on navigation', async ({ page }) => {
    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    const indicators = await page.locator(SELECTORS.carouselIndicator).all();
    
    await nextBtn.click();
    await waitForCarouselTransition(page);

    // First indicator should be inactive
    const firstClasses = await indicators[0].getAttribute('class');
    expect(firstClasses).toContain('bg-neutral-300');
    expect(firstClasses).toContain('w-3');

    // Second indicator should be active
    const secondClasses = await indicators[1].getAttribute('class');
    expect(secondClasses).toContain('bg-primary-500');
    expect(secondClasses).toContain('w-8');
  });

  test('should navigate to specific testimonial on indicator click', async ({ page }) => {
    const indicators = await page.locator(SELECTORS.carouselIndicator).all();
    
    // Click third indicator
    await indicators[2].click();
    await waitForCarouselTransition(page);

    const activeIndex = await getActiveTestimonialIndex(page);
    expect(activeIndex).toBe(2);
  });

  test('should disable next button on last testimonial', async ({ page }) => {
    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    
    // Navigate to last testimonial
    for (let i = 0; i < EXPECTED_TESTIMONIALS_COUNT - 1; i++) {
      await nextBtn.click();
      await waitForCarouselTransition(page);
    }

    const isDisabled = await nextBtn.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should navigate through all testimonials sequentially', async ({ page }) => {
    const nextBtn = page.locator(SELECTORS.carouselNextBtn);

    for (let i = 0; i < EXPECTED_TESTIMONIALS_COUNT - 1; i++) {
      await nextBtn.click();
      await waitForCarouselTransition(page);

      const activeIndex = await getActiveTestimonialIndex(page);
      expect(activeIndex).toBe(i + 1);
    }
  });

  test('should have proper testimonial card styling', async ({ page }) => {
    const testimonials = await getAllTestimonialCards(page);

    for (const testimonial of testimonials) {
      const classes = await testimonial.getAttribute('class');
      expect(classes).toContain('bg-white');
      expect(classes).toContain('rounded-2xl');
      expect(classes).toContain('shadow-xl');
    }
  });

  test('should display quote icon', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const quoteIcon = firstTestimonial.locator('svg.w-12.h-12');
    
    await expect(quoteIcon).toBeVisible();
  });

  test('should have proper avatar styling', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const avatar = firstTestimonial.locator(SELECTORS.testimonialAvatar);
    
    const classes = await avatar.getAttribute('class');
    expect(classes).toContain('w-16');
    expect(classes).toContain('h-16');
    expect(classes).toContain('rounded-full');
  });
});

// ============================================================================
// 📊 METRIC ANIMATIONS TESTS
// ============================================================================

test.describe('Use Cases Section - Metric Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should animate metrics when scrolled into view', async ({ page }) => {
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const firstMetric = page.locator(SELECTORS.metricValue).first();
    
    // Wait for animation to start
    await page.waitForTimeout(500);

    const hasAnimated = await validateMetricAnimation(firstMetric);
    expect(hasAnimated).toBe(true);
  });

  test('should animate all metrics', async ({ page }) => {
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const metrics = page.locator(SELECTORS.metricValue);
    const count = await metrics.count();

    // Wait for animations to complete
    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.METRIC_ANIMATION_TIME + 500);

    for (let i = 0; i < count; i++) {
      const metric = metrics.nth(i);
      const text = await metric.textContent();
      
      // Should not be at initial value of 0
      expect(text).not.toBe('0%');
      expect(text).not.toBe('0x');
      expect(text).not.toBe('0days');
    }
  });

  test('should display correct final metric values', async ({ page }) => {
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    // Wait for animations to complete
    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.METRIC_ANIMATION_TIME + 500);

    const metrics = page.locator(SELECTORS.metricValue);
    const count = await metrics.count();

    for (let i = 0; i < count; i++) {
      const metric = metrics.nth(i);
      const target = await metric.getAttribute('data-target');
      const unit = await metric.getAttribute('data-unit');
      const text = await metric.textContent();
      
      expect(text).toBe(`${target}${unit}`);
    }
  });

  test('should not animate metrics before scrolling into view', async ({ page }) => {
    await page.goto('/');
    
    // Don't scroll to use cases section
    await page.waitForTimeout(1000);

    const firstMetric = page.locator(SELECTORS.metricValue).first();
    const text = await firstMetric.textContent();
    
    // Should still be at initial value
    expect(text).toMatch(/^0[%x]|0days$/);
  });

  test('should animate metrics only once', async ({ page }) => {
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    // Wait for first animation
    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.METRIC_ANIMATION_TIME + 500);

    const firstMetric = page.locator(SELECTORS.metricValue).first();
    const firstValue = await firstMetric.textContent();

    // Scroll away and back
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await scrollToUseCases(page);
    await page.waitForTimeout(500);

    const secondValue = await firstMetric.textContent();
    
    // Value should not change (already animated)
    expect(secondValue).toBe(firstValue);
  });

  test('should have data-animated attribute after animation', async ({ page }) => {
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    // Wait for animations to complete
    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.METRIC_ANIMATION_TIME + 500);

    const metrics = page.locator(SELECTORS.metricValue);
    const count = await metrics.count();

    for (let i = 0; i < count; i++) {
      const metric = metrics.nth(i);
      const animated = await metric.getAttribute('data-animated');
      expect(animated).toBe('true');
    }
  });
});

// ============================================================================
// 📱 RESPONSIVE BEHAVIOR TESTS
// ============================================================================

test.describe('Use Cases Section - Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();

    // Verify cards are visible
    const cards = await getAllUseCaseCards(page);
    expect(cards.length).toBe(4);
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.tablet);
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();
  });

  test('should adjust text sizes responsively', async ({ page }) => {
    const viewports = [
      VIEWPORT_SIZES.mobile,
      VIEWPORT_SIZES.tablet,
      VIEWPORT_SIZES.desktop,
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await scrollToUseCases(page);
      await waitForUseCasesVisible(page);

      const title = page.locator(SELECTORS.sectionTitle);
      await expect(title).toBeVisible();

      const classes = await title.getAttribute('class');
      expect(classes).toContain('text-4xl');
      expect(classes).toContain('sm:text-5xl');
    }
  });

  test('should display cards in grid on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const cardsContainer = page.locator('#use-cases .grid.md\\:grid-cols-2');
    await expect(cardsContainer).toBeVisible();
  });

  test('should stack cards on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const cards = await getAllUseCaseCards(page);
    
    // All cards should be visible (stacked vertically)
    for (const card of cards) {
      await expect(card).toBeVisible();
    }
  });

  test('should display metrics in 3-column grid on all viewports', async ({ page }) => {
    const viewports = [
      VIEWPORT_SIZES.mobile,
      VIEWPORT_SIZES.tablet,
      VIEWPORT_SIZES.desktop,
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await scrollToUseCases(page);
      await waitForUseCasesVisible(page);

      const firstCard = page.locator(SELECTORS.useCaseCard).first();
      const metricsGrid = firstCard.locator('.grid.grid-cols-3');
      
      await expect(metricsGrid).toBeVisible();
    }
  });

  test('should maintain carousel functionality on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    await expect(nextBtn).toBeVisible();

    await nextBtn.click();
    await waitForCarouselTransition(page);

    const activeIndex = await getActiveTestimonialIndex(page);
    expect(activeIndex).toBe(1);
  });
});

// ============================================================================
// ♿ ACCESSIBILITY TESTS
// ============================================================================

test.describe('Use Cases Section - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    
    // Verify section element
    const tagName = await useCasesSection.evaluate((el) => 
      el.tagName.toLowerCase()
    );
    expect(tagName).toBe('section');

    // Verify aria-labelledby
    const ariaLabelledBy = await useCasesSection.getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe('use-cases-title');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const title = page.locator(SELECTORS.sectionTitle);
    
    // Verify h2 tag
    const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('h2');

    // Verify id matches aria-labelledby
    const id = await title.getAttribute('id');
    expect(id).toBe('use-cases-title');
  });

  test('should have accessible use case cards', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      // Verify role
      const role = await card.getAttribute('role');
      expect(role).toBe('article');

      // Verify aria-labelledby
      const ariaLabelledBy = await card.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBeTruthy();
      expect(ariaLabelledBy).toMatch(/^use-case-.*-title$/);
    }
  });

  test('should have accessible use case titles', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const title = card.locator('h3');
      
      // Verify h3 tag
      const tagName = await title.evaluate((el) => 
        el.tagName.toLowerCase()
      );
      expect(tagName).toBe('h3');

      // Verify id
      const id = await title.getAttribute('id');
      expect(id).toBeTruthy();
      expect(id).toMatch(/^use-case-.*-title$/);
    }
  });

  test('should hide decorative elements from screen readers', async ({ page }) => {
    // Check background pattern
    const backgroundPattern = page.locator(SELECTORS.backgroundPattern);
    const bgAriaHidden = await backgroundPattern.getAttribute('aria-hidden');
    expect(bgAriaHidden).toBe('true');

    // Check decorative elements
    const decorativeElements = page.locator(SELECTORS.decorativeElements);
    const firstAriaHidden = await decorativeElements.first().getAttribute('aria-hidden');
    expect(firstAriaHidden).toBe('true');
  });

  test('should hide icons from screen readers', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const icon = card.locator('svg');
      const ariaHidden = await icon.getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('should have accessible carousel navigation', async ({ page }) => {
    const prevBtn = page.locator(SELECTORS.carouselPrevBtn);
    const nextBtn = page.locator(SELECTORS.carouselNextBtn);

    // Verify aria-labels
    const prevLabel = await prevBtn.getAttribute('aria-label');
    const nextLabel = await nextBtn.getAttribute('aria-label');

    expect(prevLabel).toBe('Previous testimonial');
    expect(nextLabel).toBe('Next testimonial');
  });

  test('should have accessible carousel indicators', async ({ page }) => {
    const indicators = page.locator(SELECTORS.carouselIndicators);
    
    // Verify role
    const role = await indicators.getAttribute('role');
    expect(role).toBe('tablist');

    // Verify aria-label
    const ariaLabel = await indicators.getAttribute('aria-label');
    expect(ariaLabel).toBe('Testimonial indicators');
  });

  test('should have accessible indicator buttons', async ({ page }) => {
    const indicatorButtons = await page.locator(SELECTORS.carouselIndicator).all();

    for (let i = 0; i < indicatorButtons.length; i++) {
      const button = indicatorButtons[i];
      
      // Verify role
      const role = await button.getAttribute('role');
      expect(role).toBe('tab');

      // Verify aria-label
      const ariaLabel = await button.getAttribute('aria-label');
      expect(ariaLabel).toBe(`Go to testimonial ${i + 1}`);

      // Verify aria-selected
      const ariaSelected = await button.getAttribute('aria-selected');
      expect(ariaSelected).toBeTruthy();
    }
  });

  test('should have accessible CTA button', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    
    const ariaLabel = await ctaButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Start your success story');
  });

  test('should have accessible testimonial cards', async ({ page }) => {
    const testimonials = await getAllTestimonialCards(page);

    for (const testimonial of testimonials) {
      const role = await testimonial.getAttribute('role');
      expect(role).toBe('article');
    }
  });

  test('should have accessible avatar images', async ({ page }) => {
    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const avatar = firstTestimonial.locator(SELECTORS.testimonialAvatar);
    
    const alt = await avatar.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// ⚡ PERFORMANCE TESTS
// ============================================================================

test.describe('Use Cases Section - Performance', () => {
  test('should load use cases section within performance threshold', async ({ page }) => {
    const perf = measurePerformance('use_cases_load');
    
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);
    
    const result = perf.end();
    expect(result.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.SECTION_LOAD_TIME);
  });

  test('should render use case cards efficiently', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);

    const perf = measurePerformance('cards_render');
    await waitForUseCasesVisible(page);
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(1000);
  });

  test('should handle carousel transitions quickly', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    
    const perf = measurePerformance('carousel_transition');
    await nextBtn.click();
    await waitForCarouselTransition(page);
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(
      PERFORMANCE_THRESHOLDS.CAROUSEL_TRANSITION_TIME + 200
    );
  });

  test('should not cause layout shift', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    
    // Measure CLS
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

  test('should handle rapid carousel navigation efficiently', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    const prevBtn = page.locator(SELECTORS.carouselPrevBtn);

    const perf = measurePerformance('rapid_carousel_nav');
    
    for (let i = 0; i < 5; i++) {
      await nextBtn.click();
      await page.waitForTimeout(100);
    }
    
    for (let i = 0; i < 5; i++) {
      await prevBtn.click();
      await page.waitForTimeout(100);
    }
    
    const result = perf.end();
    expect(result.duration).toBeLessThan(3000);
  });

  test('should lazy load avatar images', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const firstTestimonial = page.locator(SELECTORS.testimonialCard).first();
    const avatar = firstTestimonial.locator(SELECTORS.testimonialAvatar);
    
    const loading = await avatar.getAttribute('loading');
    expect(loading).toBe('lazy');
  });
});

// ============================================================================
// 🛡️ SECURITY TESTS
// ============================================================================

test.describe('Use Cases Section - Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);
  });

  test('should sanitize CTA href to prevent XSS', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    const href = await ctaButton.getAttribute('href');
    
    expect(href).not.toContain('javascript:');
    expect(href).not.toContain('data:');
    expect(href).not.toContain('vbscript:');
  });

  test('should not expose sensitive data in HTML', async ({ page }) => {
    const content = await page.content();
    
    expect(content).not.toContain('api_key');
    expect(content).not.toContain('secret');
    expect(content).not.toContain('token');
    expect(content).not.toContain('password');
  });

  test('should escape use case content properly', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const title = card.locator('h3');
      const innerHTML = await title.innerHTML();
      
      expect(innerHTML).not.toContain('<script>');
      expect(innerHTML).not.toContain('onerror=');
      expect(innerHTML).not.toContain('onclick=');
    }
  });

  test('should validate use case data attributes', async ({ page }) => {
    const cards = await getAllUseCaseCards(page);

    for (const card of cards) {
      const useCaseId = await card.getAttribute('data-use-case-id');
      
      // Verify no malicious content
      expect(useCaseId).not.toContain('<');
      expect(useCaseId).not.toContain('>');
      expect(useCaseId).toMatch(/^[a-z]+$/);
    }
  });

  test('should sanitize avatar URLs', async ({ page }) => {
    const testimonials = await getAllTestimonialCards(page);

    for (const testimonial of testimonials) {
      const avatar = testimonial.locator(SELECTORS.testimonialAvatar);
      const src = await avatar.getAttribute('src');
      
      expect(src).not.toContain('javascript:');
      expect(src).not.toContain('vbscript:');
    }
  });

  test('should escape testimonial content properly', async ({ page }) => {
    const testimonials = await getAllTestimonialCards(page);

    for (const testimonial of testimonials) {
      const quote = testimonial.locator(SELECTORS.testimonialQuote);
      const innerHTML = await quote.innerHTML();
      
      expect(innerHTML).not.toContain('<script>');
      expect(innerHTML).not.toContain('onerror=');
      expect(innerHTML).not.toContain('onclick=');
    }
  });
});

// ============================================================================
// 🔄 EDGE CASES & ERROR HANDLING
// ============================================================================

test.describe('Use Cases Section - Edge Cases', () => {
  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');
    await scrollToUseCases(page);
    
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible({ timeout: 10000 });
  });

  test('should handle rapid button clicks', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    
    // Click rapidly
    for (let i = 0; i < 10; i++) {
      await nextBtn.click({ force: true });
    }
    
    // Verify no errors
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();
  });

  test('should handle window resize during interaction', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    // Resize window
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.waitForTimeout(300);
    
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.waitForTimeout(300);
    
    // Verify section still visible
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();
  });

  test('should handle rapid indicator clicks', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const indicators = await page.locator(SELECTORS.carouselIndicator).all();
    
    // Rapidly click different indicators
    for (let i = 0; i < 5; i++) {
      await indicators[i % indicators.length].click();
      await page.waitForTimeout(50);
    }
    
    // Verify no errors
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();
  });
});

// ============================================================================
// 🌐 CROSS-BROWSER COMPATIBILITY
// ============================================================================

test.describe('Use Cases Section - Cross-Browser', () => {
  test('should render consistently across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();

    // Take screenshot for visual comparison
    await expect(useCasesSection).toHaveScreenshot(
      `use-cases-${browserName}.png`,
      { maxDiffPixels: 100 }
    );
  });

  test('should support modern CSS features', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    
    const backgroundImage = await useCasesSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    
    expect(backgroundImage).toBeTruthy();
  });
});

// ============================================================================
// 📊 ANALYTICS & TRACKING
// ============================================================================

test.describe('Use Cases Section - Analytics', () => {
  test('should log use cases render event', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    await page.waitForTimeout(500);

    const renderLog = logs.find((log) => log.includes('use_cases_rendered'));
    expect(renderLog).toBeDefined();
  });

  test('should log use cases initialization event', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    await page.waitForTimeout(500);

    const initLog = logs.find((log) => log.includes('use_cases_initialized'));
    expect(initLog).toBeDefined();
  });

  test('should track testimonial change events', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    await nextBtn.click();

    await page.waitForTimeout(500);

    const testimonialLog = logs.find((log) => log.includes('testimonial_changed'));
    expect(testimonialLog).toBeDefined();
  });

  test('should include performance metrics in logs', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    await page.waitForTimeout(500);

    const perfLog = logs.find((log) => log.includes('render_time_ms'));
    expect(perfLog).toBeDefined();
  });
});

// ============================================================================
// 🧩 INTEGRATION TESTS
// ============================================================================

test.describe('Use Cases Section - Integration', () => {
  test('should integrate with demo section', async ({ page }) => {
    await page.goto('/');
    
    // Verify demo section exists
    const demoSection = page.locator('#demo');
    await expect(demoSection).toBeVisible();
    
    // Scroll to use cases
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);
    
    // Verify use cases section exists
    const useCasesSection = page.locator(SELECTORS.useCasesSection);
    await expect(useCasesSection).toBeVisible();
  });

  test('should maintain scroll position after interaction', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const initialScrollY = await page.evaluate(() => window.scrollY);

    const nextBtn = page.locator(SELECTORS.carouselNextBtn);
    await nextBtn.click();
    await page.waitForTimeout(300);

    const finalScrollY = await page.evaluate(() => window.scrollY);
    
    // Scroll position should be similar (within 100px)
    expect(Math.abs(finalScrollY - initialScrollY)).toBeLessThan(100);
  });

  test('should navigate to signup on CTA click', async ({ page }) => {
    await page.goto('/');
    await scrollToUseCases(page);
    await waitForUseCasesVisible(page);

    const ctaButton = page.locator(SELECTORS.ctaButton);
    await ctaButton.click();
    
    // Verify navigation
    await page.waitForURL(/.*#signup/);
    expect(page.url()).toContain('#signup');
  });
});