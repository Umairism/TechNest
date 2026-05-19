# Admin Panel & Database Setup Guide

## Overview
The TechNest admin panel and database have been configured and are ready to be activated. This guide walks you through the setup process.

## Prerequisites
- PostgreSQL database running (check DATABASE_URL in .env.local)
- Node.js and npm/pnpm installed
- All dependencies installed (`npm install` or `pnpm install`)

## Setup Steps

### Step 1: Configure Database Connection
Ensure your `.env.local` has the correct DATABASE_URL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/technest_dev"
```

Change the credentials if your PostgreSQL setup is different.

### Step 2: Initialize Database
Run the following command to push the Prisma schema to your database:
```bash
npm run prisma:push
# or with pnpm
pnpm prisma:push
```

This will:
- Create all necessary database tables
- Set up relationships and indexes
- Initialize the database schema

### Step 3: Seed Admin User
Run the seed script to create the admin user with hardcoded credentials:
```bash
npm run prisma:seed
# or with pnpm
pnpm prisma:seed
```

**Admin Credentials:**
- Email: `technest12@technest.com`
- Password: `TechNext123`

This will also create:
- Sample product categories (Laptops, Phones, Monitors, Keyboards, Mice)
- Sample product (MacBook Pro 16)

### Step 4 (Alternative): One-Command Setup
To do both steps in one command:
```bash
npm run db:setup
# or with pnpm
pnpm db:setup
```

## Accessing the Admin Panel

### Admin Login
1. Navigate to `http://localhost:3000/admin/login`
2. Enter the credentials:
   - Email: `technest12@technest.com`
   - Password: `TechNext123`
3. You'll be redirected to the admin dashboard

### Admin Dashboard
Access the admin dashboard at `http://localhost:3000/admin/dashboard`

**Available Admin Features:**
- **Products**: Create, edit, and manage product catalog
- **Users**: View and manage user accounts
- **Orders**: Track and manage customer orders
- **Categories**: Organize products by categories
- **Inventory**: Track stock levels
- **Settings**: Configure system preferences

## Admin Panel Structure

### Routes
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main admin dashboard
- `/admin/products` - Products management
- `/admin/users` - Users management
- `/admin/orders` - Orders management
- `/admin/categories` - Categories management
- `/admin/inventory` - Inventory tracking
- `/admin/settings` - System settings

### API Endpoints
- `POST /api/admin/products` - Create product
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/verify` - Verify admin access
- `GET /api/admin/stats` - Get dashboard statistics

## Troubleshooting

### Database Connection Issues
```
Error: Could not connect to the database
```
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists or create it manually

### Seed Script Fails
```bash
# Clear and reseed
npm run prisma:push --force-reset
npm run prisma:seed
```

### Admin Can't Login
- Verify DATABASE_URL environment variable
- Check that seed script ran successfully
- Ensure NextAuth configuration is correct

### Port Already in Use
If port 3000 is in use:
```bash
npm run dev -- -p 3001
```

## Security Notes

### ⚠️ Important for Production
The hardcoded admin credentials should NOT be used in production. Instead:

1. Create admin users manually through a secure admin creation process
2. Use environment variables for initial credentials
3. Implement password reset functionality
4. Enable 2FA for admin accounts
5. Use strong, unique passwords

### Next Steps for Production
- [ ] Remove hardcoded credentials
- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Set up 2FA
- [ ] Implement role-based access control
- [ ] Add audit logging
- [ ] Enable CSRF protection
- [ ] Implement rate limiting

## Testing the Admin Panel

### Create a Test Product
1. Login to admin dashboard
2. Go to "Products" → "Add Product"
3. Fill in product details
4. Click "Create Product"

### View Dashboard Statistics
The dashboard automatically displays:
- Total Products
- Total Users
- Total Orders
- Total Revenue

## Environment Variables Required
```
DATABASE_URL=postgresql://user:password@localhost:5432/technest_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production-use-openssl-rand-hex-32
JWT_SECRET=dev-jwt-secret-key-change-in-production
```

## Support
For issues or questions, check:
- `.env.local` configuration
- Database connection status
- Prisma schema validation
- NextAuth session configuration

---

**Created**: May 19, 2026
**Last Updated**: May 19, 2026
