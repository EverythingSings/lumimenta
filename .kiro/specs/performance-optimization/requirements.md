# Performance Optimization Requirements

## Problem Statement
Current Lighthouse scores show acceptable performance (72/100) but critical LCP issue (15.9s) due to large hero image (1.27 MB). Need to optimize image loading while maintaining excellent UX.

## Current Metrics
- **Performance Score**: 72/100 (acceptable)
- **Accessibility**: 100/100 (perfect)
- **SEO**: 100/100 (perfect)
- **Best Practices**: 100/100 (perfect)
- **First Contentful Paint**: 1.1s (good)
- **Largest Contentful Paint**: 15.9s (CRITICAL - needs to be < 2.5s)
- **Total Blocking Time**: 0ms (perfect)
- **Cumulative Layout Shift**: 0.114 (acceptable, but can improve)

## Root Causes

### Critical Issues
1. **Hero image size**: 1.27 MB JPEG (8e587a9a699dd2035b5b63727396587a7ff9979eb029f8bf57caeb4d6aa60f83.jpg)
2. **Back image size**: 936 KB JPEG (91304d4d005b21135e6361f489320828fbe974ea8517c94b9dd0402f46df0252.jpg)
3. **No image optimization**: Using raw JPEGs without compression or modern formats
4. **No responsive images**: Same large image served to all devices
5. **Missing dimensions**: No width/height attributes causing CLS

### Secondary Issues
1. **Continuous gradient animations**: Running 8s infinite loops on main thread
2. **Excessive backdrop-filters**: GPU-intensive on multiple elements
3. **Scroll animations on all sections**: Intersection Observer overhead
4. **Sticky nav CLS**: 60px height not reserved in layout

## Target Metrics
- **Performance Score**: 85+ (from 72)
- **LCP**: < 2.5s (from 15.9s) - **PRIMARY GOAL**
- **CLS**: < 0.1 (from 0.114)
- **Maintain**: 100/100 on Accessibility, SEO, Best Practices

## Optimization Strategy

### Phase 1: Critical Image Optimization (Immediate Impact)
**Goal**: Reduce LCP from 15.9s to < 2.5s

1. **Convert hero images to WebP**
   - Target: < 200 KB for hero front
   - Target: < 150 KB for hero back
   - Maintain visual quality at 85% compression
   - Keep JPEG fallbacks for older browsers

2. **Add responsive images**
   - Create 3 sizes: mobile (480w), tablet (768w), desktop (1200w)
   - Use `<picture>` element with srcset
   - Serve appropriate size based on viewport

3. **Add explicit dimensions**
   - Calculate and add width/height attributes
   - Prevent layout shift during image load
   - Reserve space in layout

4. **Optimize loading strategy**
   - Keep `loading="eager"` on hero images
   - Add `fetchpriority="high"` to hero front image
   - Preload hero WebP in `<head>`

### Phase 2: CSS Performance Optimization (Secondary Impact)
**Goal**: Reduce main thread work and improve CLS

1. **Remove continuous animations**
   - Remove `animation: gradientShift 8s ease infinite` from h1
   - Remove gradient animation from .philosophy
   - Keep static gradients for visual appeal

2. **Simplify scroll animations**
   - Remove fade-in/translate on all sections
   - Keep only hero section animation if desired
   - Reduce Intersection Observer overhead

3. **Optimize backdrop-filters**
   - Limit to sticky nav only
   - Remove from cards and containers
   - Use solid backgrounds with transparency instead

4. **Fix sticky nav CLS**
   - Add explicit height to .sticky-nav
   - Ensure body padding-top matches nav height
   - Prevent layout shift on scroll

5. **Optimize hover effects**
   - Remove `will-change` from hover states
   - Simplify transforms (avoid scale + translate combos)
   - Keep essential feedback only

### Phase 3: Additional Optimizations (Polish)
**Goal**: Further improve performance and user experience

1. **Lazy load non-hero images**
   - Add `loading="lazy"` to gallery images
   - Add `loading="lazy"` to availability grid images
   - Keep hero images eager

2. **Optimize remaining images**
   - Convert all gallery images to WebP
   - Target < 300 KB per image
   - Create responsive versions

3. **Add resource hints**
   - Preconnect to any external resources
   - DNS-prefetch for external domains
   - Preload critical CSS

4. **Optimize JavaScript**
   - Defer non-critical scripts
   - Minimize DOM manipulation
   - Optimize Intersection Observer usage

## Implementation Priority

### Must Have (Phase 1)
- [ ] Convert hero images to WebP (< 200 KB)
- [ ] Add responsive image srcsets
- [ ] Add width/height attributes
- [ ] Preload hero WebP
- [ ] Add fetchpriority="high"

### Should Have (Phase 2)
- [ ] Remove continuous gradient animations
- [ ] Simplify scroll animations
- [ ] Optimize backdrop-filters
- [ ] Fix sticky nav CLS
- [ ] Simplify hover effects

### Nice to Have (Phase 3)
- [ ] Lazy load gallery images
- [ ] Convert all images to WebP
- [ ] Add resource hints
- [ ] Optimize JavaScript

## Success Criteria
1. **LCP < 2.5s** (currently 15.9s) - CRITICAL
2. **Performance Score > 85** (currently 72)
3. **CLS < 0.1** (currently 0.114)
4. **Maintain 100/100** on Accessibility, SEO, Best Practices
5. **Keep excellent UX** - flip cards, sticky nav, hover effects

## Technical Constraints
- Must support browsers without WebP (provide JPEG fallbacks)
- Must maintain accessibility (WCAG 2.1 AA)
- Must preserve visual design quality
- Must keep interactive elements (flip cards, navigation)

## Testing Plan
1. Run Lighthouse audit after each phase
2. Test on mobile, tablet, desktop viewports
3. Test on slow 3G connection
4. Verify WebP fallback works
5. Validate accessibility with screen reader
6. Check CLS with Layout Shift Regions in DevTools

## Expected Results
- **Phase 1**: LCP 15.9s → 2.0s, Performance 72 → 85
- **Phase 2**: Performance 85 → 90, CLS 0.114 → 0.05
- **Phase 3**: Performance 90 → 95, overall polish

## Notes
- The UX improvements (flip cards, sticky nav, animations) are justified for an art/photography site
- Focus on image optimization first - it's 90% of the problem
- Keep the visual polish that makes the site memorable
- Prioritize user experience over perfect scores
