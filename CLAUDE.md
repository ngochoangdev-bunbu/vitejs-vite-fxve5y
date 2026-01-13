# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Guidelines

### Top-Level Rules
- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.

### Project Rules
- Follow the rules below for writing code comments and documentation:
  - **Documentation** such as JSDoc and Docstrings must be written in **English**.
  - **Comments embedded within the code**, such as descriptions for Vitest or zod-openapi, must be written in **English**.
  - **Code comments** that describe the background or reasoning behind the implementation should be written in **Japanese**.
  - **Do not use emojis**.
- When writing Japanese, do not include unnecessary spaces.
  - for example
    - ◯ "user一覧"
    - × "user 一覧"

## Overview

This is a Turborepo monorepo for a rental space application with AWS Amplify backend. The project includes two Next.js applications (service and admin) with shared UI components, common utilities, and configurations.

## Development Commands

### Install Dependencies
```bash
npm install
```

### Development
```bash
# Start all apps in development mode
npm run dev

# Start individual apps
cd apps/service && npm run dev    # Service app (http://localhost:3001)
cd apps/admin && npm run dev      # Admin app (http://localhost:3002)
```

### Building
```bash
# Build all apps
npm run build

# Build specific app using Turbo
npx turbo run build --filter=service
npx turbo run build --filter=admin
```

### Testing & Quality
```bash
# Run linting across all packages
npm run lint

# Run type checking across all packages
npm run type-check

# Format code with Prettier
npm run format

# Clean build cache
npm run clean
```

### Test Execution
```bash
# Run tests for Service app (Jest configured)
cd apps/service && npm test

# Run specific test files
cd apps/service && npm test -- --testPathPattern=specific-test.test.ts
```

## Project Architecture

### Monorepo Structure
- **apps/service/**: Main service application (Next.js) running on port 3001
- **apps/admin/**: Admin dashboard application (Next.js) running on port 3002
- **packages/ui/**: Shared React UI components library
- **packages/common-utils/**: Shared TypeScript interfaces and master data definitions
- **packages/amplify-backend/**: AWS Amplify backend configuration and resources
- **packages/eslint-config/**: Shared ESLint configurations
- **packages/typescript-config/**: Shared TypeScript configurations

### Technology Stack
- **Framework**: Next.js 14 with React 18
- **Backend**: AWS Amplify with CDK constructs
- **Styling**: Tailwind CSS 4.1
- **State Management**: Jotai (service app)
- **Forms**: React Hook Form with validation
- **Payments**: Stripe integration
- **Authentication**: AWS Cognito
- **Database**: AWS DynamoDB (via Amplify)
- **Email**: Amazon SES
- **Testing**: Jest with React Testing Library (service app)
- **Build Tool**: Turbo for monorepo orchestration
- **Package Manager**: npm with workspaces

### Key Dependencies
**Service App Specific:**
- `@aws-amplify/adapter-nextjs`: Amplify Next.js integration
- `@aws-sdk/*`: AWS SDK clients for DynamoDB, SES, Cognito
- `@repo/common-utils`: Shared interfaces and master data
- `stripe`: Payment processing
- `jotai`: State management
- `react-hook-form`: Form handling
- `dayjs`: Date manipulation
- `googleapis`: Google APIs integration
- `jest`: Testing framework

**Admin App Specific:**
- `@aws-amplify/ui-react`: Amplify UI components
- `@repo/common-utils`: Shared interfaces and master data
- `googleapis`: Google APIs integration
- `tailwindcss`: Styling framework

### Shared Package Details

**common-utils Package:**
- `@repo/common-utils/interfaces`: TypeScript interfaces for form data and reservation records
- `@repo/common-utils/master`: Master data definitions (payment types, room types, fee settings, mail templates, etc.)

### AWS Amplify Configuration
The backend is defined in `packages/amplify-backend/amplify/backend.ts` and includes:
- Authentication (Cognito)
- Data layer (GraphQL API)
- Custom resources via CDK

### Environment Variables Required
Service app requires these environment variables:
- `COGNITO_USER_POOL_CLIENT_ID`
- `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`
- `MISOCA_SECRET`
- `STRIPE_SECRET_KEY`
- `RECAPTCHA_SECRET_KEY`
- `AMAZON_SES_EMAIL`

### Deployment
Both applications have `amplify.yml` configurations for AWS Amplify hosting with:
- Change detection to avoid unnecessary builds
- Environment variable injection
- Optimized build processes for monorepo structure

### TypeScript Configuration
Shared TypeScript configurations in `packages/typescript-config/`:
- `base.json`: Base TypeScript settings
- `nextjs.json`: Next.js specific settings
- `react-library.json`: React library settings

### ESLint Configuration
Shared ESLint configurations in `packages/eslint-config/`:
- `next.js`: Next.js applications
- `react-library.js`: React libraries

## Important Notes
- The project uses npm workspaces for package management
- Turbo handles build orchestration and caching
- The service and admin apps share the UI package for consistent components
- Both apps use the common-utils package to achieve type safety and code reuse
- AWS Amplify backend resources are centralized in the amplify-backend package
- The project supports both local development and AWS deployment workflows
- Google APIs integration enables external service connectivity