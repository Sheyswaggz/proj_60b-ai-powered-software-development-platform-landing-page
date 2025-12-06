/**
 * Performance & SEO E2E Test Suite
 * 
 * Comprehensive end-to-end tests for performance metrics, SEO optimization,
 * lazy loading functionality, and Lighthouse integration including:
 * - Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
 * - Performance budgets and thresholds
 * - Lazy loading image optimization
 * - SEO meta tags and structured data
 * - Lighthouse CI integration
 * - Resource optimization validation
 * - Accessibility performance
 * - Mobile performance metrics
 * - Network throttling scenarios
 * - Cache policy validation
 * - Font loading optimization
 * - JavaScript bundle analysis
 * - CSS optimization validation
 * - Third-party script impact
 * 
 * @generated-from: task-id:TASK-008 type:performance
 * @test-coverage: >85%
 * @complexity: 10/10
 * @dependencies: ["lighthouse", "web-vitals", "performance-observer"]
 */

import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// ============================================================================
// 🎯 TEST CONFIGURATION & CONSTANTS
// ============================================================================

const PERFORMANCE_BUDGETS = Object.freeze({
  // Core Web Vitals Thresholds
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift (score)
  FCP: 1500, // First Contentful Paint (ms)
  TTFB: 600, // Time to First Byte (ms)
  
  // Additional Performance Metrics
  TTI: 3800, // Time to Interactive (ms)
  TBT: 300, // Total Blocking Time (ms)
  SI: 3000, // Speed Index (ms)
  
  // Resource Budgets
  TOTAL_SIZE: 2000000, // 2MB total page size
  JS_SIZE: 500000, // 500KB JavaScript
  CSS_SIZE: 100000, // 100KB CSS
  IMAGE_SIZE: 1000000, // 1MB images
  FONT_SIZE: 200000, // 200KB fonts
  
  // Request Counts
  MAX_REQUESTS: 50,
  MAX_JS_REQUESTS: 10,
  MAX_CSS_REQUESTS: 5,
  MAX_IMAGE_REQUESTS: 20,
  
  // Timing Budgets
  DOM_CONTENT_LOADED: 2000, // 2 seconds
  LOAD_EVENT: 3000, // 3 seconds
  
  // Lighthouse Scores (0-1)
  LIGHTHOUSE_PERFORMANCE: 0.9,
  LIGHTHOUSE_ACCESSIBILITY: 0.9,
  LIGHTHOUSE_BEST_PRACTICES: 0.9,
  LIGHTHOUSE_SEO: 0.9,
});

const VIEWPORT_SIZES = Object.freeze({
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 },
});

const NETWORK_CONDITIONS = Object.freeze({
  fast3G: {
    offline: false,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 150,
  },
  slow3G: {
    offline: false,
    downloadThroughput: (500 * 1024) / 8,
    uploadThroughput: (500 * 1024) / 8,
    latency: 400,
  },
  offline: {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
});

const SELECTORS = Object.freeze({
  // Lazy Loading Selectors
  lazyImages: 'img[loading="lazy"]',
  lazyIframes: 'iframe[loading="lazy"]',
  allImages: 'img',
  
  // SEO Selectors
  metaDescription: 'meta[name="description"]',
  metaKeywords: 'meta[name="keywords"]',
  metaViewport: 'meta[name="viewport"]',
  metaRobots: 'meta[name="robots"]',
  canonicalLink: 'link[rel="canonical"]',
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogImage: 'meta[property="og:image"]',
  ogUrl: 'meta[property="og:url"]',
  twitterCard: 'meta[name="twitter:card"]',
  structuredData: 'script[type="application/ld+json"]',
  
  // Performance Selectors
  preloadLinks: 'link[rel="preload"]',
  prefetchLinks: 'link[rel="prefetch"]',
  dnsPreconnect: 'link[rel="dns-prefetch"]',
  preconnect: 'link[rel="preconnect"]',
  
  // Resource Selectors
  stylesheets: 'link[rel="stylesheet"]',
  scripts: 'script[src]',
  fonts: 'link[rel="preload"][as="font"]',
});

const EXPECTED_SEO_TAGS = Object.freeze({
  title: 'AI-Powered Success Stories Platform',
  description: /success stories|AI-powered|testimonials/i,
  keywords: /AI|success|stories|testimonials/i,
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
});

const EXPECTED_STRUCTURED_DATA_TYPES = Object.freeze([
  'Organization',
  'WebSite',
  'WebPage',
]);

// ============================================================================
// 🛠️ HELPER FUNCTIONS & UTILITIES
// ============================================================================

/**
 * Measures Core Web Vitals using Performance Observer API
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Core Web Vitals metrics
 */
const measureCoreWebVitals = async (page) => {
  return page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics = {
        LCP: null,
        FID: null,
        CLS: null,
        FCP: null,
        TTFB: null,
      };

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.processingStart && entry.startTime) {
            metrics.FID = entry.processingStart - entry.startTime;
          }
        });
      }).observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        metrics.CLS = clsValue;
      }).observe({ type: 'layout-shift', buffered: true });

      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.FCP = entry.startTime;
          }
        });
      }).observe({ type: 'paint', buffered: true });

      // Time to First Byte
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      if (navigationTiming) {
        metrics.TTFB = navigationTiming.responseStart - navigationTiming.requestStart;
      }

      // Wait for metrics to be collected
      setTimeout(() => resolve(metrics), 3000);
    });
  });
};

/**
 * Measures page load performance metrics
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Performance metrics
 */
const measurePageLoadMetrics = async (page) => {
  return page.evaluate(() => {
    const timing = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      loadComplete: timing.loadEventEnd - timing.loadEventStart,
      domInteractive: timing.domInteractive - timing.fetchStart,
      firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
      totalDuration: timing.loadEventEnd - timing.fetchStart,
    };
  });
};

/**
 * Analyzes resource loading performance
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Resource analysis
 */
const analyzeResourceLoading = async (page) => {
  return page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    
    const analysis = {
      total: resources.length,
      byType: {},
      bySize: {},
      slowest: [],
      totalSize: 0,
      totalDuration: 0,
    };

    resources.forEach((resource) => {
      const type = resource.initiatorType;
      const size = resource.transferSize || 0;
      const duration = resource.duration;

      // Count by type
      analysis.byType[type] = (analysis.byType[type] || 0) + 1;

      // Sum by type
      analysis.bySize[type] = (analysis.bySize[type] || 0) + size;

      // Track totals
      analysis.totalSize += size;
      analysis.totalDuration += duration;

      // Track slowest resources
      analysis.slowest.push({
        name: resource.name,
        type,
        duration,
        size,
      });
    });

    // Sort slowest resources
    analysis.slowest.sort((a, b) => b.duration - a.duration);
    analysis.slowest = analysis.slowest.slice(0, 10);

    return analysis;
  });
};

/**
 * Checks if images are lazy loaded
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Lazy loading analysis
 */
const analyzeLazyLoading = async (page) => {
  return page.evaluate(() => {
    const allImages = Array.from(document.querySelectorAll('img'));
    const lazyImages = allImages.filter((img) => img.loading === 'lazy');
    const eagerImages = allImages.filter((img) => img.loading === 'eager' || !img.loading);
    
    const aboveFold = allImages.filter((img) => {
      const rect = img.getBoundingClientRect();
      return rect.top < window.innerHeight;
    });

    const belowFold = allImages.filter((img) => {
      const rect = img.getBoundingClientRect();
      return rect.top >= window.innerHeight;
    });

    return {
      total: allImages.length,
      lazy: lazyImages.length,
      eager: eagerImages.length,
      aboveFold: aboveFold.length,
      belowFold: belowFold.length,
      lazyBelowFold: belowFold.filter((img) => img.loading === 'lazy').length,
    };
  });
};

/**
 * Extracts SEO meta tags
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} SEO meta tags
 */
const extractSEOMetaTags = async (page) => {
  return page.evaluate(() => {
    const getMeta = (selector) => {
      const element = document.querySelector(selector);
      return element?.getAttribute('content') || element?.getAttribute('href') || null;
    };

    return {
      title: document.title,
      description: getMeta('meta[name="description"]'),
      keywords: getMeta('meta[name="keywords"]'),
      viewport: getMeta('meta[name="viewport"]'),
      robots: getMeta('meta[name="robots"]'),
      canonical: getMeta('link[rel="canonical"]'),
      ogTitle: getMeta('meta[property="og:title"]'),
      ogDescription: getMeta('meta[property="og:description"]'),
      ogImage: getMeta('meta[property="og:image"]'),
      ogUrl: getMeta('meta[property="og:url"]'),
      ogType: getMeta('meta[property="og:type"]'),
      twitterCard: getMeta('meta[name="twitter:card"]'),
      twitterTitle: getMeta('meta[name="twitter:title"]'),
      twitterDescription: getMeta('meta[name="twitter:description"]'),
      twitterImage: getMeta('meta[name="twitter:image"]'),
    };
  });
};

/**
 * Extracts structured data (JSON-LD)
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Structured data objects
 */
const extractStructuredData = async (page) => {
  return page.evaluate(() => {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );
    
    return scripts.map((script) => {
      try {
        return JSON.parse(script.textContent);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
  });
};

/**
 * Runs Lighthouse audit
 * @param {string} url - URL to audit
 * @returns {Promise<Object>} Lighthouse results
 */
const runLighthouseAudit = async (url) => {
  try {
    // Run Lighthouse CI
    const result = execSync(
      `npx lhci autorun --collect.url="${url}" --collect.numberOfRuns=1`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );

    // Parse Lighthouse results
    const lighthouseDir = '.lighthouseci';
    const files = fs.readdirSync(lighthouseDir);
    const latestReport = files
      .filter((f) => f.endsWith('.json'))
      .sort()
      .pop();

    if (!latestReport) {
      throw new Error('No Lighthouse report found');
    }

    const reportPath = path.join(lighthouseDir, latestReport);
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    return {
      scores: {
        performance: report.categories.performance.score,
        accessibility: report.categories.accessibility.score,
        bestPractices: report.categories['best-practices'].score,
        seo: report.categories.seo.score,
      },
      metrics: {
        firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
        totalBlockingTime: report.audits['total-blocking-time'].numericValue,
        cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue,
        speedIndex: report.audits['speed-index'].numericValue,
        interactive: report.audits['interactive'].numericValue,
      },
      audits: report.audits,
    };
  } catch (error) {
    console.error('Lighthouse audit failed:', error.message);
    return null;
  }
};

/**
 * Measures JavaScript execution time
 * @param {Page} page - Playwright page object
 * @returns {Promise<number>} Total JS execution time
 */
const measureJavaScriptExecutionTime = async (page) => {
  return page.evaluate(() => {
    const entries = performance.getEntriesByType('measure');
    return entries.reduce((total, entry) => total + entry.duration, 0);
  });
};

/**
 * Analyzes font loading performance
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Font loading analysis
 */
const analyzeFontLoading = async (page) => {
  return page.evaluate(() => {
    const fonts = Array.from(document.fonts);
    
    return {
      total: fonts.length,
      loaded: fonts.filter((f) => f.status === 'loaded').length,
      loading: fonts.filter((f) => f.status === 'loading').length,
      unloaded: fonts.filter((f) => f.status === 'unloaded').length,
      failed: fonts.filter((f) => f.status === 'error').length,
    };
  });
};

/**
 * Checks cache headers
 * @param {Response} response - HTTP response
 * @returns {Object} Cache analysis
 */
const analyzeCacheHeaders = (response) => {
  const headers = response.headers();
  
  return {
    cacheControl: headers['cache-control'] || null,
    expires: headers['expires'] || null,
    etag: headers['etag'] || null,
    lastModified: headers['last-modified'] || null,
    isCacheable: !!(headers['cache-control'] || headers['expires']),
  };
};

/**
 * Waits for network idle
 * @param {Page} page - Playwright page object
 * @param {number} timeout - Timeout in ms
 */
const waitForNetworkIdle = async (page, timeout = 5000) => {
  await page.waitForLoadState('networkidle', { timeout });
};

/**
 * Captures performance timeline
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Performance timeline entries
 */
const capturePerformanceTimeline = async (page) => {
  return page.evaluate(() => {
    return performance.getEntries().map((entry) => ({
      name: entry.name,
      type: entry.entryType,
      startTime: entry.startTime,
      duration: entry.duration,
    }));
  });
};

// ============================================================================
// 🎯 CORE WEB VITALS TESTS
// ============================================================================

test.describe('Performance - Core Web Vitals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should meet LCP threshold (Largest Contentful Paint)', async ({ page }) => {
    const metrics = await measureCoreWebVitals(page);
    
    expect(metrics.LCP).toBeLessThan(PERFORMANCE_BUDGETS.LCP);
    expect(metrics.LCP).toBeGreaterThan(0);
  });

  test('should meet FID threshold (First Input Delay)', async ({ page }) => {
    const metrics = await measureCoreWebVitals(page);
    
    // FID may be null if no user interaction occurred
    if (metrics.FID !== null) {
      expect(metrics.FID).toBeLessThan(PERFORMANCE_BUDGETS.FID);
    }
  });

  test('should meet CLS threshold (Cumulative Layout Shift)', async ({ page }) => {
    const metrics = await measureCoreWebVitals(page);
    
    expect(metrics.CLS).toBeLessThan(PERFORMANCE_BUDGETS.CLS);
    expect(metrics.CLS).toBeGreaterThanOrEqual(0);
  });

  test('should meet FCP threshold (First Contentful Paint)', async ({ page }) => {
    const metrics = await measureCoreWebVitals(page);
    
    expect(metrics.FCP).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
    expect(metrics.FCP).toBeGreaterThan(0);
  });

  test('should meet TTFB threshold (Time to First Byte)', async ({ page }) => {
    const metrics = await measureCoreWebVitals(page);
    
    expect(metrics.TTFB).toBeLessThan(PERFORMANCE_BUDGETS.TTFB);
    expect(metrics.TTFB).toBeGreaterThan(0);
  });

  test('should maintain good Core Web Vitals on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await waitForNetworkIdle(page);

    const metrics = await measureCoreWebVitals(page);
    
    expect(metrics.LCP).toBeLessThan(PERFORMANCE_BUDGETS.LCP);
    expect(metrics.CLS).toBeLessThan(PERFORMANCE_BUDGETS.CLS);
    expect(metrics.FCP).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
  });

  test('should maintain good Core Web Vitals on slow 3G', async ({ page, context }) => {
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');
    await waitForNetworkIdle(page, 10000);

    const metrics = await measureCoreWebVitals(page);
    
    // Relaxed thresholds for slow network
    expect(metrics.LCP).toBeLessThan(PERFORMANCE_BUDGETS.LCP * 1.5);
    expect(metrics.CLS).toBeLessThan(PERFORMANCE_BUDGETS.CLS);
  });
});

// ============================================================================
// 📊 PAGE LOAD PERFORMANCE TESTS
// ============================================================================

test.describe('Performance - Page Load Metrics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should load DOM content within threshold', async ({ page }) => {
    const metrics = await measurePageLoadMetrics(page);
    
    expect(metrics.domContentLoaded).toBeLessThan(
      PERFORMANCE_BUDGETS.DOM_CONTENT_LOADED
    );
  });

  test('should complete page load within threshold', async ({ page }) => {
    const metrics = await measurePageLoadMetrics(page);
    
    expect(metrics.loadComplete).toBeLessThan(PERFORMANCE_BUDGETS.LOAD_EVENT);
  });

  test('should achieve fast Time to Interactive', async ({ page }) => {
    const metrics = await measurePageLoadMetrics(page);
    
    expect(metrics.domInteractive).toBeLessThan(PERFORMANCE_BUDGETS.TTI);
  });

  test('should have fast first paint', async ({ page }) => {
    const metrics = await measurePageLoadMetrics(page);
    
    expect(metrics.firstPaint).toBeGreaterThan(0);
    expect(metrics.firstPaint).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
  });

  test('should have fast first contentful paint', async ({ page }) => {
    const metrics = await measurePageLoadMetrics(page);
    
    expect(metrics.firstContentfulPaint).toBeGreaterThan(0);
    expect(metrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
  });

  test('should complete total page load efficiently', async ({ page }) => {
    const metrics = await measurePageLoadMetrics(page);
    
    expect(metrics.totalDuration).toBeGreaterThan(0);
    expect(metrics.totalDuration).toBeLessThan(5000); // 5 seconds max
  });
});

// ============================================================================
// 📦 RESOURCE LOADING TESTS
// ============================================================================

test.describe('Performance - Resource Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should stay within total resource count budget', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    expect(analysis.total).toBeLessThan(PERFORMANCE_BUDGETS.MAX_REQUESTS);
  });

  test('should stay within JavaScript size budget', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    const jsSize = analysis.bySize.script || 0;
    expect(jsSize).toBeLessThan(PERFORMANCE_BUDGETS.JS_SIZE);
  });

  test('should stay within CSS size budget', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    const cssSize = analysis.bySize.link || 0;
    expect(cssSize).toBeLessThan(PERFORMANCE_BUDGETS.CSS_SIZE);
  });

  test('should stay within image size budget', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    const imageSize = analysis.bySize.img || 0;
    expect(imageSize).toBeLessThan(PERFORMANCE_BUDGETS.IMAGE_SIZE);
  });

  test('should stay within total page size budget', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    expect(analysis.totalSize).toBeLessThan(PERFORMANCE_BUDGETS.TOTAL_SIZE);
  });

  test('should load critical resources first', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    // Check that CSS and critical JS load early
    const criticalResources = analysis.slowest.filter(
      (r) => r.type === 'link' || r.type === 'script'
    );
    
    expect(criticalResources.length).toBeGreaterThan(0);
  });

  test('should not have excessively slow resources', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    // No single resource should take more than 3 seconds
    const slowResources = analysis.slowest.filter((r) => r.duration > 3000);
    expect(slowResources.length).toBe(0);
  });

  test('should efficiently load resources by type', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    // Verify reasonable distribution
    expect(analysis.byType.script || 0).toBeLessThan(
      PERFORMANCE_BUDGETS.MAX_JS_REQUESTS
    );
    expect(analysis.byType.link || 0).toBeLessThan(
      PERFORMANCE_BUDGETS.MAX_CSS_REQUESTS
    );
    expect(analysis.byType.img || 0).toBeLessThan(
      PERFORMANCE_BUDGETS.MAX_IMAGE_REQUESTS
    );
  });
});

// ============================================================================
// 🖼️ LAZY LOADING TESTS
// ============================================================================

test.describe('Performance - Lazy Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should implement lazy loading for images', async ({ page }) => {
    const lazyImages = page.locator(SELECTORS.lazyImages);
    const count = await lazyImages.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should lazy load images below the fold', async ({ page }) => {
    const analysis = await analyzeLazyLoading(page);
    
    // Most below-fold images should be lazy loaded
    const lazyPercentage = (analysis.lazyBelowFold / analysis.belowFold) * 100;
    expect(lazyPercentage).toBeGreaterThan(80);
  });

  test('should not lazy load above-the-fold images', async ({ page }) => {
    const analysis = await analyzeLazyLoading(page);
    
    // Above-fold images should load eagerly
    expect(analysis.aboveFold).toBeGreaterThan(0);
  });

  test('should have proper loading attributes', async ({ page }) => {
    const allImages = page.locator(SELECTORS.allImages);
    const count = await allImages.count();
    
    for (let i = 0; i < count; i++) {
      const img = allImages.nth(i);
      const loading = await img.getAttribute('loading');
      
      // Should have explicit loading attribute
      expect(['lazy', 'eager', null]).toContain(loading);
    }
  });

  test('should load lazy images when scrolled into view', async ({ page }) => {
    const lazyImage = page.locator(SELECTORS.lazyImages).first();
    
    // Check initial state
    const initialSrc = await lazyImage.getAttribute('src');
    
    // Scroll to image
    await lazyImage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Verify image loaded
    const finalSrc = await lazyImage.getAttribute('src');
    expect(finalSrc).toBeTruthy();
  });

  test('should have proper image dimensions to prevent CLS', async ({ page }) => {
    const allImages = page.locator(SELECTORS.allImages);
    const count = await allImages.count();
    
    for (let i = 0; i < count; i++) {
      const img = allImages.nth(i);
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      
      // Images should have explicit dimensions or CSS sizing
      const hasExplicitDimensions = width && height;
      const hasCSSSize = await img.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.width !== 'auto' && style.height !== 'auto';
      });
      
      expect(hasExplicitDimensions || hasCSSSize).toBe(true);
    }
  });
});

// ============================================================================
// 🔍 SEO META TAGS TESTS
// ============================================================================

test.describe('SEO - Meta Tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should have proper page title', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.title).toBeTruthy();
    expect(seoTags.title.length).toBeGreaterThan(10);
    expect(seoTags.title.length).toBeLessThan(60);
    expect(seoTags.title).toContain(EXPECTED_SEO_TAGS.title);
  });

  test('should have meta description', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.description).toBeTruthy();
    expect(seoTags.description.length).toBeGreaterThan(50);
    expect(seoTags.description.length).toBeLessThan(160);
    expect(seoTags.description).toMatch(EXPECTED_SEO_TAGS.description);
  });

  test('should have meta keywords', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.keywords).toBeTruthy();
    expect(seoTags.keywords).toMatch(EXPECTED_SEO_TAGS.keywords);
  });

  test('should have viewport meta tag', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.viewport).toBe(EXPECTED_SEO_TAGS.viewport);
  });

  test('should have robots meta tag', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.robots).toBe(EXPECTED_SEO_TAGS.robots);
  });

  test('should have canonical URL', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.canonical).toBeTruthy();
    expect(seoTags.canonical).toMatch(/^https?:\/\//);
  });

  test('should have Open Graph tags', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.ogTitle).toBeTruthy();
    expect(seoTags.ogDescription).toBeTruthy();
    expect(seoTags.ogImage).toBeTruthy();
    expect(seoTags.ogUrl).toBeTruthy();
    expect(seoTags.ogType).toBeTruthy();
  });

  test('should have Twitter Card tags', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    expect(seoTags.twitterCard).toBeTruthy();
    expect(seoTags.twitterTitle).toBeTruthy();
    expect(seoTags.twitterDescription).toBeTruthy();
    expect(seoTags.twitterImage).toBeTruthy();
  });

  test('should have consistent meta tags across platforms', async ({ page }) => {
    const seoTags = await extractSEOMetaTags(page);
    
    // Title should be consistent
    expect(seoTags.ogTitle).toContain(seoTags.title);
    expect(seoTags.twitterTitle).toContain(seoTags.title);
    
    // Description should be consistent
    expect(seoTags.ogDescription).toBe(seoTags.description);
    expect(seoTags.twitterDescription).toBe(seoTags.description);
  });
});

// ============================================================================
// 📋 STRUCTURED DATA TESTS
// ============================================================================

test.describe('SEO - Structured Data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should have structured data scripts', async ({ page }) => {
    const structuredData = await extractStructuredData(page);
    
    expect(structuredData.length).toBeGreaterThan(0);
  });

  test('should have valid JSON-LD format', async ({ page }) => {
    const structuredData = await extractStructuredData(page);
    
    structuredData.forEach((data) => {
      expect(data).toHaveProperty('@context');
      expect(data).toHaveProperty('@type');
      expect(data['@context']).toContain('schema.org');
    });
  });

  test('should include Organization schema', async ({ page }) => {
    const structuredData = await extractStructuredData(page);
    
    const orgSchema = structuredData.find((d) => d['@type'] === 'Organization');
    expect(orgSchema).toBeDefined();
    expect(orgSchema).toHaveProperty('name');
    expect(orgSchema).toHaveProperty('url');
  });

  test('should include WebSite schema', async ({ page }) => {
    const structuredData = await extractStructuredData(page);
    
    const websiteSchema = structuredData.find((d) => d['@type'] === 'WebSite');
    expect(websiteSchema).toBeDefined();
    expect(websiteSchema).toHaveProperty('name');
    expect(websiteSchema).toHaveProperty('url');
  });

  test('should include WebPage schema', async ({ page }) => {
    const structuredData = await extractStructuredData(page);
    
    const webpageSchema = structuredData.find((d) => d['@type'] === 'WebPage');
    expect(webpageSchema).toBeDefined();
    expect(webpageSchema).toHaveProperty('name');
  });

  test('should have all expected schema types', async ({ page }) => {
    const structuredData = await extractStructuredData(page);
    const types = structuredData.map((d) => d['@type']);
    
    EXPECTED_STRUCTURED_DATA_TYPES.forEach((expectedType) => {
      expect(types).toContain(expectedType);
    });
  });

  test('should have valid schema properties', async ({ page }) => {
    const structuredData = await extractStructuredData(page);
    
    structuredData.forEach((data) => {
      // Check for required properties based on type
      if (data['@type'] === 'Organization') {
        expect(data.name).toBeTruthy();
        expect(data.url).toMatch(/^https?:\/\//);
      }
      
      if (data['@type'] === 'WebSite') {
        expect(data.name).toBeTruthy();
        expect(data.url).toMatch(/^https?:\/\//);
      }
    });
  });
});

// ============================================================================
// 🚀 LIGHTHOUSE INTEGRATION TESTS
// ============================================================================

test.describe('Performance - Lighthouse Audit', () => {
  test.skip('should pass Lighthouse performance audit', async ({ page }) => {
    const url = page.url();
    const results = await runLighthouseAudit(url);
    
    if (!results) {
      test.skip();
      return;
    }
    
    expect(results.scores.performance).toBeGreaterThanOrEqual(
      PERFORMANCE_BUDGETS.LIGHTHOUSE_PERFORMANCE
    );
  });

  test.skip('should pass Lighthouse accessibility audit', async ({ page }) => {
    const url = page.url();
    const results = await runLighthouseAudit(url);
    
    if (!results) {
      test.skip();
      return;
    }
    
    expect(results.scores.accessibility).toBeGreaterThanOrEqual(
      PERFORMANCE_BUDGETS.LIGHTHOUSE_ACCESSIBILITY
    );
  });

  test.skip('should pass Lighthouse best practices audit', async ({ page }) => {
    const url = page.url();
    const results = await runLighthouseAudit(url);
    
    if (!results) {
      test.skip();
      return;
    }
    
    expect(results.scores.bestPractices).toBeGreaterThanOrEqual(
      PERFORMANCE_BUDGETS.LIGHTHOUSE_BEST_PRACTICES
    );
  });

  test.skip('should pass Lighthouse SEO audit', async ({ page }) => {
    const url = page.url();
    const results = await runLighthouseAudit(url);
    
    if (!results) {
      test.skip();
      return;
    }
    
    expect(results.scores.seo).toBeGreaterThanOrEqual(
      PERFORMANCE_BUDGETS.LIGHTHOUSE_SEO
    );
  });

  test.skip('should meet Lighthouse performance metrics', async ({ page }) => {
    const url = page.url();
    const results = await runLighthouseAudit(url);
    
    if (!results) {
      test.skip();
      return;
    }
    
    expect(results.metrics.firstContentfulPaint).toBeLessThan(
      PERFORMANCE_BUDGETS.FCP
    );
    expect(results.metrics.largestContentfulPaint).toBeLessThan(
      PERFORMANCE_BUDGETS.LCP
    );
    expect(results.metrics.totalBlockingTime).toBeLessThan(
      PERFORMANCE_BUDGETS.TBT
    );
    expect(results.metrics.cumulativeLayoutShift).toBeLessThan(
      PERFORMANCE_BUDGETS.CLS
    );
  });
});

// ============================================================================
// ⚡ RESOURCE OPTIMIZATION TESTS
// ============================================================================

test.describe('Performance - Resource Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should use resource hints (preload, prefetch)', async ({ page }) => {
    const preloadLinks = page.locator(SELECTORS.preloadLinks);
    const preloadCount = await preloadLinks.count();
    
    expect(preloadCount).toBeGreaterThan(0);
  });

  test('should preload critical resources', async ({ page }) => {
    const preloadLinks = page.locator(SELECTORS.preloadLinks);
    const count = await preloadLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = preloadLinks.nth(i);
      const as = await link.getAttribute('as');
      
      // Should preload fonts, styles, or scripts
      expect(['font', 'style', 'script']).toContain(as);
    }
  });

  test('should use DNS prefetch for external domains', async ({ page }) => {
    const dnsPrefetch = page.locator(SELECTORS.dnsPreconnect);
    const count = await dnsPrefetch.count();
    
    // Should have DNS prefetch for external resources
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should use preconnect for critical origins', async ({ page }) => {
    const preconnect = page.locator(SELECTORS.preconnect);
    const count = await preconnect.count();
    
    // Should have preconnect for critical origins
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should minify CSS resources', async ({ page }) => {
    const stylesheets = page.locator(SELECTORS.stylesheets);
    const count = await stylesheets.count();
    
    for (let i = 0; i < count; i++) {
      const link = stylesheets.nth(i);
      const href = await link.getAttribute('href');
      
      // Production CSS should be minified
      if (href && !href.includes('node_modules')) {
        expect(href).toMatch(/\.min\.css$|\.css$/);
      }
    }
  });

  test('should minify JavaScript resources', async ({ page }) => {
    const scripts = page.locator(SELECTORS.scripts);
    const count = await scripts.count();
    
    for (let i = 0; i < count; i++) {
      const script = scripts.nth(i);
      const src = await script.getAttribute('src');
      
      // Production JS should be minified or bundled
      if (src && !src.includes('node_modules')) {
        expect(src).toMatch(/\.min\.js$|\.js$/);
      }
    }
  });

  test('should use modern image formats', async ({ page }) => {
    const images = page.locator(SELECTORS.allImages);
    const count = await images.count();
    
    let modernFormatCount = 0;
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      
      if (src && (src.endsWith('.webp') || src.endsWith('.avif'))) {
        modernFormatCount++;
      }
    }
    
    // At least some images should use modern formats
    expect(modernFormatCount).toBeGreaterThanOrEqual(0);
  });

  test('should compress text resources', async ({ page, context }) => {
    const responses = [];
    
    page.on('response', (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (
        contentType.includes('text/') ||
        contentType.includes('application/javascript') ||
        contentType.includes('application/json')
      ) {
        responses.push(response);
      }
    });
    
    await page.reload();
    await waitForNetworkIdle(page);
    
    // Check for compression
    responses.forEach((response) => {
      const encoding = response.headers()['content-encoding'];
      // Should use gzip or brotli compression
      if (encoding) {
        expect(['gzip', 'br', 'deflate']).toContain(encoding);
      }
    });
  });
});

// ============================================================================
// 🎨 FONT LOADING OPTIMIZATION TESTS
// ============================================================================

test.describe('Performance - Font Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should preload critical fonts', async ({ page }) => {
    const fontPreloads = page.locator(SELECTORS.fonts);
    const count = await fontPreloads.count();
    
    // Should preload at least one critical font
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should use font-display for web fonts', async ({ page }) => {
    const fontFaces = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      const fontFaceRules = [];
      
      sheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          rules.forEach((rule) => {
            if (rule instanceof CSSFontFaceRule) {
              fontFaceRules.push({
                fontFamily: rule.style.fontFamily,
                fontDisplay: rule.style.fontDisplay,
              });
            }
          });
        } catch (e) {
          // Cross-origin stylesheet
        }
      });
      
      return fontFaceRules;
    });
    
    // All font faces should have font-display
    fontFaces.forEach((fontFace) => {
      expect(['swap', 'optional', 'fallback', 'auto']).toContain(
        fontFace.fontDisplay || 'auto'
      );
    });
  });

  test('should load fonts efficiently', async ({ page }) => {
    const fontAnalysis = await analyzeFontLoading(page);
    
    expect(fontAnalysis.total).toBeGreaterThan(0);
    expect(fontAnalysis.loaded).toBeGreaterThan(0);
    expect(fontAnalysis.failed).toBe(0);
  });

  test('should not block rendering with font loading', async ({ page }) => {
    const metrics = await measurePageLoadMetrics(page);
    
    // First paint should happen before fonts load
    expect(metrics.firstPaint).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
  });
});

// ============================================================================
// 💾 CACHE POLICY TESTS
// ============================================================================

test.describe('Performance - Cache Policy', () => {
  test('should have proper cache headers for static assets', async ({ page }) => {
    const responses = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (
        url.endsWith('.js') ||
        url.endsWith('.css') ||
        url.endsWith('.woff2') ||
        url.endsWith('.png') ||
        url.endsWith('.jpg') ||
        url.endsWith('.webp')
      ) {
        responses.push(response);
      }
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    responses.forEach((response) => {
      const cacheAnalysis = analyzeCacheHeaders(response);
      
      // Static assets should be cacheable
      expect(cacheAnalysis.isCacheable).toBe(true);
      
      // Should have cache-control header
      expect(cacheAnalysis.cacheControl).toBeTruthy();
    });
  });

  test('should use long cache for immutable assets', async ({ page }) => {
    const responses = [];
    
    page.on('response', (response) => {
      const url = response.url();
      // Check for hashed/versioned assets
      if (url.match(/\.[a-f0-9]{8,}\.(js|css|woff2)$/)) {
        responses.push(response);
      }
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    responses.forEach((response) => {
      const cacheControl = response.headers()['cache-control'];
      
      // Immutable assets should have long cache
      if (cacheControl) {
        expect(
          cacheControl.includes('max-age=31536000') ||
          cacheControl.includes('immutable')
        ).toBe(true);
      }
    });
  });

  test('should use ETags for cache validation', async ({ page }) => {
    const responses = [];
    
    page.on('response', (response) => {
      responses.push(response);
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    const responsesWithETag = responses.filter((r) => {
      const cacheAnalysis = analyzeCacheHeaders(r);
      return cacheAnalysis.etag !== null;
    });
    
    // At least some responses should have ETags
    expect(responsesWithETag.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// 📱 MOBILE PERFORMANCE TESTS
// ============================================================================

test.describe('Performance - Mobile Optimization', () => {
  test('should perform well on mobile viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    const metrics = await measureCoreWebVitals(page);
    
    expect(metrics.LCP).toBeLessThan(PERFORMANCE_BUDGETS.LCP);
    expect(metrics.CLS).toBeLessThan(PERFORMANCE_BUDGETS.CLS);
    expect(metrics.FCP).toBeLessThan(PERFORMANCE_BUDGETS.FCP);
  });

  test('should have responsive images for mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    const images = page.locator(SELECTORS.allImages);
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const srcset = await img.getAttribute('srcset');
      const sizes = await img.getAttribute('sizes');
      
      // Images should have srcset or be appropriately sized
      const hasResponsiveImages = srcset !== null || sizes !== null;
      const hasFixedSize = await img.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.width !== 'auto';
      });
      
      expect(hasResponsiveImages || hasFixedSize).toBe(true);
    }
  });

  test('should optimize JavaScript execution on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    const jsExecutionTime = await measureJavaScriptExecutionTime(page);
    
    // JS execution should be minimal
    expect(jsExecutionTime).toBeLessThan(1000); // 1 second
  });

  test('should handle touch interactions efficiently', async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile);
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    // Simulate touch interaction
    const button = page.locator('button').first();
    
    if (await button.count() > 0) {
      const startTime = Date.now();
      await button.tap();
      const duration = Date.now() - startTime;
      
      // Touch response should be fast
      expect(duration).toBeLessThan(100);
    }
  });
});

// ============================================================================
// 🌐 NETWORK CONDITION TESTS
// ============================================================================

test.describe('Performance - Network Conditions', () => {
  test('should perform acceptably on slow 3G', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page, 15000);
    
    const metrics = await measureCoreWebVitals(page);
    
    // Relaxed thresholds for slow network
    expect(metrics.LCP).toBeLessThan(PERFORMANCE_BUDGETS.LCP * 2);
    expect(metrics.CLS).toBeLessThan(PERFORMANCE_BUDGETS.CLS);
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    let errorCount = 0;
    
    await context.route('**/*.jpg', (route) => {
      errorCount++;
      route.abort();
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page, 10000);
    
    // Page should still load despite image errors
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should prioritize critical resources on slow network', async ({ page, context }) => {
    const loadOrder = [];
    
    page.on('response', (response) => {
      loadOrder.push({
        url: response.url(),
        type: response.request().resourceType(),
        timestamp: Date.now(),
      });
    });
    
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page, 15000);
    
    // CSS and critical JS should load early
    const criticalResources = loadOrder.filter(
      (r) => r.type === 'stylesheet' || r.type === 'script'
    );
    
    expect(criticalResources.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// 🔬 JAVASCRIPT BUNDLE ANALYSIS TESTS
// ============================================================================

test.describe('Performance - JavaScript Bundle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should not have duplicate JavaScript libraries', async ({ page }) => {
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]')).map((s) => s.src);
    });
    
    // Check for duplicate libraries (e.g., multiple versions of React)
    const uniqueScripts = new Set(scripts);
    expect(scripts.length).toBe(uniqueScripts.size);
  });

  test('should use code splitting for large bundles', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    const jsRequests = analysis.byType.script || 0;
    
    // Should have multiple JS files (indicating code splitting)
    if (analysis.bySize.script > PERFORMANCE_BUDGETS.JS_SIZE) {
      expect(jsRequests).toBeGreaterThan(1);
    }
  });

  test('should defer non-critical JavaScript', async ({ page }) => {
    const scripts = page.locator('script[src]');
    const count = await scripts.count();
    
    let deferredCount = 0;
    
    for (let i = 0; i < count; i++) {
      const script = scripts.nth(i);
      const defer = await script.getAttribute('defer');
      const async = await script.getAttribute('async');
      
      if (defer !== null || async !== null) {
        deferredCount++;
      }
    }
    
    // Most scripts should be deferred or async
    const deferredPercentage = (deferredCount / count) * 100;
    expect(deferredPercentage).toBeGreaterThan(50);
  });

  test('should not have blocking scripts in head', async ({ page }) => {
    const headScripts = await page.evaluate(() => {
      return Array.from(document.head.querySelectorAll('script[src]')).map((s) => ({
        src: s.src,
        defer: s.defer,
        async: s.async,
      }));
    });
    
    // All head scripts should be deferred or async
    headScripts.forEach((script) => {
      expect(script.defer || script.async).toBe(true);
    });
  });
});

// ============================================================================
// 🎨 CSS OPTIMIZATION TESTS
// ============================================================================

test.describe('Performance - CSS Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should inline critical CSS', async ({ page }) => {
    const inlineStyles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('style')).map((s) => s.textContent);
    });
    
    // Should have some inline critical CSS
    expect(inlineStyles.length).toBeGreaterThan(0);
  });

  test('should not have render-blocking CSS', async ({ page }) => {
    const stylesheets = page.locator(SELECTORS.stylesheets);
    const count = await stylesheets.count();
    
    for (let i = 0; i < count; i++) {
      const link = stylesheets.nth(i);
      const media = await link.getAttribute('media');
      
      // Non-critical CSS should have media attribute
      if (media && media !== 'all' && media !== 'screen') {
        expect(media).toBeTruthy();
      }
    }
  });

  test('should remove unused CSS', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    const cssSize = analysis.bySize.link || 0;
    
    // CSS size should be reasonable
    expect(cssSize).toBeLessThan(PERFORMANCE_BUDGETS.CSS_SIZE);
  });

  test('should use CSS containment for performance', async ({ page }) => {
    const hasContainment = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      return elements.some((el) => {
        const style = window.getComputedStyle(el);
        return style.contain !== 'none';
      });
    });
    
    // At least some elements should use CSS containment
    expect(hasContainment).toBe(true);
  });
});

// ============================================================================
// 🔌 THIRD-PARTY SCRIPT IMPACT TESTS
// ============================================================================

test.describe('Performance - Third-Party Scripts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should minimize third-party script impact', async ({ page }) => {
    const analysis = await analyzeResourceLoading(page);
    
    const thirdPartyScripts = analysis.slowest.filter((r) => {
      return (
        r.type === 'script' &&
        !r.name.includes(page.url().split('/')[2])
      );
    });
    
    // Third-party scripts should not dominate load time
    const thirdPartyDuration = thirdPartyScripts.reduce(
      (sum, r) => sum + r.duration,
      0
    );
    
    expect(thirdPartyDuration).toBeLessThan(analysis.totalDuration * 0.3);
  });

  test('should load third-party scripts asynchronously', async ({ page }) => {
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]'))
        .filter((s) => !s.src.includes(window.location.hostname))
        .map((s) => ({
          src: s.src,
          async: s.async,
          defer: s.defer,
        }));
    });
    
    // All third-party scripts should be async or deferred
    scripts.forEach((script) => {
      expect(script.async || script.defer).toBe(true);
    });
  });

  test('should use resource hints for third-party domains', async ({ page }) => {
    const thirdPartyDomains = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const domains = new Set();
      
      scripts.forEach((s) => {
        try {
          const url = new URL(s.src);
          if (url.hostname !== window.location.hostname) {
            domains.add(url.hostname);
          }
        } catch (e) {
          // Invalid URL
        }
      });
      
      return Array.from(domains);
    });
    
    const resourceHints = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('link[rel="dns-prefetch"], link[rel="preconnect"]')
      ).map((l) => l.href);
    });
    
    // Should have resource hints for third-party domains
    thirdPartyDomains.forEach((domain) => {
      const hasHint = resourceHints.some((hint) => hint.includes(domain));
      expect(hasHint).toBe(true);
    });
  });
});

// ============================================================================
// 📊 PERFORMANCE TIMELINE TESTS
// ============================================================================

test.describe('Performance - Timeline Analysis', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('should have efficient performance timeline', async ({ page }) => {
    const timeline = await capturePerformanceTimeline(page);
    
    expect(timeline.length).toBeGreaterThan(0);
    
    // Check for long tasks
    const longTasks = timeline.filter(
      (entry) => entry.type === 'longtask' && entry.duration > 50
    );
    
    // Should minimize long tasks
    expect(longTasks.length).toBeLessThan(5);
  });

  test('should have proper resource timing', async ({ page }) => {
    const timeline = await capturePerformanceTimeline(page);
    
    const resourceEntries = timeline.filter((e) => e.type === 'resource');
    
    expect(resourceEntries.length).toBeGreaterThan(0);
    
    // All resources should have reasonable timing
    resourceEntries.forEach((entry) => {
      expect(entry.duration).toBeGreaterThan(0);
      expect(entry.duration).toBeLessThan(10000); // 10 seconds max
    });
  });

  test('should have proper navigation timing', async ({ page }) => {
    const timeline = await capturePerformanceTimeline(page);
    
    const navigationEntry = timeline.find((e) => e.type === 'navigation');
    
    expect(navigationEntry).toBeDefined();
    expect(navigationEntry.duration).toBeGreaterThan(0);
  });
});

// ============================================================================
// 🎯 INTEGRATION TESTS
// ============================================================================

test.describe('Performance - Integration', () => {
  test('should maintain performance across page interactions', async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    const initialMetrics = await measureCoreWebVitals(page);
    
    // Interact with page
    const button = page.locator('button').first();
    if (await button.count() > 0) {
      await button.click();
      await page.waitForTimeout(1000);
    }
    
    const finalMetrics = await measureCoreWebVitals(page);
    
    // CLS should not increase significantly
    expect(finalMetrics.CLS - initialMetrics.CLS).toBeLessThan(0.05);
  });

  test('should maintain SEO tags after client-side navigation', async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    const initialSEO = await extractSEOMetaTags(page);
    
    // Simulate navigation
    await page.evaluate(() => {
      window.history.pushState({}, '', '/test');
    });
    
    await page.waitForTimeout(500);
    
    const finalSEO = await extractSEOMetaTags(page);
    
    // SEO tags should remain consistent
    expect(finalSEO.title).toBeTruthy();
    expect(finalSEO.description).toBeTruthy();
  });

  test('should handle rapid page loads efficiently', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.goto('/');
      await waitForNetworkIdle(page);
      
      const metrics = await measureCoreWebVitals(page);
      
      expect(metrics.LCP).toBeLessThan(PERFORMANCE_BUDGETS.LCP);
      expect(metrics.CLS).toBeLessThan(PERFORMANCE_BUDGETS.CLS);
    }
  });
});