# PT Mitra Labora Medika – Web App

Online ordering for PT Mitra Labora Medika: customers browse the catalog, order without needing an account, pay in full or in monthly installments, and track order status and payments. Signed-in customers see their full purchase history. Staff manage orders and payments in an admin dashboard. A FAQ chatbot answers common questions.

Built on Next.js 16, TypeScript, Tailwind, Drizzle/Postgres, Clerk and next-intl (Indonesian default, English at `/en`). Bootstrapped from [ixartz/SaaS-Boilerplate](https://github.com/ixartz/SaaS-Boilerplate) (MIT).

## Public site and direct ordering

The public site currently shows the bilingual coming-soon page. Customers can order through the email, telephone, and WhatsApp links configured in `AppConfig.contact` in `src/utils/AppConfig.ts`. The page, metadata, and prefilled messages do not name a third-party company or discuss licensing. `AppConfig.comingSoon` keeps the unfinished catalog and tracking URLs on the landing page and blocks direct online checkout while orders are handled through direct contact.

Run `npm run dev:next` to develop this page; it does not need a database server. The Kawung petals assemble once, then turn with the nearby mouse/pen cursor. Angular movement follows the shortest path across the angle seam and settles upright when the cursor leaves. There is no pause button or perpetual idle animation. Reduced motion disables both the entrance animation and cursor response; touch scrolling is unaffected. Brand fonts are bundled under `public/fonts/` with their licenses, so builds do not fetch Google Fonts.

`npm test` includes regression coverage for direct order/checkout attempts during the pause. `npm run test:e2e` covers the coming-soon page and intentionally skips the four legacy sales/chat scenarios while this mode is active. Install Playwright Chromium first with `npx playwright install chromium`; an existing compatible browser can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for both test runners.

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
| Online payment via Midtrans (per installment, webhook auto-confirms) | Done (needs Midtrans keys) |
| Notifications (WhatsApp/email) | Not yet |
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
Full step-by-step: see [DEPLOY.md](DEPLOY.md).
1. Create a Postgres database (e.g. Neon/Supabase) and a Clerk production instance.
2. Set `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL` in your host (Vercel, or the included `Dockerfile`).
3. Build command `npm run build` (applies migrations, then builds). Do **not** run `db:seed` in production.

## Known limitations / next steps
- Payments are recorded manually by admins; no payment gateway yet.
- No rate limiting on ordering/tracking endpoints; add one (e.g. Arcjet/Upstash) before heavy public traffic.
- Products are managed in the database (no admin UI yet).
- No MLM-specific features (downline tree, commissions) – out of scope for this version.

Licence: app code © PT Mitra Labora Medika; the starter template is MIT (see `LICENSE`).
