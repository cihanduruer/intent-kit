import {
  Intent
} from '../src/core/intent';
import {
  selectArchitecture,
  generateStackRecommendation,
  isArchitectureSuitable
} from '../src/core/stack';

describe('Stack Module', () => {
  describe('selectArchitecture', () => {
    it('should return monolith for solo scale', () => {
      expect(selectArchitecture('solo')).toBe('monolith');
    });

    it('should return monolith for startup scale', () => {
      expect(selectArchitecture('startup')).toBe('monolith');
    });

    it('should return modular-monolith for team scale', () => {
      expect(selectArchitecture('team')).toBe('modular-monolith');
    });

    it('should return microservices for enterprise scale', () => {
      expect(selectArchitecture('enterprise')).toBe('microservices');
    });
  });

  describe('generateStackRecommendation', () => {
    it('should generate a recommendation for a solo intent', () => {
      const intent: Intent = {
        name: 'solo-project',
        scaleLevel: 'solo',
        requirements: ['Simple web app']
      };

      const recommendation = generateStackRecommendation(intent);

      expect(recommendation.architecture).toBe('monolith');
      expect(recommendation.rationale).toBeTruthy();
      expect(recommendation.considerations).toBeInstanceOf(Array);
      expect(recommendation.considerations.length).toBeGreaterThan(0);
    });

    it('should generate a recommendation for an enterprise intent', () => {
      const intent: Intent = {
        name: 'enterprise-project',
        scaleLevel: 'enterprise',
        requirements: ['Scalable platform', 'Multiple teams']
      };

      const recommendation = generateStackRecommendation(intent);

      expect(recommendation.architecture).toBe('microservices');
      expect(recommendation.rationale).toContain('independent scaling');
      expect(recommendation.considerations).toContain('Invest in infrastructure automation');
    });

    it('should include appropriate rationale for modular-monolith', () => {
      const intent: Intent = {
        name: 'team-project',
        scaleLevel: 'team',
        requirements: ['Collaborative development']
      };

      const recommendation = generateStackRecommendation(intent);

      expect(recommendation.architecture).toBe('modular-monolith');
      expect(recommendation.rationale).toContain('modular monolith');
    });
  });

  describe('isArchitectureSuitable', () => {
    it('should return true for exact match', () => {
      expect(isArchitectureSuitable('solo', 'monolith')).toBe(true);
      expect(isArchitectureSuitable('startup', 'monolith')).toBe(true);
      expect(isArchitectureSuitable('team', 'modular-monolith')).toBe(true);
      expect(isArchitectureSuitable('enterprise', 'microservices')).toBe(true);
    });

    it('should return true for monolith at any scale', () => {
      expect(isArchitectureSuitable('solo', 'monolith')).toBe(true);
      expect(isArchitectureSuitable('startup', 'monolith')).toBe(true);
      expect(isArchitectureSuitable('team', 'monolith')).toBe(true);
      expect(isArchitectureSuitable('enterprise', 'monolith')).toBe(true);
    });

    it('should return true for modular-monolith at startup and team scales', () => {
      expect(isArchitectureSuitable('startup', 'modular-monolith')).toBe(true);
      expect(isArchitectureSuitable('team', 'modular-monolith')).toBe(true);
    });

    it('should return false for microservices at solo scale', () => {
      expect(isArchitectureSuitable('solo', 'microservices')).toBe(false);
    });

    it('should return false for modular-monolith at solo scale', () => {
      expect(isArchitectureSuitable('solo', 'modular-monolith')).toBe(false);
    });
  });
});
