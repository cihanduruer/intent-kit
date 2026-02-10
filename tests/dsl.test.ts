import { DSLParser } from '../src/parsers/dsl';
import { ScaleLevel } from '../src/core/intent';

describe('DSLParser', () => {
  let parser: DSLParser;
  
  beforeEach(() => {
    parser = new DSLParser();
  });
  
  describe('parseYAML', () => {
    it('should parse valid YAML intent', () => {
      const yaml = `
name: "test-project"
scale: "solo"
requirements:
  - "Build a web app"
      `;
      
      const intent = parser.parseYAML(yaml);
      expect(intent.name).toBe('test-project');
      expect(intent.scale).toBe(ScaleLevel.SOLO);
      expect(intent.requirements).toContain('Build a web app');
    });
    
    it('should throw error for invalid YAML', () => {
      const yaml = 'invalid: yaml: content:';
      expect(() => parser.parseYAML(yaml)).toThrow();
    });
    
    it('should throw error for missing required fields', () => {
      const yaml = `
name: "test-project"
      `;
      
      expect(() => parser.parseYAML(yaml)).toThrow('Invalid intent format');
    });
  });
  
  describe('parseJSON', () => {
    it('should parse valid JSON intent', () => {
      const json = JSON.stringify({
        name: 'test-project',
        scale: 'solo',
        requirements: ['Build a web app']
      });
      
      const intent = parser.parseJSON(json);
      expect(intent.name).toBe('test-project');
      expect(intent.scale).toBe(ScaleLevel.SOLO);
    });
    
    it('should throw error for invalid JSON', () => {
      const json = '{invalid json}';
      expect(() => parser.parseJSON(json)).toThrow();
    });
  });
  
  describe('toYAML', () => {
    it('should serialize intent to YAML', () => {
      const intent = {
        name: 'test-project',
        scale: ScaleLevel.SOLO,
        requirements: ['Build a web app']
      };
      
      const yaml = parser.toYAML(intent);
      expect(yaml).toContain('name: test-project');
      expect(yaml).toContain('scale: solo');
    });
  });
  
  describe('toJSON', () => {
    it('should serialize intent to JSON', () => {
      const intent = {
        name: 'test-project',
        scale: ScaleLevel.SOLO,
        requirements: ['Build a web app']
      };
      
      const json = parser.toJSON(intent);
      const parsed = JSON.parse(json);
      expect(parsed.name).toBe('test-project');
    });
  });
});
