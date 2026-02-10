/**
 * Intent represents what the user wants to build.
 * It captures the high-level requirements without specifying technical implementation.
 */
export interface Intent {
  /** Name of the project */
  name: string;
  
  /** Scale level determines architecture complexity and features */
  scale: ScaleLevel;
  
  /** High-level requirements describing what the system should do */
  requirements: string[];
  
  /** Optional: Specific features or capabilities */
  features?: string[];
  
  /** Optional: Constraints or preferences */
  constraints?: Constraints;
}

/**
 * Scale levels determine the architectural complexity
 */
export enum ScaleLevel {
  /** Single developer, simple project */
  SOLO = 'solo',
  
  /** Small team, moderate complexity */
  STARTUP = 'startup',
  
  /** Medium team, scalable architecture */
  TEAM = 'team',
  
  /** Large organization, enterprise features */
  ENTERPRISE = 'enterprise'
}

/**
 * Constraints allow users to specify preferences or limitations
 */
export interface Constraints {
  /** Preferred programming languages */
  languages?: string[];
  
  /** Preferred platforms (cloud providers, deployment targets) */
  platforms?: string[];
  
  /** Avoid certain technologies */
  avoid?: string[];
  
  /** Budget considerations (affects infrastructure choices) */
  budgetLevel?: 'minimal' | 'moderate' | 'flexible';
}

/**
 * Validates an intent object
 */
export function validateIntent(intent: any): intent is Intent {
  if (!intent || typeof intent !== 'object') {
    return false;
  }
  
  if (!intent.name || typeof intent.name !== 'string' || intent.name.trim() === '') {
    return false;
  }
  
  if (!intent.scale || !Object.values(ScaleLevel).includes(intent.scale)) {
    return false;
  }
  
  if (!Array.isArray(intent.requirements) || intent.requirements.length === 0) {
    return false;
  }
  
  return true;
}

/**
 * Creates a default intent
 */
export function createDefaultIntent(name: string): Intent {
  return {
    name,
    scale: ScaleLevel.SOLO,
    requirements: ['Build a functional application']
  };
}
