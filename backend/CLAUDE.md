# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Start development server (uses watch mode for auto-restart)
npm run dev

# Start production server
npm start

# Run database migrations
npx sequelize-cli db:migrate

# Run pending migrations and seed data
npx sequelize-cli db:seed:all

# Reset database (drop, create, migrate, seed)
npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
```

No test framework is configured. If adding tests, consider Jest or Vitest for this Node.js/Express stack.

## Code Architecture

This is a Node.js backend using Express with Sequelize ORM and PostgreSQL. The architecture follows a modular pattern:

### Core Files
- **src/server.js** - Entry point: initializes Express app, connects to database, starts server
- **src/app.js** - Defines the Express middleware stack (CORS, JSON parsing) and routes
- **src/config/database.js** - Sequelize instance and database connection logic (PostgreSQL)

### Routing and Controllers
- **src/routes/** - Route definitions (express Router)

  - `auth.routes.js` - Maps `/api/auth/signup` and `/api/auth/login` endpoints

- **src/controllers/** - Request handler logic

  - `auth.controller.js` - Signup (validates input, checks for duplicates, hashes password with bcrypt, creates User, returns JWT) and login (finds user by email, verifies bcrypt password hash, updates last login, returns JWT)

### Models
- **src/models/** - Sequelize model definitions

  - `userModel.js` - User model with fields: id (UUID), fullName, email, phone, password (hashed), role (enum), isActive, profileImage, lastLoginAt

### Security
- **src/middleware/auth.middleware.js** - Currently a stub (empty file, no auth middleware implemented yet)
- **src/utils/jwt.js** - JWT token generation (signs id, email, role with JWT_SECRET)

### Configuration Files
- `.env` - Environment variables (DB credentials, JWT_SECRET, etc.)
- `.env.example` - Template for required environment variables
- `.sequelizerc` - Sequelize CLI configuration

## Key Architectural Decisions
1. **ES Modules (ESM)** - All source files use `import`/`export` (note `"type": "module"` in package.json)
2. **PostgreSQL** - Database is PostgreSQL via pg driver and pg-hstore for serialization
3. **JWT Authentication** - Stateless authentication using JSON Web Tokens
4. **bcrypt** - Passwords hashed with bcrypt (12 rounds in signup flow)
5. **Singleton Pattern** - Database/Sequelize instance shared across models via `src/config/database.js`
6. **API Prefix** - All API routes are prefixed with `/api` 
7. **Response Format** - Consistent JSON responses with `success`, `message`, and optional `data` fields

## Environment Variables (see .env.example)
- DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT - PostgreSQL connection
- JWT_SECRET - Secret used to sign JWT tokens
- JWT_EXPIRES_IN - Token expiration time
- PORT - Server port (default: 5000)

## Development Notes
- The auth middleware is empty; adding route protection (JWT verification middleware) would be needed for protected routes
- API responses follow a consistent `{ success, message, data }` pattern
- CORS is configured to allow all origins (`origin: "*"`) — restrict this in production
- No linting or testing tooling is currently set up
