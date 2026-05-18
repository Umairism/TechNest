# TechNest - Quick Reference Guide

## 🚀 Getting Started (5 minutes)

### 1. Install & Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your database URL
npx prisma migrate dev
npm run dev
```

### 2. Verify Setup
Visit: http://localhost:3000/api/products

You should see: `{ "success": true, "data": [...], "pagination": {...} }`

---

## 📚 Key API Endpoints

### Products
- `GET /api/products?category=GPUs&sort=featured&page=1` - List products
- `GET /api/products/rtx-4090` - Get single product

### Cart
- `GET /api/cart` - Get cart (requires auth)
- `POST /api/cart` - Add item `{ productId, quantity }`

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user's orders

### Payments
- `POST /api/payments/cod/confirm` - COD payment
- `POST /api/payments/jazzcash/initiate` - JazzCash payment
- `POST /api/payments/easypaisa/initiate` - EasyPaisa payment

### Admin
- `POST /api/admin/products` - Create product (admin only)
- `POST /api/admin/inventory` - Update stock (admin only)
- `GET /api/admin/orders` - View all orders (admin only)

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema |
| `lib/auth.ts` | Authentication setup |
| `lib/db.ts` | Database client |
| `lib/services/inventory.service.ts` | Stock management |
| `lib/services/payment.service.ts` | Payment logic |
| `lib/api-utils.ts` | Helper functions |
| `.env.local` | Environment variables |

---

## 📦 Environment Variables

### Required (Database)
```
DATABASE_URL=postgresql://user:password@localhost:5432/technest
```

### Required (Auth)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string-32-chars
```

### Payment (Optional - set up later)
```
PAYFAST_MERCHANT_ID=...
JAZZCASH_MERCHANT_ID=...
EASYPAISA_MERCHANT_ID=...
```

---

## 🎯 Common Tasks

### Create a Product
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RTX 4090",
    "slug": "rtx-4090",
    "description": "Gaming GPU",
    "categoryId": "gpu-category-id",
    "price": 1599,
    "stock": 50
  }'
```

### Update Stock
```bash
curl -X POST http://localhost:3000/api/admin/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "rtx-4090",
    "quantity": 100
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "cod",
    "shippingAddress": {
      "name": "John",
      "phone": "+923001234567",
      "address": "123 Street",
      "city": "Karachi",
      "zipCode": "75000"
    },
    "cartItems": [
      {"productId": "rtx-4090", "quantity": 1}
    ]
  }'
```

---

## 🔐 Authentication

### Frontend Example (React)
```javascript
import { signIn, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return <p>Welcome {session.user.email}</p>;
  }

  return <button onClick={() => signIn()}>Sign In</button>;
}
```

### Protected API Route
```typescript
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  // Continue with logic
}
```

---

## 📊 Database Migrations

### Create Migration
```bash
npx prisma migrate dev --name add_new_table
```

### View Database (GUI)
```bash
npx prisma studio
```

### Reset Database (⚠️ Dangerous)
```bash
npx prisma migrate reset
```

---

## 🐛 Debugging

### Enable Prisma Logging
```javascript
// In lib/db.ts
log: ["query", "error", "warn"]
```

### Check API Routes
```bash
# Test product list
curl http://localhost:3000/api/products

# With filters
curl http://localhost:3000/api/products?search=laptop&sort=price-low
```

### Check NextAuth
```bash
# Visit auth page
http://localhost:3000/api/auth/signin

# Check session
http://localhost:3000/api/auth/session
```

---

## 🚀 Deployment Checklist

- [ ] Database configured (Neon/Supabase)
- [ ] Environment variables set in production
- [ ] Payment gateway credentials configured
- [ ] Email service activated (Resend)
- [ ] Admin user created
- [ ] Database migrations run
- [ ] Test payments in sandbox mode
- [ ] SSL certificate configured
- [ ] CORS configured
- [ ] Rate limiting enabled

---

## 💡 Common Issues

### Issue: "Unauthorized" on API calls
**Solution:** Make sure you're passing authentication token/cookies

### Issue: "Product not found" 
**Solution:** Check if product slug exists: `npx prisma studio`

### Issue: Stock not updating
**Solution:** Verify inventory record exists for product

### Issue: Payment gateway error
**Solution:** Check credentials in `.env.local`

---

## 📞 Support Resources

- **Next.js**: nextjs.org
- **Prisma**: prisma.io
- **NextAuth**: next-auth.js.org
- **PayFast**: payfast.co.za
- **JazzCash**: jazzcash.com.pk
- **EasyPaisa**: easypaisa.com.pk

---

## 🎓 Learning Path

1. Understand the [database schema](prisma/schema.prisma)
2. Review [API endpoints](BACKEND_SETUP.md)
3. Study [payment integration](lib/services/payment.service.ts)
4. Build [admin dashboard](app/admin)
5. Create [frontend pages](app)
6. Deploy to [Vercel](vercel.com)

---

## 📈 Next Steps

1. **This Week**: Database setup + sample data
2. **Next Week**: Frontend pages + cart integration
3. **Following Week**: Payment gateway testing
4. **Final Week**: Admin dashboard + deployment

---

**Keep it simple. Make it work. Then optimize. 🚀**
