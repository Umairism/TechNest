# Prisma v7 Configuration Fix

## Issue
Prisma v7 changed how it handles database configuration. The datasource URL can no longer be directly in the schema file.

## Solution Applied

The following changes have been made to make your project compatible with Prisma v7:

### 1. Created `prisma/prisma.config.ts`
- Defines the datasource with DATABASE_URL from environment
- Configured for PostgreSQL database

### 2. Updated `prisma/schema.prisma`
- Removed `url = env("DATABASE_URL")` from datasource
- Kept provider as "postgresql"

### 3. Updated `lib/db.ts`
- Added datasource configuration to PrismaClient initialization
- Ensures DATABASE_URL is properly passed to Prisma

### 4. Updated `package.json`
- Updated `prisma:seed` script to use `ts-node`
- Added `ts-node` to devDependencies

## Quick Fix - Run These Commands

### Step 1: Install ts-node
```bash
npm install
```

### Step 2: Initialize the database
```bash
npm run prisma:push
```

### Step 3: Seed the database with admin user
```bash
npm run prisma:seed
```

### Or do both in one command:
```bash
npm run db:setup
```

## If You Still Get Errors

### Error: "Cannot find module 'ts-node'"
```bash
npm install --save-dev ts-node
```

### Error: "DATABASE_URL not set"
Make sure `.env.local` contains:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/technest_dev"
```

### Error: "Connection refused"
Ensure PostgreSQL is running:
```bash
# Windows
net start PostgreSQL

# or check if PostgreSQL service is running in Services
```

### Error: Database doesn't exist
Create it manually:
```bash
createdb technest_dev
```

Or with psql:
```sql
CREATE DATABASE technest_dev;
```

## Verify Setup

After running the commands, verify:

1. **Check database tables were created:**
   ```bash
   psql -U postgres -d technest_dev -c "\dt"
   ```

2. **Check admin user exists:**
   ```bash
   psql -U postgres -d technest_dev -c "SELECT email, role FROM users;"
   ```

3. **Login to admin panel:**
   - Go to `http://localhost:3000/admin/login`
   - Email: `technest12@technest.com`
   - Password: `TechNext123`

## File Changes Summary

```
✓ Created: prisma/prisma.config.ts
✓ Updated: prisma/schema.prisma
✓ Updated: lib/db.ts
✓ Updated: package.json
```

## Next Steps

Once setup is complete, you can:
1. Start the development server: `npm run dev`
2. Access the site at `http://localhost:3000`
3. Login to admin at `http://localhost:3000/admin/login`

For more details, see [ADMIN_SETUP.md](../ADMIN_SETUP.md)
