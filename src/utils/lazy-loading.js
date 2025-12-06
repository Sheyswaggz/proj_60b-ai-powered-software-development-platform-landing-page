/**
 * Lazy Loading Utilities for Images and Components
 * Provides Intersection Observer implementation for lazy loading with fallbacks,
 * performance optimizations, and comprehensive error handling.
 *
 * @module lazy-loading
 * @generated-from task-id:TASK-008
 */

/**
 * Lazy loading state management
 * @private
 */
const LAZY_STATE = {
  observers: new WeakMap(),
  loadedElements: new WeakSet(),
  loadingElements: new WeakSet(),
  errorElements: new WeakSet(),
  performanceMode: 'auto',
  initialized: false,
};

/**
 * Default lazy loading configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  rootMargin: '50px 0px',
  threshold: 0.01,
  loadDelay: 0,
  retryAttempts: 3,
  retryDelay: 1000,
  placeholderClass: 'lazy-placeholder',
  loadingClass: 'lazy-loading',
  loadedClass: 'lazy-loaded',
  errorClass: 'lazy-error',
  enableLogging: false,
  useNativeLazy: true,
  preloadCritical: true,
});

/**
 * Supported element types for lazy loading
 * @private
 */
const ELEMENT_TYPES = Object.freeze({
  IMAGE: 'img',
  PICTURE: 'picture',
  VIDEO: 'video',
  IFRAME: 'iframe',
  COMPONENT: 'component',
});

/**
 * Structured logger for lazy loading events
 * @private
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {Object} context - Additional context data
 */
const log = (level, message, context = {}) => {
  if (!DEFAULT_CONFIG.enableLogging && level !== 'error') {
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    module: 'lazy-loading',
    context,
  };

  if (level === 'error') {
    console.error(`[${timestamp}] LAZY-LOADING ERROR:`, message, context);
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] LAZY-LOADING WARN:`, message, context);
  } else {
    console.info(`[${timestamp}] LAZY-LOADING INFO:`, message, context);
  }

  return logEntry;
};

/**
 * Detect device performance capabilities
 * @private
 * @returns {string} Performance mode: 'high', 'medium', or 'low'
 */
const detectPerformanceMode = () => {
  if (typeof navigator === 'undefined') {
    return 'medium';
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'low';
    }
    if (effectiveType === '3g') {
      return 'medium';
    }
  }

  const memory = navigator.deviceMemory;
  if (memory && memory < 4) {
    return 'low';
  }

  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) {
    return 'medium';
  }

  return 'high';
};

/**
 * Check if native lazy loading is supported
 * @private
 * @returns {boolean} True if native lazy loading is supported
 */
const supportsNativeLazy = () => {
  if (typeof HTMLImageElement === 'undefined') {
    return false;
  }
  return 'loading' in HTMLImageElement.prototype;
};

/**
 * Check if IntersectionObserver is supported
 * @private
 * @returns {boolean} True if IntersectionObserver is supported
 */
const supportsIntersectionObserver = () => {
  return typeof IntersectionObserver !== 'undefined';
};

/**
 * Validate lazy loading configuration
 * @private
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validated configuration
 * @throws {TypeError} If configuration is invalid
 */
const validateConfig = config => {
  if (config === null || typeof config !== 'object') {
    throw new TypeError('Lazy loading configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.rootMargin !== 'string') {
    throw new TypeError('rootMargin must be a string');
  }

  if (typeof validated.threshold !== 'number' || validated.threshold < 0 || validated.threshold > 1) {
    throw new TypeError('threshold must be a number between 0 and 1');
  }

  if (typeof validated.loadDelay !== 'number' || validated.loadDelay < 0) {
    throw new TypeError('loadDelay must be a non-negative number');
  }

  if (typeof validated.retryAttempts !== 'number' || validated.retryAttempts < 0) {
    throw new TypeError('retryAttempts must be a non-negative number');
  }

  if (typeof validated.retryDelay !== 'number' || validated.retryDelay < 0) {
    throw new TypeError('retryDelay must be a non-negative number');
  }

  return validated;
};

/**
 * Get element type for lazy loading
 * @private
 * @param {HTMLElement} element - Element to check
 * @returns {string} Element type
 */
const getElementType = element => {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError('element must be an HTMLElement');
  }

  const tagName = element.tagName.toLowerCase();

  if (tagName === 'img') {
    return ELEMENT_TYPES.IMAGE;
  }
  if (tagName === 'picture') {
    return ELEMENT_TYPES.PICTURE;
  }
  if (tagName === 'video') {
    return ELEMENT_TYPES.VIDEO;
  }
  if (tagName === 'iframe') {
    return ELEMENT_TYPES.IFRAME;
  }

  return ELEMENT_TYPES.COMPONENT;
};

/**
 * Load image with retry logic
 * @private
 * @param {HTMLImageElement} img - Image element
 * @param {string} src - Image source URL
 * @param {number} attempts - Number of retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<void>}
 */
const loadImageWithRetry = async (img, src, attempts, delay) => {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const tempImg = new Image();

        const cleanup = () => {
          tempImg.onload = null;
          tempImg.onerror = null;
        };

        tempImg.onload = () => {
          cleanup();
          img.src = src;
          resolve();
        };

        tempImg.onerror = () => {
          cleanup();
          reject(new Error(`Failed to load image: ${src}`));
        };

        tempImg.src = src;
      });

      return;
    } catch (error) {
      lastError = error;

      if (attempt < attempts - 1) {
        const backoffDelay = delay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));

        log('warn', 'Image load retry', {
          src,
          attempt: attempt + 1,
          maxAttempts: attempts,
          nextDelay: backoffDelay,
        });
      }
    }
  }

  throw lastError;
};

/**
 * Load picture element sources
 * @private
 * @param {HTMLPictureElement} picture - Picture element
 * @returns {void}
 */
const loadPictureSources = picture => {
  const sources = picture.querySelectorAll('source[data-srcset]');
  const img = picture.querySelector('img');

  for (const source of sources) {
    const srcset = source.getAttribute('data-srcset');
    if (srcset) {
      source.srcset = srcset;
      source.removeAttribute('data-srcset');
    }
  }

  if (img && img.hasAttribute('data-src')) {
    const src = img.getAttribute('data-src');
    img.src = src;
    img.removeAttribute('data-src');
  }
};

/**
 * Load video element sources
 * @private
 * @param {HTMLVideoElement} video - Video element
 * @returns {void}
 */
const loadVideoSources = video => {
  const sources = video.querySelectorAll('source[data-src]');

  for (const source of sources) {
    const src = source.getAttribute('data-src');
    if (src) {
      source.src = src;
      source.removeAttribute('data-src');
    }
  }

  if (video.hasAttribute('data-poster')) {
    const poster = video.getAttribute('data-poster');
    video.poster = poster;
    video.removeAttribute('data-poster');
  }

  video.load();
};

/**
 * Load iframe element
 * @private
 * @param {HTMLIFrameElement} iframe - Iframe element
 * @returns {void}
 */
const loadIframe = iframe => {
  if (iframe.hasAttribute('data-src')) {
    const src = iframe.getAttribute('data-src');
    iframe.src = src;
    iframe.removeAttribute('data-src');
  }
};

/**
 * Load element based on type
 * @private
 * @param {HTMLElement} element - Element to load
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
const loadElement = async (element, config) => {
  const elementType = getElementType(element);

  LAZY_STATE.loadingElements.add(element);
  element.classList.add(config.loadingClass);

  try {
    if (elementType === ELEMENT_TYPES.IMAGE) {
      const src = element.getAttribute('data-src');
      const srcset = element.getAttribute('data-srcset');

      if (srcset) {
        element.srcset = srcset;
        element.removeAttribute('data-srcset');
      }

      if (src) {
        await loadImageWithRetry(element, src, config.retryAttempts, config.retryDelay);
        element.removeAttribute('data-src');
      }
    } else if (elementType === ELEMENT_TYPES.PICTURE) {
      loadPictureSources(element);
    } else if (elementType === ELEMENT_TYPES.VIDEO) {
      loadVideoSources(element);
    } else if (elementType === ELEMENT_TYPES.IFRAME) {
      loadIframe(element);
    } else {
      const customLoader = element.getAttribute('data-loader');
      if (customLoader && typeof window[customLoader] === 'function') {
        await window[customLoader](element);
      }
    }

    LAZY_STATE.loadingElements.delete(element);
    LAZY_STATE.loadedElements.add(element);
    element.classList.remove(config.loadingClass, config.placeholderClass);
    element.classList.add(config.loadedClass);

    element.dispatchEvent(
      new CustomEvent('lazyloaded', {
        bubbles: true,
        detail: { element, elementType },
      })
    );

    log('info', 'Element loaded successfully', {
      elementType,
      tagName: element.tagName,
    });
  } catch (error) {
    LAZY_STATE.loadingElements.delete(element);
    LAZY_STATE.errorElements.add(element);
    element.classList.remove(config.loadingClass);
    element.classList.add(config.errorClass);

    element.dispatchEvent(
      new CustomEvent('lazyerror', {
        bubbles: true,
        detail: { element, elementType, error },
      })
    );

    log('error', 'Element load failed', {
      elementType,
      tagName: element.tagName,
      error: error.message,
      stack: error.stack,
    });

    throw error;
  }
};

/**
 * Create intersection observer callback
 * @private
 * @param {Object} config - Configuration object
 * @returns {Function} Intersection observer callback
 */
const createObserverCallback = config => entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const element = entry.target;

      if (LAZY_STATE.loadedElements.has(element) || LAZY_STATE.loadingElements.has(element)) {
        continue;
      }

      const observer = LAZY_STATE.observers.get(element);
      if (observer) {
        observer.unobserve(element);
      }

      const loadTimeout = setTimeout(() => {
        loadElement(element, config).catch(error => {
          log('error', 'Lazy load failed', {
            element: element.tagName,
            error: error.message,
          });
        });
      }, config.loadDelay);

      element.setAttribute('data-load-timeout', loadTimeout);
    }
  }
};

/**
 * Initialize lazy loading system
 * @private
 */
const initializeLazyLoading = () => {
  if (LAZY_STATE.initialized) {
    return;
  }

  LAZY_STATE.performanceMode = detectPerformanceMode();

  log('info', 'Lazy loading system initialized', {
    performanceMode: LAZY_STATE.performanceMode,
    nativeLazySupport: supportsNativeLazy(),
    intersectionObserverSupport: supportsIntersectionObserver(),
  });

  LAZY_STATE.initialized = true;
};

/**
 * Create lazy loading observer for elements
 * @param {HTMLElement|NodeList|Array<HTMLElement>|string} elements - Elements or selector
 * @param {Object} options - Lazy loading options
 * @param {string} [options.rootMargin='50px 0px'] - Root margin for intersection observer
 * @param {number} [options.threshold=0.01] - Intersection threshold
 * @param {number} [options.loadDelay=0] - Delay before loading in ms
 * @param {number} [options.retryAttempts=3] - Number of retry attempts
 * @param {number} [options.retryDelay=1000] - Delay between retries in ms
 * @param {boolean} [options.useNativeLazy=true] - Use native lazy loading if supported
 * @returns {Object} Observer control object with disconnect method
 * @throws {Error} If elements not found or IntersectionObserver not supported
 */
export const createLazyLoader = (elements, options = {}) => {
  initializeLazyLoading();

  const config = validateConfig(options);

  let targetElements = [];

  if (typeof elements === 'string') {
    targetElements = Array.from(document.querySelectorAll(elements));
    if (targetElements.length === 0) {
      throw new Error(`No elements found for selector: ${elements}`);
    }
  } else if (elements instanceof NodeList) {
    targetElements = Array.from(elements);
  } else if (Array.isArray(elements)) {
    targetElements = elements;
  } else if (elements instanceof HTMLElement) {
    targetElements = [elements];
  } else {
    throw new TypeError('elements must be an HTMLElement, NodeList, Array, or selector string');
  }

  if (config.useNativeLazy && supportsNativeLazy()) {
    for (const element of targetElements) {
      if (element.tagName.toLowerCase() === 'img' || element.tagName.toLowerCase() === 'iframe') {
        element.loading = 'lazy';

        const src = element.getAttribute('data-src');
        if (src) {
          element.src = src;
          element.removeAttribute('data-src');
        }

        LAZY_STATE.loadedElements.add(element);
        element.classList.add(config.loadedClass);
      }
    }

    log('info', 'Using native lazy loading', {
      elementCount: targetElements.length,
    });

    return {
      disconnect: () => {
        log('info', 'Native lazy loading disconnected');
      },
    };
  }

  if (!supportsIntersectionObserver()) {
    for (const element of targetElements) {
      loadElement(element, config).catch(error => {
        log('error', 'Fallback load failed', {
          element: element.tagName,
          error: error.message,
        });
      });
    }

    log('warn', 'IntersectionObserver not supported, loading all elements immediately');

    return {
      disconnect: () => {
        log('info', 'Fallback loader disconnected');
      },
    };
  }

  const callback = createObserverCallback(config);

  const observerOptions = {
    rootMargin: config.rootMargin,
    threshold: config.threshold,
  };

  const observer = new IntersectionObserver(callback, observerOptions);

  for (const element of targetElements) {
    if (LAZY_STATE.loadedElements.has(element)) {
      continue;
    }

    element.classList.add(config.placeholderClass);

    observer.observe(element);
    LAZY_STATE.observers.set(element, observer);
  }

  log('info', 'Lazy loader created', {
    elementCount: targetElements.length,
    config: {
      rootMargin: config.rootMargin,
      threshold: config.threshold,
      loadDelay: config.loadDelay,
    },
  });

  return {
    disconnect: () => {
      observer.disconnect();

      for (const element of targetElements) {
        LAZY_STATE.observers.delete(element);

        const loadTimeout = element.getAttribute('data-load-timeout');
        if (loadTimeout) {
          clearTimeout(parseInt(loadTimeout, 10));
          element.removeAttribute('data-load-timeout');
        }
      }

      log('info', 'Lazy loader disconnected', {
        elementCount: targetElements.length,
      });
    },
  };
};

/**
 * Preload critical images
 * @param {Array<string>} urls - Array of image URLs to preload
 * @returns {Promise<Array<void>>} Promise that resolves when all images are loaded
 */
export const preloadCriticalImages = async urls => {
  if (!Array.isArray(urls)) {
    throw new TypeError('urls must be an array');
  }

  const loadPromises = urls.map(
    url =>
      new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          log('info', 'Critical image preloaded', { url });
          resolve();
        };

        img.onerror = () => {
          const error = new Error(`Failed to preload critical image: ${url}`);
          log('error', 'Critical image preload failed', { url, error: error.message });
          reject(error);
        };

        img.src = url;
      })
  );

  return Promise.allSettled(loadPromises);
};

/**
 * Get lazy loading support information
 * @returns {Object} Support status
 */
export const getLazyLoadingSupport = () => ({
  nativeLazy: supportsNativeLazy(),
  intersectionObserver: supportsIntersectionObserver(),
  performanceMode: LAZY_STATE.performanceMode,
  supported: supportsNativeLazy() || supportsIntersectionObserver(),
});

/**
 * Get lazy loading statistics
 * @returns {Object} Statistics object
 */
export const getLazyLoadingStats = () => ({
  loaded: LAZY_STATE.loadedElements,
  loading: LAZY_STATE.loadingElements,
  errors: LAZY_STATE.errorElements,
});

/**
 * Reset lazy loading state
 * @returns {void}
 */
export const resetLazyLoading = () => {
  LAZY_STATE.loadedElements = new WeakSet();
  LAZY_STATE.loadingElements = new WeakSet();
  LAZY_STATE.errorElements = new WeakSet();

  log('info', 'Lazy loading state reset');
};

export default createLazyLoader;