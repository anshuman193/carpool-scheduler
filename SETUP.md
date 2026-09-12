# Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
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
- `VITE_API_BASE_URL` for your local or deployed API.
- `VITE_GOOGLE_CLIENT_ID` with your Web Application Client ID from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

For step-by-step instructions on setting up your Google OAuth Client ID, see [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md).

*Note: If `VITE_GOOGLE_CLIENT_ID` is left blank, the app will offer a Demo/Mock Google Sign-In mode for instant local development and testing.*

