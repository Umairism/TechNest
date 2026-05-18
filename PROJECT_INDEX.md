# TechNest Project Index

Welcome to TechNest - a production-grade e-commerce platform for premium PC components and gaming hardware.

## Quick Links

- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - What was changed and why (START HERE)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - How to deploy to Vercel
- **[next.config.mjs](./next.config.mjs)** - Build and performance configuration

## Project Overview

TechNest is a full-stack e-commerce application built with:
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Context API** - State management
- **Vercel** - Deployment platform

## Key Features

✓ Product catalog with filtering and search
✓ Shopping cart with persistence
✓ Checkout flow
✓ PC builder tool
✓ Order tracking
✓ Contact form
✓ SEO optimized
✓ Performance optimized
✓ Mobile responsive
✓ Dark mode (default)

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit http://localhost:3000

### Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Project Structure

```
app/                   # Pages and routes
├── layout.tsx         # Root layout with metadata
├── page.tsx           # Home page
├── shop/              # Shop pages
├── product/[id]/      # Product detail
├── cart/              # Shopping cart
├── checkout/          # Checkout page
├── pc-builder/        # PC builder
└── sitemap.ts         # SEO sitemap

components/           # Reusable components
├── products/          # Product components
├── cart/              # Cart components
├── forms/             # Form components
├── ui/                # UI utilities
├── sections/          # Page sections
├── layout/            # Layout components
├── product-card.tsx   # Main product component
├── hero.tsx           # Hero section
└── navbar.tsx         # Navigation

lib/                   # Utilities and helpers
├── constants.ts       # Product data
├── cart-context.tsx   # Cart state management
└── hooks/             # Custom hooks

public/               # Static assets
├── robots.txt         # SEO robots file
└── favicon.ico        # Site icon
```

## Component Highlights

### Memoized Components (Performance)
- `ProductCard` - Prevents unnecessary re-renders in lists
- `CartItem` - Optimizes cart operations
- `ProductGrid` - Efficient grid rendering

### Reusable Components (DRY)
- `PriceDisplay` - Consistent price formatting
- `RatingDisplay` - Star rating display
- `FormField` - Form field wrapper
- `SkeletonCard` - Loading state

### Smart Components (Features)
- `CategoryFilter` - With useCallback
- `SortSelector` - With useCallback
- `CartSummary` - Order calculation
- `LoadingSpinner` - Loading indicator

## Performance

Current optimizations:
- ✓ Image optimization (AVIF/WebP)
- ✓ Code splitting ready
- ✓ React.memo on list items
- ✓ useCallback on handlers
- ✓ CSS transforms only (GPU accelerated)
- ✓ Lazy loading enabled
- ✓ Minification enabled
- ✓ Source maps disabled (production)

**Targets**:
- Lighthouse > 90
- CLS < 0.1
- LCP < 2.5s

## SEO

Optimized for search engines:
- ✓ Dynamic sitemap generation
- ✓ robots.txt configuration
- ✓ Meta tags and Open Graph
- ✓ Twitter Card support
- ✓ Structured data ready
- ✓ Canonical URLs

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import on Vercel**
   - Go to vercel.com/import
   - Select repository
   - Click Deploy

3. **Set Environment Variables**
   - NEXT_PUBLIC_SITE_URL
   - NEXT_PUBLIC_API_URL

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Development Workflow

### Adding a New Component

1. Create component in appropriate folder
2. Use React.memo if list item
3. Use useCallback for handlers
4. Add TypeScript types
5. Export component
6. Import and use in pages

Example:
```typescript
"use client";
import React, { useCallback } from "react";

interface Props {
  item: Item;
  onAction: (id: string) => void;
}

function MyComponentComponent({ item, onAction }: Props) {
  const handleClick = useCallback(() => {
    onAction(item.id);
  }, [item.id, onAction]);
  
  return <button onClick={handleClick}>{item.name}</button>;
}

export const MyComponent = React.memo(MyComponentComponent);
```

### Adding a New Page

1. Create folder in `app/`
2. Create `page.tsx` inside
3. Add metadata if needed
4. Import and compose components
5. Test responsiveness

### Performance Checklist

- [ ] Component uses React.memo if in list
- [ ] Event handlers use useCallback
- [ ] Dependencies correct in dependency arrays
- [ ] Images use next/image with lazy loading
- [ ] No console errors/warnings
- [ ] Build passes without errors

## Monitoring

### Key Metrics
- Page load time
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Error rate

### Tools
- Vercel Analytics (built-in)
- Lighthouse (Chrome DevTools)
- WebPageTest
- Core Web Vitals report

## Troubleshooting

### Build fails
- Check TypeScript: `npm run type-check`
- Check linting: `npm run lint`
- Clear cache: `rm -rf .next`

### Performance issues
- Run Lighthouse audit
- Check images are lazy-loaded
- Verify React.memo is used
- Check useCallback dependencies

### Deployment issues
- Check environment variables
- Review deployment logs
- Check .vercelignore
- Try rolling back previous version

## Documentation

- **Architecture** - See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Refactoring** - See [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)
- **Deployment** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Next.js** - https://nextjs.org/docs
- **React** - https://react.dev
- **Tailwind** - https://tailwindcss.com

## Support

### Resources
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Vercel Help: https://vercel.com/help
- Tailwind CSS: https://tailwindcss.com

### Common Issues
- See troubleshooting section above
- Check error messages in console
- Review build logs
- Check deployment logs

## Team

This project was built with production-grade best practices in mind.

**Key Features**:
- Clean, maintainable code
- Comprehensive documentation
- Performance optimized
- SEO ready
- Deployment ready

## License

This project is ready for production use and deployment to Vercel.

---

**Version**: 2.0 (Production-Grade)
**Last Updated**: May 2026
**Status**: Ready for Deployment ✓

**Next Steps**:
1. Review [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)
2. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
3. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy
4. Monitor performance and metrics
