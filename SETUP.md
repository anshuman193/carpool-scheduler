# Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run backend:dev
   npm run dev
   ```
3. Run the test suite:
   ```bash
   npm run test:run
   ```
4. Build the production bundle:
   ```bash
   npm run build
   ```

## Environment & Google Authentication

Copy `.env.example` to `.env` and configure:
- `VITE_API_BASE_URL` for your local or deployed API (local backend default: `http://localhost:3000/api/v1`).
- `VITE_GOOGLE_CLIENT_ID` with your Web Application Client ID from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- `VITE_ENABLE_DEMO_LOGIN` to control whether the local demo sign-in button is available. It defaults to enabled in development and disabled in production unless explicitly set.
- `VITE_REQUIRE_LOGIN_EVERYTIME` to control whether auth should persist between sessions.

For step-by-step instructions on setting up your Google OAuth Client ID, see [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md).

*Note: If `VITE_GOOGLE_CLIENT_ID` is left blank, the app can still offer demo sign-in through the backend when `ALLOW_DEMO_ID_TOKEN=true` in `backend/.env`.*

## Deploying to Vercel

1. Import the repository into Vercel.
2. Keep the framework preset as **Vite** if Vercel detects it automatically.
3. Confirm the build settings:
   ```bash
   Build Command: npm run build
   Output Directory: dist
   ```
4. Add the required Vercel environment variables:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_API_BASE_URL`
   - `VITE_ENABLE_DEMO_LOGIN=false` for production deployments unless you intentionally want demo access
   - `VITE_REQUIRE_LOGIN_EVERYTIME=false` if you want auth persisted via localStorage in production
5. Deploy the app.

### SPA routing on Vercel

This repository includes [`vercel.json`](./vercel.json), which rewrites all unmatched routes to `index.html`. That keeps direct visits and refreshes working for client-side routes such as `/calendar`, `/groups`, and `/chat`.

### Production readiness note

The backend now verifies Google ID tokens on `POST /api/v1/auth/google/verify` and issues short-lived access tokens with refresh support; keep `ALLOW_DEMO_ID_TOKEN=false` for production.
