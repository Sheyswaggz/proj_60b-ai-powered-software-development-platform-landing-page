/**
 * Newsletter Signup Experiment Configuration
 *
 * Defines A/B test variants for newsletter signup optimization testing
 * different messaging, form layouts, and incentives. Designed to run
 * alongside other experiments without conflicts.
 *
 * @generated-from: task-id:c03a1995-6478-4b2e-a8c0-abbd07d3c751
 * @dependencies: ["newsletter-signup.js", "experiment-manager.js"]
 */

/**
 * Experiment configuration constants
 * @private
 */
const EXPERIMENT_CONFIG = Object.freeze({
  experimentName: 'newsletter_signup_optimization',
  description: 'Test different messaging and form layouts for newsletter signup',
  startDate: '2026-04-07',
  variants: {
    control: {
      weight: 0.5,
      priority: 0,
    },
    variant_a: {
      weight: 0.25,
      priority: 1,
    },
    variant_b: {
      weight: 0.25,
      priority: 2,
    },
  },
});

/**
 * Control variant configuration
 * Standard newsletter signup with default messaging
 * @private
 */
const CONTROL_VARIANT = Object.freeze({
  id: 'control',
  name: 'Control - Standard Newsletter',
  description: 'Default newsletter signup with standard messaging',
  headline: 'Stay Updated',
  subheadline: 'Get the latest insights and updates delivered to your inbox',
  placeholder: 'Enter your email',
  buttonText: 'Subscribe',
  consentText: 'I agree to receive marketing emails and accept the privacy policy',
  formLayout: 'horizontal',
  showIncentive: false,
  incentiveText: '',
  styling: {
    headlineSize: 'text-2xl',
    subheadlineSize: 'text-base',
    inputStyle: 'default',
    buttonStyle: 'primary',
    spacing: 'normal',
  },
  metadata: {
    created: '2026-04-07',
    lastModified: '2026-04-07',
    version: '1.0.0',
  },
});

/**
 * Variant A configuration
 * Benefit-focused messaging with incentive
 * @private
 */
const VARIANT_A = Object.freeze({
  id: 'variant_a',
  name: 'Variant A - Benefit Focus with Incentive',
  description: 'Emphasizes benefits and includes exclusive content incentive',
  headline: 'Join 10,000+ Developers',
  subheadline:
    'Get exclusive tips, tutorials, and early access to new features - all delivered weekly',
  placeholder: 'Your work email',
  buttonText: 'Get Free Updates',
  consentText: 'Yes, send me exclusive developer insights and updates',
  formLayout: 'vertical',
  showIncentive: true,
  incentiveText: 'Plus: Get our free "AI Development Best Practices" guide',
  styling: {
    headlineSize: 'text-3xl',
    subheadlineSize: 'text-lg',
    inputStyle: 'prominent',
    buttonStyle: 'accent',
    spacing: 'relaxed',
  },
  metadata: {
    created: '2026-04-07',
    lastModified: '2026-04-07',
    version: '1.0.0',
  },
});

/**
 * Variant B configuration
 * Urgency-driven messaging with social proof
 * @private
 */
const VARIANT_B = Object.freeze({
  id: 'variant_b',
  name: 'Variant B - Urgency with Social Proof',
  description: 'Creates urgency with time-limited offer and social proof elements',
  headline: 'Don\'t Miss Out',
  subheadline:
    'Join thousands of developers receiving weekly insights. Limited spots for exclusive content access.',
  placeholder: 'Enter email to claim your spot',
  buttonText: 'Secure My Spot',
  consentText: 'I want to receive exclusive updates and special offers',
  formLayout: 'horizontal',
  showIncentive: true,
  incentiveText: 'This week only: Free access to premium developer resources',
  styling: {
    headlineSize: 'text-2xl',
    subheadlineSize: 'text-base',
    inputStyle: 'bordered',
    buttonStyle: 'secondary',
    spacing: 'compact',
  },
  metadata: {
    created: '2026-04-07',
    lastModified: '2026-04-07',
    version: '1.0.0',
  },
});

/**
 * Experiment variants map
 * @type {Object.<string, Object>}
 */
export const NEWSLETTER_VARIANTS = Object.freeze({
  control: CONTROL_VARIANT,
  variant_a: VARIANT_A,
  variant_b: VARIANT_B,
});

/**
 * Experiment metadata
 * @type {Object}
 */
export const EXPERIMENT_METADATA = Object.freeze({
  name: EXPERIMENT_CONFIG.experimentName,
  description: EXPERIMENT_CONFIG.description,
  startDate: EXPERIMENT_CONFIG.startDate,
  type: 'conversion_optimization',
  status: 'active',
  targetMetric: 'newsletter_signup_conversion',
  secondaryMetrics: ['form_submission_rate', 'consent_acceptance_rate', 'email_validation_errors'],
  sampleSize: 1000,
  confidenceLevel: 0.95,
  minimumDetectableEffect: 0.05,
  trafficAllocation: {
    control: EXPERIMENT_CONFIG.variants.control.weight,
    variant_a: EXPERIMENT_CONFIG.variants.variant_a.weight,
    variant_b: EXPERIMENT_CONFIG.variants.variant_b.weight,
  },
});

/**
 * Gets variant configuration by ID
 * @param {string} variantId - Variant identifier
 * @returns {Object|null} Variant configuration or null if not found
 */
export const getVariantById = variantId => {
  if (typeof variantId !== 'string') {
    return null;
  }

  const variant = NEWSLETTER_VARIANTS[variantId];
  if (!variant) {
    return null;
  }

  return { ...variant };
};

/**
 * Gets all available variant IDs
 * @returns {string[]} Array of variant IDs
 */
export const getAvailableVariants = () => Object.keys(NEWSLETTER_VARIANTS);

/**
 * Gets variant by user assignment
 * Uses deterministic hash-based assignment for consistent user experience
 * @param {string} userId - User identifier
 * @returns {Object} Assigned variant configuration
 */
export const assignVariant = userId => {
  if (!userId || typeof userId !== 'string') {
    return { ...CONTROL_VARIANT };
  }

  const hash = simpleHash(userId + EXPERIMENT_CONFIG.experimentName);
  const normalizedHash = hash / 0xffffffff;

  let cumulativeWeight = 0;
  const variants = [
    { id: 'control', weight: EXPERIMENT_CONFIG.variants.control.weight },
    { id: 'variant_a', weight: EXPERIMENT_CONFIG.variants.variant_a.weight },
    { id: 'variant_b', weight: EXPERIMENT_CONFIG.variants.variant_b.weight },
  ];

  for (const variant of variants) {
    cumulativeWeight += variant.weight;
    if (normalizedHash <= cumulativeWeight) {
      return { ...NEWSLETTER_VARIANTS[variant.id] };
    }
  }

  return { ...CONTROL_VARIANT };
};

/**
 * Simple hash function for deterministic variant assignment
 * @param {string} str - String to hash
 * @returns {number} Hash value
 * @private
 */
const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Validates variant configuration
 * @param {Object} variant - Variant to validate
 * @returns {boolean} True if valid
 */
export const validateVariant = variant => {
  if (!variant || typeof variant !== 'object') {
    return false;
  }

  const requiredFields = [
    'id',
    'name',
    'description',
    'headline',
    'subheadline',
    'placeholder',
    'buttonText',
    'consentText',
    'formLayout',
    'showIncentive',
    'styling',
  ];

  for (const field of requiredFields) {
    if (!(field in variant)) {
      return false;
    }
  }

  if (!['horizontal', 'vertical'].includes(variant.formLayout)) {
    return false;
  }

  if (typeof variant.showIncentive !== 'boolean') {
    return false;
  }

  if (!variant.styling || typeof variant.styling !== 'object') {
    return false;
  }

  return true;
};

/**
 * Gets experiment configuration
 * @returns {Object} Experiment configuration
 */
export const getExperimentConfig = () => ({
  ...EXPERIMENT_CONFIG,
  variants: Object.keys(NEWSLETTER_VARIANTS).map(id => ({
    id,
    name: NEWSLETTER_VARIANTS[id].name,
    description: NEWSLETTER_VARIANTS[id].description,
  })),
});

/**
 * Checks if experiment is active
 * @returns {boolean} True if experiment is active
 */
export const isExperimentActive = () => {
  const startDate = new Date(EXPERIMENT_CONFIG.startDate);
  const now = new Date();
  return now >= startDate;
};

/**
 * Default export
 */
export default {
  NEWSLETTER_VARIANTS,
  EXPERIMENT_METADATA,
  getVariantById,
  getAvailableVariants,
  assignVariant,
  validateVariant,
  getExperimentConfig,
  isExperimentActive,
};
