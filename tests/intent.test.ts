import { validateIntent, createDefaultIntent, ScaleLevel } from '../src/core/intent';

describe('Intent', () => {
  describe('validateIntent', () => {
    it('should validate a correct intent', () => {
      const intent = {
        name: 'test-project',
        scale: ScaleLevel.SOLO,
        requirements: ['Build a web app']
      };
      
      expect(validateIntent(intent)).toBe(true);
    });
    
    it('should reject intent without name', () => {
      const intent = {
        scale: ScaleLevel.SOLO,
        requirements: ['Build a web app']
      };
      
      expect(validateIntent(intent)).toBe(false);
    });
    
    it('should reject intent with empty name', () => {
      const intent = {
        name: '',
        scale: ScaleLevel.SOLO,
        requirements: ['Build a web app']
      };
      
      expect(validateIntent(intent)).toBe(false);
    });
    
    it('should reject intent without scale', () => {
      const intent = {
        name: 'test-project',
        requirements: ['Build a web app']
      };
      
      expect(validateIntent(intent)).toBe(false);
    });
    
    it('should reject intent with invalid scale', () => {
      const intent = {
        name: 'test-project',
        scale: 'invalid',
        requirements: ['Build a web app']
      };
      
      expect(validateIntent(intent)).toBe(false);
    });
    
    it('should reject intent without requirements', () => {
      const intent = {
        name: 'test-project',
        scale: ScaleLevel.SOLO
      };
      
      expect(validateIntent(intent)).toBe(false);
    });
    
    it('should reject intent with empty requirements', () => {
      const intent = {
        name: 'test-project',
        scale: ScaleLevel.SOLO,
        requirements: []
      };
      
      expect(validateIntent(intent)).toBe(false);
    });
  });
  
  describe('createDefaultIntent', () => {
    it('should create a default intent with given name', () => {
      const intent = createDefaultIntent('my-project');
      
      expect(intent.name).toBe('my-project');
      expect(intent.scale).toBe(ScaleLevel.SOLO);
      expect(intent.requirements).toHaveLength(1);
    });
  });
});
