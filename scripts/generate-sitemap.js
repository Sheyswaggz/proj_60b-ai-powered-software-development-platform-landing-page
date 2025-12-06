/**
 * Sitemap Generation Script
 * 
 * Generates XML sitemap with all page URLs, priorities, and change frequencies.
 * Integrates with build process for automatic sitemap generation.
 * 
 * @generated-from: task-id:TASK-008 type:performance
 * @modifies: public/sitemap.xml
 * @dependencies: ["fs", "path"]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = Object.freeze({
  baseUrl: process.env.SITE_URL || 'https://example.com',
  outputPath: path.join(__dirname, '..', 'public', 'sitemap.xml'),
  defaultChangeFreq: 'weekly',
  defaultPriority: 0.5,
  lastModDate: new Date().toISOString().split('T')[0],
});

// Page definitions with SEO metadata
const PAGES = Object.freeze([
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
    lastmod: CONFIG.lastModDate,
  },
  {
    path: '/features',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: CONFIG.lastModDate,
  },
  {
    path: '/use-cases',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: CONFIG.lastModDate,
  },
  {
    path: '/workflow',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: CONFIG.lastModDate,
  },
  {
    path: '/demo',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: CONFIG.lastModDate,
  },
  {
    path: '/contact',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: CONFIG.lastModDate,
  },
]);

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates priority value
 * @param {number} priority - Priority value to validate
 * @returns {boolean} True if valid
 */
function isValidPriority(priority) {
  return typeof priority === 'number' && priority >= 0 && priority <= 1.0;
}

/**
 * Validates change frequency
 * @param {string} changefreq - Change frequency to validate
 * @returns {boolean} True if valid
 */
function isValidChangeFreq(changefreq) {
  const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  return validFreqs.includes(changefreq);
}

/**
 * Validates page configuration
 * @param {Object} page - Page configuration to validate
 * @throws {Error} If validation fails
 */
function validatePage(page) {
  if (!page || typeof page !== 'object') {
    throw new Error('Page must be an object');
  }

  if (typeof page.path !== 'string' || !page.path.startsWith('/')) {
    throw new Error(`Invalid page path: ${page.path}`);
  }

  if (page.priority !== undefined && !isValidPriority(page.priority)) {
    throw new Error(`Invalid priority for ${page.path}: ${page.priority}`);
  }

  if (page.changefreq !== undefined && !isValidChangeFreq(page.changefreq)) {
    throw new Error(`Invalid changefreq for ${page.path}: ${page.changefreq}`);
  }

  if (page.lastmod !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(page.lastmod)) {
    throw new Error(`Invalid lastmod format for ${page.path}: ${page.lastmod}`);
  }
}

/**
 * Escapes XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  const xmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  };

  return String(str).replace(/[&<>"']/g, (char) => xmlEscapeMap[char]);
}

/**
 * Generates URL element for sitemap
 * @param {Object} page - Page configuration
 * @returns {string} XML URL element
 */
function generateUrlElement(page) {
  const url = `${CONFIG.baseUrl}${page.path}`;
  const priority = page.priority ?? CONFIG.defaultPriority;
  const changefreq = page.changefreq ?? CONFIG.defaultChangeFreq;
  const lastmod = page.lastmod ?? CONFIG.lastModDate;

  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

/**
 * Generates complete sitemap XML
 * @param {Array<Object>} pages - Array of page configurations
 * @returns {string} Complete sitemap XML
 */
function generateSitemap(pages) {
  const urlElements = pages.map(generateUrlElement).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * Ensures directory exists
 * @param {string} dirPath - Directory path to ensure
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Writes sitemap to file with atomic operation
 * @param {string} filePath - Output file path
 * @param {string} content - Sitemap content
 */
function writeSitemapFile(filePath, content) {
  const tempPath = `${filePath}.tmp`;

  try {
    ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(tempPath, content, 'utf8');
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw error;
  }
}

/**
 * Logs structured message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 */
function log(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...metadata,
  };

  const formattedMessage = `[${timestamp}] [${level}] ${message}`;
  
  if (level === 'ERROR') {
    console.error(formattedMessage, metadata);
  } else if (level === 'WARN') {
    console.warn(formattedMessage, metadata);
  } else {
    console.log(formattedMessage, metadata);
  }
}

/**
 * Main sitemap generation function
 */
async function generateSitemapFile() {
  const startTime = Date.now();

  try {
    log('INFO', 'Starting sitemap generation', {
      baseUrl: CONFIG.baseUrl,
      outputPath: CONFIG.outputPath,
      pageCount: PAGES.length,
    });

    // Validate base URL
    if (!isValidUrl(CONFIG.baseUrl)) {
      throw new Error(`Invalid base URL: ${CONFIG.baseUrl}`);
    }

    // Validate all pages
    for (const page of PAGES) {
      validatePage(page);
    }

    log('INFO', 'All pages validated successfully');

    // Generate sitemap
    const sitemapXml = generateSitemap(PAGES);

    // Write to file
    writeSitemapFile(CONFIG.outputPath, sitemapXml);

    const duration = Date.now() - startTime;
    const fileSize = fs.statSync(CONFIG.outputPath).size;

    log('INFO', 'Sitemap generated successfully', {
      outputPath: CONFIG.outputPath,
      pageCount: PAGES.length,
      fileSize: `${fileSize} bytes`,
      duration: `${duration}ms`,
    });

    return {
      success: true,
      outputPath: CONFIG.outputPath,
      pageCount: PAGES.length,
      fileSize,
      duration,
    };
  } catch (error) {
    log('ERROR', 'Sitemap generation failed', {
      error: error.message,
      stack: error.stack,
    });

    throw error;
  }
}

/**
 * CLI entry point
 */
async function main() {
  try {
    const result = await generateSitemapFile();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export for programmatic use
export { generateSitemapFile, generateSitemap, PAGES, CONFIG };
export default generateSitemapFile;