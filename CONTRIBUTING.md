# Contributing to Aithor

Thank you for your interest in contributing to Aithor! We welcome contributions from the community and are grateful for your support.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- Git
- A GitHub account

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/aithor.git
   cd aithor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Update .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/abhishek/aithor/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details

### Suggesting Features

1. Check [Discussions](https://github.com/abhishek/aithor/discussions) for existing feature requests
2. Create a new discussion with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Code Contributions

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Code Standards

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/modifications
- `chore:` Maintenance tasks

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow the configured rules
- **Prettier**: Auto-formatting on save
- **File naming**: kebab-case for files, PascalCase for components

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Use Jest and React Testing Library
- Test both happy path and edge cases

## 🔍 Code Review Process

1. All PRs require review from maintainers
2. Automated tests must pass
3. Code coverage must be maintained
4. Documentation must be updated for new features
5. Breaking changes require discussion

## 📚 Development Guidelines

### Project Structure

```
aithor/
├── app/                 # Next.js 14 app directory
├── components/          # Reusable components
├── lib/                 # Utility libraries
├── public/              # Static assets
├── server/              # WebSocket server
└── docs/                # Documentation
```

### Component Guidelines

- Use TypeScript for all components
- Follow Material-UI design patterns
- Implement responsive design
- Add proper error handling
- Include loading states

### API Guidelines

- Use Next.js API routes
- Implement proper error handling
- Add input validation
- Include rate limiting
- Document endpoints

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Help others learn and grow

### Communication

- Use GitHub Issues for bugs
- Use GitHub Discussions for questions
- Be clear and concise
- Provide context and examples

## 🎯 Areas for Contribution

### High Priority

- Bug fixes and stability improvements
- Performance optimizations
- Test coverage improvements
- Documentation updates

### Medium Priority

- New features and enhancements
- UI/UX improvements
- Accessibility improvements
- Internationalization

### Low Priority

- Code refactoring
- Developer experience improvements
- Build process optimizations

## 📞 Getting Help

- **Questions**: [GitHub Discussions](https://github.com/abhishek/aithor/discussions)
- **Bugs**: [GitHub Issues](https://github.com/abhishek/aithor/issues)
- **Email**: contact@aithor.in

## 🙏 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to join the contributors team

Thank you for contributing to Aithor! 🎉
