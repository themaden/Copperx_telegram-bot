# Contributing to Copperx Telegram Bot

Thank you for considering contributing to the Copperx Telegram Bot project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. Everyone should feel welcome to contribute.

## How to Contribute

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine
3. **Create a branch** for your changes
4. **Make your changes** and commit them with descriptive messages
5. **Push your changes** to your fork
6. **Submit a pull request** to the main repository

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update the README.md if needed with details of changes
3. The pull request will be merged once it has been reviewed and approved

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Coding Standards

- Use TypeScript features
- Follow the existing code style
- Write meaningful commit messages
- Comment your code where necessary
- Add type definitions for new functionality
- Handle errors appropriately

## Adding New Features

1. **Commands**: Add new command handlers in the `/src/commands` directory
2. **Services**: Add new services in the `/src/services` directory
3. **Utils**: Add utility functions in the `/src/utils` directory
4. **Types**: Update type definitions in the `/src/types` directory

## Testing

Run tests with:
```bash
npm run test
```

## Reporting Bugs

Report bugs by opening an issue on GitHub with:
- A clear title and description
- Steps to reproduce the bug
- Expected behavior
- Screenshots if applicable
- Any relevant details about your environment

## Feature Requests

Feature requests are welcome. Open an issue on GitHub with:
- A clear title and description
- Detailed explanation of the feature
- Any relevant examples or mockups

## Questions?

If you have any questions, feel free to open an issue or contact the maintainers directly.

Thank you for contributing! 