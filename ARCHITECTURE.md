# TechNest - Production-Grade Architecture

## Overview

This document outlines the refactored production-grade architecture of TechNest, a premium e-commerce platform for PC components and gaming hardware.

## Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page
│   ├── sitemap.ts               # Dynamic sitemap generation
│   ├── (shop)/
│   │   ├── shop/page.tsx        # Product listing with filters
│   │   └── product/[id]/page.tsx # Product details
│   ├── (checkout)/
│   │   ├── cart/page.tsx        # Shopping cart
│   │   └── checkout/page.tsx    # Checkout form
│   ├── (info)/
│   │   ├── about/page.tsx       # About page
│   │   ├── contact/page.tsx     # Contact form
│   │   └── order-tracking/page.tsx # Order tracking
│   └── pc-builder/page.tsx      # Custom PC builder
├── components/                   # Reusable components
│   ├── layout/
│   │   ├── navbar.tsx           # Navigation bar
│   │   └── footer.tsx           # Footer
│   ├── sections/
│   │   ├── hero.tsx             # Hero banner
│   │   └── featured-products.tsx
│   ├── products/
│   │   ├── product-card.tsx     # Memoized product card
│   │   ├── product-grid.tsx     # Product grid wrapper
│   │   ├── product-grid-skeleton.tsx # Loading skeleton
│   │   ├── price-display.tsx    # Reusable price display
│   │   ├── rating-display.tsx   # Star rating component
│   │   ├── product-badge.tsx    # Product badges
│   │   ├── product-image.tsx    # Image component
│   │   ├── category-filter.tsx  # Category filter with useCallback
│   │   └── sort-selector.tsx    # Sort dropdown with useCallback
│   ├── cart/
│   │   ├── cart-item.tsx        # Memoized cart item
│   │   ├── cart-summary.tsx     # Order summary
│   │   └── cart-drawer.tsx      # Mobile cart drawer
│   ├── forms/
│   │   ├── form-field.tsx       # Reusable form field wrapper
│   │   ├── text-input.tsx       # Text input component
│   │   ├── select-field.tsx     # Select component
│   │   └── checkout-form.tsx    # Checkout form
│   ├── ui/
│   │   ├── skeleton-card.tsx    # Loading skeleton
│   │   ├── skeleton-text.tsx    # Text skeleton
│   │   └── loading-spinner.tsx  # Loading spinner
│   ├── hero.tsx                 # Home page hero
│   ├── navbar.tsx               # Navigation
│   └── product-card.tsx         # Product card
├── lib/
│   ├── constants.ts             # Product data and constants
│   ├── cart-context.tsx         # Cart state management
│   └── hooks/                   # Custom hooks (if any)
├── public/
│   ├── robots.txt               # SEO robots file
│   ├── og-image.jpg             # OG image for social sharing
│   └── favicon.ico              # Favicon
├── next.config.mjs              # Next.js configuration with optimization
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── vercel.json                  # Vercel deployment config
├── .vercelignore                # Files to exclude from Vercel
├── .env.example                 # Environment variable template
├── DEPLOYMENT.md                # Deployment guide
└── ARCHITECTURE.md              # This file

```

## Core Principles

### 1. Component Architecture (DRY)
- **Reusable Components**: Any UI used in 2+ places becomes a shared component
- **Composition**: Complex UIs built from simple, single-responsibility components
- **Memoization**: List rendering components use React.memo to prevent re-renders

**Key Components**:
- `ProductCard` - Memoized, reusable product display
- `CartItem` - Memoized cart item with useCallback handlers
- `FormField` - Wraps all form inputs consistently
- `PriceDisplay` - Handles currency formatting
- `RatingDisplay` - Standardizes star ratings

### 2. Performance Optimization
- **React.memo**: ProductCard, CartItem, ProductGrid
- **useCallback**: All event handlers in list items
- **Image Optimization**: Next.js Image with lazy loading
- **Code Splitting**: Dynamic imports for heavy components
- **CSS Transforms**: Animations use transform/opacity only
- **Memoization**: useMemo for expensive calculations

**Next.js Configuration**:
```javascript
{
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60
  },
  reactStrictMode: true,
  swcMinify: true,
  compress: true
}
```

### 3. State Management
- **React Context API**: Cart state management via CartProvider
- **localStorage**: Cart persistence across sessions
- **Local State**: Component-level state with useState/useCallback

**Cart Context**:
```typescript
- items: CartItem[]
- addItem(product, quantity)
- removeItem(productId)
- updateQuantity(productId, quantity)
- clearCart()
- subtotal, tax, total (computed)
```

### 4. Loading States
- **SkeletonCard**: Product card placeholder
- **SkeletonText**: Text lines placeholder
- **LoadingSpinner**: Centered loading indicator
- **ProductGridSkeleton**: Grid of skeletons

These provide visual feedback during data loading.

### 5. SEO & Metadata
- **Root Metadata**: Title template, OG/Twitter cards, keywords
- **Dynamic Metadata**: generateMetadata for product pages
- **Structured Data**: JSON-LD schemas for rich snippets
- **Sitemap**: Dynamic sitemap.ts generation
- **robots.txt**: Search engine crawl directives

**Metadata Features**:
- Open Graph for social sharing
- Twitter Card support
- Canonical URLs
- Viewport optimization

## Data Flow

```
Layout (provides CartProvider)
  ↓
Pages (route-specific pages)
  ↓
Sections & Components
  ↓
Product Cards (memoized, useCallback handlers)
  ↓
Cart Context (global state)
```

## Performance Targets

- **Lighthouse Score**: >90 on all pages
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- **Page Load**: <2 seconds
- **Animations**: 60fps (GPU-accelerated)

## Deployment

### Vercel Configuration
- Automated deployments from Git
- Environment variables for production URLs
- Automatic HTTPS and CDN
- Analytics integration
- Logs and monitoring

### Build Process
```bash
npm run build    # Production build
npm run dev      # Local development
npm run lint     # Code quality
npm run type-check # TypeScript check
```

## Optimization Checklist

### Code Quality
- ✓ React.memo on list items
- ✓ useCallback on event handlers
- ✓ Proper dependency arrays
- ✓ No unnecessary re-renders
- ✓ TypeScript strict mode

### Performance
- ✓ Image optimization (AVIF/WebP)
- ✓ Lazy loading for below-fold content
- ✓ Dynamic imports for heavy components
- ✓ CSS transforms (no layout thrashing)
- ✓ Code splitting enabled

### User Experience
- ✓ Loading skeletons
- ✓ Smooth animations
- ✓ Mobile responsive
- ✓ Accessible (semantic HTML, ARIA)
- ✓ Fast checkout flow

### SEO
- ✓ Proper metadata on all pages
- ✓ Structured data (JSON-LD)
- ✓ Sitemap generation
- ✓ robots.txt
- ✓ Open Graph tags

## Key Files to Understand

1. **app/layout.tsx**
   - Root metadata configuration
   - CartProvider wrapper
   - Analytics setup

2. **lib/cart-context.tsx**
   - State management
   - localStorage persistence
   - Cart calculations

3. **components/product-card.tsx**
   - Memoized component
   - useCallback for handlers
   - Uses sub-components for display

4. **app/shop/page.tsx**
   - Product filtering with useMemo
   - useCallback for filter handlers
   - Dynamic ProductGrid

5. **next.config.mjs**
   - Image optimization
   - SWC minification
   - Caching configuration

## Common Patterns

### Memoized Component with useCallback
```typescript
function MyListItemComponent({ item, onAction }) {
  const handleClick = useCallback(() => {
    onAction(item.id);
  }, [item.id, onAction]);

  return <button onClick={handleClick}>{item.name}</button>;
}

export const MyListItem = React.memo(MyListItemComponent);
```

### Image Optimization
```typescript
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={500}
  loading="lazy"
  quality={75}
/>
```

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(true);

return isLoading ? <SkeletonCard /> : <ProductCard />;
```

## Future Enhancements

1. **Database Integration**: Replace mock data with real database
2. **User Authentication**: Login/register system
3. **Payment Processing**: Stripe integration
4. **Email Notifications**: Order confirmations
5. **Analytics**: Enhanced tracking and reporting
6. **A/B Testing**: Vercel Analytics experiments
7. **Caching Strategy**: Redis for session/cart data
8. **Search Optimization**: Full-text search or Algolia

## Monitoring & Maintenance

### Regular Tasks
- Weekly: Review error logs
- Monthly: Run Lighthouse audits
- Quarterly: Update dependencies
- Yearly: Security audit

### Key Metrics
- Page load time
- Error rate
- User engagement
- Conversion rate
- Core Web Vitals

## Support & Documentation

- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com

---

**Last Updated**: May 2026
**Version**: 2.0 (Production-Grade Refactor)
