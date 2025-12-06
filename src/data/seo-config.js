/**
 * SEO Configuration Module
 * Centralized configuration for meta tags, structured data schemas, and SEO content
 * Provides comprehensive SEO settings including Open Graph and Twitter Card configurations
 * 
 * @module data/seo-config
 * @generated-from: task-id:TASK-008 type:performance
 * @modifies: src/components/seo-head.js
 * @dependencies: []
 */

/**
 * Site-wide SEO configuration
 * @type {Object}
 */
export const SITE_CONFIG = Object.freeze({
  siteName: 'AI-Powered Software Development Platform',
  siteUrl: 'https://example.com',
  defaultTitle: 'AI-Powered Software Development Platform | Transform Your Development Workflow',
  titleTemplate: '%s | AI-Powered Software Development Platform',
  titleSeparator: '|',
  defaultDescription: 'Accelerate software development with AI-powered tools. Build faster, ship smarter, and scale effortlessly with our intelligent development platform.',
  defaultKeywords: [
    'AI software development',
    'development platform',
    'AI coding tools',
    'software automation',
    'developer tools',
    'intelligent IDE',
    'code generation',
    'automated testing',
    'DevOps automation',
    'continuous integration',
  ],
  author: 'AI-Powered Software Development Platform',
  publisher: 'AI-Powered Software Development Platform',
  copyright: `© ${new Date().getFullYear()} AI-Powered Software Development Platform. All rights reserved.`,
  locale: 'en_US',
  alternateLocales: ['en_GB', 'en_CA', 'en_AU'],
  type: 'website',
  twitterHandle: '@aidevplatform',
  facebookAppId: null,
  verificationCodes: {
    google: null,
    bing: null,
    yandex: null,
    pinterest: null,
  },
});

/**
 * Image configuration for social sharing
 * @type {Object}
 */
export const IMAGE_CONFIG = Object.freeze({
  defaultImage: '/og-image.jpg',
  defaultImageAlt: 'AI-Powered Software Development Platform - Transform Your Development Workflow',
  defaultImageWidth: 1200,
  defaultImageHeight: 630,
  defaultImageType: 'image/jpeg',
  twitterCardType: 'summary_large_image',
  imageFormats: {
    og: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 600 },
    linkedin: { width: 1200, height: 627 },
  },
});

/**
 * Theme and branding configuration
 * @type {Object}
 */
export const THEME_CONFIG = Object.freeze({
  themeColor: {
    light: '#007bff',
    dark: '#1a1a2e',
  },
  brandColors: {
    primary: '#007bff',
    secondary: '#6c757d',
    accent: '#28a745',
  },
  appleTouchIcon: '/apple-touch-icon.png',
  favicon: {
    ico: '/favicon.ico',
    svg: '/favicon.svg',
    png16: '/favicon-16x16.png',
    png32: '/favicon-32x32.png',
    png192: '/android-chrome-192x192.png',
    png512: '/android-chrome-512x512.png',
  },
  manifest: '/site.webmanifest',
});

/**
 * Robots and crawling configuration
 * @type {Object}
 */
export const ROBOTS_CONFIG = Object.freeze({
  default: 'index, follow',
  noindex: 'noindex, follow',
  nofollow: 'index, nofollow',
  none: 'noindex, nofollow',
  maxSnippet: 160,
  maxImagePreview: 'large',
  maxVideoPreview: -1,
  crawlDelay: null,
  sitemapUrl: '/sitemap.xml',
  robotsTxtUrl: '/robots.txt',
});

/**
 * Structured data organization schema
 * @type {Object}
 */
export const ORGANIZATION_SCHEMA = Object.freeze({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AI-Powered Software Development Platform',
  url: 'https://example.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://example.com/logo.png',
    width: 250,
    height: 60,
  },
  description: 'Leading AI-powered software development platform helping teams build faster and smarter.',
  foundingDate: '2023',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@example.com',
    availableLanguage: ['English'],
  },
  sameAs: [
    'https://twitter.com/aidevplatform',
    'https://linkedin.com/company/aidevplatform',
    'https://github.com/aidevplatform',
  ],
});

/**
 * Structured data website schema
 * @type {Object}
 */
export const WEBSITE_SCHEMA = Object.freeze({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI-Powered Software Development Platform',
  url: 'https://example.com',
  description: 'Accelerate software development with AI-powered tools.',
  publisher: {
    '@type': 'Organization',
    name: 'AI-Powered Software Development Platform',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://example.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

/**
 * Software application structured data
 * @type {Object}
 */
export const SOFTWARE_APPLICATION_SCHEMA = Object.freeze({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI-Powered Software Development Platform',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
  author: {
    '@type': 'Organization',
    name: 'AI-Powered Software Development Platform',
    url: 'https://example.com',
  },
  datePublished: '2023-01-01',
  description: 'AI-powered development platform with intelligent code completion, automated testing, and smart refactoring.',
  screenshot: 'https://example.com/screenshot.jpg',
  softwareVersion: '2.0',
  featureList: [
    'AI-powered code completion',
    'Automated testing',
    'Smart refactoring',
    'Real-time collaboration',
    'Performance optimization',
  ],
});

/**
 * Page-specific SEO configurations
 * @type {Object}
 */
export const PAGE_CONFIGS = Object.freeze({
  home: {
    title: 'AI-Powered Software Development Platform | Transform Your Development Workflow',
    description: 'Accelerate software development with AI-powered tools. Build faster, ship smarter, and scale effortlessly with our intelligent development platform.',
    keywords: [
      'AI software development',
      'development platform',
      'AI coding tools',
      'software automation',
      'developer tools',
    ],
    path: '',
    type: 'website',
    priority: 1.0,
    changefreq: 'weekly',
    image: '/og-image-home.jpg',
    imageAlt: 'AI-Powered Software Development Platform Homepage',
    structuredData: {
      '@type': 'WebPage',
      mainEntity: SOFTWARE_APPLICATION_SCHEMA,
    },
  },
  features: {
    title: 'Features - AI Development Tools',
    description: 'Explore powerful AI-driven features including intelligent code completion, automated testing, and smart refactoring tools.',
    keywords: [
      'AI features',
      'code completion',
      'automated testing',
      'smart refactoring',
      'development tools',
    ],
    path: 'features',
    type: 'website',
    priority: 0.9,
    changefreq: 'monthly',
    image: '/og-image-features.jpg',
    imageAlt: 'AI Development Platform Features',
    structuredData: {
      '@type': 'WebPage',
      about: {
        '@type': 'Thing',
        name: 'Software Development Features',
        description: 'AI-powered development tools and features',
      },
    },
  },
  useCases: {
    title: 'Use Cases - Real-World Applications',
    description: 'Discover how teams use our AI platform to accelerate development, improve code quality, and scale efficiently.',
    keywords: [
      'use cases',
      'success stories',
      'development workflows',
      'team productivity',
    ],
    path: 'use-cases',
    type: 'website',
    priority: 0.8,
    changefreq: 'monthly',
    image: '/og-image-use-cases.jpg',
    imageAlt: 'AI Platform Use Cases and Success Stories',
    structuredData: {
      '@type': 'CollectionPage',
      about: {
        '@type': 'Thing',
        name: 'Use Cases',
        description: 'Real-world applications and success stories',
      },
    },
  },
  demo: {
    title: 'Interactive Demo - See AI in Action',
    description: 'Experience our AI-powered development platform with an interactive demo. See how AI transforms your workflow.',
    keywords: [
      'demo',
      'interactive demo',
      'AI demonstration',
      'platform preview',
    ],
    path: 'demo',
    type: 'website',
    priority: 0.9,
    changefreq: 'monthly',
    image: '/og-image-demo.jpg',
    imageAlt: 'Interactive Platform Demo',
    structuredData: {
      '@type': 'WebPage',
      about: {
        '@type': 'SoftwareApplication',
        name: 'Platform Demo',
        description: 'Interactive demonstration of AI development tools',
      },
    },
  },
  pricing: {
    title: 'Pricing - Plans & Features',
    description: 'Choose the perfect plan for your team. Flexible pricing with powerful features for teams of all sizes.',
    keywords: [
      'pricing',
      'plans',
      'subscription',
      'enterprise',
    ],
    path: 'pricing',
    type: 'website',
    priority: 0.9,
    changefreq: 'monthly',
    image: '/og-image-pricing.jpg',
    imageAlt: 'Platform Pricing Plans',
    structuredData: {
      '@type': 'WebPage',
      about: {
        '@type': 'Offer',
        name: 'Pricing Plans',
        description: 'Flexible pricing options for all team sizes',
      },
    },
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description: 'Have questions? Contact our team to learn how our AI platform can transform your development workflow.',
    keywords: [
      'contact',
      'support',
      'sales',
      'get in touch',
    ],
    path: 'contact',
    type: 'website',
    priority: 0.7,
    changefreq: 'yearly',
    image: '/og-image-contact.jpg',
    imageAlt: 'Contact AI Development Platform',
    structuredData: {
      '@type': 'ContactPage',
      mainEntity: {
        '@type': 'Organization',
        name: 'AI-Powered Software Development Platform',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'support@example.com',
        },
      },
    },
  },
  blog: {
    title: 'Blog - Insights & Updates',
    description: 'Stay updated with the latest insights, tutorials, and news about AI-powered software development.',
    keywords: [
      'blog',
      'articles',
      'tutorials',
      'development insights',
    ],
    path: 'blog',
    type: 'website',
    priority: 0.8,
    changefreq: 'daily',
    image: '/og-image-blog.jpg',
    imageAlt: 'Development Platform Blog',
    structuredData: {
      '@type': 'Blog',
      name: 'AI Development Platform Blog',
      description: 'Insights and updates on AI-powered development',
    },
  },
  docs: {
    title: 'Documentation - Developer Guide',
    description: 'Comprehensive documentation and guides for getting started with our AI-powered development platform.',
    keywords: [
      'documentation',
      'developer guide',
      'API reference',
      'tutorials',
    ],
    path: 'docs',
    type: 'website',
    priority: 0.8,
    changefreq: 'weekly',
    image: '/og-image-docs.jpg',
    imageAlt: 'Platform Documentation',
    structuredData: {
      '@type': 'TechArticle',
      about: {
        '@type': 'SoftwareApplication',
        name: 'Platform Documentation',
        description: 'Technical documentation and guides',
      },
    },
  },
});

/**
 * Open Graph configuration templates
 * @type {Object}
 */
export const OPEN_GRAPH_CONFIG = Object.freeze({
  siteName: SITE_CONFIG.siteName,
  locale: SITE_CONFIG.locale,
  type: 'website',
  imageWidth: IMAGE_CONFIG.defaultImageWidth,
  imageHeight: IMAGE_CONFIG.defaultImageHeight,
  imageType: IMAGE_CONFIG.defaultImageType,
  determiner: 'auto',
  richAttachment: true,
  videoConfig: {
    type: 'video.other',
    width: 1280,
    height: 720,
    secureUrl: true,
  },
  audioConfig: {
    type: 'music.song',
    secureUrl: true,
  },
});

/**
 * Twitter Card configuration templates
 * @type {Object}
 */
export const TWITTER_CARD_CONFIG = Object.freeze({
  card: IMAGE_CONFIG.twitterCardType,
  site: SITE_CONFIG.twitterHandle,
  creator: SITE_CONFIG.twitterHandle,
  imageWidth: IMAGE_CONFIG.imageFormats.twitter.width,
  imageHeight: IMAGE_CONFIG.imageFormats.twitter.height,
  playerConfig: {
    width: 1280,
    height: 720,
  },
});

/**
 * Breadcrumb configurations for different pages
 * @type {Object}
 */
export const BREADCRUMB_CONFIGS = Object.freeze({
  features: [
    { name: 'Home', path: '' },
    { name: 'Features', path: 'features' },
  ],
  useCases: [
    { name: 'Home', path: '' },
    { name: 'Use Cases', path: 'use-cases' },
  ],
  demo: [
    { name: 'Home', path: '' },
    { name: 'Demo', path: 'demo' },
  ],
  pricing: [
    { name: 'Home', path: '' },
    { name: 'Pricing', path: 'pricing' },
  ],
  contact: [
    { name: 'Home', path: '' },
    { name: 'Contact', path: 'contact' },
  ],
  blog: [
    { name: 'Home', path: '' },
    { name: 'Blog', path: 'blog' },
  ],
  docs: [
    { name: 'Home', path: '' },
    { name: 'Documentation', path: 'docs' },
  ],
});

/**
 * FAQ structured data for common questions
 * @type {Object}
 */
export const FAQ_SCHEMA = Object.freeze({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is AI-Powered Software Development Platform?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI-Powered Software Development Platform is an intelligent development environment that uses artificial intelligence to accelerate software development through features like code completion, automated testing, and smart refactoring.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does AI improve development workflow?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI analyzes your codebase and development patterns to provide intelligent suggestions, automate repetitive tasks, catch bugs early, and optimize code performance, resulting in faster development cycles and higher code quality.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the platform suitable for teams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our platform is designed for teams of all sizes with features like real-time collaboration, code review automation, and team analytics. We offer flexible pricing plans for individuals, teams, and enterprises.',
      },
    },
    {
      '@type': 'Question',
      name: 'What programming languages are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support all major programming languages including JavaScript, TypeScript, Python, Java, C++, Go, Rust, and many more. Our AI models are continuously trained on diverse codebases.',
      },
    },
  ],
});

/**
 * Article structured data template
 * @type {Function}
 */
export const createArticleSchema = (article) => {
  return Object.freeze({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || IMAGE_CONFIG.defaultImage,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.siteName,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_SCHEMA.logo.url,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.siteUrl}/${article.path}`,
    },
  });
};

/**
 * Product structured data template
 * @type {Function}
 */
export const createProductSchema = (product) => {
  return Object.freeze({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.siteName,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: product.availability || 'https://schema.org/InStock',
      url: `${SITE_CONFIG.siteUrl}/${product.path}`,
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      ratingCount: product.rating.count,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
  });
};

/**
 * Video structured data template
 * @type {Function}
 */
export const createVideoSchema = (video) => {
  return Object.freeze({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.url,
    embedUrl: video.embedUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.siteName,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_SCHEMA.logo.url,
      },
    },
  });
};

/**
 * Sitemap configuration
 * @type {Object}
 */
export const SITEMAP_CONFIG = Object.freeze({
  baseUrl: SITE_CONFIG.siteUrl,
  defaultChangefreq: 'monthly',
  defaultPriority: 0.5,
  excludePaths: [
    '/admin',
    '/api',
    '/private',
    '/_next',
    '/static',
  ],
  includeImages: true,
  includeVideos: true,
  lastmod: true,
  alternateRefs: true,
});

/**
 * Performance and optimization hints
 * @type {Object}
 */
export const PERFORMANCE_HINTS = Object.freeze({
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
  dnsPrefetch: [
    'https://www.google-analytics.com',
    'https://cdn.example.com',
  ],
  preload: [
    { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  ],
  prefetch: [
    { href: '/features', as: 'document' },
    { href: '/pricing', as: 'document' },
  ],
});

/**
 * Validation rules for SEO content
 * @type {Object}
 */
export const VALIDATION_RULES = Object.freeze({
  title: {
    minLength: 10,
    maxLength: 60,
    optimalLength: 50,
  },
  description: {
    minLength: 50,
    maxLength: 160,
    optimalLength: 155,
  },
  keywords: {
    minCount: 3,
    maxCount: 10,
    optimalCount: 5,
  },
  image: {
    minWidth: 1200,
    minHeight: 630,
    aspectRatio: 1.91,
    maxFileSize: 5242880,
  },
  url: {
    maxLength: 2048,
    allowedProtocols: ['https', 'http'],
  },
});

/**
 * Gets page configuration by page identifier
 * @param {string} pageId - Page identifier
 * @returns {Object} Page configuration
 */
export const getPageConfig = (pageId) => {
  if (typeof pageId !== 'string' || !pageId) {
    return PAGE_CONFIGS.home;
  }
  
  return PAGE_CONFIGS[pageId] || PAGE_CONFIGS.home;
};

/**
 * Gets all available page identifiers
 * @returns {string[]} Array of page identifiers
 */
export const getAvailablePages = () => {
  return Object.keys(PAGE_CONFIGS);
};

/**
 * Validates SEO configuration
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result
 */
export const validateSEOConfig = (config) => {
  const errors = [];
  const warnings = [];
  
  if (!config.title || config.title.length < VALIDATION_RULES.title.minLength) {
    errors.push(`Title must be at least ${VALIDATION_RULES.title.minLength} characters`);
  }
  
  if (config.title && config.title.length > VALIDATION_RULES.title.maxLength) {
    warnings.push(`Title should be under ${VALIDATION_RULES.title.maxLength} characters for optimal display`);
  }
  
  if (!config.description || config.description.length < VALIDATION_RULES.description.minLength) {
    errors.push(`Description must be at least ${VALIDATION_RULES.description.minLength} characters`);
  }
  
  if (config.description && config.description.length > VALIDATION_RULES.description.maxLength) {
    warnings.push(`Description should be under ${VALIDATION_RULES.description.maxLength} characters for optimal display`);
  }
  
  if (!config.keywords || (Array.isArray(config.keywords) && config.keywords.length < VALIDATION_RULES.keywords.minCount)) {
    warnings.push(`At least ${VALIDATION_RULES.keywords.minCount} keywords recommended for better SEO`);
  }
  
  if (config.keywords && Array.isArray(config.keywords) && config.keywords.length > VALIDATION_RULES.keywords.maxCount) {
    warnings.push(`Consider reducing keywords to ${VALIDATION_RULES.keywords.maxCount} for better focus`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Merges custom configuration with defaults
 * @param {Object} customConfig - Custom configuration
 * @param {Object} defaultConfig - Default configuration
 * @returns {Object} Merged configuration
 */
export const mergeConfig = (customConfig, defaultConfig) => {
  if (!customConfig || typeof customConfig !== 'object') {
    return { ...defaultConfig };
  }
  
  return {
    ...defaultConfig,
    ...customConfig,
    keywords: customConfig.keywords || defaultConfig.keywords,
    structuredData: customConfig.structuredData 
      ? { ...defaultConfig.structuredData, ...customConfig.structuredData }
      : defaultConfig.structuredData,
  };
};

export default {
  SITE_CONFIG,
  IMAGE_CONFIG,
  THEME_CONFIG,
  ROBOTS_CONFIG,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
  SOFTWARE_APPLICATION_SCHEMA,
  PAGE_CONFIGS,
  OPEN_GRAPH_CONFIG,
  TWITTER_CARD_CONFIG,
  BREADCRUMB_CONFIGS,
  FAQ_SCHEMA,
  SITEMAP_CONFIG,
  PERFORMANCE_HINTS,
  VALIDATION_RULES,
  createArticleSchema,
  createProductSchema,
  createVideoSchema,
  getPageConfig,
  getAvailablePages,
  validateSEOConfig,
  mergeConfig,
};