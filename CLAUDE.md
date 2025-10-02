# Money System - Project Memory

## Tech Stack
- **Frontend**: React with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Build Tool**: Vite
- **Framework**: Next.js
- **Language**: TypeScript

## Development Workflow
- Use feature branches for development
- Follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Squash and merge pull requests
- Always run linting and type checking before commits

## Code Style
- Use 2-space indentation
- Prefer arrow functions over function declarations
- Use const/let instead of var
- Maximum line length: 100 characters
- Use TypeScript strict mode
- Prefer named exports over default exports

## TypeScript Guidelines
- Enable strict mode in tsconfig.json
- Use interface for object types
- Use type for unions and computed types
- Always define component props interfaces
- Use generic types for reusable components

## React Best Practices
- Use functional components with hooks
- Prefer custom hooks for shared logic
- Use React.memo for expensive components
- Follow component composition patterns
- Keep components focused and single-responsibility

## MUI Guidelines
- Use MUI theme system for consistent styling
- Leverage sx prop for component-specific styles
- Use MUI breakpoints for responsive design
- Follow MUI naming conventions for custom components
- Utilize MUI's built-in accessibility features

## File Structure
- Components in `src/components/`
- Pages in `src/pages/` (Next.js) or `src/routes/`
- Utilities in `src/utils/`
- Types in `src/types/`
- Hooks in `src/hooks/`
- Constants in `src/constants/`

## Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Files: camelCase for utilities, PascalCase for components
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase with 'I' prefix (e.g., `IUserData`)

## Common Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint errors automatically
- `npm run typecheck`: Run TypeScript compiler check
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode

## Database Commands
- `docker compose up -d`: Start PostgreSQL container
- `docker compose down`: Stop PostgreSQL container
- `npx prisma generate`: Generate Prisma Client
- `npx prisma migrate dev`: Create and apply migrations
- `npx prisma db seed`: Seed database with initial data
- `npx prisma studio`: Open Prisma Studio (database GUI)

## Dependencies Management
- Use exact versions for critical dependencies
- Keep dependencies updated regularly
- Separate devDependencies from dependencies
- Document any peer dependency requirements

## Environment Setup
- Node.js version: Use `.nvmrc` if specified
- Use `npm ci` for clean installs
- Configure environment variables in `.env.local`
- Never commit sensitive environment variables

## Performance Considerations
- Use React.lazy for code splitting
- Implement proper memoization with useMemo/useCallback
- Optimize bundle size with tree shaking
- Use Next.js Image component for images
- Monitor bundle size with build analysis

## Testing Guidelines
- Write unit tests for utilities and hooks
- Use React Testing Library for component tests
- Test user interactions, not implementation details
- Maintain good test coverage for critical paths
- Mock external dependencies in tests