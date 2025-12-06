/**
 * Demo Content and Configuration Data
 * 
 * Provides structured data for interactive demo section including walkthrough steps,
 * video information, interface mockups, and navigation configuration. Supports
 * multiple demo modes and content variations.
 * 
 * @generated-from: task-id:TASK-005
 * @modifies: src/components/demo-section.js
 * @dependencies: ["TASK-004"]
 */

/**
 * Demo step configuration
 * @typedef {Object} DemoStep
 * @property {string} id - Unique step identifier
 * @property {string} title - Step title
 * @property {string} description - Step description
 * @property {string} image - Step image URL or data URI
 * @property {number} order - Display order
 * @property {string} [action] - Optional action button text
 * @property {string} [actionUrl] - Optional action button URL
 * @property {number} [duration] - Estimated duration in seconds
 * @property {Array<string>} [highlights] - Key highlights for this step
 * @property {string} [category] - Step category
 */

/**
 * Video configuration
 * @typedef {Object} VideoConfig
 * @property {string} id - Unique video identifier
 * @property {string} title - Video title
 * @property {string} description - Video description
 * @property {string} url - Video URL
 * @property {string} thumbnail - Video thumbnail URL
 * @property {number} duration - Video duration in seconds
 * @property {string} [provider] - Video provider (youtube, vimeo, custom)
 * @property {Object} [captions] - Caption tracks
 * @property {boolean} [autoplay] - Auto-play video
 * @property {boolean} [controls] - Show video controls
 * @property {boolean} [loop] - Loop video
 * @property {number} [startTime] - Start time in seconds
 */

/**
 * Demo mode configuration
 * @typedef {Object} DemoMode
 * @property {string} id - Mode identifier
 * @property {string} name - Mode display name
 * @property {string} description - Mode description
 * @property {string} type - Mode type (walkthrough, video, interactive)
 * @property {boolean} default - Is default mode
 */

/**
 * Demo content categories
 */
const DEMO_CATEGORIES = Object.freeze({
  GETTING_STARTED: 'getting-started',
  CORE_FEATURES: 'core-features',
  ADVANCED: 'advanced',
  INTEGRATION: 'integration',
  DEPLOYMENT: 'deployment',
});

/**
 * Demo step highlights
 */
const STEP_HIGHLIGHTS = Object.freeze({
  REQUIREMENTS: [
    'Natural language input',
    'Context-aware parsing',
    'Technical specification extraction',
    'Automatic validation',
  ],
  CODE_GENERATION: [
    'Production-ready code',
    'Best practices enforcement',
    'Comprehensive error handling',
    'Inline documentation',
  ],
  TESTING: [
    'Automated test generation',
    'High coverage targets',
    'Edge case validation',
    'Performance benchmarks',
  ],
  DEPLOYMENT: [
    'One-click deployment',
    'Automated monitoring',
    'Rollback capabilities',
    'Zero-downtime updates',
  ],
});

/**
 * Demo walkthrough steps
 * @type {Array<DemoStep>}
 */
const DEMO_STEPS = Object.freeze([
  {
    id: 'step-requirements',
    title: 'Define Your Requirements',
    description: 'Start by describing your project requirements in natural language. Our AI understands context, technical specifications, and business logic. Simply explain what you want to build, and the platform translates it into actionable development tasks.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Crect x="20" y="20" width="360" height="260" rx="8" fill="%23ffffff" stroke="%23e5e7eb" stroke-width="2"/%3E%3Crect x="40" y="40" width="320" height="40" rx="4" fill="%23f9fafb" stroke="%23d1d5db" stroke-width="1"/%3E%3Ctext x="50" y="65" font-family="monospace" font-size="12" fill="%236b7280"%3EDescribe your project...%3C/text%3E%3Crect x="40" y="100" width="320" height="160" rx="4" fill="%23f9fafb" stroke="%23d1d5db" stroke-width="1"/%3E%3Ctext x="50" y="120" font-family="monospace" font-size="10" fill="%233b82f6"%3E// AI-powered parsing%3C/text%3E%3Ctext x="50" y="140" font-family="monospace" font-size="10" fill="%236b7280"%3ERequirements: ✓%3C/text%3E%3Ctext x="50" y="160" font-family="monospace" font-size="10" fill="%236b7280"%3ETech Stack: ✓%3C/text%3E%3Ctext x="50" y="180" font-family="monospace" font-size="10" fill="%236b7280"%3EArchitecture: ✓%3C/text%3E%3C/svg%3E',
    order: 1,
    duration: 45,
    highlights: STEP_HIGHLIGHTS.REQUIREMENTS,
    category: DEMO_CATEGORIES.GETTING_STARTED,
  },
  {
    id: 'step-code-generation',
    title: 'AI Generates Production Code',
    description: 'Watch as our AI generates production-ready code following industry best practices. Every line includes comprehensive error handling, security validations, performance optimizations, and detailed documentation. The code is immediately deployable without modifications.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Crect x="20" y="20" width="360" height="260" rx="8" fill="%231e293b" stroke="%2364748b" stroke-width="2"/%3E%3Ctext x="30" y="45" font-family="monospace" font-size="10" fill="%2394a3b8"%3E1%3C/text%3E%3Ctext x="50" y="45" font-family="monospace" font-size="10" fill="%23f472b6"%3Eexport%3C/text%3E%3Ctext x="95" y="45" font-family="monospace" font-size="10" fill="%23fbbf24"%3Efunction%3C/text%3E%3Ctext x="155" y="45" font-family="monospace" font-size="10" fill="%2360a5fa"%3EprocessData%3C/text%3E%3Ctext x="30" y="65" font-family="monospace" font-size="10" fill="%2394a3b8"%3E2%3C/text%3E%3Ctext x="50" y="65" font-family="monospace" font-size="10" fill="%23cbd5e1"%3E  %3C/text%3E%3Ctext x="70" y="65" font-family="monospace" font-size="10" fill="%2322c55e"%3E// Validate input%3C/text%3E%3Ctext x="30" y="85" font-family="monospace" font-size="10" fill="%2394a3b8"%3E3%3C/text%3E%3Ctext x="50" y="85" font-family="monospace" font-size="10" fill="%23f472b6"%3E  if%3C/text%3E%3Ctext x="80" y="85" font-family="monospace" font-size="10" fill="%23cbd5e1"%3E(!data)%3C/text%3E%3Ctext x="30" y="105" font-family="monospace" font-size="10" fill="%2394a3b8"%3E4%3C/text%3E%3Ctext x="50" y="105" font-family="monospace" font-size="10" fill="%23f472b6"%3E    throw%3C/text%3E%3Ctext x="100" y="105" font-family="monospace" font-size="10" fill="%23fbbf24"%3Enew%3C/text%3E%3Ctext x="130" y="105" font-family="monospace" font-size="10" fill="%2360a5fa"%3EError%3C/text%3E%3Crect x="340" y="30" width="30" height="30" rx="4" fill="%2322c55e"/%3E%3Ctext x="350" y="50" font-size="20" fill="%23ffffff"%3E✓%3C/text%3E%3C/svg%3E',
    order: 2,
    duration: 60,
    highlights: STEP_HIGHLIGHTS.CODE_GENERATION,
    category: DEMO_CATEGORIES.CORE_FEATURES,
  },
  {
    id: 'step-automated-testing',
    title: 'Comprehensive Test Coverage',
    description: 'Automated test suites are generated and executed in real-time. Unit tests, integration tests, and edge case validations ensure high code quality. Performance benchmarks and security checks run automatically before deployment.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Crect x="20" y="20" width="360" height="260" rx="8" fill="%23ffffff" stroke="%23e5e7eb" stroke-width="2"/%3E%3Ctext x="40" y="50" font-family="sans-serif" font-size="14" font-weight="bold" fill="%231e293b"%3ETest Results%3C/text%3E%3Crect x="40" y="70" width="320" height="30" rx="4" fill="%23dcfce7" stroke="%2322c55e" stroke-width="1"/%3E%3Ctext x="50" y="90" font-family="monospace" font-size="12" fill="%2315803d"%3E✓ Unit Tests: 45/45 passed%3C/text%3E%3Crect x="40" y="110" width="320" height="30" rx="4" fill="%23dcfce7" stroke="%2322c55e" stroke-width="1"/%3E%3Ctext x="50" y="130" font-family="monospace" font-size="12" fill="%2315803d"%3E✓ Integration: 12/12 passed%3C/text%3E%3Crect x="40" y="150" width="320" height="30" rx="4" fill="%23dcfce7" stroke="%2322c55e" stroke-width="1"/%3E%3Ctext x="50" y="170" font-family="monospace" font-size="12" fill="%2315803d"%3E✓ Coverage: 94%%3C/text%3E%3Crect x="40" y="190" width="320" height="30" rx="4" fill="%23dcfce7" stroke="%2322c55e" stroke-width="1"/%3E%3Ctext x="50" y="210" font-family="monospace" font-size="12" fill="%2315803d"%3E✓ Security: No issues%3C/text%3E%3Crect x="40" y="240" width="320" height="30" rx="4" fill="%2322c55e"/%3E%3Ctext x="140" y="262" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ffffff"%3EAll Tests Passed%3C/text%3E%3C/svg%3E',
    order: 3,
    duration: 50,
    highlights: STEP_HIGHLIGHTS.TESTING,
    category: DEMO_CATEGORIES.CORE_FEATURES,
  },
  {
    id: 'step-deployment',
    title: 'Deploy with Confidence',
    description: 'One-click deployment to your preferred platform with automated monitoring, health checks, and instant rollback capabilities. Zero-downtime updates ensure your application stays available during deployments.',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Crect x="20" y="20" width="360" height="260" rx="8" fill="%23ffffff" stroke="%23e5e7eb" stroke-width="2"/%3E%3Ccircle cx="200" cy="120" r="60" fill="%2322c55e" opacity="0.2"/%3E%3Ccircle cx="200" cy="120" r="40" fill="%2322c55e" opacity="0.4"/%3E%3Ccircle cx="200" cy="120" r="20" fill="%2322c55e"/%3E%3Cpath d="M 190 120 L 200 130 L 220 110" stroke="%23ffffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/%3E%3Ctext x="200" y="200" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="%231e293b"%3EDeployment Successful%3C/text%3E%3Ctext x="200" y="225" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%236b7280"%3Ehttps://your-app.com%3C/text%3E%3Crect x="120" y="240" width="160" height="30" rx="4" fill="%233b82f6"/%3E%3Ctext x="200" y="262" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23ffffff"%3EView Live Site%3C/text%3E%3C/svg%3E',
    order: 4,
    duration: 40,
    highlights: STEP_HIGHLIGHTS.DEPLOYMENT,
    category: DEMO_CATEGORIES.DEPLOYMENT,
    action: 'Start Free Trial',
    actionUrl: '#signup',
  },
]);

/**
 * Demo video configurations
 * @type {Array<VideoConfig>}
 */
const DEMO_VIDEOS = Object.freeze([
  {
    id: 'video-overview',
    title: 'Platform Overview',
    description: 'Complete walkthrough of the AI-powered development platform, from requirements to deployment.',
    url: 'https://example.com/videos/platform-overview.mp4',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"%3E%3Crect fill="%231e293b" width="640" height="360"/%3E%3Ccircle cx="320" cy="180" r="60" fill="%23ffffff" opacity="0.9"/%3E%3Cpath d="M 300 160 L 300 200 L 340 180 Z" fill="%231e293b"/%3E%3Ctext x="320" y="280" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23ffffff"%3EPlatform Overview%3C/text%3E%3Ctext x="320" y="310" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8"%3E5:30 minutes%3C/text%3E%3C/svg%3E',
    duration: 330,
    provider: 'custom',
    captions: {
      en: 'https://example.com/captions/overview-en.vtt',
    },
    autoplay: false,
    controls: true,
    loop: false,
    startTime: 0,
  },
  {
    id: 'video-quickstart',
    title: 'Quick Start Guide',
    description: 'Get started in under 3 minutes with this quick introduction to core features.',
    url: 'https://example.com/videos/quickstart.mp4',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"%3E%3Crect fill="%233b82f6" width="640" height="360"/%3E%3Ccircle cx="320" cy="180" r="60" fill="%23ffffff" opacity="0.9"/%3E%3Cpath d="M 300 160 L 300 200 L 340 180 Z" fill="%233b82f6"/%3E%3Ctext x="320" y="280" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23ffffff"%3EQuick Start%3C/text%3E%3Ctext x="320" y="310" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23dbeafe"%3E2:45 minutes%3C/text%3E%3C/svg%3E',
    duration: 165,
    provider: 'custom',
    captions: {
      en: 'https://example.com/captions/quickstart-en.vtt',
    },
    autoplay: false,
    controls: true,
    loop: false,
    startTime: 0,
  },
  {
    id: 'video-advanced',
    title: 'Advanced Features',
    description: 'Deep dive into advanced capabilities including custom integrations and enterprise features.',
    url: 'https://example.com/videos/advanced-features.mp4',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"%3E%3Crect fill="%2310b981" width="640" height="360"/%3E%3Ccircle cx="320" cy="180" r="60" fill="%23ffffff" opacity="0.9"/%3E%3Cpath d="M 300 160 L 300 200 L 340 180 Z" fill="%2310b981"/%3E%3Ctext x="320" y="280" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23ffffff"%3EAdvanced Features%3C/text%3E%3Ctext x="320" y="310" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23d1fae5"%3E8:15 minutes%3C/text%3E%3C/svg%3E',
    duration: 495,
    provider: 'custom',
    captions: {
      en: 'https://example.com/captions/advanced-en.vtt',
    },
    autoplay: false,
    controls: true,
    loop: false,
    startTime: 0,
  },
]);

/**
 * Demo modes
 * @type {Array<DemoMode>}
 */
const DEMO_MODES = Object.freeze([
  {
    id: 'mode-walkthrough',
    name: 'Interactive Walkthrough',
    description: 'Step-by-step guide with interface mockups and detailed explanations',
    type: 'walkthrough',
    default: true,
  },
  {
    id: 'mode-video',
    name: 'Video Demo',
    description: 'Watch a complete demonstration of the platform in action',
    type: 'video',
    default: false,
  },
  {
    id: 'mode-interactive',
    name: 'Try It Live',
    description: 'Experience the platform with an interactive sandbox environment',
    type: 'interactive',
    default: false,
  },
]);

/**
 * Demo navigation configuration
 */
const DEMO_NAVIGATION = Object.freeze({
  enableKeyboard: true,
  enableProgress: true,
  enableAutoAdvance: false,
  autoAdvanceDelay: 5000,
  enableLoop: false,
  enableModeSwitch: true,
  enableFullscreen: true,
  enableShare: true,
});

/**
 * Demo analytics events
 */
const DEMO_EVENTS = Object.freeze({
  DEMO_STARTED: 'demo_started',
  DEMO_COMPLETED: 'demo_completed',
  STEP_VIEWED: 'demo_step_viewed',
  VIDEO_PLAYED: 'demo_video_played',
  VIDEO_PAUSED: 'demo_video_paused',
  VIDEO_COMPLETED: 'demo_video_completed',
  MODE_SWITCHED: 'demo_mode_switched',
  CTA_CLICKED: 'demo_cta_clicked',
  SHARE_CLICKED: 'demo_share_clicked',
});

/**
 * Demo metadata
 */
const DEMO_METADATA = Object.freeze({
  version: '1.0.0',
  lastUpdated: '2025-12-06',
  totalSteps: DEMO_STEPS.length,
  totalVideos: DEMO_VIDEOS.length,
  totalModes: DEMO_MODES.length,
  estimatedDuration: DEMO_STEPS.reduce((sum, step) => sum + (step.duration || 0), 0),
  categories: Object.values(DEMO_CATEGORIES),
});

/**
 * Validates demo step
 * @param {Object} step - Step to validate
 * @param {number} index - Step index
 * @throws {TypeError} If step invalid
 */
const validateDemoStep = (step, index) => {
  if (!step || typeof step !== 'object') {
    throw new TypeError(`Demo step at index ${index} must be an object`);
  }

  const requiredFields = ['id', 'title', 'description', 'image', 'order'];
  for (const field of requiredFields) {
    if (typeof step[field] !== 'string' && typeof step[field] !== 'number') {
      throw new TypeError(`Demo step at index ${index} missing required field: ${field}`);
    }
  }

  if (step.duration !== undefined && (typeof step.duration !== 'number' || step.duration < 0)) {
    throw new TypeError(`Demo step at index ${index} duration must be non-negative number`);
  }

  if (step.highlights !== undefined && !Array.isArray(step.highlights)) {
    throw new TypeError(`Demo step at index ${index} highlights must be an array`);
  }
};

/**
 * Validates video configuration
 * @param {Object} video - Video to validate
 * @param {number} index - Video index
 * @throws {TypeError} If video invalid
 */
const validateVideoConfig = (video, index) => {
  if (!video || typeof video !== 'object') {
    throw new TypeError(`Video config at index ${index} must be an object`);
  }

  const requiredFields = ['id', 'title', 'url', 'thumbnail', 'duration'];
  for (const field of requiredFields) {
    if (typeof video[field] !== 'string' && typeof video[field] !== 'number') {
      throw new TypeError(`Video config at index ${index} missing required field: ${field}`);
    }
  }

  if (typeof video.duration !== 'number' || video.duration <= 0) {
    throw new TypeError(`Video config at index ${index} duration must be positive number`);
  }
};

/**
 * Gets demo step by ID
 * @param {string} stepId - Step ID
 * @returns {DemoStep|null} Demo step or null
 */
export const getDemoStepById = (stepId) => {
  if (typeof stepId !== 'string') {
    return null;
  }
  return DEMO_STEPS.find((step) => step.id === stepId) || null;
};

/**
 * Gets demo steps by category
 * @param {string} category - Category name
 * @returns {Array<DemoStep>} Filtered demo steps
 */
export const getDemoStepsByCategory = (category) => {
  if (typeof category !== 'string') {
    return [];
  }
  return DEMO_STEPS.filter((step) => step.category === category);
};

/**
 * Gets demo steps sorted by order
 * @returns {Array<DemoStep>} Sorted demo steps
 */
export const getDemoStepsSortedByOrder = () => {
  return [...DEMO_STEPS].sort((a, b) => a.order - b.order);
};

/**
 * Gets video by ID
 * @param {string} videoId - Video ID
 * @returns {VideoConfig|null} Video config or null
 */
export const getVideoById = (videoId) => {
  if (typeof videoId !== 'string') {
    return null;
  }
  return DEMO_VIDEOS.find((video) => video.id === videoId) || null;
};

/**
 * Gets default demo mode
 * @returns {DemoMode|null} Default mode or null
 */
export const getDefaultDemoMode = () => {
  return DEMO_MODES.find((mode) => mode.default) || DEMO_MODES[0] || null;
};

/**
 * Gets demo mode by ID
 * @param {string} modeId - Mode ID
 * @returns {DemoMode|null} Demo mode or null
 */
export const getDemoModeById = (modeId) => {
  if (typeof modeId !== 'string') {
    return null;
  }
  return DEMO_MODES.find((mode) => mode.id === modeId) || null;
};

/**
 * Gets total demo duration
 * @returns {number} Total duration in seconds
 */
export const getTotalDemoDuration = () => {
  return DEMO_STEPS.reduce((sum, step) => sum + (step.duration || 0), 0);
};

/**
 * Gets demo categories
 * @returns {Array<string>} Available categories
 */
export const getDemoCategories = () => {
  return Object.values(DEMO_CATEGORIES);
};

/**
 * Validates all demo content
 * @returns {Object} Validation result
 */
export const validateDemoContent = () => {
  const errors = [];

  try {
    DEMO_STEPS.forEach((step, index) => validateDemoStep(step, index));
  } catch (error) {
    errors.push({ type: 'step', message: error.message });
  }

  try {
    DEMO_VIDEOS.forEach((video, index) => validateVideoConfig(video, index));
  } catch (error) {
    errors.push({ type: 'video', message: error.message });
  }

  const stepIds = new Set();
  const duplicateStepIds = [];
  DEMO_STEPS.forEach((step) => {
    if (stepIds.has(step.id)) {
      duplicateStepIds.push(step.id);
    }
    stepIds.add(step.id);
  });

  if (duplicateStepIds.length > 0) {
    errors.push({
      type: 'step',
      message: `Duplicate step IDs found: ${duplicateStepIds.join(', ')}`,
    });
  }

  const videoIds = new Set();
  const duplicateVideoIds = [];
  DEMO_VIDEOS.forEach((video) => {
    if (videoIds.has(video.id)) {
      duplicateVideoIds.push(video.id);
    }
    videoIds.add(video.id);
  });

  if (duplicateVideoIds.length > 0) {
    errors.push({
      type: 'video',
      message: `Duplicate video IDs found: ${duplicateVideoIds.join(', ')}`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    metadata: DEMO_METADATA,
  };
};

export {
  DEMO_STEPS,
  DEMO_VIDEOS,
  DEMO_MODES,
  DEMO_CATEGORIES,
  DEMO_NAVIGATION,
  DEMO_EVENTS,
  DEMO_METADATA,
  STEP_HIGHLIGHTS,
};

export default DEMO_STEPS;