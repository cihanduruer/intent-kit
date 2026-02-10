import { Intent, ScaleLevel } from './intent';

/**
 * Stack represents the technical solution for an intent.
 * It contains all the architecture decisions and technologies.
 */
export interface Stack {
  /** Stack name/identifier */
  name: string;
  
  /** Stack description */
  description: string;
  
  /** Architecture pattern */
  architecture: Architecture;
  
  /** Technology choices */
  technologies: Technologies;
  
  /** Infrastructure setup */
  infrastructure: Infrastructure;
  
  /** Project structure */
  structure: ProjectStructure;
}

/**
 * Architecture patterns
 */
export enum Architecture {
  MONOLITH = 'monolith',
  MICROSERVICES = 'microservices',
  SERVERLESS = 'serverless',
  JAMSTACK = 'jamstack'
}

/**
 * Technologies selected for the stack
 */
export interface Technologies {
  backend?: BackendTech;
  frontend?: FrontendTech;
  database?: DatabaseTech;
  messaging?: MessagingTech;
}

export interface BackendTech {
  language: string;
  framework: string;
  runtime?: string;
}

export interface FrontendTech {
  framework: string;
  language: string;
  buildTool?: string;
}

export interface DatabaseTech {
  type: 'sql' | 'nosql' | 'hybrid';
  engine: string;
}

export interface MessagingTech {
  type: string;
  provider?: string;
}

/**
 * Infrastructure configuration
 */
export interface Infrastructure {
  containerization: 'docker' | 'none';
  orchestration?: 'kubernetes' | 'docker-compose' | 'none';
  cicd?: 'github-actions' | 'gitlab-ci' | 'none';
}

/**
 * Project structure definition
 */
export interface ProjectStructure {
  directories: string[];
  files: FileTemplate[];
}

export interface FileTemplate {
  path: string;
  template: string;
  context?: Record<string, any>;
}

/**
 * Selects the appropriate stack based on intent
 */
export class StackSelector {
  selectStack(intent: Intent): Stack {
    const architecture = this.selectArchitecture(intent);
    const technologies = this.selectTechnologies(intent, architecture);
    const infrastructure = this.selectInfrastructure(intent);
    const structure = this.generateStructure(intent, architecture);
    
    return {
      name: `${intent.scale}-${architecture}`,
      description: `${architecture} architecture for ${intent.scale} scale`,
      architecture,
      technologies,
      infrastructure,
      structure
    };
  }
  
  private selectArchitecture(intent: Intent): Architecture {
    const { scale, requirements } = intent;
    
    // Check for serverless indicators
    const hasServerlessKeywords = requirements.some(req => 
      /serverless|lambda|function/i.test(req)
    );
    if (hasServerlessKeywords) {
      return Architecture.SERVERLESS;
    }
    
    // Check for static site indicators
    const hasStaticKeywords = requirements.some(req =>
      /static|jamstack|blog|documentation/i.test(req)
    );
    if (hasStaticKeywords) {
      return Architecture.JAMSTACK;
    }
    
    // Scale-based architecture selection
    switch (scale) {
      case ScaleLevel.SOLO:
      case ScaleLevel.STARTUP:
        return Architecture.MONOLITH;
      case ScaleLevel.TEAM:
      case ScaleLevel.ENTERPRISE:
        return Architecture.MICROSERVICES;
      default:
        return Architecture.MONOLITH;
    }
  }
  
  private selectTechnologies(intent: Intent, architecture: Architecture): Technologies {
    const hasRealtimeReq = intent.requirements.some(req => 
      /real-?time|websocket|chat/i.test(req)
    );
    
    const hasMobileReq = intent.requirements.some(req =>
      /mobile|ios|android|react native/i.test(req)
    );
    
    const technologies: Technologies = {};
    
    // Backend selection
    if (architecture !== Architecture.JAMSTACK) {
      const preferredLang = intent.constraints?.languages?.[0];
      
      if (preferredLang === 'python') {
        technologies.backend = {
          language: 'Python',
          framework: 'FastAPI',
          runtime: 'Python 3.11'
        };
      } else if (preferredLang === 'go') {
        technologies.backend = {
          language: 'Go',
          framework: 'Gin',
          runtime: 'Go 1.21'
        };
      } else {
        technologies.backend = {
          language: 'TypeScript',
          framework: 'Express',
          runtime: 'Node.js 20'
        };
      }
    }
    
    // Frontend selection
    if (intent.requirements.some(req => /frontend|web|ui|interface/i.test(req))) {
      technologies.frontend = {
        framework: hasMobileReq ? 'React Native' : 'React',
        language: 'TypeScript',
        buildTool: 'Vite'
      };
    }
    
    // Database selection
    if (intent.requirements.some(req => /database|storage|persist/i.test(req))) {
      const needsNoSql = intent.requirements.some(req => 
        /flexible schema|unstructured|document/i.test(req)
      );
      
      technologies.database = needsNoSql ? {
        type: 'nosql',
        engine: 'MongoDB'
      } : {
        type: 'sql',
        engine: 'PostgreSQL'
      };
    }
    
    // Messaging for real-time or microservices
    if (hasRealtimeReq || architecture === Architecture.MICROSERVICES) {
      technologies.messaging = {
        type: hasRealtimeReq ? 'WebSocket' : 'Message Queue',
        provider: hasRealtimeReq ? 'Socket.io' : 'RabbitMQ'
      };
    }
    
    return technologies;
  }
  
  private selectInfrastructure(intent: Intent): Infrastructure {
    const infrastructure: Infrastructure = {
      containerization: 'docker'
    };
    
    if (intent.scale === ScaleLevel.ENTERPRISE) {
      infrastructure.orchestration = 'kubernetes';
      infrastructure.cicd = 'github-actions';
    } else if (intent.scale === ScaleLevel.TEAM) {
      infrastructure.orchestration = 'docker-compose';
      infrastructure.cicd = 'github-actions';
    } else {
      infrastructure.orchestration = 'docker-compose';
      infrastructure.cicd = 'github-actions';
    }
    
    return infrastructure;
  }
  
  private generateStructure(intent: Intent, architecture: Architecture): ProjectStructure {
    const directories: string[] = [];
    const files: FileTemplate[] = [];
    
    // Base directories
    directories.push('src', 'tests', 'docs');
    
    if (architecture === Architecture.MICROSERVICES) {
      directories.push('services', 'shared', 'infrastructure');
    } else if (architecture === Architecture.MONOLITH) {
      directories.push(
        'src/api',
        'src/models',
        'src/services',
        'src/utils'
      );
    }
    
    // Configuration files
    files.push(
      { path: 'README.md', template: 'readme' },
      { path: '.gitignore', template: 'gitignore' },
      { path: 'docker-compose.yml', template: 'docker-compose' }
    );
    
    return { directories, files };
  }
}
