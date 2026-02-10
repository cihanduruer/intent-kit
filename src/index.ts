/**
 * Intent Kit - A framework for intent-driven development guidance.
 * 
 * This module provides tools for defining development intents,
 * validating them, and generating appropriate technology stack
 * recommendations based on project scale and requirements.
 */

export {
  Intent,
  ScaleLevel,
  ValidationResult,
  VALID_SCALE_LEVELS,
  validateIntent,
  createIntent
} from './core/intent';

export {
  ArchitectureType,
  StackRecommendation,
  selectArchitecture,
  generateStackRecommendation,
  isArchitectureSuitable
} from './core/stack';
