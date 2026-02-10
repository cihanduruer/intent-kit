/**
 * Intent Kit Core Types and Functions
 * 
 * This is a standalone copy of the intent-kit core functionality
 * for use within the VS Code extension.
 */

/**
 * Scale level for the project/intent.
 */
export type ScaleLevel = 'solo' | 'startup' | 'team' | 'enterprise';

/**
 * Represents a development intent.
 */
export interface Intent {
    name: string;
    description?: string;
    scaleLevel: ScaleLevel;
    requirements: string[];
    metadata?: Record<string, unknown>;
}

/**
 * Result of intent validation.
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Architecture types that can be recommended.
 */
export type ArchitectureType = 'monolith' | 'microservices' | 'modular-monolith';

/**
 * Represents a technology stack recommendation.
 */
export interface StackRecommendation {
    architecture: ArchitectureType;
    rationale: string;
    considerations: string[];
}

/**
 * Valid scale levels.
 */
export const VALID_SCALE_LEVELS: readonly ScaleLevel[] = [
    'solo',
    'startup',
    'team',
    'enterprise'
] as const;

/**
 * Validates an intent object.
 */
export function validateIntent(intent: Intent): ValidationResult {
    const errors: string[] = [];

    if (!intent.name || typeof intent.name !== 'string' || intent.name.trim() === '') {
        errors.push('Intent must have a non-empty name');
    }

    if (!VALID_SCALE_LEVELS.includes(intent.scaleLevel)) {
        errors.push(`Scale level must be one of: ${VALID_SCALE_LEVELS.join(', ')}`);
    }

    if (!Array.isArray(intent.requirements) || intent.requirements.length === 0) {
        errors.push('Intent must have a non-empty requirements array');
    } else {
        const invalidRequirements = intent.requirements.filter(
            req => typeof req !== 'string' || req.trim() === ''
        );
        if (invalidRequirements.length > 0) {
            errors.push('All requirements must be non-empty strings');
        }
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Creates a new intent.
 */
export function createIntent(
    name: string,
    scaleLevel: ScaleLevel,
    requirements: string[]
): Intent {
    return { name, scaleLevel, requirements };
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

const ARCHITECTURE_RATIONALE: Record<ArchitectureType, string> = {
    monolith: 'A monolithic architecture is simpler to develop, deploy, and maintain for smaller teams.',
    'modular-monolith': 'A modular monolith provides clear boundaries while maintaining deployment simplicity for growing teams.',
    microservices: 'Microservices enable independent scaling and deployment, suitable for large teams and complex domains.'
};

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
 * Generates a full stack recommendation based on an intent.
 */
export function generateStackRecommendation(intent: Intent): StackRecommendation {
    const architecture = SCALE_ARCHITECTURE_MAP[intent.scaleLevel];

    return {
        architecture,
        rationale: ARCHITECTURE_RATIONALE[architecture],
        considerations: ARCHITECTURE_CONSIDERATIONS[architecture]
    };
}
