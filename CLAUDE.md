# Sarah K Yoga - Codebase Documentation

## Project Overview
A Next.js web application for Sarah K Yoga, featuring online class bookings, payment processing via Stripe, promo code management, and class pass purchases.

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript
- Prisma ORM with PostgreSQL
- Chakra UI for styling
- NextAuth.js for authentication
- Stripe for payment processing
- React Query for data fetching

---

## 🆕 Latest Features (2025)

### 1. Promo Code System
A complete promotional code management system allowing the business owner to create, manage, and track discount codes.

**Features:**
- **Three discount types:**
  - Percentage discounts (e.g., 20% off)
  - Fixed amount discounts (e.g., $10 off)
  - Free class codes (100% discount)
- **Usage controls:**
  - Maximum usage limits
  - Expiration dates
  - Active/inactive status
- **Auto-generation:** Random 10-character alphanumeric codes
- **Custom codes:** Business owner can create custom promotional codes
- **Usage tracking:** See how many times each code has been used

**Key Files:**
- `prisma/schema.prisma`: PromoCode, OrderPromoCode models
- `app/admin/promo-codes/page.tsx`: Admin management UI
- `app/api/admin/promo-codes/route.ts`: CRUD operations
- `app/api/admin/promo-codes/[id]/route.ts`: Update/delete specific codes
- `app/api/promo-code/validate/route.ts`: Validate codes at checkout
- `lib/promoCodeUtils.ts`: Code generation and discount calculations

**How to Use (Admin):**
1. Navigate to `/admin/promo-codes`
2. Click "Create Promo Code"
3. Choose:
   - Auto-generate or custom code
   - Discount type and value
   - Optional: max uses, expiration date, description
4. Save and the code is immediately active
5. Deactivate or delete codes as needed

**How to Use (Customer):**
1. Add items to cart
2. At checkout, enter promo code in the "Have a Promo Code?" section
3. Click "Apply" to see discount
4. Discount is automatically applied to payment

---

### 2. Class Pass Products with Variants
Purchase bundles of classes at discounted rates. The more classes you buy, the more you save!

**Available Packages:**
- **5 Class Pass:** $75 ($15 per class)
- **10 Class Pass:** $140 ($14 per class - save $10)
- **20 Class Pass:** $260 ($13 per class - save $40)

**Features:**
- Variant selection via radio buttons
- Price updates dynamically based on selected variant
- Full integration with cart, checkout, and order system
- Never expires

**Key Files:**
- `prisma/schema.prisma`: ProductVariant model
- `prisma/seed-class-pass.ts`: Seeds the class pass product
- `app/booking/ProductItem.tsx`: Displays variant selection UI
- `app/booking/ReservationComponent.tsx`: Shows class passes on booking page
- `app/api/cart/route.ts`: Handles variant in cart operations
- `app/api/payment/confirm/route.ts`: Records variant with orders

**How It Works:**
1. Visit `/booking` - Class passes appear at the top
2. Select desired package (5, 10, or 20 classes)
3. Click "Book Now" to add to cart
4. Complete checkout as usual
5. Variant information is saved with the order

**To Add More Product Variants:**
```typescript
// Create product with type CLASS_PASS or other type
await prisma.product.create({
  data: {
    name: "Your Product",
    type: "CLASS_PASS", // or custom type
    variants: {
      create: [
        { name: "Variant 1", price: 50, quantity: 5 },
        { name: "Variant 2", price: 90, quantity: 10 },
      ]
    }
  }
});
```

---

## Architecture

### Database Schema (Key Models)

**User Management:**
- `User`: User accounts with role-based access (admin/user/guest)
- `Account`, `Session`: NextAuth.js authentication
- `Subscriber`: Newsletter subscribers

**E-commerce:**
- `Product`: Base product (classes, passes, workshops)
- `ProductVariant`: Different options for a product (5/10/20 class bundles)
- `Cart`, `CartItem`: Shopping cart for guests and authenticated users
- `Order`, `OrderItem`: Completed purchases

**Promotions:**
- `PromoCode`: Discount codes with usage tracking
- `OrderPromoCode`: Links orders to promo codes used

**Content:**
- `Newsletter`: Email newsletters with draft/published states

### API Routes

**Public Routes:**
- `GET /api/products`: Fetch all products (includes variants)
- `POST /api/promo-code/validate`: Validate promo code
- `POST /api/payment/intent`: Create Stripe payment intent
- `POST /api/payment/confirm`: Confirm payment and create order

**Cart Management:**
- `POST /api/cart`: Add item to cart (supports variantId)
- `GET /api/cart`: Fetch cart items
- `PATCH /api/cart`: Update cart item quantity
- `DELETE /api/cart`: Remove item or clear cart

**Admin Routes (Auth Required):**
- `GET /api/admin/promo-codes`: List all promo codes
- `POST /api/admin/promo-codes`: Create new promo code
- `PATCH /api/admin/promo-codes/[id]`: Update promo code
- `DELETE /api/admin/promo-codes/[id]`: Delete unused promo code

### Authentication & Authorization
- NextAuth.js handles authentication
- Role-based access control (admin vs user)
- Admin routes check `session.user.role === "admin"`
- Guest checkout supported for convenience

---

## Key Components

### Shopping & Checkout
- **ProductItem** (`app/booking/ProductItem.tsx`):
  - Displays product with variant selection
  - Shows price dynamically based on selected variant
  - "Book Now" button with variant support

- **CheckoutPage** (`app/components/CheckoutPage.tsx`):
  - Order summary with variant names
  - Promo code input and validation
  - Billing details form
  - Stripe payment integration

- **PaymentForm** (`app/components/PaymentForm.tsx`):
  - Stripe CardElement integration
  - Passes promo code to payment confirmation
  - Handles payment success/failure

### Admin Dashboard
- **PromoCodesPage** (`app/admin/promo-codes/page.tsx`):
  - Full CRUD for promo codes
  - Usage statistics
  - Activate/deactivate codes
  - Cannot delete codes that have been used

- **DashboardPage** (`app/admin/dashboard/page.tsx`):
  - View orders
  - Sort by various fields
  - Order details

### Booking System
- **ReservationComponent** (`app/booking/ReservationComponent.tsx`):
  - Calendar for date selection
  - Time slot picker
  - Availability checking via Google Calendar API
  - **NEW:** Class pass products section at top
  - Private session booking below

---

## Custom Hooks

### Data Fetching
- **useProducts** (`app/hooks/useProducts.ts`): Fetches all products with variants
- **useCart** (`app/hooks/useCart.ts`): Manages cart state with React Query
- **useOrders** (`app/hooks/useOrders.ts`): Fetches orders for admin dashboard

### Cart Operations
- **useAddToCart** (`app/hooks/useAddToCart.ts`):
  - Adds products to cart (now supports variantId)
  - Handles guest vs authenticated users
  - Auto-redirects to checkout

### Availability
- **useCheckAvailability**: Checks Google Calendar for booking conflicts

---

## Utilities

### Promo Code Utilities (`lib/promoCodeUtils.ts`)
```typescript
// Generate random 10-character alphanumeric code
generatePromoCode(length?: number): string

// Validate code format
validatePromoCodeFormat(code: string, length?: number): boolean

// Calculate discount amount
calculateDiscount(type, value, total): number
```

---

## Environment Variables

Required in `.env` or `.env.local`:

```bash
# Database
DATABASE_PRISMA_URL=postgresql://...
DATABASE_URL_NON_POOLING=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Stripe
STRIPE_SECRET_KEY_DEV=sk_test_...
STRIPE_SECRET_KEY_PROD=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV=pk_test_...
STRIPE_PUBLISH_KEY_PROD=pk_live_...

# Google Calendar (for availability checking)
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_CALENDAR_ID=...
```

---

## Development Workflow

### Running the App
```bash
# Install dependencies
pnpm install

# Run database migrations
npx prisma migrate dev

# Seed class pass products (run once)
npx tsx prisma/seed-class-pass.ts

# Start development server
pnpm dev
```

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Generate Prisma Client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### Adding New Products

**Option 1: Directly in Database**
Use Prisma Studio or SQL to add products

**Option 2: Seed Script**
Create a seed file like `prisma/seed-class-pass.ts`:
```typescript
const product = await prisma.product.create({
  data: {
    name: "Product Name",
    description: "Description here",
    price: 100,
    type: "CLASS_PASS", // or CLASS, WORKSHOP, OTHER
    variants: {
      create: [
        { name: "Option 1", price: 50, quantity: 1 },
        { name: "Option 2", price: 90, quantity: 2 },
      ]
    }
  }
});
```

---

## Payment Flow

### Complete Purchase Flow

1. **Add to Cart**
   - Customer selects product (optionally with variant)
   - `POST /api/cart` with `{ productId, variantId? }`
   - Cart stored in database, ID in localStorage for guests

2. **Checkout**
   - Navigate to `/booking/checkout`
   - Cart items fetched with product and variant details
   - Enter billing details
   - Optional: Apply promo code
   - `POST /api/promo-code/validate` checks validity
   - `POST /api/payment/intent` creates Stripe PaymentIntent with final amount

3. **Payment**
   - Enter card details via Stripe CardElement
   - `stripe.confirmCardPayment()` processes payment
   - On success: `POST /api/payment/confirm`

4. **Order Creation**
   - Payment confirmed in Stripe
   - Order created with:
     - Order items (with variantId if applicable)
     - Promo code linkage (if used)
     - User/guest information
   - Promo code usage count incremented
   - Cart cleared
   - Confirmation email sent
   - Redirect to `/booking/success`

---

## Promo Code Implementation Details

### Validation Logic (`/api/promo-code/validate`)
1. Check if code exists
2. Verify `isActive === true`
3. Check expiration date (if set)
4. Check `usedCount < maxUses` (if maxUses set)
5. Calculate discount based on type:
   - `PERCENTAGE`: total * (value / 100)
   - `FIXED_AMOUNT`: min(value, total)
   - `FREE_CLASS`: total (100% off)
6. Return discount and new total

### Recording Usage (`/api/payment/confirm`)
1. Order created with promo code reference
2. `OrderPromoCode` junction record created
3. `PromoCode.usedCount` incremented by 1
4. Discount amount saved for reporting

### Admin Controls
- **Deactivate** instead of delete for codes with usage history
- **Edit** limits, expiration, or value
- **View** usage statistics in table

---

## Product Variants Implementation

### Database Structure
```prisma
Product (parent)
  └─ ProductVariant[] (children)
       ├─ name: "5 Class Pass"
       ├─ price: 75
       └─ quantity: 5
```

### UI Flow
1. **Product Display**: Shows all variants as radio buttons
2. **Price Update**: Price tag updates when variant selected
3. **Add to Cart**: `variantId` passed to cart API
4. **Cart Display**: Shows "Product Name - Variant Name"
5. **Checkout**: Uses variant price for total calculation
6. **Order**: `OrderItem` includes `variantId` reference

### Cart Storage
- CartItem includes `variantId` field
- Same product + different variant = separate cart items
- Same product + same variant = quantity increment

---

## Testing Checklist

### Promo Codes
- [ ] Create percentage discount code
- [ ] Create fixed amount discount code
- [ ] Create free class code
- [ ] Set max uses and verify limit enforced
- [ ] Set expiration date and verify rejection after expiry
- [ ] Deactivate code and verify rejection
- [ ] Apply code at checkout and verify discount
- [ ] Complete purchase and verify usage count incremented
- [ ] Verify used codes cannot be deleted

### Class Passes
- [ ] View class passes on `/booking` page
- [ ] Select different variants (5, 10, 20)
- [ ] Verify price updates correctly
- [ ] Add to cart with variant
- [ ] View cart shows variant name
- [ ] Complete checkout with variant
- [ ] Verify order includes variant information
- [ ] Apply promo code to class pass purchase

---

## Common Tasks

### Create a New Promo Code (Admin)
1. Go to `/admin/promo-codes`
2. Click "Create Promo Code"
3. Either:
   - Check "Auto-generate code" for random code
   - Or enter custom code (10 chars recommended)
4. Select type and enter value
5. Optionally set max uses, expiration, description
6. Click "Create"

### Deactivate a Promo Code
1. Go to `/admin/promo-codes`
2. Find the code in the table
3. Click "Deactivate" button
4. Code can be reactivated later if needed

### Add a New Product Type
1. Update `ProductType` enum in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_product_type`
3. Create product with new type
4. Filter by type in `ReservationComponent.tsx` if needed

---

## Security Considerations

### Admin Routes
- All `/api/admin/*` routes check session and role
- Return 401 if not authenticated or not admin
- Use `getServerSession(authOptions)` consistently

### Payment Security
- Never store credit card details (handled by Stripe)
- Payment intents created server-side only
- Client secret passed to client for confirmation
- Payment confirmation happens server-side

### Promo Code Security
- Codes are case-insensitive (converted to uppercase)
- Validation happens server-side
- Cannot be reused beyond max usage limit
- Cannot be used after expiration

### Guest Checkout
- Cart ID stored in localStorage
- Cart items stored in database, not client
- Guest user created with minimal info (email only)
- Proper cleanup after checkout

---

## Deployment Notes

### Database Migrations
- Always run migrations before deploying: `npx prisma migrate deploy`
- Prisma Client is regenerated during build

### Environment Variables
- Set all required env vars in production
- Use production Stripe keys for live site
- Ensure DATABASE_URL points to production database

### Initial Setup
- Run `npx tsx prisma/seed-class-pass.ts` to create class passes
- Create admin user with role="admin"
- Test promo code creation before going live

---

## Future Enhancements

Potential features to add:
- [ ] Promo code auto-apply by URL parameter (`?code=WELCOME10`)
- [ ] User-specific promo codes (one-time codes per email)
- [ ] Promo code analytics dashboard
- [ ] Class pass usage tracking (redemption system)
- [ ] Gift cards/vouchers
- [ ] Recurring subscription products
- [ ] Referral system with automatic code generation
- [ ] Bulk promo code creation
- [ ] Scheduled promo code activation/deactivation

---

## Troubleshooting

### Promo Code Not Applying
1. Check if code is active in admin dashboard
2. Verify expiration date hasn't passed
3. Check if max uses reached
4. Ensure code is entered exactly (spaces, capitalization)

### Variant Not Showing Price
1. Verify variant has a price set in database
2. Check that product type filter is correct
3. Ensure `GET /api/products` includes variants

### Cart Not Persisting for Guests
1. Check localStorage for `cartId`
2. Verify cart exists in database with that ID
3. Check that `x-cart-id` header is being sent

### Payment Fails
1. Verify Stripe keys are set correctly
2. Check Stripe dashboard for error details
3. Ensure payment intent amount matches cart total
4. Verify webhooks are configured (if using webhooks)

---

## Contact & Support

For questions about this codebase:
- Review this documentation first
- Check Prisma schema for data structure
- Review API route files for business logic
- Test in development before production changes

**Key Principle:** Always test promo codes and variants thoroughly before launching new promotions!
