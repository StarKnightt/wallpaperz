# Contributing to Wallpaperz

First off, thank you for considering contributing to Wallpaperz! It's people like you that make Wallpaperz such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md). Please report unacceptable behavior to [maintainer email].

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
* Check the [issues](https://github.com/StarKnightt/wallpaperz/issues) for a list of current known issues.
* Perform a [search](https://github.com/StarKnightt/wallpaperz/issues) to see if the problem has already been reported.

**How Do I Submit A Bug Report?**
Bugs are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible
* Include your environment details (OS, browser, etc.)

### Feature Requests

This section guides you through submitting a feature request, including completely new features and minor improvements to existing functionality.

**Before Submitting A Feature Request:**
* Check if the feature already exists
* Determine which repository the feature should be suggested in
* Perform a [search](https://github.com/StarKnightt/wallpaperz/issues) to see if the feature has already been suggested

**How Do I Submit A Feature Request?**
Feature requests are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title
* Provide a detailed explanation of the feature
* Explain why this feature would be useful
* Include mockups or examples if applicable

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the style guides
* Include screenshots and animated GIFs in your pull request whenever possible

## Style Guides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Style Guide

* All JavaScript code is formatted using Prettier
* Use ES6 syntax when possible
* Use semicolons
* Use single quotes
* 2 spaces for indentation
* Prefer the object spread operator over `Object.assign()`
* Prefer arrow functions over `function` declarations

### React/JSX Style Guide

* Use TypeScript for all React components
* Use functional components with hooks instead of class components
* Use the `.tsx` extension for React components
* Place component files in appropriate directories based on their purpose

## Setting Up Development Environment

1. Fork the repository
2. Clone your fork
3. Create a new branch (`git checkout -b feature/awesome-feature`)
4. Copy `.env.example` to `.env.local` and update values
5. Install dependencies (`npm install` or `yarn`)
6. Start development server (`npm run dev` or `yarn dev`)
7. Make your changes
8. Commit your changes (`git commit -m 'Add some awesome feature'`)
9. Push to the branch (`git push origin feature/awesome-feature`)
10. Open a Pull Request

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
