# Launch checklist (Vercel + Neon + Clerk + Midtrans, domain on Hostinger)

Analogy: Vercel is the shop, Neon is the warehouse (data), Clerk is the door lock (login), Midtrans is the cashier, Hostinger is the street address (domain) and mailbox.

Do the steps in order. Keep a note of every key you copy; never paste keys into chat, GitHub or code.

## 1. Database (Neon)
1. Sign up at https://neon.tech, create a project (region: Singapore).
2. Copy the **connection string** (starts with `postgresql://`). This is `DATABASE_URL`.

## 2. Login (Clerk)
1. Sign up at https://clerk.com, create an application.
2. Copy the **Publishable key** (`pk_...`) and **Secret key** (`sk_...`).
3. After your first sign-in on the live site: Clerk dashboard > Users > your user > Metadata > Public, set `{ "role": "admin" }`. Then open `/dashboard/admin`.

## 3. Payments (Midtrans)
1. Sign up at https://dashboard.midtrans.com. Start in **Sandbox**.
2. Settings > Access Keys: copy the **Server Key**.
3. Settings > Payment > Notification URL: `https://YOUR-DOMAIN/api/payments/midtrans`.
4. To go live later: finish Midtrans business verification, then switch to the Production server key and set `MIDTRANS_IS_PRODUCTION=true`.

## 4. The app (Vercel)
1. Sign up at https://vercel.com with GitHub, then Add New > Project > import `yukimurakanzaki/mlm`.
2. Production branch: the repo's default branch (currently `claude/affectionate-bell-ht89aj`; no `main` exists yet).
3. Build command: `npm run build` (it applies database migrations, then builds).
4. Environment variables:

| Name | Value |
|---|---|
| `DATABASE_URL` | from step 1 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | from step 2 |
| `CLERK_SECRET_KEY` | from step 2 |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR-DOMAIN` |
| `MIDTRANS_SERVER_KEY` | from step 3 |
| `MIDTRANS_IS_PRODUCTION` | `false` (sandbox) |

5. Deploy. Do **not** run `db:seed` in production.
6. Add products: sign in as admin, open `/dashboard/admin/products`, and upload your catalog sheet (CSV) under **Impor katalog**. Columns: `sku, nama_produk, kategori, merek, kemasan, satuan, deskripsi_singkat, harga_jual, tampilkan_harga (Ya/Tidak), status (aktif/draft)`. Re-uploading the same sheet updates prices and details (matched by SKU). Do not commit the sheet to GitHub: the repository is public.

## 5. Domain (Hostinger)
1. Vercel > Project > Settings > Domains > add your domain. Vercel shows DNS records.
2. Hostinger hPanel > Domains > DNS / Nameservers > add those records (usually an `A` record for the root and a `CNAME` for `www`).
3. Leave existing `MX` and mail records alone, so your email keeps working.
4. Wait up to a few hours; Vercel issues HTTPS automatically.
5. In Clerk, add your domain under Domains / allowed origins if asked.

## 6. Test before announcing
1. Place a test order as a guest, then open Track order with the code and phone.
2. Press **Pay online** and pay with a Midtrans sandbox test method; the installment should turn Paid within a minute and the order should become Confirmed.
3. Sign in as admin, add a product, change stock, move an order along its statuses.
4. Check the chatbot and the English version at `/en`.
