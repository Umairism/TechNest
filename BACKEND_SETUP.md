# TechNest - Production Grade E-Commerce Platform for Pakistan

A fully functional e-commerce backend infrastructure built for the Pakistani market with support for local payment methods (COD, JazzCash, EasyPaisa) and integrated inventory management.

## 🚀 Technology Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ShadCN UI Components

### Backend
- **Next.js API Routes** (with NestJS alternative)
- **Authentication**: NextAuth.js (Email/Password, Google OAuth, GitHub OAuth)
- **Database**: PostgreSQL (Prisma ORM)
- **Database Hosting**: Neon / Supabase / Railway

### Payment Gateway
- **Primary**: PayFast Pakistan (local support)
- **Methods**: 
  - Cash on Delivery (COD) - Most popular in Pakistan
  - JazzCash Mobile Money
  - EasyPaisa Mobile Money
  - Credit/Debit Cards (via Stripe/2Checkout)

### Additional Services
- **Email**: Resend.io (production-grade email)
- **WhatsApp Notifications**: Twilio WhatsApp API
- **File Storage**: Cloudinary (image CDN & optimization)
- **Analytics**: Google Analytics, Vercel Analytics
- **Error Tracking**: Sentry

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts       # NextAuth handlers
│   │   │   └── signup/route.ts              # User registration
│   │   ├── products/
│   │   │   ├── route.ts                     # List & search products
│   │   │   └── [id]/route.ts                # Get single product
│   │   ├── cart/
│   │   │   └── route.ts                     # Cart management
│   │   ├── orders/
│   │   │   └── route.ts                     # Create & fetch orders
│   │   ├── payments/
│   │   │   ├── cod/confirm/route.ts         # COD confirmation
│   │   │   ├── jazzcash/initiate/route.ts   # JazzCash payment
│   │   │   └── easypaisa/initiate/route.ts  # EasyPaisa payment
│   │   └── admin/
│   │       ├── products/route.ts            # Admin product management
│   │       ├── inventory/route.ts           # Stock management
│   │       ├── orders/route.ts              # Admin order management
│   │       └── payments/stats/route.ts      # Payment analytics
│   ├── layout.tsx
│   ├── page.tsx
│   └── [other pages]
│
├── lib/
│   ├── auth.ts                              # NextAuth configuration
│   ├── db.ts                                # Prisma client setup
│   ├── constants.ts                         # App constants
│   └── services/
│       ├── inventory.service.ts             # Stock management logic
│       └── payment.service.ts               # Payment processing logic
│
├── prisma/
│   ├── schema.prisma                        # Database schema
│   └── migrations/                          # Database migrations
│
├── components/
│   ├── ui/                                  # ShadCN UI components
│   └── [custom components]
│
├── .env.example                             # Environment variables template
├── .env.local                               # Local development variables
└── package.json
```

---

## 🔧 Installation & Setup

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (local or cloud)

### 2. Environment Setup

```bash
# Clone repository
git clone <repo-url>
cd technest

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` with your actual values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/technest"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Payment Gateway (PayFast Pakistan)
PAYFAST_MERCHANT_ID="your-merchant-id"
PAYFAST_MERCHANT_KEY="your-merchant-key"
PAYFAST_PASSPHRASE="your-passphrase"

# Mobile Money (JazzCash, EasyPaisa)
JAZZCASH_MERCHANT_ID="your-jazzcash-id"
EASYPAISA_MERCHANT_ID="your-easypaisa-id"

# Email Service
RESEND_API_KEY="your-resend-key"
```

### 4. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed sample data (optional)
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name",
  "phone": "+923001234567"
}
```

#### Sign In
```bash
POST /api/auth/signin
# Handled by NextAuth - use frontend components
```

### Product Endpoints

#### List Products
```bash
GET /api/products?category=GPUs&sort=featured&page=1&limit=12
```

#### Get Single Product
```bash
GET /api/products/rtx-4090
```

### Cart Endpoints

#### Get Cart
```bash
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```bash
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "rtx-4090",
  "quantity": 1
}
```

### Order Endpoints

#### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "cod",
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+923001234567",
    "address": "123 Street, Karachi",
    "city": "Karachi",
    "zipCode": "75000"
  },
  "cartItems": [
    {"productId": "rtx-4090", "quantity": 1}
  ]
}
```

#### Get User Orders
```bash
GET /api/orders
Authorization: Bearer <token>
```

### Payment Endpoints

#### Cash on Delivery (COD)
```bash
POST /api/payments/cod/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-id"
}
```

#### JazzCash Payment
```bash
POST /api/payments/jazzcash/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-id",
  "phoneNumber": "+923001234567"
}
```

#### EasyPaisa Payment
```bash
POST /api/payments/easypaisa/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-id",
  "phoneNumber": "+923001234567"
}
```

### Admin Endpoints

#### Create Product (Admin Only)
```bash
POST /api/admin/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "RTX 4090",
  "slug": "rtx-4090",
  "description": "Ultimate gaming GPU",
  "categoryId": "gpu-category-id",
  "price": 1599,
  "originalPrice": 1799,
  "sku": "NVIDIA-RTX-4090",
  "stock": 50,
  "featured": true
}
```

#### Update Inventory
```bash
POST /api/admin/inventory
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "productId": "rtx-4090",
  "quantity": 100
}
```

#### Get Orders (Admin)
```bash
GET /api/admin/orders?status=pending&page=1&limit=20
Authorization: Bearer <admin-token>
```

#### Update Order Status
```bash
PATCH /api/admin/orders
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "orderId": "order-id",
  "status": "shipped",
  "trackingId": "TCS-TRACKING-ID"
}
```

#### Payment Statistics
```bash
GET /api/admin/payments/stats?days=30
Authorization: Bearer <admin-token>
```

---

## 💳 Payment Methods - Pakistan Specific

### 1. Cash on Delivery (COD) - DEFAULT
Most popular payment method in Pakistan. Payment collected on delivery.

**Advantages:**
- No online payment risk
- Builds customer trust
- Highest conversion rate

### 2. JazzCash Mobile Money
Pakistani telecom-based mobile payment system.

**Setup:**
1. Register as merchant on JazzCash
2. Get Merchant ID & API credentials
3. Add credentials to `.env`

### 3. EasyPaisa Mobile Money
Pakistani mobile payment service.

**Setup:**
1. Register business account on EasyPaisa
2. Get Store ID & Merchant ID
3. Add credentials to `.env`

### 4. Debit/Credit Cards
Via Stripe or 2Checkout for international cards.

---

## 📊 Database Schema

### Users
```sql
- id (Primary Key)
- email (Unique)
- name
- password_hash
- phone
- role (admin/customer)
- address, city, zipCode
- createdAt, updatedAt
```

### Products
```sql
- id, name, slug (Unique), description
- categoryId (Foreign Key)
- price, originalPrice
- brand, sku (Unique)
- images (JSON Array)
- specifications (JSON)
- stock, featured, active
- createdAt, updatedAt
```

### Orders
```sql
- id, orderNumber (Unique)
- userId (Foreign Key)
- status (pending/confirmed/shipped/delivered/cancelled)
- paymentStatus (unpaid/paid/failed)
- paymentMethod (cod/jazzcash/easypaisa/card)
- subtotal, tax, shippingCost, totalAmount
- shippingAddress (JSON), billingAddress (JSON)
- trackingId, notes
- createdAt, updatedAt
```

### Inventory
```sql
- id, productId (Unique, Foreign Key)
- quantity (total available)
- reserved (reserved for pending orders)
- sold (total sold)
- lastUpdated
```

---

## 🔒 Security Features

✅ **Implemented:**
- Password hashing with bcryptjs
- JWT-based session management
- CSRF protection via NextAuth
- Rate limiting on API routes
- Input validation and sanitization
- Role-based access control (Admin routes)
- HTTPS enforcement in production
- Secure payment verification

✅ **To Implement:**
- Request rate limiting middleware
- Helmet.js for HTTP headers
- SQL injection prevention (via Prisma ORM)
- XSS protection
- CORS configuration

---

## 📈 Performance Optimization

- Database query optimization with Prisma select
- Pagination for large datasets
- Image CDN via Cloudinary
- API response caching (Redis recommended for production)
- Database indexing on frequently queried fields

---

## 🚀 Production Deployment

### Hosting Options

**Frontend & Backend:**
- Vercel (recommended for Next.js)
- Railway
- Render
- AWS EC2

**Database:**
- Neon (PostgreSQL)
- Supabase
- Railway

### Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Payment gateway credentials configured
- [ ] Email service activated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error tracking (Sentry) integrated
- [ ] SSL/HTTPS enforced
- [ ] Admin user created
- [ ] Backup strategy established

### Deploy to Vercel

```bash
# Push to Git
git push origin main

# Vercel auto-deploys on push
# Or manually deploy:
npx vercel --prod
```

---

## 📋 Phase 2 Features (TODO)

- [ ] Advanced inventory with variants (size, color, specs)
- [ ] Coupon & discount system
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Real-time order tracking
- [ ] Customer support chat
- [ ] Email notifications
- [ ] SMS notifications via Twilio
- [ ] Affiliate/referral system
- [ ] Analytics dashboard

---

## 📞 Support & Contact

For Pakistani payment gateway support:
- **PayFast**: support@payfast.co.za
- **JazzCash**: merchant@jazzcash.com.pk
- **EasyPaisa**: business@easypaisa.com.pk

---

## 📄 License

This project is part of TechNest E-Commerce Platform.

---

## ⭐ Key Reminder

> "Customers forgive average UI. They don't forgive fake stock, broken checkout, or slow support. Trust converts better than glow effects."

Focus on:
1. ✅ Reliable inventory
2. ✅ Smooth checkout
3. ✅ Fast support
4. ✅ Accurate pricing
5. ✅ Timely delivery

*Then* optimize the animations.
