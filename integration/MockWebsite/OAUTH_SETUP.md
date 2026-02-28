# Google OAuth Setup

To make Google sign-in work, configure the following in your Supabase Dashboard.

## 1. Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **URL Configuration**
3. Under **Redirect URLs**, add:
   - `http://localhost:3001/**` (for local dev)
   - `https://yourdomain.com/**` (for production)
4. Set **Site URL** to `http://localhost:3001` for dev (or your production URL)

## 2. Google Provider

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
4. Application type: **Web application**
5. **Authorized JavaScript origins**: add `http://localhost:3001` (and your production URL)
6. **Authorized redirect URIs**: add your Supabase callback URL:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Find YOUR_PROJECT_REF in Supabase Dashboard → Settings → General
7. Copy the **Client ID** and **Client Secret**
8. In Supabase: **Authentication** → **Providers** → **Google**
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

## 3. Verify

After configuration:

1. Restart your dev server
2. Click **Google** on the login/sign-up page
3. You should be redirected to Google, then back to your dashboard (`/`)
