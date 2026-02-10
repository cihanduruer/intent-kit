/**
 * Scale level for the project/intent.
 * Determines the recommended architecture complexity.
 */
export type ScaleLevel = 'solo' | 'startup' | 'team' | 'enterprise';

/**
 * Represents a development intent - the goal or purpose
 * that drives architectural and technology decisions.
 */
export interface Intent {
  /** Unique name for the intent */
  name: string;
  /** Brief description of the intent */
  description?: string;
  /** Expected scale level of the project */
  scaleLevel: ScaleLevel;
  /** List of requirements for this intent */
  requirements: string[];
  /** Optional metadata for extensibility */
  metadata?: Record<string, unknown>;
}

/**
 * Result of intent validation.
 */
export interface ValidationResult {
  /** Whether the intent is valid */
  valid: boolean;
  /** List of validation errors, if any */
  errors: string[];
}

/**
 * Valid scale levels for reference and validation.
 */
export const VALID_SCALE_LEVELS: readonly ScaleLevel[] = [
  'solo',
  'startup',
  'team',
  'enterprise'
] as const;

/**
 * Validates an intent object.
 * 
 * @param intent - The intent to validate
 * @returns ValidationResult with validity status and any errors
 */
export function validateIntent(intent: Intent): ValidationResult {
  const errors: string[] = [];

  // Validate name
  if (!intent.name || typeof intent.name !== 'string' || intent.name.trim() === '') {
    errors.push('Intent must have a non-empty name');
  }

  // Validate scale level
  if (!VALID_SCALE_LEVELS.includes(intent.scaleLevel)) {
    errors.push(`Scale level must be one of: ${VALID_SCALE_LEVELS.join(', ')}`);
  }

  // Validate requirements
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

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Creates a new intent with default values.
 * 
 * @param name - The intent name
 * @param scaleLevel - The scale level
 * @param requirements - The requirements list
 * @returns A new Intent object
 */
export function createIntent(
  name: string,
  scaleLevel: ScaleLevel,
  requirements: string[]
): Intent {
  return {
    name,
    scaleLevel,
    requirements
  };
}
