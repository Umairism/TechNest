# TechNest E-Commerce Platform - Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] `npm run build` passes without errors
- [ ] No console warnings or errors in browser
- [ ] All TypeScript errors resolved
- [ ] Code follows project conventions

### Performance
- [ ] Lighthouse score >90 on home page
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] All images are optimized
- [ ] All components use React.memo where needed

### Functionality
- [ ] Cart add/remove/update works
- [ ] Cart persists after page reload
- [ ] Checkout form validation works
- [ ] Product filtering and sorting works
- [ ] Product search works
- [ ] Mobile layout responsive on all pages
- [ ] Navigation links work
- [ ] No broken images or 404s

### SEO
- [ ] All pages have proper metadata
- [ ] robots.txt exists
- [ ] sitemap.xml generates correctly
- [ ] Product pages have structured data
- [ ] Open Graph meta tags present

### Browser Compatibility
- [ ] Tested on Chrome/Edge
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production: refactored to production-grade architecture"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/import
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_SITE_URL`
   - Add `NEXT_PUBLIC_API_URL`
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Authenticate**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SITE_URL
   vercel env add NEXT_PUBLIC_API_URL
   ```

## Post-Deployment Verification

### Test Deployed Site
1. Visit your Vercel deployment URL
2. Test all key functionality:
   - Add product to cart
   - Remove from cart
   - Update quantity
   - Go to checkout
   - Test filters and search
   - Check mobile responsiveness

### Monitor Performance
1. **Vercel Analytics**
   - Check Web Vitals dashboard
   - Monitor real user metrics

2. **Third-Party Tools**
   - Run Lighthouse audit
   - Test with WebPageTest
   - Check Core Web Vitals

### Monitor Errors
1. **Vercel Error Tracking**
   - Monitor error rate
   - Check for console errors
   - Review deployment logs

## Environment Variables

Create `.env.local` for local development:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

For production, set in Vercel dashboard:
```
NEXT_PUBLIC_SITE_URL=https://technest.vercel.app
NEXT_PUBLIC_API_URL=https://technest.vercel.app/api
```

## Build Optimization

The project is configured for production with:
- SWC minification enabled
- Image optimization with AVIF/WebP
- React Strict Mode for development debugging
- Source maps disabled in production
- Automatic static optimization

## Rollback Plan

If deployment issues occur:

1. **Via Vercel Dashboard**
   - Go to Deployments
   - Select previous stable deployment
   - Click "Promote to Production"

2. **Via Git**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

## Production Tips

1. **Monitor Lighthouse Regularly**
   - Run monthly performance audits
   - Target: LCP < 2.5s, CLS < 0.1

2. **Monitor Core Web Vitals**
   - Use Vercel Analytics
   - Set up alerts for regressions

3. **Update Dependencies**
   - Review monthly
   - Update patch versions immediately
   - Test major updates before deploying

4. **Backup Strategy**
   - All code in Git (version controlled)
   - Vercel keeps deployment history
   - Can rollback anytime

## Support

For Vercel deployment issues:
- Check https://vercel.com/help
- Review https://nextjs.org/docs
- Contact Vercel support
