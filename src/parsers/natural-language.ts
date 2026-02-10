import { Intent, ScaleLevel, Constraints } from '../core/intent';

/**
 * Natural language parser interface
 * Future: Integrate with LLM APIs (OpenAI, Anthropic, etc.)
 */
export class NaturalLanguageParser {
  /**
   * Parse natural language description into intent
   * This is a simplified version - in production, this would use an LLM API
   */
  parseNaturalLanguage(description: string): Intent {
    // Extract project name (simple heuristic)
    const nameMatch = description.match(/(?:called|named|for)\s+["']?([a-z0-9-]+)["']?/i);
    const name = nameMatch ? nameMatch[1] : 'my-project';
    
    // Detect scale level
    const scale = this.detectScale(description);
    
    // Extract requirements (split by sentences or common delimiters)
    const requirements = this.extractRequirements(description);
    
    // Detect features
    const features = this.extractFeatures(description);
    
    // Detect constraints
    const constraints = this.extractConstraints(description);
    
    return {
      name,
      scale,
      requirements,
      features: features.length > 0 ? features : undefined,
      constraints: Object.keys(constraints).length > 0 ? constraints : undefined
    };
  }
  
  /**
   * Detect scale level from natural language
   */
  private detectScale(text: string): ScaleLevel {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('enterprise') || lowerText.includes('large scale')) {
      return ScaleLevel.ENTERPRISE;
    }
    if (lowerText.includes('team') || lowerText.includes('multiple developers')) {
      return ScaleLevel.TEAM;
    }
    if (lowerText.includes('startup') || lowerText.includes('small team')) {
      return ScaleLevel.STARTUP;
    }
    
    return ScaleLevel.SOLO;
  }
  
  /**
   * Extract requirements from description
   */
  private extractRequirements(text: string): string[] {
    const requirements: string[] = [];
    
    // Common requirement keywords
    const keywords = [
      'real-time',
      'authentication',
      'database',
      'api',
      'mobile',
      'web interface',
      'messaging',
      'chat',
      'notifications',
      'file upload',
      'payment',
      'analytics'
    ];
    
    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword)) {
        requirements.push(keyword);
      }
    }
    
    // If no keywords found, use the entire description
    if (requirements.length === 0) {
      requirements.push(text.trim());
    }
    
    return requirements;
  }
  
  /**
   * Extract features from description
   */
  private extractFeatures(text: string): string[] {
    const features: string[] = [];
    const lowerText = text.toLowerCase();
    
    const featureMap: Record<string, string> = {
      'user management': 'user-management',
      'admin panel': 'admin-panel',
      'dashboard': 'dashboard',
      'reporting': 'reporting',
      'search': 'search-functionality'
    };
    
    for (const [phrase, feature] of Object.entries(featureMap)) {
      if (lowerText.includes(phrase)) {
        features.push(feature);
      }
    }
    
    return features;
  }
  
  /**
   * Extract constraints from description
   */
  private extractConstraints(text: string): Partial<Constraints> {
    const constraints: Partial<Constraints> = {};
    const lowerText = text.toLowerCase();
    
    // Detect language preferences
    const languages: string[] = [];
    if (lowerText.includes('python')) languages.push('python');
    if (lowerText.includes('typescript') || lowerText.includes('javascript')) languages.push('typescript');
    if (lowerText.includes('go') || lowerText.includes('golang')) languages.push('go');
    if (lowerText.includes('java')) languages.push('java');
    
    if (languages.length > 0) {
      constraints.languages = languages;
    }
    
    // Detect platform preferences
    const platforms: string[] = [];
    if (lowerText.includes('aws')) platforms.push('aws');
    if (lowerText.includes('azure')) platforms.push('azure');
    if (lowerText.includes('gcp') || lowerText.includes('google cloud')) platforms.push('gcp');
    if (lowerText.includes('docker')) platforms.push('docker');
    if (lowerText.includes('kubernetes')) platforms.push('kubernetes');
    
    if (platforms.length > 0) {
      constraints.platforms = platforms;
    }
    
    // Detect budget level
    if (lowerText.includes('minimal cost') || lowerText.includes('low budget')) {
      constraints.budgetLevel = 'minimal';
    } else if (lowerText.includes('flexible budget')) {
      constraints.budgetLevel = 'flexible';
    }
    
    return constraints;
  }
}
