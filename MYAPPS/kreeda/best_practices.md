# 📘 Project Best Practices

## 1. Project Purpose
Krida is a monorepo for a sports application with an AI Coach. It provides a RESTful backend API (Node/Express/MongoDB), a React Native (Expo) frontend, end-to-end tests, and supporting documentation. Major domains include authentication, user profiles, events, and AI-powered training/insights.

## 2. Project Structure
- Root
  - backend/ — Node.js Express API server
    - config/ — database connection, env validation
    - controllers/ — request handlers (e.g., aiCoachController)
    - middleware/ — auth, error handler, rate limiter, validation
    - models/ — Mongoose schemas (User, Event, AI Coach)
    - routes/ — Express routers grouped by domain
    - services/ — domain logic not tied to HTTP (e.g., aiCoachService)
    - tests/ — Jest test suite (api/integration/performance)
    - utils/ — shared helpers
    - server.js — app bootstrap and route mounting
  - frontend/ — React Native (Expo) app using TypeScript
    - app/ — Expo Router structure
    - components/, screens/ — presentational and screen components
    - config/ — API base URL, theme, etc.
    - context/ — global providers (AuthContext)
    - hooks/ — custom hooks (useApi)
    - services/ — API client, caching, feature services
    - __tests__/ — component tests and utilities
  - e2e/ — Detox tests and configuration
  - docs/ — API spec, examples, architecture, testing docs
  - packages/ — shared packages (utils, types)
  - ml/ — experimental/auxiliary Python modules and requirements
  - best_practices.md — this document

Key entry points and configs
- backend/server.js — Express app setup, security middleware, route registration, error handling
- backend/config/env.js — validates required env vars and constraints
- backend/config/database.js — MongoDB connection lifecycle
- frontend/config/api.ts — platform-aware API base URL and endpoints
- Jest: backend/jest.config.js and frontend/jest.config.js
- Linting: backend/.eslintrc.js and frontend/.eslintrc.js

Versioning and routes
- Preferred: /api/v1/... endpoints
- Legacy kept for compatibility: /api/... — prefer adding new routes only under /api/v1 and plan migration.

## 3. Test Strategy
- Frameworks
  - Backend: Jest + Supertest + mongodb-memory-server (node test env)
  - Frontend: Jest + Testing Library (jest-expo preset)
  - E2E: Detox (configured under e2e/)
  - Performance: Artillery config under backend/tests/performance (load-test.yml)

- Organization
  - Backend: backend/tests/{api, integration, performance, utils}/ with global setup (tests/setup.js)
  - Frontend: frontend/__tests__/{components, utils}/ with setup mocks in __tests__/setup.js
  - E2E: e2e/*.e2e.test.js with Jest + Detox environment

- Naming/Conventions
  - Test files: *.test.js/ts(x) or *.spec.js/ts(x)
  - AAA pattern (Arrange, Act, Assert) for readability

- Mocking and Data
  - Backend: In-memory MongoDB + builders in tests/utils/testUtils.js
  - Frontend: Comprehensive mocks for RN/Expo modules and fetch; utilities in __tests__/utils

- When to write tests
  - Unit: functions, model methods/statics, small hooks/components
  - Integration: Express routes with Supertest, component-container interactions
  - E2E: Critical user flows (auth, events lifecycle)
  - Performance: High-traffic endpoints and key paths

- Coverage
  - Current thresholds (backend/frontend configs): 70% global. Target higher for critical modules.

## 4. Code Style
- Backend (Node/Express)
  - Use async/await; handle errors via next(err) or centralized errorHandler
  - Validate input with express-validator in middleware; fail fast and consistently
  - Keep controllers thin; move domain logic to services/ when complexity grows
  - Models own persistence rules and invariants; prefer model methods/statics for domain ops
  - Use consistent response envelope: { success, data, message } for success; { success: false, message } for errors (see docs/api-spec.md). Align all routes to this shape
  - Naming: files kebab-case or camelCase in JS; variables camelCase; classes PascalCase; Mongoose models singular PascalCase

- Frontend (React Native + TypeScript)
  - Components: PascalCase; hooks: useX; context: XContext.tsx; screens: XScreen.tsx
  - Prefer function components with hooks; co-locate styles when small; move theme to config/theme.ts
  - API calls via services/api.ts and typed responses; centralize endpoints in config/api.ts
  - Keep side effects in hooks (e.g., useApi), not in components; lift state when shared
  - Use TypeScript types in types/ and packages/shared-types; avoid any
  - Accessibility: set testID and accessibilityLabel for interactive elements

- Comments/Docs
  - JSDoc for services, controllers, complex functions
  - Keep comments on reasoning, not restating code

- Error handling
  - Backend: always funnel errors to errorHandler; never leak stack traces to clients
  - Frontend: surface user-friendly messages; capture ApiError.message; log dev details only in dev builds

- Security
  - Do not log secrets; never store plaintext passwords
  - Use helmet, CORS, rate limiter as in server.js; keep defaults strict in production
  - JWT secret must be strong (env validator enforces >=32 chars)

## 5. Common Patterns
- Controller-Service-Model layering in backend
- Mongoose statics/methods for domain logic (e.g., getCurrentPlan, calculateOverallScore)
- Middleware composition for cross-cutting concerns (auth, validation, rate limiting, logging)
- Consistent request context: auth middleware attaches req.user with { id }
- Frontend API client abstraction with token injection and timeout handling
- Environment-aware API base URL selection (device vs emulator vs web) via config/api.ts

## 6. Do's and Don'ts
- Do
  - Validate env on startup (backend/config/env.js) and fail fast
  - Use express-validator in routes; put handleValidationErrors last in the chain
  - Return consistent envelopes: { success: true, data, message? }
  - Use auth middleware on protected routes; read user ID from req.user.id consistently
  - Sanitize and validate all user input; normalize emails to lowercase
  - Use lean() on read-heavy Mongoose queries when writes aren’t needed
  - Paginate list endpoints; document query params in docs
  - Keep controllers small; move logic to services for reuse/testability
  - Write tests alongside new features; use in-memory DB for backend tests
  - Keep token handling consistent across app layers

- Don’t
  - Don’t duplicate password hashing. User model has pre('save') hashing — avoid re-hashing in controllers
  - Don’t mix different auth context fields (req.userId vs req.user.id). Standardize on req.user.id
  - Don’t return inconsistent response shapes; align with docs/api-spec.md
  - Don’t hardcode URLs; always use config/api.ts and services/api.ts
  - Don’t expose internal error details to clients; rely on errorHandler
  - Don’t bypass rate limits or helmet/CORS protections in prod

## 7. Tools & Dependencies
- Backend
  - express, mongoose, jsonwebtoken, bcryptjs, helmet, cors, express-rate-limit, express-validator
  - Testing: jest, supertest, mongodb-memory-server
- Frontend
  - Expo RN stack, React Navigation, React Native Paper, @tanstack/react-query (available), Testing Library, jest-expo
  - API client wrapper in services/api.ts with AsyncStorage token integration
- E2E: Detox configured under e2e/
- Linting: ESLint configs in backend and frontend; Prettier at repo level
- Running
  - Root scripts to run backend and frontend concurrently: npm run dev
  - Backend: npm run dev (nodemon) | npm start
  - Frontend: npm start (Expo)
  - Tests: npm run test:backend | npm run test:frontend | npm run test:e2e

Environment configuration
- Required (backend): MONGODB_URI, JWT_SECRET (>=32 chars), PORT
- Frontend API resolution is environment and platform dependent; see config/api.ts

## 8. Other Notes
- Known inconsistencies to align
  - Backend auth middleware sets req.user = { id: decoded.userId }, while some routes use req.userId. Standardize use of req.user.id and update routes accordingly
  - User password hashing occurs both in controllers and in model pre-save; remove manual hashing in controllers to avoid double hashing
  - API response shapes in some routes return raw objects; migrate to { success, data } format per docs/api-spec.md and tests
  - Frontend token key mismatch: AuthContext stores token under 'token' and services/api.ts expects 'authToken'. Standardize to a single key (e.g., 'token') and update api client getters accordingly
- Versioning
  - Prefer /api/v1 paths in backend/server.js; plan deprecation timeline for legacy /api paths
- AI Coach
  - Keep heavy logic in services/ (aiCoachService). Controllers should validate inputs and orchestrate service calls; ensure pagination and filtering on list endpoints
- For LLM code generation
  - Respect layering and directory boundaries
  - Use express-validator and errorHandler for new routes
  - Maintain TypeScript types in frontend; export common types via packages/shared-types when used cross-layer
  - Include unit tests for business logic and integration tests for new endpoints
