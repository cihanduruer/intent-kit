import {
  Intent,
  ScaleLevel,
  VALID_SCALE_LEVELS,
  validateIntent,
  createIntent
} from '../src/core/intent';

describe('Intent Module', () => {
  describe('VALID_SCALE_LEVELS', () => {
    it('should contain all expected scale levels', () => {
      expect(VALID_SCALE_LEVELS).toEqual(['solo', 'startup', 'team', 'enterprise']);
    });
  });

  describe('createIntent', () => {
    it('should create an intent with provided values', () => {
      const intent = createIntent('test-intent', 'startup', ['req1', 'req2']);
      
      expect(intent.name).toBe('test-intent');
      expect(intent.scaleLevel).toBe('startup');
      expect(intent.requirements).toEqual(['req1', 'req2']);
    });
  });

  describe('validateIntent', () => {
    it('should validate a valid intent', () => {
      const intent: Intent = {
        name: 'valid-intent',
        scaleLevel: 'team',
        requirements: ['Build a REST API']
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject an intent with empty name', () => {
      const intent: Intent = {
        name: '',
        scaleLevel: 'solo',
        requirements: ['requirement']
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Intent must have a non-empty name');
    });

    it('should reject an intent with whitespace-only name', () => {
      const intent: Intent = {
        name: '   ',
        scaleLevel: 'solo',
        requirements: ['requirement']
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Intent must have a non-empty name');
    });

    it('should reject an intent with invalid scale level', () => {
      const intent = {
        name: 'test',
        scaleLevel: 'invalid' as ScaleLevel,
        requirements: ['requirement']
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Scale level must be one of'))).toBe(true);
    });

    it('should reject an intent with empty requirements array', () => {
      const intent: Intent = {
        name: 'test',
        scaleLevel: 'startup',
        requirements: []
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Intent must have a non-empty requirements array');
    });

    it('should reject an intent with empty string in requirements', () => {
      const intent: Intent = {
        name: 'test',
        scaleLevel: 'startup',
        requirements: ['valid', '']
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('All requirements must be non-empty strings');
    });

    it('should validate an intent with optional fields', () => {
      const intent: Intent = {
        name: 'full-intent',
        description: 'A complete intent',
        scaleLevel: 'enterprise',
        requirements: ['Scalable', 'Secure'],
        metadata: { priority: 'high' }
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return multiple errors for multiple issues', () => {
      const intent = {
        name: '',
        scaleLevel: 'invalid' as ScaleLevel,
        requirements: []
      };

      const result = validateIntent(intent);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});
