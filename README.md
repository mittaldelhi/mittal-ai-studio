# Mittal AI Studio

Premium AI agency website for local businesses across Bharat, based on the attached PRD.

## Current Status

- Next.js app scaffolded with TypeScript, Tailwind, and App Router.
- Premium landing page built with hero, service catalogue, audience hooks, portfolio, process, AI tools preview, pricing toggle, testimonials, contact form, footer, SEO metadata, sitemap, robots, and LocalBusiness schema.
- Source files are at the workspace root.
- A mirrored runnable copy currently exists in `mittal-ai-studio/` because the root `npm install` was interrupted and left a partial `node_modules`.
- TypeScript and ESLint pass in the runnable copy.

## Run Locally

Use the runnable copy for now:

```powershell
cd E:\deepak\MittalAistudio\mittal-ai-studio
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

The dev server may need permission to spawn worker processes on Windows. If PowerShell blocks `npm`, use:

```powershell
npm.cmd run dev
```

Create `.env.local` from `.env.example` before testing Razorpay:

```powershell
Copy-Item E:\deepak\MittalAistudio\.env.example E:\deepak\MittalAistudio\mittal-ai-studio\.env.local
```

Then fill:

```text
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

## Verification

Already run successfully:

```powershell
node_modules\.bin\tsc.cmd --noEmit
node_modules\.bin\eslint.cmd
```

`next build` compiled the app, then the sandbox blocked a spawned worker with `EPERM`; this is an environment permission issue, not a TypeScript error.

## Next Steps

- Repair or reinstall root dependencies, then remove the temporary mirrored `mittal-ai-studio/` folder.
- Create a Supabase project, enable Google auth, and run `supabase/schema.sql`.
- Add Razorpay test keys and WhatsApp Cloud API webhook credentials.
- Add individual service and portfolio detail pages.

## Supabase Setup

Create `.env.local` in the runnable folder and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
```

In Supabase:

1. Enable Google provider in Authentication.
2. Add redirect URL: `http://127.0.0.1:3000/auth/callback`.
3. Open SQL editor and run:

```text
supabase/schema.sql
```

After your first Google login, make your account admin:

```sql
update profiles
set role = 'admin'
where email = 'your-email@example.com';
```

Admin dashboard:

```text
http://127.0.0.1:3000/admin
```

Customer dashboard:

```text
http://127.0.0.1:3000/dashboard
```

## WhatsApp Cloud API

Set:

```env
WHATSAPP_VERIFY_TOKEN=choose-a-secret-token
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

Webhook URL:

```text
https://your-domain.com/api/whatsapp/webhook
```

## Edit Pricing

Pricing is stored in:

```text
lib/constants/site.ts
```

Edit `pricingPlans`. Each plan uses yearly pricing:

```ts
yearly: 9999
```

The UI displays that as `Rs. 9,999/year` and sends the same amount to Razorpay.
