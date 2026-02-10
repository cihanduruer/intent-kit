import { Intent, ScaleLevel } from './intent';

/**
 * Architecture types that can be recommended based on scale.
 */
export type ArchitectureType = 'monolith' | 'microservices' | 'modular-monolith';

/**
 * Represents a technology stack recommendation.
 */
export interface StackRecommendation {
  /** Recommended architecture pattern */
  architecture: ArchitectureType;
  /** Rationale for the recommendation */
  rationale: string;
  /** Additional considerations for the stack */
  considerations: string[];
}

/**
 * Maps scale levels to architecture recommendations.
 */
const SCALE_ARCHITECTURE_MAP: Record<ScaleLevel, ArchitectureType> = {
  solo: 'monolith',
  startup: 'monolith',
  team: 'modular-monolith',
  enterprise: 'microservices'
};

/**
 * Rationale text for each architecture type.
 */
const ARCHITECTURE_RATIONALE: Record<ArchitectureType, string> = {
  monolith: 'A monolithic architecture is simpler to develop, deploy, and maintain for smaller teams.',
  'modular-monolith': 'A modular monolith provides clear boundaries while maintaining deployment simplicity for growing teams.',
  microservices: 'Microservices enable independent scaling and deployment, suitable for large teams and complex domains.'
};

/**
 * Considerations for each architecture type.
 */
const ARCHITECTURE_CONSIDERATIONS: Record<ArchitectureType, string[]> = {
  monolith: [
    'Keep code modular for future migration',
    'Use dependency injection for testability',
    'Consider database per module patterns'
  ],
  'modular-monolith': [
    'Define clear module boundaries',
    'Use internal APIs between modules',
    'Plan for potential service extraction'
  ],
  microservices: [
    'Invest in infrastructure automation',
    'Implement service discovery and load balancing',
    'Consider distributed tracing and observability'
  ]
};

/**
 * Selects the recommended architecture based on the intent's scale level.
 * 
 * @param scaleLevel - The scale level to evaluate
 * @returns The recommended architecture type
 */
export function selectArchitecture(scaleLevel: ScaleLevel): ArchitectureType {
  return SCALE_ARCHITECTURE_MAP[scaleLevel];
}

/**
 * Generates a full stack recommendation based on an intent.
 * 
 * @param intent - The intent to analyze
 * @returns A complete stack recommendation
 */
export function generateStackRecommendation(intent: Intent): StackRecommendation {
  const architecture = selectArchitecture(intent.scaleLevel);
  
  return {
    architecture,
    rationale: ARCHITECTURE_RATIONALE[architecture],
    considerations: ARCHITECTURE_CONSIDERATIONS[architecture]
  };
}

/**
 * Checks if an architecture is suitable for a given scale level.
 * 
 * @param scaleLevel - The scale level
 * @param architecture - The architecture to check
 * @returns True if the architecture is suitable
 */
export function isArchitectureSuitable(
  scaleLevel: ScaleLevel,
  architecture: ArchitectureType
): boolean {
  const recommended = selectArchitecture(scaleLevel);
  
  // Direct match is always suitable
  if (recommended === architecture) {
    return true;
  }
  
  // Monolith is suitable for any scale (may not be optimal)
  if (architecture === 'monolith') {
    return true;
  }
  
  // Modular monolith is suitable for team and startup
  if (architecture === 'modular-monolith' && 
      (scaleLevel === 'team' || scaleLevel === 'startup')) {
    return true;
  }
  
  return false;
}
