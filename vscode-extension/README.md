# Intent Kit VS Code Extension

A VS Code extension for intent-driven development guidance.

## Features

- **Create Intent**: Interactively create a new development intent with name, scale level, and requirements
- **Get Stack Recommendation**: Get architecture recommendations based on scale level
- **Validate Intent**: Validate JSON intent files in the editor

## Commands

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for:

| Command | Description |
|---------|-------------|
| `Intent Kit: Create New Intent` | Create a new intent interactively |
| `Intent Kit: Get Stack Recommendation` | Get recommendations for a scale level |
| `Intent Kit: Validate Current Intent` | Validate a JSON intent file |

## Scale Levels

| Level | Description | Recommended Architecture |
|-------|-------------|-------------------------|
| solo | Individual developer | Monolith |
| startup | Small team | Monolith |
| team | Growing team | Modular Monolith |
| enterprise | Large organization | Microservices |

## Development

```bash
# Install dependencies
npm install

# Compile the extension
npm run compile

# Watch for changes
npm run watch
```

## Installation

1. Clone this repository
2. Run `npm install`
3. Press `F5` to open a new VS Code window with the extension loaded
4. Use the Command Palette to run Intent Kit commands
