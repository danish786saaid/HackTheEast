# BadgeForge MockWebsite

Standalone copy of the BadgeForge frontend and backend for integration testing and demos.

## Contents

- **Frontend:** Next.js app (`app/`, `components/`, `contexts/`, `public/`)
- **Backend:** API routes (`pages/api/`), Supabase, AI/ML modules (`ai/`, `lib/`)

## Run locally

```bash
cd integration/MockWebsite
cp .env.example .env.local
# Edit .env.local with your Supabase URL, keys, and API keys
npm install
npm run dev
```

Open http://localhost:3000

## Requirements

- Node.js 18+
- Supabase project (see OAUTH_SETUP.md for Google sign-in)
- API keys in .env.local (OpenAI, MiniMax, NewsAPI, etc.)
