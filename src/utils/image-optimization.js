/**
 * Image Optimization and Responsive Image Utilities
 * Provides comprehensive image optimization, responsive loading, WebP format detection,
 * and srcset generation for different screen densities with performance optimizations.
 *
 * @module image-optimization
 * @generated-from task-id:TASK-008
 */

/**
 * Image optimization state management
 * @private
 */
const IMAGE_STATE = {
  webpSupport: null,
  avifSupport: null,
  devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  connectionSpeed: 'unknown',
  initialized: false,
  formatCache: new Map(),
  sizeCache: new WeakMap(),
};

/**
 * Default image optimization configuration
 * @private
 */
const DEFAULT_CONFIG = Object.freeze({
  formats: ['avif', 'webp', 'jpg'],
  densities: [1, 1.5, 2, 3],
  sizes: [320, 640, 768, 1024, 1366, 1920],
  quality: 85,
  enableWebP: true,
  enableAVIF: true,
  enableLazyLoad: true,
  enablePlaceholder: true,
  placeholderQuality: 20,
  placeholderSize: 40,
  maxWidth: 3840,
  maxHeight: 2160,
  compressionLevel: 'balanced',
  enableLogging: false,
});

/**
 * Compression level presets
 * @private
 */
const COMPRESSION_PRESETS = Object.freeze({
  maximum: { quality: 70, effort: 9 },
  balanced: { quality: 85, effort: 6 },
  fast: { quality: 90, effort: 3 },
  lossless: { quality: 100, effort: 0 },
});

/**
 * Image format MIME types
 * @private
 */
const FORMAT_MIME_TYPES = Object.freeze({
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
});

/**
 * Breakpoint definitions for responsive images
 * @private
 */
const BREAKPOINTS = Object.freeze({
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1366,
  xxl: 1920,
});

/**
 * Structured logger for image optimization events
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
    module: 'image-optimization',
    context,
  };

  if (level === 'error') {
    console.error(`[${timestamp}] IMAGE-OPT ERROR:`, message, context);
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] IMAGE-OPT WARN:`, message, context);
  } else {
    console.info(`[${timestamp}] IMAGE-OPT INFO:`, message, context);
  }

  return logEntry;
};

/**
 * Detect network connection speed
 * @private
 * @returns {string} Connection speed: 'slow', 'medium', 'fast', or 'unknown'
 */
const detectConnectionSpeed = () => {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return 'unknown';
  }

  const effectiveType = connection.effectiveType;

  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow';
  }

  if (effectiveType === '3g') {
    return 'medium';
  }

  if (effectiveType === '4g') {
    return 'fast';
  }

  return 'unknown';
};

/**
 * Check WebP format support
 * @private
 * @returns {Promise<boolean>} True if WebP is supported
 */
const checkWebPSupport = async () => {
  if (IMAGE_STATE.webpSupport !== null) {
    return IMAGE_STATE.webpSupport;
  }

  if (typeof document === 'undefined') {
    IMAGE_STATE.webpSupport = false;
    return false;
  }

  return new Promise(resolve => {
    const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    const img = new Image();

    img.onload = () => {
      IMAGE_STATE.webpSupport = img.width === 1 && img.height === 1;
      log('info', 'WebP support detected', { supported: IMAGE_STATE.webpSupport });
      resolve(IMAGE_STATE.webpSupport);
    };

    img.onerror = () => {
      IMAGE_STATE.webpSupport = false;
      log('info', 'WebP not supported');
      resolve(false);
    };

    img.src = webpData;
  });
};

/**
 * Check AVIF format support
 * @private
 * @returns {Promise<boolean>} True if AVIF is supported
 */
const checkAVIFSupport = async () => {
  if (IMAGE_STATE.avifSupport !== null) {
    return IMAGE_STATE.avifSupport;
  }

  if (typeof document === 'undefined') {
    IMAGE_STATE.avifSupport = false;
    return false;
  }

  return new Promise(resolve => {
    const avifData =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    const img = new Image();

    img.onload = () => {
      IMAGE_STATE.avifSupport = img.width === 2 && img.height === 2;
      log('info', 'AVIF support detected', { supported: IMAGE_STATE.avifSupport });
      resolve(IMAGE_STATE.avifSupport);
    };

    img.onerror = () => {
      IMAGE_STATE.avifSupport = false;
      log('info', 'AVIF not supported');
      resolve(false);
    };

    img.src = avifData;
  });
};

/**
 * Initialize image optimization system
 * @private
 * @returns {Promise<void>}
 */
const initializeImageOptimization = async () => {
  if (IMAGE_STATE.initialized) {
    return;
  }

  IMAGE_STATE.connectionSpeed = detectConnectionSpeed();

  await Promise.all([checkWebPSupport(), checkAVIFSupport()]);

  log('info', 'Image optimization system initialized', {
    webpSupport: IMAGE_STATE.webpSupport,
    avifSupport: IMAGE_STATE.avifSupport,
    devicePixelRatio: IMAGE_STATE.devicePixelRatio,
    connectionSpeed: IMAGE_STATE.connectionSpeed,
  });

  IMAGE_STATE.initialized = true;
};

/**
 * Validate image optimization configuration
 * @private
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validated configuration
 * @throws {TypeError} If configuration is invalid
 */
const validateConfig = config => {
  if (config === null || typeof config !== 'object') {
    throw new TypeError('Image optimization configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (!Array.isArray(validated.formats)) {
    throw new TypeError('formats must be an array');
  }

  if (!Array.isArray(validated.densities)) {
    throw new TypeError('densities must be an array');
  }

  if (!Array.isArray(validated.sizes)) {
    throw new TypeError('sizes must be an array');
  }

  if (typeof validated.quality !== 'number' || validated.quality < 0 || validated.quality > 100) {
    throw new TypeError('quality must be a number between 0 and 100');
  }

  if (typeof validated.maxWidth !== 'number' || validated.maxWidth <= 0) {
    throw new TypeError('maxWidth must be a positive number');
  }

  if (typeof validated.maxHeight !== 'number' || validated.maxHeight <= 0) {
    throw new TypeError('maxHeight must be a positive number');
  }

  return validated;
};

/**
 * Get optimal image format based on browser support
 * @private
 * @param {Array<string>} formats - Preferred formats in order
 * @returns {string} Optimal format
 */
const getOptimalFormat = formats => {
  for (const format of formats) {
    if (format === 'avif' && IMAGE_STATE.avifSupport) {
      return 'avif';
    }
    if (format === 'webp' && IMAGE_STATE.webpSupport) {
      return 'webp';
    }
  }

  return 'jpg';
};

/**
 * Calculate optimal image dimensions
 * @private
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} targetWidth - Target width
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {Object} Calculated dimensions
 */
const calculateDimensions = (originalWidth, originalHeight, targetWidth, maxWidth, maxHeight) => {
  const aspectRatio = originalWidth / originalHeight;

  let width = Math.min(targetWidth, maxWidth, originalWidth);
  let height = Math.round(width / aspectRatio);

  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * aspectRatio);
  }

  return { width, height };
};

/**
 * Generate image URL with optimization parameters
 * @private
 * @param {string} baseUrl - Base image URL
 * @param {Object} params - Optimization parameters
 * @returns {string} Optimized image URL
 */
const generateOptimizedUrl = (baseUrl, params) => {
  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new TypeError('baseUrl must be a non-empty string');
  }

  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

  if (params.width) {
    url.searchParams.set('w', params.width);
  }

  if (params.height) {
    url.searchParams.set('h', params.height);
  }

  if (params.quality) {
    url.searchParams.set('q', params.quality);
  }

  if (params.format) {
    url.searchParams.set('fm', params.format);
  }

  if (params.fit) {
    url.searchParams.set('fit', params.fit);
  }

  return url.toString();
};

/**
 * Generate srcset string for responsive images
 * @param {string} baseUrl - Base image URL
 * @param {Object} options - Srcset generation options
 * @param {Array<number>} [options.widths] - Array of widths for srcset
 * @param {Array<number>} [options.densities] - Array of pixel densities
 * @param {string} [options.format] - Image format
 * @param {number} [options.quality] - Image quality
 * @returns {string} Generated srcset string
 * @throws {TypeError} If parameters are invalid
 */
export const generateSrcset = (baseUrl, options = {}) => {
  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new TypeError('baseUrl must be a non-empty string');
  }

  const config = validateConfig(options);

  const srcsetParts = [];

  if (options.widths && Array.isArray(options.widths)) {
    for (const width of options.widths) {
      const url = generateOptimizedUrl(baseUrl, {
        width,
        quality: config.quality,
        format: options.format,
      });
      srcsetParts.push(`${url} ${width}w`);
    }
  } else if (options.densities && Array.isArray(options.densities)) {
    for (const density of options.densities) {
      const url = generateOptimizedUrl(baseUrl, {
        quality: config.quality,
        format: options.format,
      });
      srcsetParts.push(`${url} ${density}x`);
    }
  } else {
    for (const width of config.sizes) {
      const url = generateOptimizedUrl(baseUrl, {
        width,
        quality: config.quality,
        format: options.format,
      });
      srcsetParts.push(`${url} ${width}w`);
    }
  }

  const srcset = srcsetParts.join(', ');

  log('info', 'Srcset generated', {
    baseUrl,
    partsCount: srcsetParts.length,
  });

  return srcset;
};

/**
 * Generate responsive image sources for picture element
 * @param {string} baseUrl - Base image URL
 * @param {Object} options - Source generation options
 * @param {Array<string>} [options.formats] - Image formats to generate
 * @param {Array<number>} [options.sizes] - Image sizes
 * @param {Object} [options.breakpoints] - Custom breakpoints
 * @returns {Array<Object>} Array of source objects
 */
export const generateResponsiveSources = (baseUrl, options = {}) => {
  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new TypeError('baseUrl must be a non-empty string');
  }

  const config = validateConfig(options);
  const formats = options.formats || config.formats;
  const sizes = options.sizes || config.sizes;
  const breakpoints = options.breakpoints || BREAKPOINTS;

  const sources = [];

  for (const format of formats) {
    if (format === 'avif' && !IMAGE_STATE.avifSupport) {
      continue;
    }
    if (format === 'webp' && !IMAGE_STATE.webpSupport) {
      continue;
    }

    const srcset = generateSrcset(baseUrl, {
      widths: sizes,
      format,
      quality: config.quality,
    });

    sources.push({
      type: FORMAT_MIME_TYPES[format],
      srcset,
      sizes: generateSizesAttribute(breakpoints),
    });
  }

  log('info', 'Responsive sources generated', {
    baseUrl,
    sourcesCount: sources.length,
    formats,
  });

  return sources;
};

/**
 * Generate sizes attribute for responsive images
 * @param {Object} breakpoints - Breakpoint definitions
 * @returns {string} Generated sizes attribute
 */
export const generateSizesAttribute = (breakpoints = BREAKPOINTS) => {
  const sizeParts = [];

  const sortedBreakpoints = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);

  for (const [name, width] of sortedBreakpoints) {
    sizeParts.push(`(max-width: ${width}px) ${width}px`);
  }

  sizeParts.push('100vw');

  return sizeParts.join(', ');
};

/**
 * Create optimized image element with responsive sources
 * @param {string} src - Image source URL
 * @param {Object} options - Image options
 * @param {string} [options.alt] - Alt text
 * @param {string} [options.className] - CSS class name
 * @param {boolean} [options.lazy] - Enable lazy loading
 * @param {Array<string>} [options.formats] - Image formats
 * @param {Array<number>} [options.sizes] - Image sizes
 * @returns {HTMLPictureElement} Picture element with sources
 */
export const createResponsiveImage = (src, options = {}) => {
  if (!src || typeof src !== 'string') {
    throw new TypeError('src must be a non-empty string');
  }

  const config = validateConfig(options);

  const picture = document.createElement('picture');

  const sources = generateResponsiveSources(src, {
    formats: options.formats || config.formats,
    sizes: options.sizes || config.sizes,
  });

  for (const source of sources) {
    const sourceElement = document.createElement('source');
    sourceElement.type = source.type;
    sourceElement.srcset = source.srcset;
    sourceElement.sizes = source.sizes;
    picture.appendChild(sourceElement);
  }

  const img = document.createElement('img');
  img.src = src;

  if (options.alt) {
    img.alt = options.alt;
  }

  if (options.className) {
    img.className = options.className;
  }

  if (options.lazy !== false && config.enableLazyLoad) {
    img.loading = 'lazy';
  }

  picture.appendChild(img);

  log('info', 'Responsive image created', {
    src,
    sourcesCount: sources.length,
  });

  return picture;
};

/**
 * Generate placeholder image data URL
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @param {string} [color] - Placeholder color
 * @returns {string} Data URL for placeholder
 */
export const generatePlaceholder = (width, height, color = '#e0e0e0') => {
  if (typeof width !== 'number' || width <= 0) {
    throw new TypeError('width must be a positive number');
  }

  if (typeof height !== 'number' || height <= 0) {
    throw new TypeError('height must be a positive number');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/png');
};

/**
 * Calculate optimal image quality based on connection speed
 * @param {string} connectionSpeed - Connection speed
 * @param {number} baseQuality - Base quality setting
 * @returns {number} Adjusted quality
 */
export const calculateOptimalQuality = (connectionSpeed, baseQuality = 85) => {
  if (typeof baseQuality !== 'number' || baseQuality < 0 || baseQuality > 100) {
    throw new TypeError('baseQuality must be a number between 0 and 100');
  }

  const speedMultipliers = {
    slow: 0.7,
    medium: 0.85,
    fast: 1.0,
    unknown: 0.9,
  };

  const multiplier = speedMultipliers[connectionSpeed] || speedMultipliers.unknown;
  const adjustedQuality = Math.round(baseQuality * multiplier);

  return Math.max(50, Math.min(100, adjustedQuality));
};

/**
 * Get image format support information
 * @returns {Promise<Object>} Format support status
 */
export const getFormatSupport = async () => {
  await initializeImageOptimization();

  return {
    webp: IMAGE_STATE.webpSupport,
    avif: IMAGE_STATE.avifSupport,
    jpg: true,
    png: true,
    gif: true,
    svg: true,
  };
};

/**
 * Get optimal image configuration for current device
 * @returns {Promise<Object>} Optimal configuration
 */
export const getOptimalConfig = async () => {
  await initializeImageOptimization();

  const optimalFormat = getOptimalFormat(DEFAULT_CONFIG.formats);
  const optimalQuality = calculateOptimalQuality(IMAGE_STATE.connectionSpeed, DEFAULT_CONFIG.quality);

  return {
    format: optimalFormat,
    quality: optimalQuality,
    devicePixelRatio: IMAGE_STATE.devicePixelRatio,
    connectionSpeed: IMAGE_STATE.connectionSpeed,
    webpSupport: IMAGE_STATE.webpSupport,
    avifSupport: IMAGE_STATE.avifSupport,
  };
};

/**
 * Preload critical images with optimal format
 * @param {Array<string>} urls - Array of image URLs to preload
 * @param {Object} options - Preload options
 * @returns {Promise<Array<void>>} Promise that resolves when images are preloaded
 */
export const preloadImages = async (urls, options = {}) => {
  if (!Array.isArray(urls)) {
    throw new TypeError('urls must be an array');
  }

  await initializeImageOptimization();

  const config = validateConfig(options);
  const optimalFormat = getOptimalFormat(config.formats);

  const preloadPromises = urls.map(url => {
    const optimizedUrl = generateOptimizedUrl(url, {
      format: optimalFormat,
      quality: config.quality,
    });

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedUrl;

      link.onload = () => {
        log('info', 'Image preloaded', { url: optimizedUrl });
        resolve();
      };

      link.onerror = () => {
        const error = new Error(`Failed to preload image: ${optimizedUrl}`);
        log('error', 'Image preload failed', { url: optimizedUrl, error: error.message });
        reject(error);
      };

      document.head.appendChild(link);
    });
  });

  return Promise.allSettled(preloadPromises);
};

/**
 * Get image optimization statistics
 * @returns {Object} Statistics object
 */
export const getOptimizationStats = () => ({
  initialized: IMAGE_STATE.initialized,
  webpSupport: IMAGE_STATE.webpSupport,
  avifSupport: IMAGE_STATE.avifSupport,
  devicePixelRatio: IMAGE_STATE.devicePixelRatio,
  connectionSpeed: IMAGE_STATE.connectionSpeed,
  formatCacheSize: IMAGE_STATE.formatCache.size,
});

/**
 * Reset image optimization state
 * @returns {void}
 */
export const resetOptimization = () => {
  IMAGE_STATE.webpSupport = null;
  IMAGE_STATE.avifSupport = null;
  IMAGE_STATE.initialized = false;
  IMAGE_STATE.formatCache.clear();

  log('info', 'Image optimization state reset');
};

export default {
  generateSrcset,
  generateResponsiveSources,
  generateSizesAttribute,
  createResponsiveImage,
  generatePlaceholder,
  calculateOptimalQuality,
  getFormatSupport,
  getOptimalConfig,
  preloadImages,
  getOptimizationStats,
  resetOptimization,
};