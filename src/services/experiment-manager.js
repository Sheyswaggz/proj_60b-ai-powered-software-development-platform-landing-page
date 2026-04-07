/**
 * Experiment Manager Service
 *
 * Coordinates multiple simultaneous A/B experiments with conflict resolution,
 * state management, and unified interface for experiment operations. Ensures
 * experiments can run simultaneously without interfering with each other.
 *
 * @generated-from: task-id:c03a1995-6478-4b2e-a8c0-abbd07d3c751
 * @dependencies: ["newsletter-config.js", "hero-cta-config.js"]
 */

/**
 * Experiment state
 * @typedef {Object} ExperimentState
 * @property {string} experimentId - Experiment identifier
 * @property {string} variantId - Assigned variant
 * @property {string} userId - User identifier
 * @property {number} timestamp - Assignment timestamp
 * @property {Object} metadata - Additional metadata
 */

/**
 * Experiment registration
 * @typedef {Object} ExperimentRegistration
 * @property {string} id - Experiment identifier
 * @property {string} name - Experiment name
 * @property {Function} assignVariant - Variant assignment function
 * @property {Function} getVariantById - Get variant configuration
 * @property {number} priority - Experiment priority for conflict resolution
 * @property {string[]} conflictsWith - List of conflicting experiment IDs
 */

/**
 * Active experiments registry
 * @private
 */
const experimentsRegistry = new Map();

/**
 * User experiment assignments cache
 * @private
 */
const assignmentsCache = new Map();

/**
 * Experiment conflicts map
 * @private
 */
const conflictsMap = new Map();

/**
 * Structured event logger
 * @param {string} event - Event name
 * @param {Object} context - Event context
 * @private
 */
const logEvent = (event, context = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    service: 'experiment-manager',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[ExperimentManager]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'experiment_manager',
      ...context,
    });
  }
};

/**
 * Generates user identifier
 * Uses various browser fingerprinting techniques for consistent user identity
 * @returns {string} User identifier
 * @private
 */
const generateUserId = () => {
  if (typeof window === 'undefined') {
    return 'server-' + Math.random().toString(36).substring(7);
  }

  let userId = localStorage.getItem('experiment_user_id');

  if (!userId) {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width + 'x' + screen.height,
      screen.colorDepth,
    ].join('|');

    const hash = simpleHash(fingerprint);
    userId = 'user-' + hash.toString(36);
    localStorage.setItem('experiment_user_id', userId);
  }

  return userId;
};

/**
 * Simple hash function
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
 * Registers an experiment
 * @param {ExperimentRegistration} registration - Experiment registration details
 * @throws {Error} If registration is invalid
 */
export const registerExperiment = registration => {
  if (!registration || typeof registration !== 'object') {
    throw new TypeError('Experiment registration must be an object');
  }

  const { id, name, assignVariant, getVariantById, priority = 0, conflictsWith = [] } = registration;

  if (!id || typeof id !== 'string') {
    throw new TypeError('Experiment id must be a non-empty string');
  }

  if (!name || typeof name !== 'string') {
    throw new TypeError('Experiment name must be a non-empty string');
  }

  if (typeof assignVariant !== 'function') {
    throw new TypeError('assignVariant must be a function');
  }

  if (typeof getVariantById !== 'function') {
    throw new TypeError('getVariantById must be a function');
  }

  if (typeof priority !== 'number') {
    throw new TypeError('priority must be a number');
  }

  if (!Array.isArray(conflictsWith)) {
    throw new TypeError('conflictsWith must be an array');
  }

  if (experimentsRegistry.has(id)) {
    logEvent('experiment_registration_duplicate', { experimentId: id });
    throw new Error(`Experiment ${id} is already registered`);
  }

  experimentsRegistry.set(id, {
    id,
    name,
    assignVariant,
    getVariantById,
    priority,
    conflictsWith,
    registeredAt: Date.now(),
  });

  conflictsWith.forEach(conflictId => {
    if (!conflictsMap.has(id)) {
      conflictsMap.set(id, new Set());
    }
    conflictsMap.get(id).add(conflictId);
  });

  logEvent('experiment_registered', {
    experimentId: id,
    experimentName: name,
    priority,
    conflictCount: conflictsWith.length,
  });
};

/**
 * Unregisters an experiment
 * @param {string} experimentId - Experiment ID to unregister
 * @returns {boolean} True if unregistered successfully
 */
export const unregisterExperiment = experimentId => {
  if (!experimentId || typeof experimentId !== 'string') {
    return false;
  }

  const removed = experimentsRegistry.delete(experimentId);

  if (removed) {
    conflictsMap.delete(experimentId);

    for (const [userId, assignments] of assignmentsCache.entries()) {
      const filtered = assignments.filter(a => a.experimentId !== experimentId);
      if (filtered.length === 0) {
        assignmentsCache.delete(userId);
      } else {
        assignmentsCache.set(userId, filtered);
      }
    }

    logEvent('experiment_unregistered', { experimentId });
  }

  return removed;
};

/**
 * Checks for experiment conflicts
 * @param {string} experimentId - Experiment ID to check
 * @param {ExperimentState[]} currentAssignments - Current user assignments
 * @returns {boolean} True if there are conflicts
 * @private
 */
const hasConflicts = (experimentId, currentAssignments) => {
  const conflicts = conflictsMap.get(experimentId);
  if (!conflicts || conflicts.size === 0) {
    return false;
  }

  return currentAssignments.some(assignment => conflicts.has(assignment.experimentId));
};

/**
 * Resolves experiment conflicts using priority
 * @param {string} experimentId - Experiment ID
 * @param {ExperimentState[]} currentAssignments - Current assignments
 * @returns {ExperimentState[]} Resolved assignments
 * @private
 */
const resolveConflicts = (experimentId, currentAssignments) => {
  const experiment = experimentsRegistry.get(experimentId);
  if (!experiment) {
    return currentAssignments;
  }

  const conflicts = conflictsMap.get(experimentId);
  if (!conflicts || conflicts.size === 0) {
    return currentAssignments;
  }

  const filtered = currentAssignments.filter(assignment => {
    if (!conflicts.has(assignment.experimentId)) {
      return true;
    }

    const conflictingExperiment = experimentsRegistry.get(assignment.experimentId);
    if (!conflictingExperiment) {
      return true;
    }

    return conflictingExperiment.priority > experiment.priority;
  });

  const removedCount = currentAssignments.length - filtered.length;
  if (removedCount > 0) {
    logEvent('experiment_conflict_resolved', {
      experimentId,
      removedAssignments: removedCount,
      remainingAssignments: filtered.length,
    });
  }

  return filtered;
};

/**
 * Assigns user to experiment variant
 * @param {string} experimentId - Experiment identifier
 * @param {string} [userId] - User identifier (auto-generated if not provided)
 * @returns {ExperimentState|null} Assignment state or null if failed
 */
export const assignUserToExperiment = (experimentId, userId = null) => {
  if (!experimentId || typeof experimentId !== 'string') {
    logEvent('experiment_assignment_error', { error: 'Invalid experiment ID' });
    return null;
  }

  const experiment = experimentsRegistry.get(experimentId);
  if (!experiment) {
    logEvent('experiment_assignment_error', {
      experimentId,
      error: 'Experiment not registered',
    });
    return null;
  }

  const effectiveUserId = userId || generateUserId();
  const cacheKey = effectiveUserId;

  let userAssignments = assignmentsCache.get(cacheKey) || [];
  const existingAssignment = userAssignments.find(a => a.experimentId === experimentId);

  if (existingAssignment) {
    logEvent('experiment_assignment_cached', {
      experimentId,
      userId: effectiveUserId,
      variantId: existingAssignment.variantId,
    });
    return existingAssignment;
  }

  if (hasConflicts(experimentId, userAssignments)) {
    userAssignments = resolveConflicts(experimentId, userAssignments);
  }

  try {
    const variant = experiment.assignVariant(effectiveUserId);

    if (!variant || !variant.id) {
      logEvent('experiment_assignment_error', {
        experimentId,
        userId: effectiveUserId,
        error: 'Invalid variant returned',
      });
      return null;
    }

    const assignment = {
      experimentId,
      variantId: variant.id,
      userId: effectiveUserId,
      timestamp: Date.now(),
      metadata: {
        experimentName: experiment.name,
        variantName: variant.name || variant.id,
      },
    };

    userAssignments.push(assignment);
    assignmentsCache.set(cacheKey, userAssignments);

    logEvent('experiment_assignment_created', {
      experimentId,
      userId: effectiveUserId,
      variantId: variant.id,
      hasConflicts: hasConflicts(experimentId, userAssignments),
    });

    return assignment;
  } catch (error) {
    logEvent('experiment_assignment_error', {
      experimentId,
      userId: effectiveUserId,
      error: error.message,
    });
    return null;
  }
};

/**
 * Gets variant configuration for user
 * @param {string} experimentId - Experiment identifier
 * @param {string} [userId] - User identifier
 * @returns {Object|null} Variant configuration or null if not found
 */
export const getVariantForUser = (experimentId, userId = null) => {
  const assignment = assignUserToExperiment(experimentId, userId);
  if (!assignment) {
    return null;
  }

  const experiment = experimentsRegistry.get(experimentId);
  if (!experiment) {
    return null;
  }

  try {
    const variant = experiment.getVariantById(assignment.variantId);
    return variant;
  } catch (error) {
    logEvent('get_variant_error', {
      experimentId,
      variantId: assignment.variantId,
      error: error.message,
    });
    return null;
  }
};

/**
 * Gets all active experiments for user
 * @param {string} [userId] - User identifier
 * @returns {ExperimentState[]} Array of active experiments
 */
export const getUserExperiments = (userId = null) => {
  const effectiveUserId = userId || generateUserId();
  return assignmentsCache.get(effectiveUserId) || [];
};

/**
 * Gets all registered experiments
 * @returns {Object[]} Array of experiment metadata
 */
export const getRegisteredExperiments = () =>
  Array.from(experimentsRegistry.values()).map(exp => ({
    id: exp.id,
    name: exp.name,
    priority: exp.priority,
    conflictsWith: exp.conflictsWith,
    registeredAt: exp.registeredAt,
  }));

/**
 * Clears all experiment assignments for user
 * @param {string} [userId] - User identifier
 */
export const clearUserExperiments = (userId = null) => {
  const effectiveUserId = userId || generateUserId();
  const removed = assignmentsCache.delete(effectiveUserId);

  if (removed) {
    logEvent('user_experiments_cleared', { userId: effectiveUserId });
  }
};

/**
 * Clears all cached assignments
 * Useful for testing and development
 */
export const clearAllAssignments = () => {
  const count = assignmentsCache.size;
  assignmentsCache.clear();

  logEvent('all_assignments_cleared', { count });
};

/**
 * Gets experiment manager statistics
 * @returns {Object} Statistics object
 */
export const getStatistics = () => ({
  registeredExperiments: experimentsRegistry.size,
  activeUsers: assignmentsCache.size,
  totalAssignments: Array.from(assignmentsCache.values()).reduce(
    (sum, assignments) => sum + assignments.length,
    0
  ),
  conflicts: conflictsMap.size,
});

/**
 * Validates experiment manager state
 * @returns {Object} Validation result with warnings and errors
 */
export const validateState = () => {
  const warnings = [];
  const errors = [];

  for (const [experimentId, experiment] of experimentsRegistry.entries()) {
    for (const conflictId of experiment.conflictsWith) {
      if (!experimentsRegistry.has(conflictId)) {
        warnings.push(`Experiment ${experimentId} declares conflict with unregistered ${conflictId}`);
      }
    }

    const reciprocalConflicts = conflictsMap.get(experimentId);
    if (reciprocalConflicts) {
      for (const conflictId of reciprocalConflicts) {
        const conflictExp = experimentsRegistry.get(conflictId);
        if (conflictExp && !conflictExp.conflictsWith.includes(experimentId)) {
          warnings.push(
            `Conflict between ${experimentId} and ${conflictId} is not bidirectional`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Default export
 */
export default {
  registerExperiment,
  unregisterExperiment,
  assignUserToExperiment,
  getVariantForUser,
  getUserExperiments,
  getRegisteredExperiments,
  clearUserExperiments,
  clearAllAssignments,
  getStatistics,
  validateState,
};
