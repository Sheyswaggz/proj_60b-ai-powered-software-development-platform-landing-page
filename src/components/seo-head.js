/**
 * SEO Head Component
 * Manages meta tags, Open Graph tags, Twitter cards, and JSON-LD structured data
 * Provides dynamic content generation for different pages with comprehensive SEO optimization
 * 
 * @module components/seo-head
 * @generated-from: task-id:TASK-008 type:performance
 * @modifies: index.html meta tags
 * @dependencies: []
 */

/**
 * Default SEO configuration
 * @type {Object}
 */
const DEFAULT_SEO_CONFIG = Object.freeze({
  siteName: 'AI-Powered Software Development Platform',
  siteUrl: 'https://example.com',
  defaultTitle: 'AI-Powered Software Development Platform | Transform Your Development Workflow',
  titleTemplate: '%s | AI-Powered Software Development Platform',
  defaultDescription: 'Accelerate software development with AI-powered tools. Build faster, ship smarter, and scale effortlessly with our intelligent development platform.',
  defaultKeywords: ['AI software development', 'development platform', 'AI coding tools', 'software automation', 'developer tools'],
  author: 'AI-Powered Software Development Platform',
  twitterHandle: '@aidevplatform',
  defaultImage: '/og-image.jpg',
  defaultImageAlt: 'AI-Powered Software Development Platform',
  themeColor: {
    light: '#007bff',
    dark: '#1a1a2e',
  },
  locale: 'en_US',
  type: 'website',
});

/**
 * Page-specific SEO configurations
 * @type {Object}
 */
const PAGE_CONFIGS = Object.freeze({
  home: {
    title: 'AI-Powered Software Development Platform | Transform Your Development Workflow',
    description: 'Accelerate software development with AI-powered tools. Build faster, ship smarter, and scale effortlessly with our intelligent development platform.',
    keywords: ['AI software development', 'development platform', 'AI coding tools', 'software automation', 'developer tools'],
    type: 'website',
    structuredData: {
      '@type': 'SoftwareApplication',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
    },
  },
  features: {
    title: 'Features - AI Development Tools',
    description: 'Explore powerful AI-driven features including intelligent code completion, automated testing, and smart refactoring tools.',
    keywords: ['AI features', 'code completion', 'automated testing', 'smart refactoring', 'development tools'],
    type: 'website',
  },
  useCases: {
    title: 'Use Cases - Real-World Applications',
    description: 'Discover how teams use our AI platform to accelerate development, improve code quality, and scale efficiently.',
    keywords: ['use cases', 'success stories', 'development workflows', 'team productivity'],
    type: 'website',
  },
  demo: {
    title: 'Interactive Demo - See AI in Action',
    description: 'Experience our AI-powered development platform with an interactive demo. See how AI transforms your workflow.',
    keywords: ['demo', 'interactive demo', 'AI demonstration', 'platform preview'],
    type: 'website',
  },
  pricing: {
    title: 'Pricing - Plans & Features',
    description: 'Choose the perfect plan for your team. Flexible pricing with powerful features for teams of all sizes.',
    keywords: ['pricing', 'plans', 'subscription', 'enterprise'],
    type: 'website',
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description: 'Have questions? Contact our team to learn how our AI platform can transform your development workflow.',
    keywords: ['contact', 'support', 'sales', 'get in touch'],
    type: 'website',
  },
});

/**
 * Sanitizes text content for meta tags
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
const sanitizeMetaContent = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/[<>]/g, '')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
};

/**
 * Generates canonical URL
 * @param {string} path - Page path
 * @param {string} baseUrl - Base URL
 * @returns {string} Canonical URL
 */
const generateCanonicalUrl = (path, baseUrl) => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
};

/**
 * Creates meta tag element
 * @param {string} name - Meta name or property
 * @param {string} content - Meta content
 * @param {boolean} isProperty - Whether to use property instead of name
 * @returns {HTMLMetaElement} Meta element
 */
const createMetaTag = (name, content, isProperty = false) => {
  const meta = document.createElement('meta');
  
  if (isProperty) {
    meta.setAttribute('property', name);
  } else {
    meta.setAttribute('name', name);
  }
  
  meta.setAttribute('content', sanitizeMetaContent(content));
  return meta;
};

/**
 * Creates link tag element
 * @param {string} rel - Link relationship
 * @param {string} href - Link href
 * @param {Object} attributes - Additional attributes
 * @returns {HTMLLinkElement} Link element
 */
const createLinkTag = (rel, href, attributes = {}) => {
  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', href);
  
  Object.entries(attributes).forEach(([key, value]) => {
    link.setAttribute(key, value);
  });
  
  return link;
};

/**
 * Generates JSON-LD structured data
 * @param {Object} config - SEO configuration
 * @param {Object} pageConfig - Page-specific configuration
 * @returns {Object} Structured data object
 */
const generateStructuredData = (config, pageConfig) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': pageConfig.structuredData?.['@type'] || 'WebPage',
    name: pageConfig.title || config.defaultTitle,
    description: pageConfig.description || config.defaultDescription,
    url: generateCanonicalUrl(pageConfig.path || '', config.siteUrl),
    inLanguage: config.locale.replace('_', '-'),
  };

  if (pageConfig.structuredData?.['@type'] === 'SoftwareApplication') {
    return {
      ...baseData,
      applicationCategory: pageConfig.structuredData.applicationCategory,
      operatingSystem: pageConfig.structuredData.operatingSystem,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
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
        name: config.siteName,
        url: config.siteUrl,
      },
    };
  }

  if (pageConfig.breadcrumbs) {
    baseData.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: pageConfig.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: generateCanonicalUrl(crumb.path, config.siteUrl),
      })),
    };
  }

  return baseData;
};

/**
 * Updates or creates meta tag
 * @param {string} selector - Meta tag selector
 * @param {string} content - Meta content
 * @param {boolean} isProperty - Whether to use property instead of name
 */
const updateMetaTag = (selector, content, isProperty = false) => {
  const attribute = isProperty ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attribute}="${selector}"]`);
  
  if (!meta) {
    meta = createMetaTag(selector, content, isProperty);
    document.head.appendChild(meta);
  } else {
    meta.setAttribute('content', sanitizeMetaContent(content));
  }
};

/**
 * Updates or creates link tag
 * @param {string} rel - Link relationship
 * @param {string} href - Link href
 * @param {Object} attributes - Additional attributes
 */
const updateLinkTag = (rel, href, attributes = {}) => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  
  if (!link) {
    link = createLinkTag(rel, href, attributes);
    document.head.appendChild(link);
  } else {
    link.setAttribute('href', href);
    Object.entries(attributes).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
  }
};

/**
 * Updates structured data script
 * @param {Object} structuredData - Structured data object
 */
const updateStructuredData = (structuredData) => {
  let script = document.querySelector('script[type="application/ld+json"]');
  
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(structuredData, null, 2);
};

/**
 * Updates page title
 * @param {string} title - Page title
 * @param {string} template - Title template
 */
const updateTitle = (title, template) => {
  const formattedTitle = template && !title.includes('|') 
    ? template.replace('%s', title)
    : title;
  
  document.title = sanitizeMetaContent(formattedTitle);
};

/**
 * Updates basic meta tags
 * @param {Object} config - SEO configuration
 * @param {Object} pageConfig - Page-specific configuration
 */
const updateBasicMetaTags = (config, pageConfig) => {
  const title = pageConfig.title || config.defaultTitle;
  const description = pageConfig.description || config.defaultDescription;
  const keywords = pageConfig.keywords || config.defaultKeywords;
  
  updateTitle(title, config.titleTemplate);
  updateMetaTag('description', description);
  updateMetaTag('keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
  updateMetaTag('author', config.author);
  updateMetaTag('robots', pageConfig.robots || 'index, follow');
};

/**
 * Updates Open Graph meta tags
 * @param {Object} config - SEO configuration
 * @param {Object} pageConfig - Page-specific configuration
 */
const updateOpenGraphTags = (config, pageConfig) => {
  const title = pageConfig.title || config.defaultTitle;
  const description = pageConfig.description || config.defaultDescription;
  const image = pageConfig.image || config.defaultImage;
  const imageAlt = pageConfig.imageAlt || config.defaultImageAlt;
  const url = generateCanonicalUrl(pageConfig.path || '', config.siteUrl);
  const type = pageConfig.type || config.type;
  
  updateMetaTag('og:title', title, true);
  updateMetaTag('og:description', description, true);
  updateMetaTag('og:type', type, true);
  updateMetaTag('og:url', url, true);
  updateMetaTag('og:image', `${config.siteUrl}${image}`, true);
  updateMetaTag('og:image:alt', imageAlt, true);
  updateMetaTag('og:site_name', config.siteName, true);
  updateMetaTag('og:locale', config.locale, true);
  
  if (pageConfig.imageWidth) {
    updateMetaTag('og:image:width', pageConfig.imageWidth.toString(), true);
  }
  
  if (pageConfig.imageHeight) {
    updateMetaTag('og:image:height', pageConfig.imageHeight.toString(), true);
  }
};

/**
 * Updates Twitter Card meta tags
 * @param {Object} config - SEO configuration
 * @param {Object} pageConfig - Page-specific configuration
 */
const updateTwitterCardTags = (config, pageConfig) => {
  const title = pageConfig.title || config.defaultTitle;
  const description = pageConfig.description || config.defaultDescription;
  const image = pageConfig.image || config.defaultImage;
  const imageAlt = pageConfig.imageAlt || config.defaultImageAlt;
  const cardType = pageConfig.twitterCard || 'summary_large_image';
  
  updateMetaTag('twitter:card', cardType);
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', `${config.siteUrl}${image}`);
  updateMetaTag('twitter:image:alt', imageAlt);
  
  if (config.twitterHandle) {
    updateMetaTag('twitter:site', config.twitterHandle);
    updateMetaTag('twitter:creator', config.twitterHandle);
  }
};

/**
 * Updates canonical and alternate links
 * @param {Object} config - SEO configuration
 * @param {Object} pageConfig - Page-specific configuration
 */
const updateCanonicalLinks = (config, pageConfig) => {
  const canonicalUrl = generateCanonicalUrl(pageConfig.path || '', config.siteUrl);
  updateLinkTag('canonical', canonicalUrl);
  
  if (pageConfig.alternates) {
    pageConfig.alternates.forEach((alternate) => {
      updateLinkTag('alternate', alternate.href, {
        hreflang: alternate.hreflang,
      });
    });
  }
};

/**
 * Updates theme color meta tags
 * @param {Object} config - SEO configuration
 */
const updateThemeColor = (config) => {
  updateMetaTag('theme-color', config.themeColor.light, false);
  
  const darkMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
  if (darkMeta) {
    darkMeta.setAttribute('content', config.themeColor.dark);
  } else {
    const meta = createMetaTag('theme-color', config.themeColor.dark);
    meta.setAttribute('media', '(prefers-color-scheme: dark)');
    document.head.appendChild(meta);
  }
};

/**
 * Main SEO Head component
 * @param {Object} options - Component options
 * @param {string} options.page - Page identifier
 * @param {Object} options.customConfig - Custom SEO configuration
 * @param {Object} options.pageData - Additional page data
 * @returns {Object} Component API
 */
export const createSEOHead = (options = {}) => {
  const { page = 'home', customConfig = {}, pageData = {} } = options;
  
  const config = { ...DEFAULT_SEO_CONFIG, ...customConfig };
  const pageConfig = { 
    ...(PAGE_CONFIGS[page] || PAGE_CONFIGS.home),
    ...pageData,
  };
  
  const update = () => {
    try {
      updateBasicMetaTags(config, pageConfig);
      updateOpenGraphTags(config, pageConfig);
      updateTwitterCardTags(config, pageConfig);
      updateCanonicalLinks(config, pageConfig);
      updateThemeColor(config);
      
      const structuredData = generateStructuredData(config, pageConfig);
      updateStructuredData(structuredData);
      
      return { success: true };
    } catch (error) {
      console.error('[SEO Head] Failed to update meta tags:', {
        error: error.message,
        stack: error.stack,
        page,
        timestamp: new Date().toISOString(),
      });
      
      return { success: false, error: error.message };
    }
  };
  
  const updatePage = (newPage, newPageData = {}) => {
    const newPageConfig = {
      ...(PAGE_CONFIGS[newPage] || PAGE_CONFIGS.home),
      ...newPageData,
    };
    
    Object.assign(pageConfig, newPageConfig);
    return update();
  };
  
  const updateCustomData = (customData) => {
    Object.assign(pageConfig, customData);
    return update();
  };
  
  const getStructuredData = () => {
    return generateStructuredData(config, pageConfig);
  };
  
  const getPageConfig = () => {
    return { ...pageConfig };
  };
  
  update();
  
  return Object.freeze({
    update,
    updatePage,
    updateCustomData,
    getStructuredData,
    getPageConfig,
  });
};

/**
 * Utility function to register page configuration
 * @param {string} pageId - Page identifier
 * @param {Object} config - Page configuration
 */
export const registerPageConfig = (pageId, config) => {
  if (typeof pageId !== 'string' || !pageId) {
    throw new TypeError('Page ID must be a non-empty string');
  }
  
  if (typeof config !== 'object' || config === null) {
    throw new TypeError('Config must be an object');
  }
  
  PAGE_CONFIGS[pageId] = Object.freeze({ ...config });
};

/**
 * Utility function to get available page configurations
 * @returns {string[]} Array of page identifiers
 */
export const getAvailablePages = () => {
  return Object.keys(PAGE_CONFIGS);
};

/**
 * Utility function to validate SEO configuration
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result
 */
export const validateSEOConfig = (config) => {
  const errors = [];
  const warnings = [];
  
  if (!config.title || config.title.length < 10) {
    errors.push('Title must be at least 10 characters');
  }
  
  if (config.title && config.title.length > 60) {
    warnings.push('Title should be under 60 characters for optimal display');
  }
  
  if (!config.description || config.description.length < 50) {
    errors.push('Description must be at least 50 characters');
  }
  
  if (config.description && config.description.length > 160) {
    warnings.push('Description should be under 160 characters for optimal display');
  }
  
  if (!config.keywords || (Array.isArray(config.keywords) && config.keywords.length === 0)) {
    warnings.push('Keywords should be provided for better SEO');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

export default createSEOHead;