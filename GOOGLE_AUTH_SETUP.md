# Google OAuth Setup Guide

This guide walks you through setting up real Google Authentication credentials for the Carpool Scheduler app.

---

## 1. Create a Project in Google Cloud Console

1. Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. If you don't already have a project, click **Create Project** at the top right, enter a project name (e.g., `carpool-scheduler`), and click **Create**.

---

## 2. Configure the OAuth Consent Screen

1. In the left navigation menu, click **OAuth consent screen**.
2. Select **External** (or **Internal** if within a Google Workspace organization) and click **Create**.
3. Fill in the required fields:
   - **App name**: `Carpool Scheduler`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes** and select:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Click **Save and Continue**.
7. Under **Test users** (if in External / Testing status), add your Google email address so you can sign in during development.
8. Click **Save and Continue**.

---

## 3. Create OAuth 2.0 Web Application Credentials

1. In the left menu, click **Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Set **Name** to `Carpool Scheduler Web Client`.
5. Under **Authorized JavaScript origins**, click **+ Add URI** and add:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
6. Under **Authorized redirect URIs**, click **+ Add URI** and add:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
7. Click **Create**.
8. A modal will pop up displaying your **Client ID** (it looks like `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`). Copy this Client ID.

---

## 4. Configure Your Local Environment

1. Open `.env` in the root directory of the Carpool Scheduler project (or copy `.env.example` to `.env` if `.env` does not exist yet).
2. Paste your copied Client ID into `VITE_GOOGLE_CLIENT_ID`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

3. Save `.env` and restart the Vite development server (`npm run dev`).

---

## 5. Local Development / Demo Mode

If `VITE_GOOGLE_CLIENT_ID` is left empty in `.env`:
- The app automatically provides a **"Sign in with Demo Google Account"** option in the sign-in modal.
- This allows you or new contributors to test authenticated UI screens without needing Google Cloud credentials.
