# Chinnamma Ruchulu

Modern full-stack restaurant platform for a South Indian cloud kitchen.

## Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn-style reusable UI components
- Prisma ORM + PostgreSQL
- NextAuth (credentials auth)
- Stripe checkout + webhook
- Framer Motion

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env:
   ```bash
   copy .env.example .env
   ```
3. Generate Prisma client and migrate:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
4. Run app:
   ```bash
   npm run dev
   ```

## Default Admin

- Email: `admin@chinnammaruchulu.com`
- Password: `admin12345`

## Folder Structure

```text
app/
  api/
    admin/menu/route.ts
    admin/orders/[id]/route.ts
    auth/[...nextauth]/route.ts
    auth/register/route.ts
    cart/checkout/route.ts
    orders/route.ts
    stripe/webhook/route.ts
  (auth)/
    login/page.tsx
    register/page.tsx
  (dashboard)/
    admin/page.tsx
    dashboard/page.tsx
  (marketing)/
    about/page.tsx
    contact/page.tsx
    gallery/page.tsx
    menu/page.tsx
  (shop)/
    cart/page.tsx
  order/page.tsx
  globals.css
  layout.tsx
  page.tsx
  providers.tsx
  robots.ts
  sitemap.ts
components/
  cart/
  dashboard/
  layout/
  menu/
  shared/
  ui/
lib/
  auth.ts
  constants.ts
  menu.ts
  prisma.ts
  stripe.ts
  utils.ts
prisma/
  schema.prisma
  seed.ts
```

## Notes

- Stripe payment confirmation updates order status through `/api/stripe/webhook`.
- Customer dashboard shows order history.
- Admin dashboard supports menu creation and order status updates.
- WhatsApp floating CTA and Google Maps embed are included.
