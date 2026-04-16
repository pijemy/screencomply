# ScreenComply Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard and sign in (or create account)
2. Click "New Project"
3. Settings:
   - Name: `screencomply`
   - Database password: generate and save this somewhere secure
   - Region: **East US (North Virginia)** — closest to Orlando customers
   - Plan: Free tier is fine for now
4. Wait for project to provision (~2 minutes)

## Step 2: Apply Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the ENTIRE contents of `supabase/migrations/001_initial_schema.sql` and paste it
4. Click **Run** — you should see "Success" for all statements
5. Verify: Go to **Table Editor** — you should see `profiles`, `projects`, `license_verifications`

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Also go to **Settings** → **API** → **SMTP** and note the SMTP settings if you want custom email later

## Step 4: Configure Email Auth (Supabase)

1. Go to **Authentication** → **Providers** → **Email**
2. Make sure "Enable Email Signup" is ON
3. Under **Email Templates**, you can customize the confirmation email later
4. Under **URL Configuration**, set the Site URL to your Vercel URL once deployed (or `http://localhost:3000` for dev)

## Step 5: Update .env.local

Replace the placeholder values in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## Step 6: Deploy to Vercel

### Option A: Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from screencomply project root)
cd ~/clanker-projects/screencomply
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redeploy with env vars
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import the `pijemy/screencomply` repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Click "Deploy"

## Step 7: Verify

1. Visit your deployed URL
2. Try signing up — should create a user and profile
3. Check Supabase dashboard → Authentication → Users — should see your test user
4. Check Supabase dashboard → Table Editor → profiles — should see your profile row

## What Clanker Needs From You

After completing Steps 1-3, send me:
1. The Supabase project URL
2. The anon public key

I'll then:
- Update `.env.local` with real credentials
- Wire up the auth flow for real
- Set up Vercel deployment
- Push any code changes needed for the real backend