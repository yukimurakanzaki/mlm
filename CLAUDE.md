# PT MLM web app

Customer-facing web app for PT MLM: landing page, product catalog, ordering (guest or signed-in), installment payments, order tracking, a rule-based FAQ chatbot, and an admin dashboard.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Drizzle ORM + Postgres (PGLite locally) · Clerk auth · next-intl (`id` default, `en` at `/en`) · Vitest + Playwright.
Bootstrapped from [ixartz/SaaS-Boilerplate](https://github.com/ixartz/SaaS-Boilerplate) (MIT).

## Commands
- `npm run dev` – dev server with a local PGLite database (no Docker)
- `npm run db:seed` – sample products (run while `dev` is running)
- `npm run db:generate` – create a migration after editing `src/models/Schema.ts` (commit it)
- `npm run lint` · `check:types` · `check:deps` · `check:i18n` · `test` · `test:e2e` – all must pass before merging

## Where things live
- `src/models/Schema.ts` – database tables (money is whole IDR integers)
- `src/features/orders/` – order creation/admin actions (`actions.ts`), queries, UI
- `src/utils/Orders.ts`, `src/utils/Chatbot.ts` – pure logic with unit tests
- `src/app/[locale]/(marketing)` – public pages · `(auth)/dashboard` – signed-in pages · `src/app/api/chat` – chatbot
- `src/locales/{id,en}.json` – every user-facing string; add keys to both (`npm run check:i18n`)

## Conventions
- All user-facing text goes through next-intl; never hardcode strings in components.
- Server actions validate with zod and must check `isAdmin()` for admin work.
- Never commit secrets. Real keys go in `.env.local` / hosting env vars; `.env` holds dummy defaults only.
- Conventional commit messages (`feat:`, `fix:`, `chore:`), enforced by commitlint.
- Admin = Clerk user with public metadata `{ "role": "admin" }`.
