import * as yaml from 'js-yaml';
import { Intent, validateIntent } from '../core/intent';

/**
 * Parser for YAML/JSON intent files
 */
export class DSLParser {
  /**
   * Parse intent from YAML string
   */
  parseYAML(yamlContent: string): Intent {
    try {
      const data = yaml.load(yamlContent);
      return this.parseIntent(data);
    } catch (error) {
      throw new Error(`Failed to parse YAML: ${error}`);
    }
  }
  
  /**
   * Parse intent from JSON string
   */
  parseJSON(jsonContent: string): Intent {
    try {
      const data = JSON.parse(jsonContent);
      return this.parseIntent(data);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }
  
  /**
   * Parse and validate intent object
   */
  private parseIntent(data: any): Intent {
    if (!validateIntent(data)) {
      throw new Error('Invalid intent format. Required fields: name, scale, requirements');
    }
    
    return data as Intent;
  }
  
  /**
   * Serialize intent to YAML
   */
  toYAML(intent: Intent): string {
    return yaml.dump(intent, {
      indent: 2,
      lineWidth: 80,
      noRefs: true
    });
  }
  
  /**
   * Serialize intent to JSON
   */
  toJSON(intent: Intent): string {
    return JSON.stringify(intent, null, 2);
  }
}
