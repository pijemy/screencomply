# Project: ScreenComply

## Description
Florida screen enclosure contractor compliance SaaS. Compliance checklist wizard, license verification, permit tracking, and HOA approval workflows.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Postgres + Auth + Storage)
- **Payments:** Stripe (checkout session) — Phase 2
- **Hosting:** Vercel (free tier)
- **Language:** TypeScript throughout

## Architecture
- State-by-state data structure from day 1 (easy expansion beyond FL)
- County-by-county permit data as structured JSON (starting with Orange, Seminole, Osceola)
- License verification as async job (not real-time — poll FL DBPR)
- Clean separation between license check service and app logic (paves way for FLVerify API)

## MVP Features (Build These First)
1. **License Verification Dashboard** — Enter contractor license # → verify status via FL DBPR, show expiration, specialty endorsements, disciplinary actions
2. **Compliance Checklist Wizard** — Select project type (new screen, rescreen, pool enclosure, security screen) + jurisdiction → generate required permits, licenses, insurance, inspections
3. **Permit Requirement Lookup** — Orange, Seminole, Osceola county specifics: forms needed, fees, timeline, submission methods
4. **Project Tracker** — Track compliance status per project: license ✓, permit submitted/issued ✓, HOA approved ✓, insurance verified ✓, inspection scheduled ✓

## NOT in MVP (Phase 2+)
- Automated permit submission
- HOA document management
- Multi-county expansion beyond Orlando metro
- API access (FLVerify)
- Mobile app
- Customer-facing portal
- Stripe payments

## Code Standards
- TypeScript strict mode
- 2-space indentation for all files
- Functional React components with hooks
- Server components by default, client components only when needed (`"use client"`)
- shadcn/ui components — use the CLI to add them
- Tailwind for styling — no inline styles
- All database queries through Supabase client
- Environment variables in `.env.local` (never committed)
- Organize by feature: `app/(auth)/`, `app/dashboard/`, `app/projects/`, etc.

## Key Commands
- `npm run dev` — start dev server on :3000
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npx shadcn@latest add <component>` — add shadcn/ui components

## Directory Structure
```
screencomply/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing/home page
│   ├── globals.css             # Tailwind base styles
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Main dashboard
│   │   ├── licenses/page.tsx   # License verification
│   │   └── permits/page.tsx    # Permit requirement lookup
│   ├── projects/
│   │   ├── page.tsx            # Project list
│   │   ├── [id]/
│   │   │   └── page.tsx        # Project detail with checklist
│   │   └── new/page.tsx        # Compliance wizard
│   └── api/
│       └── licenses/
│           └── verify/route.ts  # License verification endpoint
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── compliance-wizard.tsx
│   ├── project-checklist.tsx
│   ├── license-card.tsx
│   └── permit-info-card.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   ├── permit-data/
│   │   ├── orange.ts           # Orange County permit requirements
│   │   ├── seminole.ts         # Seminole County permit requirements
│   │   └── osceola.ts          # Osceola County permit requirements
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── utils.ts                # Utility functions
├── data/
│   └── florida-counties.ts     # County data with permit requirements
├── public/
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```