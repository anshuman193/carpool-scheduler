# Carpool Scheduler

Carpool Scheduler is a production-ready React 18 + TypeScript + Tailwind CSS starter for a responsive family transportation planning app.
It now includes a Node backend scaffold (`backend/`) with versioned API contracts for auth, groups, schedules, swaps, chat, notifications, and dashboard metrics.

## Included foundation

- Vite-based React app shell with typed routing
- Mobile, tablet, and desktop layouts
- Shared UI primitives for buttons, cards, badges, inputs, and modals
- Redux Toolkit UI state for screen navigation, menus, sidebar, and theme
- Tailwind CSS with custom breakpoints at 320px, 641px, and 1025px
- Setup and architecture documentation for new contributors

## Quick start

```bash
npm install
npm run backend:dev
npm run dev
npm run test
```

## Deploying to Vercel

This app is a Vite-built React SPA and can be deployed directly to Vercel as a static frontend.

- Build command: `npm run build`
- Output directory: `dist`
- SPA routing fallback is configured in [`vercel.json`](./vercel.json) so deep links like `/calendar` continue to work on refresh
- Required environment variables:
  - `VITE_GOOGLE_CLIENT_ID`
  - `VITE_API_BASE_URL` (for example `http://localhost:3000/api/v1`)
- Optional environment variables:
  - `VITE_ENABLE_DEMO_LOGIN` (`false` recommended for production)
  - `VITE_REQUIRE_LOGIN_EVERYTIME`

See [SETUP.md](./SETUP.md) for deployment steps and [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) for OAuth configuration details.

Additional documentation:

- [SETUP.md](./SETUP.md)
- [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
