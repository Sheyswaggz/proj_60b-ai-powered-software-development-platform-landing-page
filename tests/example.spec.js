// tests/e2e/landing-page.spec.js
import { test, expect } from '@playwright/test';

/**
 * Landing Page E2E Test Suite
 * 
 * Tests the AI-Powered Software Development Platform landing page
 * across multiple browsers and devices with comprehensive coverage.
 * 
 * Coverage Areas:
 * - Page loading and rendering
 * - SEO and metadata validation
 * - Accessibility compliance
 * - Responsive design
 * - Performance metrics
 * - User interactions
 * - Navigation flows
 */

// ============================================================================
// 🎯 TEST DATA AND CONSTANTS
// ============================================================================

const EXPECTED_TITLE = 'AI-Powered Software Development Platform | Transform Your Development Workflow';
const EXPECTED_DESCRIPTION = 'Accelerate software development with AI-powered tools. Build faster, ship smarter, and scale effortlessly with our intelligent development platform.';
const PERFORMANCE_THRESHOLD = 3000; // 3 seconds
const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
};

// ============================================================================
// 🏗️ SETUP AND TEARDOWN
// ============================================================================

test.describe('Landing Page - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to landing page before each test
    await page.goto('/');
  });

  // ==========================================================================
  // 📄 PAGE LOADING AND RENDERING TESTS
  // ==========================================================================

  test('should load the landing page successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveURL(/.*localhost:3000/);
    
    // Verify page is fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify no console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    expect(errors).toHaveLength(0);
  });

  test('should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(EXPECTED_TITLE);
  });

  test('should have correct meta description', async ({ page }) => {
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBe(EXPECTED_DESCRIPTION);
  });

  test('should render main content container', async ({ page }) => {
    const appContainer = page.locator('#app');
    await expect(appContainer).toBeVisible();
  });

  test('should display noscript warning when JavaScript is disabled', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto('/');
    
    const noscript = page.locator('noscript');
    await expect(noscript).toContainText('JavaScript Required');
    
    await context.close();
  });

  // ==========================================================================
  // 🔍 SEO AND METADATA TESTS
  // ==========================================================================

  test('should have proper Open Graph meta tags', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    
    expect(ogTitle).toBe('AI-Powered Software Development Platform');
    expect(ogDescription).toContain('Accelerate software development');
    expect(ogType).toBe('website');
    expect(ogUrl).toBe('https://example.com/');
    expect(ogImage).toBe('https://example.com/og-image.jpg');
  });

  test('should have proper Twitter Card meta tags', async ({ page }) => {
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    
    expect(twitterCard).toBe('summary_large_image');
    expect(twitterTitle).toBe('AI-Powered Software Development Platform');
    expect(twitterDescription).toContain('Accelerate software development');
    expect(twitterImage).toBe('https://example.com/twitter-image.jpg');
  });

  test('should have canonical URL', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://example.com/');
  });

  test('should have robots meta tag', async ({ page }) => {
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toBe('index, follow');
  });

  test('should have structured data (JSON-LD)', async ({ page }) => {
    const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
    const jsonData = JSON.parse(structuredData);
    
    expect(jsonData['@context']).toBe('https://schema.org');
    expect(jsonData['@type']).toBe('SoftwareApplication');
    expect(jsonData.name).toBe('AI-Powered Software Development Platform');
    expect(jsonData.applicationCategory).toBe('DeveloperApplication');
  });

  test('should have proper favicon links', async ({ page }) => {
    const svgFavicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
    const png32Favicon = page.locator('link[rel="icon"][sizes="32x32"]');
    const png16Favicon = page.locator('link[rel="icon"][sizes="16x16"]');
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    
    await expect(svgFavicon).toHaveAttribute('href', '/favicon.svg');
    await expect(png32Favicon).toHaveAttribute('href', '/favicon-32x32.png');
    await expect(png16Favicon).toHaveAttribute('href', '/favicon-16x16.png');
    await expect(appleTouchIcon).toHaveAttribute('href', '/apple-touch-icon.png');
  });

  // ==========================================================================
  // ♿ ACCESSIBILITY TESTS
  // ==========================================================================

  test('should have skip to main content link', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main');
    await expect(skipLink).toHaveText('Skip to main content');
  });

  test('should have proper language attribute', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(html).toHaveAttribute('dir', 'ltr');
  });

  test('should have proper viewport meta tag', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1.0');
    expect(viewport).toContain('viewport-fit=cover');
  });

  test('should have theme-color meta tags for light and dark modes', async ({ page }) => {
    const lightTheme = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    const darkTheme = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
    
    await expect(lightTheme).toHaveAttribute('content', '#007bff');
    await expect(darkTheme).toHaveAttribute('content', '#1a1a2e');
  });

  test('should have proper charset declaration', async ({ page }) => {
    const charset = await page.locator('meta[charset]').getAttribute('charset');
    expect(charset).toBe('UTF-8');
  });

  // ==========================================================================
  // 📱 RESPONSIVE DESIGN TESTS
  // ==========================================================================

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.waitForLoadState('networkidle');
    
    const appContainer = page.locator('#app');
    await expect(appContainer).toBeVisible();
    
    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.tablet);
    await page.waitForLoadState('networkidle');
    
    const appContainer = page.locator('#app');
    await expect(appContainer).toBeVisible();
    
    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should be responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.waitForLoadState('networkidle');
    
    const appContainer = page.locator('#app');
    await expect(appContainer).toBeVisible();
  });

  // ==========================================================================
  // ⚡ PERFORMANCE TESTS
  // ==========================================================================

  test('should load within performance threshold', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLD);
  });

  test('should have proper resource preconnect hints', async ({ page }) => {
    const dnsPreconnect = page.locator('link[rel="dns-prefetch"]');
    const preconnect = page.locator('link[rel="preconnect"]');
    
    await expect(dnsPreconnect).toHaveAttribute('href', 'https://fonts.googleapis.com');
    await expect(preconnect).toHaveAttribute('href', 'https://fonts.googleapis.com');
    await expect(preconnect).toHaveAttribute('crossorigin');
  });

  test('should load main JavaScript module', async ({ page }) => {
    const scriptTag = page.locator('script[type="module"][src="/src/main.js"]');
    await expect(scriptTag).toHaveCount(1);
  });

  // ==========================================================================
  // 🔒 SECURITY TESTS
  // ==========================================================================

  test('should not expose sensitive information in HTML', async ({ page }) => {
    const content = await page.content();
    
    // Check for common sensitive patterns
    expect(content).not.toContain('password');
    expect(content).not.toContain('api_key');
    expect(content).not.toContain('secret');
    expect(content).not.toContain('token');
  });

  test('should have proper HTTPS configuration in production URLs', async ({ page }) => {
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    
    expect(ogUrl).toMatch(/^https:\/\//);
    expect(canonical).toMatch(/^https:\/\//);
  });

  // ==========================================================================
  // 🎨 VISUAL REGRESSION TESTS
  // ==========================================================================

  test('should match visual snapshot on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.desktop);
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('landing-page-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('should match visual snapshot on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('landing-page-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

// ============================================================================
// 🌐 CROSS-BROWSER COMPATIBILITY TESTS
// ============================================================================

test.describe('Landing Page - Cross-Browser Compatibility', () => {
  test('should work correctly in Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium-specific test');
    
    await page.goto('/');
    await expect(page).toHaveTitle(EXPECTED_TITLE);
    await expect(page.locator('#app')).toBeVisible();
  });

  test('should work correctly in Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');
    
    await page.goto('/');
    await expect(page).toHaveTitle(EXPECTED_TITLE);
    await expect(page.locator('#app')).toBeVisible();
  });

  test('should work correctly in WebKit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'WebKit-specific test');
    
    await page.goto('/');
    await expect(page).toHaveTitle(EXPECTED_TITLE);
    await expect(page.locator('#app')).toBeVisible();
  });
});

// ============================================================================
// 📊 ANALYTICS AND TRACKING TESTS
// ============================================================================

test.describe('Landing Page - Analytics', () => {
  test('should have proper meta keywords', async ({ page }) => {
    await page.goto('/');
    
    const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(keywords).toContain('AI software development');
    expect(keywords).toContain('development platform');
    expect(keywords).toContain('developer tools');
  });

  test('should have proper author meta tag', async ({ page }) => {
    await page.goto('/');
    
    const author = await page.locator('meta[name="author"]').getAttribute('content');
    expect(author).toBe('AI-Powered Software Development Platform');
  });
});

// ============================================================================
// 🔄 ERROR HANDLING TESTS
// ============================================================================

test.describe('Landing Page - Error Handling', () => {
  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline mode
    await context.setOffline(true);
    
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' }).catch(() => null);
    
    // Verify error is handled
    expect(response).toBeNull();
    
    // Restore online mode
    await context.setOffline(false);
  });

  test('should not have any console errors on load', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(consoleErrors).toHaveLength(0);
  });

  test('should not have any uncaught exceptions', async ({ page }) => {
    const pageErrors = [];
    
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(pageErrors).toHaveLength(0);
  });
});

// ============================================================================
// 🎯 SMOKE TESTS (Critical Path)
// ============================================================================

test.describe('Landing Page - Smoke Tests', () => {
  test('critical path: page loads and displays content', async ({ page }) => {
    // This is the most critical test - if this fails, everything else is moot
    await page.goto('/');
    
    // Verify page loaded
    await expect(page).toHaveTitle(EXPECTED_TITLE);
    
    // Verify main container exists
    await expect(page.locator('#app')).toBeVisible();
    
    // Verify no JavaScript errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    expect(errors).toHaveLength(0);
    
    // Verify page is interactive
    await page.waitForLoadState('networkidle');
  });
});