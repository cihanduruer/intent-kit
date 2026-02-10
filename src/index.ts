// Core exports
export { Intent, ScaleLevel, Constraints, validateIntent, createDefaultIntent } from './core/intent';
export { 
  Stack, 
  Architecture, 
  Technologies, 
  Infrastructure, 
  StackSelector 
} from './core/stack';
export { Generator, GenerateResult } from './core/generator';

// Parser exports
export { DSLParser } from './parsers/dsl';
export { NaturalLanguageParser } from './parsers/natural-language';

// Main orchestrator
import { Intent } from './core/intent';
import { StackSelector } from './core/stack';
import { Generator } from './core/generator';
import { DSLParser } from './parsers/dsl';
import { NaturalLanguageParser } from './parsers/natural-language';

/**
 * IntentKit - Main orchestrator for intent-driven development
 */
export class IntentKit {
  private stackSelector: StackSelector;
  private generator: Generator;
  private dslParser: DSLParser;
  private nlParser: NaturalLanguageParser;
  
  constructor() {
    this.stackSelector = new StackSelector();
    this.generator = new Generator();
    this.dslParser = new DSLParser();
    this.nlParser = new NaturalLanguageParser();
  }
  
  /**
   * Parse intent from YAML file
   */
  parseYAML(yamlContent: string): Intent {
    return this.dslParser.parseYAML(yamlContent);
  }
  
  /**
   * Parse intent from JSON
   */
  parseJSON(jsonContent: string): Intent {
    return this.dslParser.parseJSON(jsonContent);
  }
  
  /**
   * Parse intent from natural language
   */
  parseNaturalLanguage(description: string): Intent {
    return this.nlParser.parseNaturalLanguage(description);
  }
  
  /**
   * Generate project from intent
   */
  async generateFromIntent(intent: Intent, outputDir: string) {
    const stack = this.stackSelector.selectStack(intent);
    return await this.generator.generate(intent, stack, outputDir);
  }
  
  /**
   * End-to-end: parse YAML and generate
   */
  async generateFromYAML(yamlContent: string, outputDir: string) {
    const intent = this.parseYAML(yamlContent);
    return await this.generateFromIntent(intent, outputDir);
  }
  
  /**
   * End-to-end: parse natural language and generate
   */
  async generateFromDescription(description: string, outputDir: string) {
    const intent = this.parseNaturalLanguage(description);
    return await this.generateFromIntent(intent, outputDir);
  }
  
  /**
   * Get stack selection without generating
   */
  selectStack(intent: Intent) {
    return this.stackSelector.selectStack(intent);
  }
  
  /**
   * Export intent to YAML
   */
  exportYAML(intent: Intent): string {
    return this.dslParser.toYAML(intent);
  }
  
  /**
   * Export intent to JSON
   */
  exportJSON(intent: Intent): string {
    return this.dslParser.toJSON(intent);
  }
}

// Create default instance
export const intentKit = new IntentKit();
