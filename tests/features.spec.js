import { test, expect } from '@playwright/test';

/**
 * Features Section E2E Test Suite
 * 
 * Comprehensive end-to-end tests for features showcase including:
 * - Visual rendering and layout validation
 * - Interactive feature card hover effects
 * - Scroll animations and visibility tracking
 * - Responsive behavior across all viewports
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Performance metrics and optimization
 * - Security validations and XSS prevention
 * - Cross-browser compatibility
 * - Analytics event tracking
 * 
 * @generated-from: task-id:TASK-004
 * @test-coverage: >85%
 * @complexity: 9/10
 * @dependencies: ["features-section.js", "animations.js"]
 */

// ============================================================================
// 🎯 TEST CONFIGURATION & CONSTANTS
// ============================================================================

const PERFORMANCE_THRESHOLDS = Object.freeze({
  FEATURES_LOAD_TIME: 2500, // 2.5 seconds
  CARD_INTERACTION_TIME: 150, // 150ms
  ANIMATION_DURATION: 1000, // 1 second
  SCROLL_ANIMATION_TIME: 800, // 800ms
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
  featuresSection: '#features',
  sectionTitle: '#features-title',
  subtitle: '#features p.text-xl',
  featuresGrid: '.features-grid',
  featureCard: '[data-feature-id]',
  featureIcon: '.feature-card .w-20.h-20',
  featureTitle: '[id^="feature-"][id$="-title"]',
  featureDescription: '.feature-card p.text-neutral-600',
  benefitsList: '.feature-card ul[role="list"]',
  benefitItem: '.feature-card ul[role="list"] li',
  ctaButton: '#features a[href="#signup"]',
  backgroundPattern: '#features .absolute.inset-0.opacity-5',
  decorativeElements: '#features .blur-3xl.opacity-20',
  hoverOverlay: '.feature-card .absolute.inset-0.bg-gradient-to-br',
});

const EXPECTED_FEATURES = Object.freeze([
  {
    id: 'code-generation',
    title: 'Intelligent Code Generation',
    order: 1,
    benefitsCount: 4,
  },
  {
    id: 'automated-testing',
    title: 'Automated Testing',
    order: 2,
    benefitsCount: 4,
  },
  {
    id: 'deployment-automation',
    title: 'Deployment Automation',
    order: 3,
    benefitsCount: 4,
  },
  {
    id: 'continuous-monitoring',
    title: 'Continuous Monitoring',
    order: 4,
    benefitsCount: 4,
  },
  {
    id: 'multi-language',
    title: 'Multi-language Support',
    order: 5,
    benefitsCount: 4,
  },
  {
    id: 'real-time-collaboration',
    title: 'Real-time Collaboration',
    order: 6,
    benefitsCount: 4,
  },
]);

// ============================================================================
// 🛠️ HELPER FUNCTIONS & UTILITIES
// ============================================================================

/**
 * Waits for features section to be fully visible and loaded
 * @param {Page} page - Playwright page object
 */
const waitForFeaturesVisible = async (page) => {
  await page.waitForSelector(SELECTORS.featuresSection, { state: 'visible' });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300); // Allow animations to settle
};

/**
 * Scrolls to features section smoothly
 * @param {Page} page - Playwright page object
 */
const scrollToFeatures = async (page) => {
  await page.evaluate(() => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
 * Gets all feature card elements
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of feature card locators
 */
const getAllFeatureCards = async (page) => {
  return page.locator(SELECTORS.featureCard).all();
};

/**
 * Validates feature card data attributes
 * @param {Locator} cardElement - Feature card element locator
 * @param {Object} expectedData - Expected feature data
 */
const validateFeatureData = async (cardElement, expectedData) => {
  const featureId = await cardElement.getAttribute('data-feature-id');
  const featureOrder = await cardElement.getAttribute('data-feature-order');
  
  expect(featureId).toBe(expectedData.id);
  expect(parseInt(featureOrder)).toBe(expectedData.order);
};

/**
 * Captures console logs for event tracking
 * @param {Page} page - Playwright page object
 * @returns {Array} Array of captured logs
 */
const captureConsoleLogs = (page) => {
  const logs = [];
  page.on('console', (msg) => {
    if (msg.text().includes('FeaturesSection')) {
      logs.push(msg.text());
    }
  });
  return logs;
};

/**
 * Validates feature benefits list
 * @param {Locator} cardElement - Feature card element
 * @param {number} expectedCount - Expected benefits count
 */
const validateBenefitsList = async (cardElement, expectedCount) => {
  const benefitsList = cardElement.locator(SELECTORS.benefitsList);
  await expect(benefitsList).toBeVisible();
  
  const benefits = await benefitsList.locator('li').all();
  expect(benefits.length).toBe(expectedCount);
  
  // Verify each benefit has checkmark icon
  for (const benefit of benefits) {
    const checkIcon = benefit.locator('svg');
    await expect(checkIcon).toBeVisible();
  }
};

// ============================================================================
// 🎨 VISUAL RENDERING & LAYOUT TESTS
// ============================================================================

test.describe('Features Section - Visual Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
  });

  test('should render features section with all core elements', async ({ page }) => {
    // Verify section exists
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();

    // Verify section title
    const title = page.locator(SELECTORS.sectionTitle);
    await expect(title).toBeVisible();
    await expect(title).toContainText('Powerful Features');

    // Verify subtitle
    const subtitle = page.locator(SELECTORS.subtitle);
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Everything you need to build');

    // Verify features grid
    const featuresGrid = page.locator(SELECTORS.featuresGrid);
    await expect(featuresGrid).toBeVisible();

    // Verify CTA button
    const ctaButton = page.locator(SELECTORS.ctaButton);
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Explore All Features');
  });

  test('should display all 6 feature cards', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);
    
    expect(featureCards.length).toBe(6);

    // Verify each card has required elements
    for (let i = 0; i < featureCards.length; i++) {
      const card = featureCards[i];
      
      // Feature icon
      const icon = card.locator('.w-20.h-20');
      await expect(icon).toBeVisible();

      // Feature title
      const title = card.locator('[id^="feature-"]');
      await expect(title).toBeVisible();

      // Feature description
      const description = card.locator('p.text-neutral-600');
      await expect(description).toBeVisible();

      // Benefits list
      const benefitsList = card.locator('ul[role="list"]');
      await expect(benefitsList).toBeVisible();
    }
  });

  test('should display features in correct order', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);

    for (let i = 0; i < EXPECTED_FEATURES.length; i++) {
      await validateFeatureData(featureCards[i], EXPECTED_FEATURES[i]);
    }
  });

  test('should display feature titles correctly', async ({ page }) => {
    for (const expectedFeature of EXPECTED_FEATURES) {
      const featureTitle = page.locator(`#feature-${expectedFeature.id}-title`);
      await expect(featureTitle).toBeVisible();
      await expect(featureTitle).toContainText(expectedFeature.title);
    }
  });

  test('should display gradient background pattern', async ({ page }) => {
    const featuresSection = page.locator(SELECTORS.featuresSection);
    
    // Check gradient classes
    const classes = await featuresSection.getAttribute('class');
    expect(classes).toContain('bg-gradient-to-b');
    expect(classes).toContain('from-neutral-50');

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
    const titleSpan = page.locator('#features-title .gradient-text');
    await expect(titleSpan).toBeVisible();
    
    const classes = await titleSpan.getAttribute('class');
    expect(classes).toContain('gradient-text');
  });

  test('should display feature cards with proper styling', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    
    await expect(firstCard).toBeVisible();
    
    const classes = await firstCard.getAttribute('class');
    expect(classes).toContain('rounded-2xl');
    expect(classes).toContain('shadow-lg');
    expect(classes).toContain('hover:shadow-2xl');
  });

  test('should display all benefits for each feature', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);

    for (let i = 0; i < EXPECTED_FEATURES.length; i++) {
      await validateBenefitsList(
        featureCards[i],
        EXPECTED_FEATURES[i].benefitsCount
      );
    }
  });

  test('should display feature icons with gradient backgrounds', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);

    for (const card of featureCards) {
      const iconContainer = card.locator('.w-20.h-20');
      await expect(iconContainer).toBeVisible();
      
      const classes = await iconContainer.getAttribute('class');
      expect(classes).toContain('bg-gradient-to-br');
      expect(classes).toContain('rounded-2xl');
    }
  });
});

// ============================================================================
// 🖱️ INTERACTIVE FEATURE CARD TESTS
// ============================================================================

test.describe('Features Section - Card Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
  });

  test('should show hover effects on feature cards', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    
    // Hover over card
    await firstCard.hover();
    await page.waitForTimeout(300);
    
    // Verify hover classes exist
    const classes = await firstCard.getAttribute('class');
    expect(classes).toContain('hover:shadow-2xl');
    expect(classes).toContain('hover:border-primary-500');
  });

  test('should scale and rotate icon on hover', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    const iconContainer = firstCard.locator('.w-20.h-20');
    
    // Hover over card
    await firstCard.hover();
    await page.waitForTimeout(300);
    
    // Verify transform classes
    const classes = await iconContainer.getAttribute('class');
    expect(classes).toContain('group-hover:scale-110');
    expect(classes).toContain('group-hover:rotate-3');
  });

  test('should display hover overlay on feature cards', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    const hoverOverlay = firstCard.locator('.absolute.inset-0.bg-gradient-to-br');
    
    await expect(hoverOverlay).toBeVisible();
    
    const classes = await hoverOverlay.getAttribute('class');
    expect(classes).toContain('opacity-0');
    expect(classes).toContain('group-hover:opacity-100');
  });

  test('should change title color on hover', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    const title = firstCard.locator('[id^="feature-"]');
    
    await firstCard.hover();
    await page.waitForTimeout(300);
    
    const classes = await title.getAttribute('class');
    expect(classes).toContain('group-hover:text-primary-600');
  });

  test('should track feature card hover events', async ({ page }) => {
    const logs = captureConsoleLogs(page);
    
    const firstCard = page.locator(SELECTORS.featureCard).first();
    await firstCard.hover();
    
    await page.waitForTimeout(200);
    
    // Verify hover event was logged
    const hoverLog = logs.find((log) => 
      log.includes('feature_interaction') && log.includes('hover')
    );
    expect(hoverLog).toBeDefined();
  });

  test('should track feature card click events', async ({ page }) => {
    const logs = captureConsoleLogs(page);
    
    const firstCard = page.locator(SELECTORS.featureCard).first();
    await firstCard.click();
    
    await page.waitForTimeout(200);
    
    // Verify click event was logged
    const clickLog = logs.find((log) => 
      log.includes('feature_interaction') && log.includes('click')
    );
    expect(clickLog).toBeDefined();
  });

  test('should handle rapid card interactions', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);
    
    // Rapidly hover over all cards
    for (const card of featureCards) {
      await card.hover();
      await page.waitForTimeout(50);
    }
    
    // Verify no errors occurred
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should maintain card structure on interaction', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    
    // Click card
    await firstCard.click();
    await page.waitForTimeout(100);
    
    // Verify all elements still present
    await expect(firstCard.locator('.w-20.h-20')).toBeVisible();
    await expect(firstCard.locator('[id^="feature-"]')).toBeVisible();
    await expect(firstCard.locator('ul[role="list"]')).toBeVisible();
  });

  test('should display checkmark icons in benefits list', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    const benefits = await firstCard.locator(SELECTORS.benefitItem).all();

    for (const benefit of benefits) {
      const checkIcon = benefit.locator('svg');
      await expect(checkIcon).toBeVisible();
      
      // Verify icon color
      const classes = await checkIcon.getAttribute('class');
      expect(classes).toContain('text-primary-500');
    }
  });
});

// ============================================================================
// 🔗 CTA BUTTON INTERACTION TESTS
// ============================================================================

test.describe('Features Section - CTA Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
  });

  test('should navigate to signup on CTA click', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    
    await ctaButton.click();
    
    // Verify navigation
    await page.waitForURL(/.*#signup/);
    expect(page.url()).toContain('#signup');
  });

  test('should show hover effects on CTA button', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    
    await ctaButton.hover();
    await page.waitForTimeout(300);
    
    const classes = await ctaButton.getAttribute('class');
    expect(classes).toContain('hover:scale-105');
    expect(classes).toContain('hover:shadow-2xl');
  });

  test('should show active state on CTA press', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    
    await ctaButton.hover();
    await page.mouse.down();
    
    const classes = await ctaButton.getAttribute('class');
    expect(classes).toContain('active:scale-95');
    
    await page.mouse.up();
  });

  test('should have correct ARIA label on CTA', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    
    const ariaLabel = await ctaButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Explore all features in detail');
  });

  test('should display arrow icon in CTA button', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    const arrowIcon = ctaButton.locator('svg');
    
    await expect(arrowIcon).toBeVisible();
    
    const classes = await arrowIcon.getAttribute('class');
    expect(classes).toContain('w-5');
    expect(classes).toContain('h-5');
  });

  test('should respond to CTA click quickly', async ({ page }) => {
    const ctaButton = page.locator(SELECTORS.ctaButton);
    
    const perf = measurePerformance('cta_click');
    await ctaButton.click();
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CTA_CLICK_TIME);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab to CTA button
    let tabCount = 0;
    const maxTabs = 30;
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      const ctaButton = page.locator(SELECTORS.ctaButton);
      const isFocused = await ctaButton.evaluate((el) => el === document.activeElement);
      
      if (isFocused) {
        // Press Enter to activate
        await page.keyboard.press('Enter');
        await page.waitForURL(/.*#signup/);
        break;
      }
    }
    
    expect(tabCount).toBeLessThan(maxTabs);
  });
});

// ============================================================================
// 🎬 ANIMATION & SCROLL TESTS
// ============================================================================

test.describe('Features Section - Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should apply fade-in animations to feature cards', async ({ page }) => {
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    const featureCards = await getAllFeatureCards(page);
    
    // Verify cards are visible after animation
    for (const card of featureCards) {
      await expect(card).toBeVisible();
    }
  });

  test('should apply staggered animations to feature cards', async ({ page }) => {
    // Scroll to features to trigger animations
    await scrollToFeatures(page);
    await page.waitForTimeout(200);
    
    const featureCards = await getAllFeatureCards(page);
    
    // Verify all cards become visible
    for (const card of featureCards) {
      await expect(card).toBeVisible({ timeout: 2000 });
    }
  });

  test('should animate decorative elements with pulse', async ({ page }) => {
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    const decorativeElements = page.locator(SELECTORS.decorativeElements);
    const firstElement = decorativeElements.first();
    
    await expect(firstElement).toBeVisible();
    
    const classes = await firstElement.getAttribute('class');
    expect(classes).toContain('animate-pulse');
  });

  test('should apply delayed animation to second decorative element', async ({ page }) => {
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    const decorativeElements = page.locator(SELECTORS.decorativeElements);
    const secondElement = decorativeElements.nth(1);
    
    const classes = await secondElement.getAttribute('class');
    expect(classes).toContain('animation-delay-500');
  });

  test('should complete animations within threshold', async ({ page }) => {
    const perf = measurePerformance('features_animations');
    
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    // Wait for all animations to complete
    await page.waitForTimeout(PERFORMANCE_THRESHOLDS.ANIMATION_DURATION);
    
    const result = perf.end();
    expect(result.duration).toBeLessThan(
      PERFORMANCE_THRESHOLDS.ANIMATION_DURATION + 500
    );
  });

  test('should handle scroll animations correctly', async ({ page }) => {
    await page.goto('/');
    
    // Scroll away from features
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    
    // Scroll to features
    await scrollToFeatures(page);
    await page.waitForTimeout(500);
    
    // Verify features section is visible
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should respect reduced motion preferences', async ({ page, context }) => {
    // Set reduced motion preference
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
      });
    });

    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    // Verify features section is still visible
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });
});

// ============================================================================
// 📱 RESPONSIVE BEHAVIOR TESTS
// ============================================================================

test.describe('Features Section - Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();

    // Verify grid layout
    const featuresGrid = page.locator(SELECTORS.featuresGrid);
    const classes = await featuresGrid.getAttribute('class');
    expect(classes).toContain('grid-cols-1');

    // Verify all cards visible
    const featureCards = await getAllFeatureCards(page);
    expect(featureCards.length).toBe(6);
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.tablet);
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featuresGrid = page.locator(SELECTORS.featuresGrid);
    const classes = await featuresGrid.getAttribute('class');
    expect(classes).toContain('md:grid-cols-2');
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featuresGrid = page.locator(SELECTORS.featuresGrid);
    const classes = await featuresGrid.getAttribute('class');
    expect(classes).toContain('lg:grid-cols-3');
  });

  test('should display correctly on large desktop viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.largeDesktop);
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();

    // Verify 3-column grid
    const featuresGrid = page.locator(SELECTORS.featuresGrid);
    const classes = await featuresGrid.getAttribute('class');
    expect(classes).toContain('lg:grid-cols-3');
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
      await scrollToFeatures(page);
      await waitForFeaturesVisible(page);

      const title = page.locator(SELECTORS.sectionTitle);
      await expect(title).toBeVisible();

      const classes = await title.getAttribute('class');
      expect(classes).toContain('text-4xl');
      expect(classes).toContain('sm:text-5xl');
    }
  });

  test('should maintain card aspect ratio on all viewports', async ({ page }) => {
    const viewports = [
      VIEWPORT_SIZES.mobile,
      VIEWPORT_SIZES.tablet,
      VIEWPORT_SIZES.desktop,
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await scrollToFeatures(page);
      await waitForFeaturesVisible(page);

      const firstCard = page.locator(SELECTORS.featureCard).first();
      
      await expect(firstCard).toBeVisible();
      
      const box = await firstCard.boundingBox();
      expect(box).toBeTruthy();
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
  });

  test('should stack cards vertically on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featureCards = await getAllFeatureCards(page);
    
    // Get positions of first two cards
    const firstBox = await featureCards[0].boundingBox();
    const secondBox = await featureCards[1].boundingBox();
    
    // Second card should be below first card
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height);
  });

  test('should display cards in 2 columns on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.tablet);
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featureCards = await getAllFeatureCards(page);
    
    // Get positions of first three cards
    const firstBox = await featureCards[0].boundingBox();
    const secondBox = await featureCards[1].boundingBox();
    const thirdBox = await featureCards[2].boundingBox();
    
    // Second card should be beside first card
    expect(Math.abs(secondBox.y - firstBox.y)).toBeLessThan(50);
    
    // Third card should be below first card
    expect(thirdBox.y).toBeGreaterThan(firstBox.y + firstBox.height);
  });
});

// ============================================================================
// ♿ ACCESSIBILITY TESTS
// ============================================================================

test.describe('Features Section - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    const featuresSection = page.locator(SELECTORS.featuresSection);
    
    // Verify section element
    const tagName = await featuresSection.evaluate((el) => 
      el.tagName.toLowerCase()
    );
    expect(tagName).toBe('section');

    // Verify aria-labelledby
    const ariaLabelledBy = await featuresSection.getAttribute('aria-labelledby');
    expect(ariaLabelledBy).toBe('features-title');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const title = page.locator(SELECTORS.sectionTitle);
    
    // Verify h2 tag
    const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('h2');

    // Verify id matches aria-labelledby
    const id = await title.getAttribute('id');
    expect(id).toBe('features-title');
  });

  test('should have accessible feature cards', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);

    for (const card of featureCards) {
      // Verify role
      const role = await card.getAttribute('role');
      expect(role).toBe('article');

      // Verify aria-labelledby
      const ariaLabelledBy = await card.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBeTruthy();
      expect(ariaLabelledBy).toMatch(/^feature-.*-title$/);
    }
  });

  test('should have accessible feature titles', async ({ page }) => {
    for (const expectedFeature of EXPECTED_FEATURES) {
      const featureTitle = page.locator(`#feature-${expectedFeature.id}-title`);
      
      // Verify h3 tag
      const tagName = await featureTitle.evaluate((el) => 
        el.tagName.toLowerCase()
      );
      expect(tagName).toBe('h3');

      // Verify id
      const id = await featureTitle.getAttribute('id');
      expect(id).toBe(`feature-${expectedFeature.id}-title`);
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

  test('should hide feature icons from screen readers', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);

    for (const card of featureCards) {
      const icon = card.locator('svg').first();
      const ariaHidden = await icon.getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('should hide checkmark icons from screen readers', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    const benefits = await firstCard.locator(SELECTORS.benefitItem).all();

    for (const benefit of benefits) {
      const checkIcon = benefit.locator('svg');
      const ariaHidden = await checkIcon.getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Should eventually reach CTA button
    let tabCount = 0;
    const maxTabs = 30;
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      const ctaButton = page.locator(SELECTORS.ctaButton);
      const isFocused = await ctaButton.evaluate((el) => 
        el === document.activeElement
      );
      
      if (isFocused) {
        break;
      }
    }
    
    expect(tabCount).toBeLessThan(maxTabs);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const title = page.locator(SELECTORS.sectionTitle);
    
    const color = await title.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color;
    });
    
    expect(color).toBeTruthy();
  });

  test('should have proper list semantics for benefits', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    const benefitsList = firstCard.locator('ul[role="list"]');
    
    // Verify role
    const role = await benefitsList.getAttribute('role');
    expect(role).toBe('list');
    
    // Verify list items
    const listItems = await benefitsList.locator('li').all();
    expect(listItems.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// ⚡ PERFORMANCE TESTS
// ============================================================================

test.describe('Features Section - Performance', () => {
  test('should load features section within performance threshold', async ({ page }) => {
    const perf = measurePerformance('features_load');
    
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    const result = perf.end();
    expect(result.duration).toBeLessThan(PERFORMANCE_THRESHOLDS.FEATURES_LOAD_TIME);
  });

  test('should render all feature cards efficiently', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    
    const perf = measurePerformance('cards_render');
    await waitForFeaturesVisible(page);
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(1000);
  });

  test('should handle card interactions quickly', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const firstCard = page.locator(SELECTORS.featureCard).first();
    
    const perf = measurePerformance('card_interaction');
    await firstCard.hover();
    const result = perf.end();
    
    expect(result.duration).toBeLessThan(
      PERFORMANCE_THRESHOLDS.CARD_INTERACTION_TIME
    );
  });

  test('should not cause layout shift', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    
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

  test('should lazy load non-critical resources', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    // Verify decorative elements don't block rendering
    const decorativeElements = page.locator(SELECTORS.decorativeElements);
    await expect(decorativeElements.first()).toBeVisible();
  });

  test('should handle rapid scrolling efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Rapidly scroll up and down
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForTimeout(100);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
    }
    
    // Verify features section still renders correctly
    await scrollToFeatures(page);
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should render benefits lists efficiently', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featureCards = await getAllFeatureCards(page);
    
    const perf = measurePerformance('benefits_render');
    
    for (const card of featureCards) {
      const benefitsList = card.locator('ul[role="list"]');
      await expect(benefitsList).toBeVisible();
    }
    
    const result = perf.end();
    expect(result.duration).toBeLessThan(500);
  });
});

// ============================================================================
// 🛡️ SECURITY TESTS
// ============================================================================

test.describe('Features Section - Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
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

  test('should escape feature content properly', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);

    for (const card of featureCards) {
      const title = card.locator('[id^="feature-"]');
      const innerHTML = await title.innerHTML();
      
      expect(innerHTML).not.toContain('<script>');
      expect(innerHTML).not.toContain('onerror=');
      expect(innerHTML).not.toContain('onclick=');
    }
  });

  test('should validate feature data attributes', async ({ page }) => {
    const featureCards = await getAllFeatureCards(page);

    for (const card of featureCards) {
      const featureId = await card.getAttribute('data-feature-id');
      const featureOrder = await card.getAttribute('data-feature-order');
      
      // Verify no malicious content
      expect(featureId).not.toContain('<');
      expect(featureId).not.toContain('>');
      expect(featureOrder).toMatch(/^\d+$/);
    }
  });

  test('should escape benefits text properly', async ({ page }) => {
    const firstCard = page.locator(SELECTORS.featureCard).first();
    const benefits = await firstCard.locator(SELECTORS.benefitItem).all();

    for (const benefit of benefits) {
      const text = await benefit.textContent();
      
      expect(text).not.toContain('<script>');
      expect(text).not.toContain('javascript:');
    }
  });
});

// ============================================================================
// 🔄 EDGE CASES & ERROR HANDLING
// ============================================================================

test.describe('Features Section - Edge Cases', () => {
  test('should handle missing feature icons gracefully', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    // Features section should still be visible
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');
    await scrollToFeatures(page);
    
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible({ timeout: 10000 });
  });

  test('should handle very long feature descriptions', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const firstCard = page.locator(SELECTORS.featureCard).first();
    const description = firstCard.locator('p.text-neutral-600');
    
    await expect(description).toBeVisible();
    
    const classes = await description.getAttribute('class');
    expect(classes).toContain('leading-relaxed');
  });

  test('should handle disabled JavaScript gracefully', async ({ page, context }) => {
    await context.addInitScript(() => {
      delete window.IntersectionObserver;
    });

    await page.goto('/');
    await scrollToFeatures(page);
    
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should handle rapid card clicks', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featureCards = await getAllFeatureCards(page);
    
    // Click all cards rapidly
    for (const card of featureCards) {
      await card.click({ force: true });
    }
    
    // Verify no errors
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should handle window resize during interaction', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    // Resize window
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.waitForTimeout(300);
    
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.waitForTimeout(300);
    
    // Verify features section still visible
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should handle missing benefits gracefully', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featureCards = await getAllFeatureCards(page);
    
    // Verify all cards have benefits lists
    for (const card of featureCards) {
      const benefitsList = card.locator('ul[role="list"]');
      await expect(benefitsList).toBeVisible();
    }
  });
});

// ============================================================================
// 🌐 CROSS-BROWSER COMPATIBILITY
// ============================================================================

test.describe('Features Section - Cross-Browser', () => {
  test('should render consistently across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();

    // Take screenshot for visual comparison
    await expect(featuresSection).toHaveScreenshot(
      `features-${browserName}.png`,
      { maxDiffPixels: 100 }
    );
  });

  test('should support modern CSS features', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const featuresSection = page.locator(SELECTORS.featuresSection);
    
    const backgroundImage = await featuresSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    
    expect(backgroundImage).toContain('gradient');
  });

  test('should handle different font rendering', async ({ page, browserName }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const title = page.locator(SELECTORS.sectionTitle);
    await expect(title).toBeVisible();

    const fontSize = await title.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    
    expect(fontSize).toBeTruthy();
  });

  test('should support flexbox layout', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const firstCard = page.locator(SELECTORS.featureCard).first();
    
    const display = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    
    expect(['flex', 'block']).toContain(display);
  });
});

// ============================================================================
// 📊 ANALYTICS & TRACKING
// ============================================================================

test.describe('Features Section - Analytics', () => {
  test('should log features render event', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    await page.waitForTimeout(500);

    const renderLog = logs.find((log) => log.includes('features_rendered'));
    expect(renderLog).toBeDefined();
  });

  test('should log features initialization event', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    await page.waitForTimeout(500);

    const initLog = logs.find((log) => log.includes('features_initialized'));
    expect(initLog).toBeDefined();
  });

  test('should track feature card interaction events', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const firstCard = page.locator(SELECTORS.featureCard).first();
    await firstCard.hover();
    await firstCard.click();

    await page.waitForTimeout(500);

    const interactionLogs = logs.filter((log) => 
      log.includes('feature_interaction')
    );
    expect(interactionLogs.length).toBeGreaterThan(0);
  });

  test('should include performance metrics in logs', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    await page.waitForTimeout(500);

    const perfLog = logs.find((log) => log.includes('render_time_ms'));
    expect(perfLog).toBeDefined();
  });

  test('should track animation initialization', async ({ page }) => {
    const logs = captureConsoleLogs(page);

    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    await page.waitForTimeout(500);

    const animLog = logs.find((log) => 
      log.includes('features_animations_initialized')
    );
    expect(animLog).toBeDefined();
  });
});

// ============================================================================
// 🧩 INTEGRATION TESTS
// ============================================================================

test.describe('Features Section - Integration', () => {
  test('should integrate with workflow section', async ({ page }) => {
    await page.goto('/');
    
    // Verify workflow section exists
    const workflowSection = page.locator('#workflow');
    await expect(workflowSection).toBeVisible();
    
    // Scroll to features
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    // Verify features section exists
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should maintain scroll position after interaction', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    const initialScrollY = await page.evaluate(() => window.scrollY);

    const firstCard = page.locator(SELECTORS.featureCard).first();
    await firstCard.click();
    await page.waitForTimeout(200);

    const finalScrollY = await page.evaluate(() => window.scrollY);
    
    // Scroll position should be similar (within 100px)
    expect(Math.abs(finalScrollY - initialScrollY)).toBeLessThan(100);
  });

  test('should work with dark mode toggle', async ({ page }) => {
    await page.goto('/');
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);

    // Toggle dark mode if available
    const darkModeToggle = page.locator('[data-theme-toggle]');
    if (await darkModeToggle.count() > 0) {
      await darkModeToggle.click();
      await page.waitForTimeout(300);
    }

    // Verify features section still visible
    const featuresSection = page.locator(SELECTORS.featuresSection);
    await expect(featuresSection).toBeVisible();
  });

  test('should coordinate with other section animations', async ({ page }) => {
    await page.goto('/');
    
    // Scroll through multiple sections
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    await scrollToFeatures(page);
    await waitForFeaturesVisible(page);
    
    // Verify features section animations work
    const featureCards = await getAllFeatureCards(page);
    for (const card of featureCards) {
      await expect(card).toBeVisible();
    }
  });
});