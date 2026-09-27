# Architecture

## Frontend stack

- **Vite + React 18 + TypeScript** for the application shell
- **Tailwind CSS** for responsive styling and theming
- **Redux Toolkit** for UI state such as screen selection, sidebar visibility, and theme
- **React Router** for screen-level navigation

## Backend stack (new)

- **Node.js HTTP server** in `backend/` with versioned REST API at `/api/v1`
- Server-side Google token verification + short-lived access and refresh sessions
- In-memory module boundaries for Auth, Groups, Scheduling, Swaps, Chat, Notifications, Admin, and Reporting
- Contract tests in `backend/tests/contracts.test.js`
- Relational production schema draft in `backend/db/schema.sql`

### Backend scope and SLA targets

- Scope: login/session, groups/members, ride slots/assignments, swaps, chat, notifications, dashboard metrics
- Availability target: `99.9%`
- Latency targets: read p95 `<=200ms`, write p95 `<=350ms`
- Audit retention target: `365 days`
- Notification retention target: `180 days`

### Core backend domain entities

- Users, Families, Children
- CarpoolGroups, GroupMemberships (RBAC)
- RideSlots, Assignments, Schedule versions
- SwapRequests (optimistic locking)
- ChatThreads, ChatMessages
- Notifications + delivery state
- AuditLogs

### API contract map

- `POST /auth/google/verify`, `GET /auth/session`, `POST /auth/session/refresh`, `POST /auth/logout`
- `GET/POST /groups`, `GET /groups/:id/members`
- `GET /schedule`, `GET /rides`, `GET /assignments`, `POST /assignments/recompute`
- `GET/POST /swaps`, `POST /swaps/:id/respond`
- `GET /chat/threads`, `GET/POST /chat/messages`
- `GET /notifications`, `GET /me/dashboard`
- `GET /admin/moderation`, `GET /reports/analytics`, `GET /meta/sla`

## Folder structure

- `src/components/layout`: mobile, tablet, and desktop shells plus adaptive navigation
- `src/components/screens`: MVP-ready screen placeholders for home, calendar, groups, chat, and menu
- `src/components/shared`: typed UI primitives (button, card, badge, input, modal)
- `src/hooks`: responsive hooks and layout context
- `src/store`: Redux store and UI slice
- `src/styles`: Tailwind entrypoint, CSS variables, and shared breakpoints
- `src/utils`: device detection, constants, and class name helpers

## Responsive strategy

The app is mobile-first, with custom Tailwind breakpoints at 320px, 641px, and 1025px. Layout selection happens through `useResponsive` and `useLayout`, allowing the shell to switch between bottom-tab, two-column, and three-column experiences without changing route structure.
