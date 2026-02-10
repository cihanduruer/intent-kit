import * as fs from 'fs';
import * as path from 'path';
import { Stack, FileTemplate } from './stack';
import { Intent } from './intent';

/**
 * Generator creates project files and structure based on a stack
 */
export class Generator {
  private templateRegistry: Map<string, string> = new Map();
  
  constructor() {
    this.registerBuiltInTemplates();
  }
  
  /**
   * Generate a project from intent and stack
   */
  async generate(intent: Intent, stack: Stack, outputDir: string): Promise<GenerateResult> {
    const result: GenerateResult = {
      success: false,
      filesCreated: [],
      directoriesCreated: [],
      errors: []
    };
    
    try {
      // Create output directory
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        result.directoriesCreated.push(outputDir);
      }
      
      // Create project directories
      for (const dir of stack.structure.directories) {
        const fullPath = path.join(outputDir, dir);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          result.directoriesCreated.push(fullPath);
        }
      }
      
      // Generate files from templates
      for (const fileTemplate of stack.structure.files) {
        try {
          const content = this.renderTemplate(fileTemplate, intent, stack);
          const fullPath = path.join(outputDir, fileTemplate.path);
          
          // Ensure parent directory exists
          const parentDir = path.dirname(fullPath);
          if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
          }
          
          fs.writeFileSync(fullPath, content, 'utf-8');
          result.filesCreated.push(fullPath);
        } catch (error) {
          result.errors.push(`Failed to generate ${fileTemplate.path}: ${error}`);
        }
      }
      
      result.success = result.errors.length === 0;
    } catch (error) {
      result.errors.push(`Generation failed: ${error}`);
    }
    
    return result;
  }
  
  /**
   * Render a template with context
   */
  private renderTemplate(fileTemplate: FileTemplate, intent: Intent, stack: Stack): string {
    const template = this.templateRegistry.get(fileTemplate.template);
    
    if (!template) {
      return `# Template '${fileTemplate.template}' not found\n`;
    }
    
    const context = {
      intent,
      stack,
      ...fileTemplate.context
    };
    
    return this.simpleTemplateEngine(template, context);
  }
  
  /**
   * Simple template engine - replaces {{variable}} with values and handles conditionals
   */
  private simpleTemplateEngine(template: string, context: any): string {
    // Remove handlebars-style conditional blocks ({{#if}}...{{/if}})
    let result = template.replace(/\{\{#if [^}]+\}\}[\s\S]*?\{\{\/if\}\}/g, '');
    
    // Replace variables
    result = result.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = this.getNestedValue(context, path);
      return value !== undefined ? String(value) : match;
    });
    
    return result;
  }
  
  /**
   * Get nested value from object by path (e.g., "intent.name")
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
  
  /**
   * Register built-in templates
   */
  private registerBuiltInTemplates(): void {
    this.templateRegistry.set('readme', `# {{intent.name}}

## Overview
{{stack.description}}

## Architecture
- **Pattern**: {{stack.architecture}}
- **Scale**: {{intent.scale}}

## Technologies
Backend, frontend, database, and infrastructure technologies are automatically selected based on your requirements and scale.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (if using TypeScript/JavaScript)

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd {{intent.name}}

# Start services with Docker Compose
docker-compose up -d
\`\`\`

## Development

\`\`\`bash
# Install dependencies (if applicable)
npm install

# Run in development mode
npm run dev

# Run tests
npm test
\`\`\`

## Requirements
This project addresses the following requirements:
{{intent.requirements}}

## Project Structure
Generated using intent-driven development principles. The structure is optimized for your specified scale ({{intent.scale}}) and architecture pattern ({{stack.architecture}}).

## License
MIT
`);

    this.templateRegistry.set('gitignore', `# Dependencies
node_modules/
__pycache__/
venv/
.env

# Build outputs
dist/
build/
*.pyc

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Testing
coverage/
.nyc_output/
`);

    this.templateRegistry.set('docker-compose', `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB={{intent.name}}
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  db_data:
`);

    this.templateRegistry.set('dockerfile', `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
`);
  }
  
  /**
   * Helper to generate technology stack description
   */
  private getStackTechDescription(): string {
    return '';  // Handled in template rendering
  }
  
  /**
   * Register a custom template
   */
  registerTemplate(name: string, template: string): void {
    this.templateRegistry.set(name, template);
  }
}

export interface GenerateResult {
  success: boolean;
  filesCreated: string[];
  directoriesCreated: string[];
  errors: string[];
}
