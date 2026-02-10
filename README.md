# Intent Kit

**Stop writing specs. Start declaring intent.**

A framework for intent-driven development guidance.

---

## 🎯 What is Intent-Driven Development?

**Intent-Driven Development flips the script on traditional software planning.** Instead of drowning in detailed specifications before writing a single line of code, you declare what you want to achieve—your *intent*—and let the framework guide your architectural decisions.

| Spec-Driven Development | Intent-Driven Development |
|------------------------|--------------------------|
| "Here are 50 pages of requirements" | "I want to build X at Y scale" |
| Rigid upfront planning | Adaptive guidance |
| Technology-first thinking | Goal-first thinking |
| Premature optimization | Right-sized architecture |

**The result?** Less time in planning meetings, more time building. Architectures that match your actual scale. Technology choices that serve your goals, not the other way around.

---

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