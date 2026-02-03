# Task Management System with RBAC

Full-stack secure task management application with role-based access control.

## Author
Connor Babb - connorjbabb@gmail.com

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```
npm install
```

### Running the Application
```bash
# Terminal 1: Start backend
npx nx serve api

# Terminal 2: Start frontend
npx nx serve dashboard
```

- Backend: http://localhost:3000/api
- Frontend: http://localhost:4200

### Test Accounts
- **Owner**: owner@test.com / password123
- **Admin**: admin@test.com / password123
- **Viewer**: viewer@test.com / password123

## Architecture Overview

### NX Monorepo Structure
```
apps/
  api/              → NestJS backend (port 3000)
  dashboard/        → Angular frontend (port 4200)
libs/
  data/             → Shared TypeScript interfaces & DTOs
  auth/             → Reusable RBAC logic & decorators
```

### Technology Stack
**Backend:**
- NestJS
- TypeORM
- SQLite
- JWT (passport-jwt)
- bcrypt

**Frontend:**
- Angular (standalone components)
- TailwindCSS
- RxJS

## Data Model

### Entity Relationship Diagram
```
Organization (1) ──< (many) User
     │                       │
     │                       │
     └──< (many) Task  <──┘
          (owned by User, scoped to Org)
```

### Entities

**User**
- id (UUID)
- email (unique)
- password (hashed)
- role (OWNER | ADMIN | VIEWER)
- organizationId (FK)

**Organization**
- id (UUID)
- name
- parentOrgId (nullable, 2-level hierarchy)

**Task**
- id (UUID)
- title
- description
- status (TODO | IN_PROGRESS | DONE)
- category
- ownerId (FK to User)
- organizationId (FK)
- createdAt, updatedAt

**AuditLog**
- id (UUID)
- userId
- action
- resource
- timestamp

## Access Control Implementation

### Role Hierarchy
```
OWNER (level 3)
  ↓
ADMIN (level 2)
  ↓
VIEWER (level 1)
```

### Permission Model

**OWNER:**
- Full access to their organization
- Can view/edit/delete tasks in child organizations
- Can view audit logs

**ADMIN:**
- Full access within their own organization
- Can create/edit/delete tasks
- Cannot access parent or sibling organizations

**VIEWER:**
- Read-only access to their organization's tasks
- Cannot create, edit, or delete tasks

### RBAC Implementation

1. **JWT Authentication**
   - Login endpoint issues JWT token
   - Token contains: userId, email, role, organizationId
   - All endpoints require valid JWT

2. **Guards & Decorators**
   - `@RequireRole(Role.ADMIN)` - Method-level role checking
   - `RBACGuard` - Validates user has sufficient role
   - `JwtAuthGuard` - Validates JWT token

3. **Organizational Scoping**
   - Tasks are filtered by accessible organization IDs
   - OWNER can access child org tasks via `parentOrgId` lookup
   - ADMIN/VIEWER limited to their own org

4. **Audit Logging**
   - `AuditInterceptor` logs all API calls
   - Captures: userId, method, URL, timestamp
   - Currently logs to console (extensible to DB)

## API Documentation

### Authentication
```
POST /api/auth/login
Body: { "email": "owner@test.com", "password": "password123" }
Response: { "access_token": "jwt...", "user": {...} }
```

### Tasks

**Create Task**
```
POST /api/tasks
Headers: Authorization: Bearer <token>
Body: {
  "title": "New task",
  "description": "Task details",
  "category": "Work"
}
```

**List Tasks** (scoped to role/org)
```
GET /api/tasks
Headers: Authorization: Bearer <token>
Response: [{ id, title, description, status, category, ... }]
```

**Update Task**
```
PATCH /api/tasks/:id
Headers: Authorization: Bearer <token>
Body: { "status": "DONE" }
```

**Delete Task**
```
DELETE /api/tasks/:id
Headers: Authorization: Bearer <token>
```

## Testing

### Run Tests
```bash
# Backend tests
npx nx test api

# Auth library tests
npx nx test auth

# Frontend tests
npx nx test dashboard
```

### Test Coverage
- RBAC guard role hierarchy
- Permission service logic
- Task scoping by organization
- JWT authentication flow

## Future Considerations

### Security Enhancements
- JWT refresh tokens
- CSRF protection
- Rate limiting
- Input sanitization
- SQL injection prevention (TypeORM parameterization)

### Performance
- RBAC permission caching (Redis)
- Database indexing on organizationId, ownerId
- Pagination for large task lists

### Features
- Advanced role delegation (custom permissions)
- Task assignment to other users
- Email notifications
- File attachments
- Task comments & history

### Scalability
- PostgreSQL for production
- Microservices architecture
- Event-driven audit logging
- Multi-tenancy improvements

## Development Notes

- SQLite database file: `database.sqlite` (auto-created)
- Database is seeded on backend startup
- CORS enabled for local development
- TypeORM `synchronize: true` (disable in production!)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/nest?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)