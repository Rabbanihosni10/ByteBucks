# ByteBucks

ByteBucks is a Next.js app for learning money skills with short quizzes and coin rewards. It uses Supabase for authentication and storage.

## Requirements

- Node.js 20.9 or newer
- A Supabase project

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the Supabase project URL and anon/publishable key.
3. Apply `supabase/migrations/20261126000000_initial_schema.sql` in the Supabase SQL Editor. This creates the tables, row-level security policies, auth profile trigger, secure quiz completion function, and two starter quizzes. If you use the Supabase CLI, initialize and link the project first, then apply the migration with `supabase db push`.
4. In Supabase Authentication settings, set the Site URL to `http://localhost:3000` and enable email/password sign-in. Email confirmation can remain enabled; after confirming, users can log in.
5. Run `npm run dev` and open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repository to GitHub and import it in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings → Environment Variables for the environments you deploy.
3. Apply the Supabase migration before inviting users. Set the Supabase Auth Site URL to your production domain and add both your production domain and `http://localhost:3000` to the allowed redirect URLs.
4. Deploy with the default build command, `npm run build` (Webpack with Tailwind's PostCSS plugin).

The app does not need a Supabase service-role key. Never expose a service-role key in a `NEXT_PUBLIC_` variable.

## Scripts

- `npm run dev` — start the development server
- `npm run lint` — run ESLint
- `npm run build` — create a production build
- `npm run start` — serve a production build

## Data and security

Quiz answers are scored in a PostgreSQL function so answer keys and reward updates stay on the server and attempt/coin updates happen atomically. Row-level security limits profile, attempt, and audit-log reads to the signed-in account. The parent progress screen currently shows the signed-in account's own attempts; linking a parent's account to a student's account is not implemented.
