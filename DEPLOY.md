# ScreenComply Deployment

## Quick Deploy to Vercel

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select `pijemy/screencomply`
4. Framework Preset: **Next.js** (auto-detected)
5. Environment Variables: None needed for localStorage demo mode
6. Click **Deploy**

That's it. Vercel will auto-deploy on every push to `main`.

## Future: Supabase Integration

When adding Supabase back, add these env vars in Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

## Current State

App runs fully client-side with localStorage. All pages functional:
- Dashboard with overview stats
- License verification (mock DBPR data)
- Permit requirements (real county data for Orange, Seminole, Osceola)
- Project tracker
- Auth (localStorage demo mode)