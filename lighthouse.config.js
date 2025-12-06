/**
 * Lighthouse CI Configuration
 * 
 * Production-grade configuration for Lighthouse CI performance testing
 * with strict thresholds for Core Web Vitals and performance metrics.
 * 
 * @generated-from: task-id:TASK-008 type:performance
 * @modifies: none (new file)
 * @dependencies: ["@lhci/cli"]
 */

export default {
  ci: {
    collect: {
      // Number of runs to perform for each URL to ensure consistent results
      numberOfRuns: 3,
      
      // URLs to test - adjust based on deployment environment
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/index.html'
      ],
      
      // Start local server for testing
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      
      // Lighthouse settings
      settings: {
        // Use mobile emulation for realistic performance testing
        preset: 'desktop',
        
        // Throttling settings for consistent results
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        
        // Screen emulation
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        },
        
        // Form factor
        formFactor: 'desktop',
        
        // Only run performance audits for faster execution
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        
        // Skip certain audits that may not be relevant
        skipAudits: [
          'uses-http2',
          'redirects-http'
        ]
      }
    },
    
    assert: {
      // Assertion level - error will fail the build
      preset: 'lighthouse:no-pwa',
      
      assertions: {
        // Performance Score - Must exceed 90
        'categories:performance': ['error', { minScore: 0.9 }],
        
        // Accessibility Score
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        
        // Best Practices Score
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        
        // SEO Score
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // Core Web Vitals - Critical metrics
        
        // First Contentful Paint - Must be under 1.5s
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        
        // Largest Contentful Paint - Must be under 2.5s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        
        // Cumulative Layout Shift - Must be under 0.1
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Total Blocking Time - Should be minimal
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Speed Index - Overall page load speed
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        
        // Time to Interactive
        'interactive': ['warn', { maxNumericValue: 3800 }],
        
        // Resource optimization audits
        
        // Modern image formats
        'modern-image-formats': ['warn', { maxLength: 0 }],
        
        // Efficient image encoding
        'uses-optimized-images': ['warn', { maxLength: 0 }],
        
        // Properly sized images
        'uses-responsive-images': ['warn', { maxLength: 0 }],
        
        // Lazy loading images
        'offscreen-images': ['warn', { maxLength: 0 }],
        
        // Text compression
        'uses-text-compression': ['warn', { maxLength: 0 }],
        
        // Minified CSS
        'unminified-css': ['warn', { maxLength: 0 }],
        
        // Minified JavaScript
        'unminified-javascript': ['warn', { maxLength: 0 }],
        
        // Unused CSS
        'unused-css-rules': ['warn', { maxLength: 0 }],
        
        // Unused JavaScript
        'unused-javascript': ['warn', { maxLength: 0 }],
        
        // Render blocking resources
        'render-blocking-resources': ['warn', { maxLength: 0 }],
        
        // Efficient cache policy
        'uses-long-cache-ttl': ['warn', { maxLength: 0 }],
        
        // Font display optimization
        'font-display': ['warn', { maxLength: 0 }],
        
        // SEO audits
        
        // Meta description
        'meta-description': 'error',
        
        // Document title
        'document-title': 'error',
        
        // Viewport meta tag
        'viewport': 'error',
        
        // Crawlable links
        'crawlable-anchors': 'warn',
        
        // Valid robots.txt
        'robots-txt': 'warn',
        
        // Structured data
        'structured-data': 'warn',
        
        // Accessibility audits
        
        // Image alt text
        'image-alt': 'warn',
        
        // ARIA attributes
        'aria-valid-attr': 'error',
        'aria-valid-attr-value': 'error',
        
        // Color contrast
        'color-contrast': 'warn',
        
        // Form labels
        'label': 'warn',
        
        // Link names
        'link-name': 'warn',
        
        // Best practices
        
        // HTTPS usage
        'is-on-https': 'error',
        
        // No browser errors
        'errors-in-console': 'warn',
        
        // Valid source maps
        'valid-source-maps': 'warn',
        
        // No vulnerable libraries
        'no-vulnerable-libraries': 'error'
      }
    },
    
    upload: {
      // Configure upload target if using Lighthouse CI server
      target: 'temporary-public-storage',
      
      // Alternative: filesystem storage for local development
      // target: 'filesystem',
      // outputDir: './lighthouse-reports',
      
      // GitHub status checks (if using GitHub Actions)
      // githubToken: process.env.LHCI_GITHUB_TOKEN,
      // githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN
    },
    
    server: {
      // Lighthouse CI server configuration (if self-hosting)
      // baseUrl: process.env.LHCI_SERVER_BASE_URL,
      // token: process.env.LHCI_SERVER_TOKEN
    }
  }
};