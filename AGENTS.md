# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core references
- **Primary architecture & feature docs:** `CLAUDE.md` (promo codes, class passes, payment flow, environment variables, common tasks).
- **Framework basics:** `README.md` (generic Next.js notes).
- **Database schema:** `prisma/schema.prisma` (source of truth for data model).

When in doubt about business rules (especially around promo codes, payments, and booking), prefer `CLAUDE.md` + the relevant API route over guessing.

## Common commands & workflows

### Dependency installation
Project uses a `pnpm-lock.yaml` and TypeScript/Next.js 15:
- Install dependencies (preferred):
  - `pnpm install`
- Alternative (if pnpm is not available):
  - `npm install`

### Local development
- Start dev server:
  - `pnpm dev`
- Default dev URL:
  - `http://localhost:3000`

Ensure required env vars are set (see **Environment & secrets** below) before starting the server, or many features (auth, payments, availability) will not work.

### Linting & type-check
- Lint:
  - `pnpm lint`
- TypeScript is configured via `tsconfig.json`; there is no dedicated `typecheck` script, but `next build` will run type-checks.

### Database & Prisma
Prisma client is generated into `app/generated/prisma` and re-exported via `prisma/client.ts`.

- Run migrations and generate client during active development:
  - `npx prisma migrate dev --name <migration_name>`
  - `npx prisma generate`
- View/edit data:
  - `npx prisma studio`
- Apply migrations in production / CI:
  - `npx prisma migrate deploy`

### Seeding
There are two seed entry points:
- General seed script (wired via `package.json`):
  - `pnpm seed` → runs `ts-node prisma/seed.mjs`
- Class pass product seed (documented in `CLAUDE.md`):
  - `npx tsx prisma/seed-class-pass.ts`

Check both `prisma/seed.mjs` and `prisma/seed-class-pass.ts` before modifying seeding behavior so you don’t duplicate or diverge product setups.

### Build & run in production mode
- Build (also runs `prisma generate` and sitemap generation):
  - `pnpm build`
- Start in production mode (after `pnpm build`):
  - `pnpm start`
- Static export (if needed):
  - `pnpm export`

### Tests
There is **no configured automated test script** in `package.json` and no `*.test.*` / `*.spec.*` files in the repo. If you add a test framework, also add an explicit script (e.g. `"test"`) to `package.json` and document how to run single tests here.

## High-level architecture

### Tech stack
As summarized in `CLAUDE.md`:
- Next.js 14+/15 (App Router, `app/` directory) with some legacy `pages/` support.
- TypeScript.
- Chakra UI for layout and styling.
- Prisma + PostgreSQL, with the client emitted into `app/generated/prisma`.
- NextAuth.js (credentials + Google) for auth.
- Stripe for payments.
- React Query (TanStack Query) for data fetching and caching.
- SendGrid-style email sending via `/api/send-email` and `app/templates`.

### Routing & UI layout
- **Global layout:**
  - `app/layout.tsx` wraps the app with `ServerLayout`, `ClientLayout`, Google Tag Manager, and a `WelcomeToast` component.
  - Chakra UI theming is configured via `app/theme.ts` and global providers (`ClientLayout`, `QueryClientProvider.tsx`, etc.).

- **Marketing / static pages:**
  - Located under `app/about`, `app/workshops`, `app/classes`, `app/contact`, `app/privacy-policy`, etc.
  - Generally render Chakra-based content with minimal business logic.

- **Booking flow (core user funnel):**
  - Entry point: `app/booking/page.tsx` → renders `ReservationComponent`.
  - `app/booking/ReservationComponent.tsx`: orchestrates calendar availability, class pass product display, and booking options.
  - `app/booking/ProductItem.tsx`: renders purchasable products/class passes with variant selection.
  - `app/booking/checkout` + `app/components/CheckoutPage.tsx` and `PaymentForm.tsx`: handle cart display, promo-code input, billing details, and Stripe payment confirmation.
  - `app/components/BookingCalendar.tsx`: encapsulates the date/time picker and availability UI.

- **Admin area:**
  - Root: `app/admin/*` guarded via NextAuth role checks in API layer.
  - `app/admin/dashboard/page.tsx`: admin order table (sortable) backed by `useOrders`.
  - `app/admin/promo-codes/page.tsx`: CRUD UI for promo codes (activation, limits, usage stats, delete constraints).
  - `app/admin/classes`, `app/admin/newsletter`, `app/admin/users`: various management UIs for classes, newsletters, and users.

- **Shared components:** in `app/components`:
  - Checkout / payment (`CheckoutPage`, `PaymentForm`).
  - Booking and cart UX (`BookingCalendar`, `ShoppingCartPopout`, `BookNow`).
  - Misc: `WelcomeToast`, newsletter editor components, etc.

### Data model (Prisma)
Key models and relationships (see `prisma/schema.prisma` for full details):
- **User & auth:**
  - `User` with `role` (e.g. `admin`, `user`, `guest`) and standard NextAuth tables: `Account`, `Session`, `VerificationToken`, `Authenticator`.
- **Products & variants:**
  - `Product`: base entity for classes, class passes, workshops, etc. Fields include `price`, `type` (`ProductType` enum: `CLASS`, `CLASS_PASS`, `WORKSHOP`, `OTHER`), and optional duration/slots.
  - `ProductVariant`: child rows for variants like 5/10/20 class passes; linked to `Product` and referenced by cart/order items.
- **Cart & orders:**
  - `Cart` and `CartItem`: support both authenticated users (`userId`) and guests (anonymous `id` used with `x-cart-id`).
  - `Order` and `OrderItem`: finalized purchases; `Order` has unique `orderNumber` used in emails and admin views.
- **Promo codes:**
  - `PromoCode` with `type` (`PromoCodeType` enum: `PERCENTAGE`, `FIXED_AMOUNT`, `FREE_CLASS`), `value`, `maxUses`, `usedCount`, `expiresAt`, `isActive`, etc.
  - `OrderPromoCode`: junction table linking orders to the promo codes actually applied and the discount amount.
- **Newsletter & subscribers:**
  - `Newsletter` for rich-content email campaigns (content, style, draft/published state, send date).
  - `Subscriber` for mailing list entries.

Any schema change should go through a Prisma migration and be verified against:
- Relevant API routes (especially under `app/api/cart`, `app/api/payment`, `app/api/products`, `app/api/promo-code`).
- Admin UIs that depend on those models (`app/admin/*`).

### API surface (App Router)
API routes live under `app/api/*/route.ts`. Important ones include:

- **Products & catalog:**
  - `GET /api/products` → `app/api/products/route.ts` – returns products with sorted variants; used by booking and cart flows.

- **Cart:** `app/api/cart/route.ts`
  - `POST /api/cart` – get-or-create carts for logged-in users or guests (via `x-cart-id`), then add/merge items (including `variantId`).
  - `GET /api/cart` – fetches cart items (flattened across carts) with included `product` and `variant` relations for both authenticated and guest flows.
  - `PATCH /api/cart` – decreases quantity or removes items when quantity reaches zero.
  - `DELETE /api/cart` – either remove a single cart item (`cartItemId` param) or clear/delete an entire cart (uses `cartId` + `deleteCart` flag and sets `x-clear-cart` header to tell the client to clear localStorage).

- **Promo codes:**
  - `POST /api/promo-code/validate` → `app/api/promo-code/validate/route.ts` – main validation endpoint (existence, active, expiry, usage limit) and discount calculation via `lib/promoCodeUtils.calculateDiscount`.

- **Payments:**
  - `app/api/payment/*` – intent creation and confirmation.
  - `POST /api/payment/confirm` → `app/api/payment/confirm/route.ts` – centralizes order creation, optional user account creation (password-based or guest), promo code application, email dispatch (`/api/send-email`), cart cleanup, and `x-clear-cart` header behavior.

- **Admin:** `app/api/admin/*`
  - Promo code CRUD (`/api/admin/promo-codes`, `/api/admin/promo-codes/[id]`).
  - Additional resources for classes, users, newsletters, etc. (see the corresponding subdirectories).

- **Other:**
  - Availability (Google Calendar), newsletter sending, user management, file upload, and auth routes are all under the expected `app/api` subtrees (`availability`, `newsletter`, `users`, `upload`, `auth`, `send-email`).

When changing any business-critical flow (cart, payment, promo codes), update both the relevant API handlers and the consuming hooks/components to keep payload shapes in sync.

### Client-side data access & hooks
Custom hooks in `app/hooks` use React Query for data fetching and mutations:
- `useProducts` – fetches products (+variants) from `/api/products`.
- `useCart` – wraps cart CRUD operations and local `x-cart-id` handling.
- `useAddToCart` – adds items to cart and handles guest vs authenticated logic and navigation.
- `useOrders` – powers the admin dashboard order table.
- Other hooks: `useUsers`, `useForgotPassword`, `useResetPassword`, `useCheckAvailability`, `useLocalStorage`, `useResponsive`.

Prefer using these hooks instead of calling `fetch`/`axios` directly from components, so cache behavior and request conventions stay centralized.

### Auth & authorization
- NextAuth config lives in `lib/auth.ts`:
  - Google OAuth provider with calendar-read scope.
  - Credentials provider using bcrypt-hashed passwords from `User.password`.
  - Sessions are JWT-based; `session.user` is extended with `id` and `role` in callbacks.
- Many API routes (especially under `/api/admin`) gate access based on `getServerSession(authOptions)` and `session.user.role === "admin"`.
- Guests are supported explicitly in the checkout flow by creating minimal `User` records with `role: "guest"` when necessary.

When building new admin-only features, follow the established pattern: guard in the API route using NextAuth session/role and keep client-side assumptions in sync.

### Payments & promo codes (behavioral overview)
High-level flow (expanded from `CLAUDE.md`):
1. **Cart assembly** via `/api/cart` (guest or authenticated; may involve `variantId`).
2. **Checkout** shows items and optionally validates a promo code via `/api/promo-code/validate`.
3. **Payment intent** is created server-side (see `app/api/payment/intent`), using the discounted total when a promo code is applied.
4. **Confirmation** via `/api/payment/confirm`:
   - Validates payment status with Stripe unless it’s a special `"free-order"` case.
   - Resolves/creates `User` (existing, new account with password, or guest).
   - Reads cart items (with `product`/`variant`) and computes the total.
   - Creates an `Order` and `OrderItem`s; optionally creates `OrderPromoCode` and increments `PromoCode.usedCount` using `calculateDiscount` from `lib/promoCodeUtils`.
   - Sends confirmation email using `emailTemplates` and `/api/send-email`.
   - Clears cart data (DB + client hint via `x-clear-cart`).

If you modify promo code logic, keep the following aligned:
- `lib/promoCodeUtils` (discount math and code utilities).
- `/api/promo-code/validate` (validation and client-visible result shape).
- `/api/payment/confirm` (order creation + discount persistence and stats).
- Admin promo code screens (`app/admin/promo-codes/page.tsx`).

## Environment & secrets
Environment variables are documented in detail in `CLAUDE.md` under **Environment Variables**. At a minimum, expect to configure:

- **Database:**
  - `DATABASE_PRISMA_URL`
  - `DATABASE_URL_NON_POOLING`
- **NextAuth:**
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Stripe:**
  - `STRIPE_SECRET_KEY_DEV`, `STRIPE_SECRET_KEY_PROD`
  - `NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV`, `STRIPE_PUBLISH_KEY_PROD`
- **Google Calendar availability:**
  - `GOOGLE_CLIENT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`
  - `GOOGLE_CALENDAR_ID`
- **Email (SendGrid or similar):**
  - Check `/api/send-email` and related config to see how API keys are expected.

Always cross-check `CLAUDE.md` and any `process.env.*` usages in `lib/` and `app/api/**` when introducing new configuration.

## Agent-specific notes
- Use `CLAUDE.md` as the authoritative description of domain concepts (promo codes, class passes, booking rules) and keep this file focused on how to operate in the repo.
- Prefer working through existing hooks (`app/hooks`) and API modules (`app/api/**`) rather than adding new ad-hoc endpoints or fetch calls.
- When altering schema or high-impact flows (cart, payment, promo codes, booking), update:
  - Prisma schema + migrations.
  - API handlers.
  - Client hooks and admin UIs.
  - Documentation in `CLAUDE.md` and this `AGENTS.md` where relevant.
