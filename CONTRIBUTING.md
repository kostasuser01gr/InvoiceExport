# Contributing to Invoice Export

Thank you for your interest in contributing to the Invoice Export project!

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/InvoiceExport.git
   cd InvoiceExport
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local credentials
   ```

4. **Initialize Database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Prettier**: Configured for consistent formatting
- **Naming**: camelCase for variables, PascalCase for components

## Before Submitting

1. **Lint your code**
   ```bash
   npm run lint
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

4. **Type check**
   ```bash
   npx tsc --noEmit
   ```

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Commit with clear messages: `git commit -m "Add: feature description"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request

## Commit Message Format

```
Type: Short description

Longer explanation if needed

Types: Add, Update, Fix, Remove, Refactor, Docs, Test
```

## Testing

- Write tests for new features
- Maintain existing test coverage
- Test with both brands (Europcar/Goldcar)
- Verify RBAC permissions

## Questions?

Contact: heraklion.airport@europcargreece.com
