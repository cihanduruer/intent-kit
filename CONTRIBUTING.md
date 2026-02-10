# Contributing to Intent-Kit

Thank you for your interest in contributing to Intent-Kit! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Provide a clear description of the bug
3. Include steps to reproduce
4. Share your environment details (OS, Node version, etc.)

### Suggesting Features

1. Open an issue with the "feature request" label
2. Clearly describe the feature and its benefits
3. Provide use cases and examples

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Run linter: `npm run lint`
7. Commit with clear messages
8. Push to your fork
9. Open a pull request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/cihanduruer/intent-kit.git
cd intent-kit

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Project Structure

```
intent-kit/
├── src/
│   ├── core/          # Core intent and stack logic
│   ├── parsers/       # Intent parsers (YAML, JSON, NL)
│   ├── templates/     # Project templates
│   ├── providers/     # Deployment providers
│   ├── cli/           # Command-line interface
│   └── index.ts       # Main library export
├── tests/             # Test files
├── examples/          # Example intent files
└── docs/              # Documentation
```

## Coding Standards

- Use TypeScript with strict mode
- Follow ESLint rules
- Write clear, self-documenting code
- Add JSDoc comments for public APIs
- Keep functions focused and small
- Use meaningful variable names

## Testing

- Write tests for all new features
- Maintain or improve code coverage
- Test edge cases and error conditions
- Use descriptive test names

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(parser): add support for Python preferences`
- `fix(generator): correct template rendering`
- `docs(readme): update installation instructions`

## Areas for Contribution

### High Priority

- Additional architecture templates (Python/Django, Java/Spring, etc.)
- Cloud deployment providers (AWS, Azure, GCP)
- LLM integration for better natural language parsing
- More comprehensive test coverage

### Medium Priority

- IDE extensions (VS Code, JetBrains)
- Web UI for intent creation
- CI/CD pipeline templates
- Database migration templates

### Nice to Have

- Plugin system for custom templates
- AI-powered optimization suggestions
- Multi-language documentation
- Video tutorials and examples

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make Intent-Kit better!
