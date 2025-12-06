/**
 * Use Cases and Testimonials Data Module
 * 
 * Comprehensive data structure containing real-world use case scenarios,
 * customer testimonials, metrics, and configuration for the use cases section.
 * Includes realistic content for developers, businesses, and entrepreneurs
 * with measurable outcomes and success stories.
 * 
 * @generated-from: task-id:TASK-006
 * @modifies: src/components/use-cases-section.js
 * @dependencies: []
 */

/**
 * Use case data structure
 * @typedef {Object} UseCase
 * @property {string} id - Unique identifier
 * @property {string} title - Use case title
 * @property {string} segment - Target user segment
 * @property {string} problem - Problem description
 * @property {string} solution - Solution description
 * @property {Array<Metric>} metrics - Measurable outcomes
 * @property {string} icon - Icon identifier
 * @property {number} order - Display order
 * @property {string} category - Use case category
 * @property {Array<string>} tags - Related tags
 */

/**
 * Testimonial data structure
 * @typedef {Object} Testimonial
 * @property {string} id - Unique identifier
 * @property {string} quote - Testimonial quote
 * @property {string} author - Author name
 * @property {string} role - Author role/title
 * @property {string} company - Company name
 * @property {string} avatar - Avatar image URL
 * @property {string} segment - Related user segment
 * @property {string} useCaseId - Related use case ID
 * @property {number} rating - Rating out of 5
 */

/**
 * Metric data structure
 * @typedef {Object} Metric
 * @property {string} label - Metric label
 * @property {string} value - Display value
 * @property {string} unit - Unit string
 * @property {number} target - Target number for animation
 */

/**
 * Use case categories
 * @constant
 */
const USE_CASE_CATEGORIES = Object.freeze({
  STARTUP: 'startup',
  ENTERPRISE: 'enterprise',
  DEVELOPER: 'developer',
  AGENCY: 'agency',
});

/**
 * User segments
 * @constant
 */
const USER_SEGMENTS = Object.freeze({
  SOLO_DEVELOPER: 'Solo Developer',
  STARTUP_FOUNDER: 'Startup Founder',
  ENTERPRISE_TEAM: 'Enterprise Team',
  AGENCY_OWNER: 'Agency Owner',
  FREELANCER: 'Freelancer',
  TECH_LEAD: 'Tech Lead',
});

/**
 * Use cases data
 * @constant
 * @type {Array<UseCase>}
 */
const USE_CASES = Object.freeze([
  {
    id: 'solo-developer-mvp',
    title: 'Rapid MVP Development',
    segment: USER_SEGMENTS.SOLO_DEVELOPER,
    problem: 'Solo developers struggle to build production-ready MVPs quickly while maintaining code quality. Manual coding, testing, and deployment consume weeks of valuable time, delaying market validation.',
    solution: 'Our AI platform generates complete, production-ready features with comprehensive tests and documentation. Developers describe requirements in natural language and receive deployable code in minutes, accelerating time-to-market by 10x.',
    metrics: [
      {
        label: 'Time Saved',
        value: '85%',
        unit: '%',
        target: 85,
      },
      {
        label: 'Code Quality',
        value: '95%',
        unit: '%',
        target: 95,
      },
      {
        label: 'Features/Week',
        value: '12+',
        unit: '+',
        target: 12,
      },
    ],
    icon: 'rocket',
    order: 1,
    category: USE_CASE_CATEGORIES.DEVELOPER,
    tags: ['mvp', 'rapid-development', 'solo-developer', 'time-saving'],
  },
  {
    id: 'startup-scaling',
    title: 'Scaling Without Hiring',
    segment: USER_SEGMENTS.STARTUP_FOUNDER,
    problem: 'Early-stage startups need to ship features rapidly but lack resources to hire large engineering teams. Technical debt accumulates as founders rush to meet deadlines, creating maintenance nightmares.',
    solution: 'AI-powered development enables small teams to achieve enterprise-level output. Generate scalable architectures, comprehensive test suites, and production-grade code that grows with your business without accumulating technical debt.',
    metrics: [
      {
        label: 'Team Productivity',
        value: '300%',
        unit: '%',
        target: 300,
      },
      {
        label: 'Cost Reduction',
        value: '60%',
        unit: '%',
        target: 60,
      },
      {
        label: 'Release Velocity',
        value: '5x',
        unit: 'x',
        target: 5,
      },
    ],
    icon: 'building',
    order: 2,
    category: USE_CASE_CATEGORIES.STARTUP,
    tags: ['scaling', 'startup', 'cost-reduction', 'productivity'],
  },
  {
    id: 'enterprise-modernization',
    title: 'Legacy System Modernization',
    segment: USER_SEGMENTS.ENTERPRISE_TEAM,
    problem: 'Enterprise teams face massive technical debt from legacy systems. Manual refactoring is risky, time-consuming, and expensive. Business pressure demands faster modernization without disrupting operations.',
    solution: 'AI analyzes legacy codebases and generates modern, maintainable replacements while preserving business logic. Automated testing ensures feature parity. Gradual migration paths minimize risk and downtime.',
    metrics: [
      {
        label: 'Migration Speed',
        value: '70%',
        unit: '%',
        target: 70,
      },
      {
        label: 'Bug Reduction',
        value: '80%',
        unit: '%',
        target: 80,
      },
      {
        label: 'Maintenance Cost',
        value: '50%',
        unit: '%',
        target: 50,
      },
    ],
    icon: 'users',
    order: 3,
    category: USE_CASE_CATEGORIES.ENTERPRISE,
    tags: ['modernization', 'legacy', 'enterprise', 'refactoring'],
  },
  {
    id: 'agency-client-delivery',
    title: 'Accelerated Client Delivery',
    segment: USER_SEGMENTS.AGENCY_OWNER,
    problem: 'Development agencies struggle with tight deadlines, scope creep, and maintaining quality across multiple client projects. Manual development limits project capacity and profit margins.',
    solution: 'Generate client-ready features in hours instead of weeks. Maintain consistent code quality across all projects. Scale project capacity without proportional hiring. Deliver more projects with existing team size.',
    metrics: [
      {
        label: 'Project Capacity',
        value: '200%',
        unit: '%',
        target: 200,
      },
      {
        label: 'Profit Margin',
        value: '45%',
        unit: '%',
        target: 45,
      },
      {
        label: 'Client Satisfaction',
        value: '98%',
        unit: '%',
        target: 98,
      },
    ],
    icon: 'building',
    order: 4,
    category: USE_CASE_CATEGORIES.AGENCY,
    tags: ['agency', 'client-delivery', 'capacity', 'quality'],
  },
  {
    id: 'freelancer-competitive-edge',
    title: 'Freelancer Competitive Advantage',
    segment: USER_SEGMENTS.FREELANCER,
    problem: 'Freelance developers compete on price and speed while maintaining quality. Limited time means choosing between more clients or better work. Manual development caps earning potential.',
    solution: 'AI assistance enables freelancers to deliver enterprise-quality work at startup speed. Take on more projects simultaneously. Provide comprehensive documentation and testing that commands premium rates.',
    metrics: [
      {
        label: 'Income Growth',
        value: '150%',
        unit: '%',
        target: 150,
      },
      {
        label: 'Active Projects',
        value: '3x',
        unit: 'x',
        target: 3,
      },
      {
        label: 'Client Retention',
        value: '92%',
        unit: '%',
        target: 92,
      },
    ],
    icon: 'user',
    order: 5,
    category: USE_CASE_CATEGORIES.DEVELOPER,
    tags: ['freelancer', 'income', 'competitive-edge', 'quality'],
  },
  {
    id: 'tech-lead-team-efficiency',
    title: 'Engineering Team Efficiency',
    segment: USER_SEGMENTS.TECH_LEAD,
    problem: 'Tech leads spend excessive time on code reviews, architecture decisions, and mentoring junior developers. Team velocity suffers from inconsistent code quality and knowledge gaps.',
    solution: 'AI generates consistent, well-architected code that follows team standards. Automated code reviews catch issues early. Junior developers learn from AI-generated examples. Tech leads focus on strategic decisions.',
    metrics: [
      {
        label: 'Review Time',
        value: '65%',
        unit: '%',
        target: 65,
      },
      {
        label: 'Team Velocity',
        value: '180%',
        unit: '%',
        target: 180,
      },
      {
        label: 'Code Consistency',
        value: '95%',
        unit: '%',
        target: 95,
      },
    ],
    icon: 'users',
    order: 6,
    category: USE_CASE_CATEGORIES.ENTERPRISE,
    tags: ['tech-lead', 'team-efficiency', 'mentoring', 'consistency'],
  },
]);

/**
 * Testimonials data
 * @constant
 * @type {Array<Testimonial>}
 */
const TESTIMONIALS = Object.freeze([
  {
    id: 'testimonial-sarah-chen',
    quote: 'This platform transformed how I build products. What used to take weeks now takes days. The generated code is production-ready with comprehensive tests. I launched my SaaS MVP in 3 weeks instead of 3 months.',
    author: 'Sarah Chen',
    role: 'Founder & Solo Developer',
    company: 'TaskFlow AI',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    segment: USER_SEGMENTS.SOLO_DEVELOPER,
    useCaseId: 'solo-developer-mvp',
    rating: 5,
  },
  {
    id: 'testimonial-marcus-rodriguez',
    quote: 'As a startup founder with limited technical resources, this AI platform has been a game-changer. We ship features 5x faster than before and our code quality actually improved. It\'s like having a senior engineering team without the overhead.',
    author: 'Marcus Rodriguez',
    role: 'CEO & Co-founder',
    company: 'FinTech Innovations',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    segment: USER_SEGMENTS.STARTUP_FOUNDER,
    useCaseId: 'startup-scaling',
    rating: 5,
  },
  {
    id: 'testimonial-jennifer-park',
    quote: 'We modernized our 10-year-old legacy system in 6 months instead of the projected 2 years. The AI understood our business logic and generated clean, maintainable code. Our maintenance costs dropped by 50% immediately.',
    author: 'Jennifer Park',
    role: 'VP of Engineering',
    company: 'Global Retail Corp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    segment: USER_SEGMENTS.ENTERPRISE_TEAM,
    useCaseId: 'enterprise-modernization',
    rating: 5,
  },
  {
    id: 'testimonial-david-thompson',
    quote: 'Our agency doubled project capacity without hiring. We deliver client projects faster with better quality. The consistent code generation means less technical debt and happier clients. Our profit margins increased by 45%.',
    author: 'David Thompson',
    role: 'Founder & Creative Director',
    company: 'Digital Craft Agency',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    segment: USER_SEGMENTS.AGENCY_OWNER,
    useCaseId: 'agency-client-delivery',
    rating: 5,
  },
  {
    id: 'testimonial-priya-sharma',
    quote: 'As a freelancer, this platform gave me a competitive edge. I can take on 3x more projects while delivering enterprise-quality work. My clients love the comprehensive documentation and testing. My income increased by 150% in 6 months.',
    author: 'Priya Sharma',
    role: 'Full-Stack Developer',
    company: 'Independent Consultant',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    segment: USER_SEGMENTS.FREELANCER,
    useCaseId: 'freelancer-competitive-edge',
    rating: 5,
  },
  {
    id: 'testimonial-alex-kim',
    quote: 'My team\'s velocity increased by 180% after adopting this platform. Code reviews are faster, quality is consistent, and junior developers learn from AI-generated examples. I finally have time for strategic architecture decisions.',
    author: 'Alex Kim',
    role: 'Engineering Manager',
    company: 'TechScale Solutions',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    segment: USER_SEGMENTS.TECH_LEAD,
    useCaseId: 'tech-lead-team-efficiency',
    rating: 5,
  },
]);

/**
 * Overall platform metrics
 * @constant
 */
const PLATFORM_METRICS = Object.freeze({
  totalUsers: {
    label: 'Active Users',
    value: '50K+',
    unit: 'K+',
    target: 50,
    description: 'Developers and teams using the platform',
  },
  codeGenerated: {
    label: 'Lines of Code Generated',
    value: '100M+',
    unit: 'M+',
    target: 100,
    description: 'Production-ready code generated',
  },
  timeSaved: {
    label: 'Development Hours Saved',
    value: '2M+',
    unit: 'M+',
    target: 2,
    description: 'Collective time saved across all users',
  },
  satisfaction: {
    label: 'User Satisfaction',
    value: '98%',
    unit: '%',
    target: 98,
    description: 'Users rating the platform 4+ stars',
  },
});

/**
 * Success story highlights
 * @constant
 */
const SUCCESS_HIGHLIGHTS = Object.freeze([
  {
    id: 'highlight-mvp-speed',
    title: 'MVP in 3 Weeks',
    description: 'Solo developer launched full-featured SaaS product',
    metric: '10x faster',
    icon: 'rocket',
  },
  {
    id: 'highlight-cost-savings',
    title: '$500K Saved',
    description: 'Startup avoided hiring 5 additional engineers',
    metric: '60% cost reduction',
    icon: 'building',
  },
  {
    id: 'highlight-legacy-migration',
    title: 'Legacy System Modernized',
    description: 'Enterprise migrated 10-year-old codebase in 6 months',
    metric: '70% faster',
    icon: 'users',
  },
  {
    id: 'highlight-agency-growth',
    title: 'Agency Doubled Revenue',
    description: 'Increased project capacity without hiring',
    metric: '200% growth',
    icon: 'building',
  },
]);

/**
 * Configuration for use cases section
 * @constant
 */
const USE_CASES_CONFIG = Object.freeze({
  displayLimit: 6,
  enableFiltering: true,
  enableSearch: true,
  defaultCategory: 'all',
  animationDelay: 100,
  transitionDuration: 300,
  enableMetricAnimation: true,
  enableHoverEffects: true,
});

/**
 * Configuration for testimonial carousel
 * @constant
 */
const TESTIMONIAL_CONFIG = Object.freeze({
  autoplay: true,
  interval: 6000,
  loop: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  transitionDuration: 500,
  transitionEasing: 'ease-in-out',
  showNavigation: true,
  showIndicators: true,
});

/**
 * Validates use case data structure
 * @returns {Object} Validation result
 */
const validateUseCases = () => {
  const errors = [];
  const warnings = [];

  USE_CASES.forEach((useCase, index) => {
    if (!useCase.id || typeof useCase.id !== 'string') {
      errors.push(`Use case at index ${index} missing valid id`);
    }
    if (!useCase.title || typeof useCase.title !== 'string') {
      errors.push(`Use case at index ${index} missing valid title`);
    }
    if (!useCase.segment || typeof useCase.segment !== 'string') {
      errors.push(`Use case at index ${index} missing valid segment`);
    }
    if (!useCase.problem || typeof useCase.problem !== 'string') {
      errors.push(`Use case at index ${index} missing valid problem`);
    }
    if (!useCase.solution || typeof useCase.solution !== 'string') {
      errors.push(`Use case at index ${index} missing valid solution`);
    }
    if (!Array.isArray(useCase.metrics) || useCase.metrics.length === 0) {
      errors.push(`Use case at index ${index} missing valid metrics array`);
    }
    if (useCase.metrics) {
      useCase.metrics.forEach((metric, metricIndex) => {
        if (!metric.label || !metric.value || !metric.unit || typeof metric.target !== 'number') {
          errors.push(`Use case ${useCase.id} metric at index ${metricIndex} invalid`);
        }
      });
    }
    if (!useCase.icon || typeof useCase.icon !== 'string') {
      warnings.push(`Use case at index ${index} missing icon`);
    }
    if (typeof useCase.order !== 'number') {
      warnings.push(`Use case at index ${index} missing order`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validates testimonial data structure
 * @returns {Object} Validation result
 */
const validateTestimonials = () => {
  const errors = [];
  const warnings = [];

  TESTIMONIALS.forEach((testimonial, index) => {
    if (!testimonial.id || typeof testimonial.id !== 'string') {
      errors.push(`Testimonial at index ${index} missing valid id`);
    }
    if (!testimonial.quote || typeof testimonial.quote !== 'string') {
      errors.push(`Testimonial at index ${index} missing valid quote`);
    }
    if (!testimonial.author || typeof testimonial.author !== 'string') {
      errors.push(`Testimonial at index ${index} missing valid author`);
    }
    if (!testimonial.role || typeof testimonial.role !== 'string') {
      warnings.push(`Testimonial at index ${index} missing role`);
    }
    if (!testimonial.company || typeof testimonial.company !== 'string') {
      warnings.push(`Testimonial at index ${index} missing company`);
    }
    if (!testimonial.avatar || typeof testimonial.avatar !== 'string') {
      warnings.push(`Testimonial at index ${index} missing avatar`);
    }
    if (!testimonial.segment || typeof testimonial.segment !== 'string') {
      warnings.push(`Testimonial at index ${index} missing segment`);
    }
    if (typeof testimonial.rating !== 'number' || testimonial.rating < 1 || testimonial.rating > 5) {
      warnings.push(`Testimonial at index ${index} invalid rating`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Gets use case by ID
 * @param {string} useCaseId - Use case ID
 * @returns {UseCase|null} Use case or null if not found
 */
const getUseCaseById = (useCaseId) => {
  if (typeof useCaseId !== 'string' || !useCaseId.trim()) {
    return null;
  }
  return USE_CASES.find((useCase) => useCase.id === useCaseId) || null;
};

/**
 * Gets use cases by segment
 * @param {string} segment - User segment
 * @returns {Array<UseCase>} Filtered use cases
 */
const getUseCasesBySegment = (segment) => {
  if (typeof segment !== 'string' || !segment.trim()) {
    return [];
  }
  return USE_CASES.filter((useCase) => useCase.segment === segment);
};

/**
 * Gets use cases by category
 * @param {string} category - Category
 * @returns {Array<UseCase>} Filtered use cases
 */
const getUseCasesByCategory = (category) => {
  if (typeof category !== 'string' || !category.trim()) {
    return [];
  }
  return USE_CASES.filter((useCase) => useCase.category === category);
};

/**
 * Gets use cases sorted by order
 * @returns {Array<UseCase>} Sorted use cases
 */
const getUseCasesSortedByOrder = () => {
  return [...USE_CASES].sort((a, b) => a.order - b.order);
};

/**
 * Gets testimonials by segment
 * @param {string} segment - User segment
 * @returns {Array<Testimonial>} Filtered testimonials
 */
const getTestimonialsBySegment = (segment) => {
  if (typeof segment !== 'string' || !segment.trim()) {
    return [];
  }
  return TESTIMONIALS.filter((testimonial) => testimonial.segment === segment);
};

/**
 * Gets testimonials by use case ID
 * @param {string} useCaseId - Use case ID
 * @returns {Array<Testimonial>} Related testimonials
 */
const getTestimonialsByUseCaseId = (useCaseId) => {
  if (typeof useCaseId !== 'string' || !useCaseId.trim()) {
    return [];
  }
  return TESTIMONIALS.filter((testimonial) => testimonial.useCaseId === useCaseId);
};

/**
 * Gets all use cases
 * @returns {Array<UseCase>} All use cases
 */
const getAllUseCases = () => {
  return [...USE_CASES];
};

/**
 * Gets all testimonials
 * @returns {Array<Testimonial>} All testimonials
 */
const getAllTestimonials = () => {
  return [...TESTIMONIALS];
};

/**
 * Gets total use cases count
 * @returns {number} Total count
 */
const getTotalUseCases = () => {
  return USE_CASES.length;
};

/**
 * Gets total testimonials count
 * @returns {number} Total count
 */
const getTotalTestimonials = () => {
  return TESTIMONIALS.length;
};

/**
 * Gets available segments
 * @returns {Array<string>} Available segments
 */
const getAvailableSegments = () => {
  return Object.values(USER_SEGMENTS);
};

/**
 * Gets available categories
 * @returns {Array<string>} Available categories
 */
const getAvailableCategories = () => {
  return Object.values(USE_CASE_CATEGORIES);
};

export {
  USE_CASES,
  TESTIMONIALS,
  PLATFORM_METRICS,
  SUCCESS_HIGHLIGHTS,
  USE_CASES_CONFIG,
  TESTIMONIAL_CONFIG,
  USE_CASE_CATEGORIES,
  USER_SEGMENTS,
  getUseCaseById,
  getUseCasesBySegment,
  getUseCasesByCategory,
  getUseCasesSortedByOrder,
  getTestimonialsBySegment,
  getTestimonialsByUseCaseId,
  getAllUseCases,
  getAllTestimonials,
  getTotalUseCases,
  getTotalTestimonials,
  getAvailableSegments,
  getAvailableCategories,
  validateUseCases,
  validateTestimonials,
};

export default USE_CASES;