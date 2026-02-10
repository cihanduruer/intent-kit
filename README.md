# Intent Kit

A framework for intent-driven development guidance.

> **Intent-Driven Development starts with *why* you're building, not *what* you're building.**
>
> Unlike spec-driven development that begins with detailed technical specifications, intent-driven development captures your goals, scale, and constraints first—then guides you to the right architecture and technology choices. You describe your intent; the framework recommends how to achieve it.

## Overview

Intent Kit helps developers define their project intentions and receive appropriate architecture and technology stack recommendations based on project scale and requirements.

## Installation

```bash
npm install intent-kit
```

## Quick Start

```typescript
import { createIntent, validateIntent, generateStackRecommendation } from 'intent-kit';

// Create an intent
const intent = createIntent('my-web-app', 'startup', [
  'Build a REST API',
  'User authentication',
  'Database integration'
]);

// Validate the intent
const validation = validateIntent(intent);
if (validation.valid) {
  // Get stack recommendations
  const recommendation = generateStackRecommendation(intent);
  console.log(`Recommended architecture: ${recommendation.architecture}`);
  console.log(`Rationale: ${recommendation.rationale}`);
}
```

## Scale Levels

Intent Kit supports four scale levels:

| Scale Level | Description | Recommended Architecture |
|-------------|-------------|-------------------------|
| `solo` | Individual developer projects | Monolith |
| `startup` | Small team, rapid iteration | Monolith |
| `team` | Growing team, clear boundaries needed | Modular Monolith |
| `enterprise` | Large organization, multiple teams | Microservices |

## API

### Intent Management

- `createIntent(name, scaleLevel, requirements)` - Create a new intent
- `validateIntent(intent)` - Validate an intent object

### Stack Recommendations

- `selectArchitecture(scaleLevel)` - Get recommended architecture for a scale level
- `generateStackRecommendation(intent)` - Generate full stack recommendation
- `isArchitectureSuitable(scaleLevel, architecture)` - Check if an architecture fits a scale

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint the code
npm run lint
```

## VS Code Extension

A VS Code extension is included in the `vscode-extension/` directory. See [vscode-extension/README.md](vscode-extension/README.md) for details.

## License

ISC