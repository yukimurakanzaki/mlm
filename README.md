# PT MLM – Web App

Online ordering for PT MLM: customers browse the catalog, order without needing an account, pay in full or in monthly installments, and track order status and payments. Signed-in customers see their full purchase history. Staff manage orders and payments in an admin dashboard. A FAQ chatbot answers common questions.

Built on Next.js 16, TypeScript, Tailwind, Drizzle/Postgres, Clerk and next-intl (Indonesian default, English at `/en`). Bootstrapped from [ixartz/SaaS-Boilerplate](https://github.com/ixartz/SaaS-Boilerplate) (MIT).

## Features
| Area | Status |
|---|---|
| Landing page, catalog, product page | Done |
| Guest ordering (stock-safe, validated) | Done |
| Installment plans (1/3/6 months) and payment schedule | Done |
| Order tracking by code + phone | Done |
| Customer dashboard (history, payments) | Done |
| Admin: order status, mark installment paid, stats | Done |
| FAQ chatbot (rule-based, no AI key needed) | Done |
| Online payment gateway (Midtrans/Xendit), notifications | Not yet |
| Product management UI, rate limiting, LLM chatbot | Not yet |

## Quick start
```bash
npm ci
cp .env.example .env.local      # add your Clerk keys (https://dashboard.clerk.com)
npm run dev                     # http://localhost:3000, local database, no Docker
npm run db:seed                 # in another terminal: sample products
```
Requires Node 22+ (24 recommended).

### Make yourself admin
Clerk dashboard → Users → your user → Metadata → Public: `{ "role": "admin" }`, then open `/dashboard/admin`.

## Quality gates
`npm run lint && npm run check:types && npm run check:deps && npm run check:i18n && npm test && npm run test:e2e` (also run in GitHub Actions on every PR).

## Deploying
1. Create a Postgres database (e.g. Neon/Supabase) and a Clerk production instance.
2. Set `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL` in your host (Vercel, or the included `Dockerfile`).
3. Build command `npm run build` (applies migrations, then builds). Do **not** run `db:seed` in production.
4. Before launch, replace the placeholders marked `FIXME` in `src/utils/AppConfig.ts` (contact email, WhatsApp number).

## Known limitations / next steps
- Payments are recorded manually by admins; no payment gateway yet.
- No rate limiting on ordering/tracking endpoints; add one (e.g. Arcjet/Upstash) before heavy public traffic.
- Products are managed in the database (no admin UI yet).
- No MLM-specific features (downline tree, commissions) – out of scope for this version.

Licence: app code © PT MLM; the starter template is MIT (see `LICENSE`).
