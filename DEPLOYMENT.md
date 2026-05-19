# TechNest Deployment Guide

## Recommended Netlify Deployment

This project uses Next.js route handlers, Auth.js, Prisma, PostgreSQL, checkout APIs, and admin server pages. That means it is not a pure static export. Deploy it to Netlify as a Next.js app so Netlify can provision serverless functions for APIs and server-rendered pages.

Netlify settings:

- Build command: `npm run build:netlify`
- Publish directory: `.next`
- Node version: `22`

The `netlify.toml` file already sets these values.

## Required Environment Variables

Set these in Netlify: Site settings -> Build & deploy -> Environment variables.

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
NEXTAUTH_URL="https://your-site.netlify.app"
AUTH_URL="https://your-site.netlify.app"
NEXTAUTH_SECRET="generate-a-long-random-secret"
AUTH_SECRET="same-as-nextauth-secret"
NEXT_PUBLIC_SITE_URL="https://your-site.netlify.app"
NEXT_PUBLIC_SITE_NAME="TechNest"
JWT_SECRET="generate-a-different-long-random-secret"
JWT_EXPIRATION="7d"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

Optional, only if enabled:

```bash
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
JAZZCASH_MERCHANT_ID=""
JAZZCASH_PASSWORD=""
EASYPAISA_STORE_ID=""
EASYPAISA_MERCHANT_ID=""
EASYPAISA_PASSWORD=""
```

Generate secrets locally:

```bash
openssl rand -hex 32
```

On Windows PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database

Use a hosted PostgreSQL database. Good options:

- Neon
- Supabase
- Railway
- Prisma Postgres
- Netlify Database, if available in your Netlify account

For serverless deployments, prefer pooled PostgreSQL URLs. Serverless functions can open many short-lived connections, so connection pooling matters.

After setting `DATABASE_URL`, run one of these:

```bash
npx prisma db push
npm run prisma:seed
```

For production teams, use migrations instead:

```bash
npx prisma migrate deploy
```

## Deploy Steps

1. Push the repository to GitHub.
2. In Netlify, choose Add new site -> Import existing project.
3. Select the GitHub repository.
4. Confirm build command is `npm run build:netlify`.
5. Confirm publish directory is `.next`.
6. Add environment variables.
7. Deploy.
8. Open `/admin/login` and sign in with the seeded admin user.

## Static Frontend Only Option

A true static Netlify frontend cannot run this app's backend features. Static export does not support dynamic server behavior such as cookies, auth sessions, POST route handlers, Prisma queries, server actions, or admin pages that read the database.

If you want Netlify to host only static files:

1. Move all backend code to a separate service:
   - Railway/Render/Fly.io Node API
   - NestJS/Express API
   - Supabase direct APIs
   - Netlify Functions with a separate `/netlify/functions` backend
2. Replace frontend calls like `/api/products` with `NEXT_PUBLIC_API_URL`.
3. Convert server-rendered admin pages to client pages that call the external API.
4. Remove Auth.js server session dependency from static pages, or use a frontend-compatible auth provider.
5. Only then set `output: "export"` in `next.config.mjs` and publish `out`.

For this repository today, the safest production path is Netlify's Next.js runtime, not static export.
