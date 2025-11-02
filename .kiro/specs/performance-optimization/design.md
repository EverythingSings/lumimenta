# Performance Optimization Design

## Overview
Optimize Lumimenta website to achieve LCP < 2.5s while maintaining excellent UX. Primary focus on image optimization, secondary focus on CSS performance.

## Architecture

### Image Optimization Pipeline
```
Original JPEG (1.27 MB)
    ↓
WebP Conversion (85% quality)
    ↓
Responsive Sizes (480w, 768w, 1200w)
    ↓
Optimized WebP (< 200 KB)
    ↓
HTML with <picture> + srcset
```

### Loading Strategy
```
<head>
    ↓
Preload hero WebP (fetchpriority="high")
    ↓
<body>
    ↓
Hero images (loading="eager")
    ↓
Gallery images (loading="lazy")
```

## Component Design

### 1. Optimized Hero Section

#### HTML Structure
```html
<section class="hero" aria-label="Featured card example">
    <div class="flip-card hero-flip-card">
        <div class="flip-card-inner">
            <!-- Front -->
            <div class="flip-card-front">
                <picture>
                    <source 
                        type="image/webp"
                        srcset="
                            images/hero-front-480.webp 480w,
                            images/hero-front-768.webp 768w,
                            images/hero-front-1200.webp 1200w
                        "
                        sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px">
                    <img 
                        src="images/8e587a9a699dd2035b5b63727396587a7ff9979eb029f8bf57caeb4d6aa60f83.jpg"
                        alt="Oregon Beach Scenes - front view"
                        width="1200"
                        height="1600"
                        loading="eager"
                        fetchpriority="high">
                </picture>
                <p class="card-caption">Oregon Beach Scenes — front view</p>
            </div>
            
            <!-- Back -->
            <div class="flip-card-back">
                <picture>
                    <source 
                        type="image/webp"
                        srcset="
                            images/hero-back-480.webp 480w,
                            images/hero-back-768.webp 768w,
                            images/hero-back-1200.webp 1200w
                        "
                        sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px">
                    <img 
                        src="images/91304d4d005b21135e6361f489320828fbe974ea8517c94b9dd0402f46df0252.jpg"
                        alt="Oregon Beach Scenes - back view"
                        width="1200"
                        height="1600"
                        loading="eager">
                </picture>
                <p class="card-caption">Oregon Beach Scenes — back view</p>
            </div>
        </div>
        <button class="flip-button">...</button>
    </div>
    <p class="hero-hook">Photography that exists only as physical objects.</p>
</section>
```

#### Preload in Head
```html
<head>
    <!-- Preload hero image -->
    <link rel="preload" 
          as="image" 
          href="images/hero-front-1200.webp"
          type="image/webp"
          imagesrcset="
              images/hero-front-480.webp 480w,
              images/hero-front-768.webp 768w,
              images/hero-front-1200.webp 1200w
          "
          imagesizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px">
</head>
```

### 2. Optimized CSS

#### Remove Continuous Animations
```css
/* BEFORE - Expensive */
h1 {
    background: linear-gradient(...);
    animation: gradientShift 8s ease infinite; /* REMOVE */
}

/* AFTER - Static gradient */
h1 {
    background: linear-gradient(135deg, 
        #a8c0ff 0%, 
        var(--color-primary-dark) 50%, 
        var(--color-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

#### Simplify Scroll Animations
```css
/* BEFORE - All sections animate */
section {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 600ms, transform 600ms;
}

section.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* AFTER - Only hero animates, rest visible */
section {
    opacity: 1;
    transform: none;
}

.hero {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 400ms ease, transform 400ms ease;
}

.hero.animate-in {
    opacity: 1;
    transform: translateY(0);
}
```

#### Optimize Backdrop Filters
```css
/* BEFORE - Multiple elements */
.glass-container,
.concept,
.rarity-card,
.stats-container,
.example-images,
.contact-link {
    backdrop-filter: blur(10px); /* EXPENSIVE */
}

/* AFTER - Only sticky nav */
.sticky-nav {
    backdrop-filter: blur(10px);
}

/* Other elements use solid backgrounds */
.concept,
.rarity-card,
.stats-container {
    background: var(--color-bg-surface-solid);
    /* Remove backdrop-filter */
}
```

#### Fix Sticky Nav CLS
```css
/* BEFORE - No explicit height */
.sticky-nav {
    position: fixed;
    /* height calculated by content */
}

body {
    padding-top: 60px; /* Doesn't prevent CLS */
}

/* AFTER - Explicit height */
.sticky-nav {
    position: fixed;
    height: 60px; /* Explicit */
    min-height: 60px;
}

body {
    padding-top: 60px;
}
```

#### Simplify Hover Effects
```css
/* BEFORE - Complex transforms */
.rarity-card:hover {
    transform: translateY(-8px) scale(1.02) translateZ(0);
    will-change: transform, box-shadow; /* REMOVE will-change */
}

/* AFTER - Simple transform */
.rarity-card:hover {
    transform: translateY(-4px);
    /* will-change removed */
}
```

### 3. JavaScript Optimizations

#### Optimize Intersection Observer
```javascript
// BEFORE - Observing all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// AFTER - Only observe hero
const hero = document.querySelector('.hero');
if (hero) {
    observer.observe(hero);
}

// Or remove entirely if not needed
```

#### Optimize Flip Card Handler
```javascript
// Already optimized - no changes needed
// Uses event delegation and prevents double-tap zoom
```

## Image Conversion Specifications

### WebP Conversion Settings
- **Quality**: 85% (balance between size and visual quality)
- **Method**: 6 (best compression, slower encoding)
- **Format**: WebP with lossy compression

### Responsive Sizes
1. **Mobile (480w)**
   - Width: 480px
   - Target size: < 80 KB
   - For viewports < 480px

2. **Tablet (768w)**
   - Width: 768px
   - Target size: < 120 KB
   - For viewports 480px - 768px

3. **Desktop (1200w)**
   - Width: 1200px
   - Target size: < 200 KB
   - For viewports > 768px

### Naming Convention
```
Original: 8e587a9a699dd2035b5b63727396587a7ff9979eb029f8bf57caeb4d6aa60f83.jpg
WebP versions:
  - hero-front-480.webp
  - hero-front-768.webp
  - hero-front-1200.webp
  - hero-back-480.webp
  - hero-back-768.webp
  - hero-back-1200.webp
```

## Performance Budget

### Image Sizes
| Image Type | Original | Target | Savings |
|------------|----------|--------|---------|
| Hero Front | 1.27 MB  | 200 KB | 84%     |
| Hero Back  | 936 KB   | 150 KB | 84%     |
| Gallery    | 300-800 KB | 150 KB | 50-80%  |

### Loading Times (3G)
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| LCP    | 15.9s  | 2.0s  | 87%         |
| FCP    | 1.1s   | 1.0s  | 9%          |
| Total  | 16s    | 3s    | 81%         |

## Browser Compatibility

### WebP Support
- Chrome 23+ ✓
- Firefox 65+ ✓
- Safari 14+ ✓
- Edge 18+ ✓

### Fallback Strategy
```html
<picture>
    <source type="image/webp" srcset="..."> <!-- Modern browsers -->
    <img src="fallback.jpg">                <!-- Older browsers -->
</picture>
```

### Feature Detection
```css
/* Backdrop-filter fallback */
.no-backdrop-filter .sticky-nav {
    background: var(--color-bg-surface-solid);
}
```

## Testing Strategy

### Lighthouse Audits
1. **Baseline**: Current performance (72/100, LCP 15.9s)
2. **Phase 1**: After image optimization (target: 85/100, LCP 2.0s)
3. **Phase 2**: After CSS optimization (target: 90/100, CLS 0.05)
4. **Phase 3**: After additional optimizations (target: 95/100)

### Device Testing
- Mobile: iPhone 12, Pixel 5
- Tablet: iPad Air
- Desktop: 1920x1080, 2560x1440

### Network Testing
- Fast 3G (1.6 Mbps)
- Slow 3G (400 Kbps)
- 4G (4 Mbps)

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Rollout Plan

### Phase 1: Image Optimization (Day 1)
1. Convert hero images to WebP
2. Create responsive sizes
3. Update HTML with `<picture>` elements
4. Add preload link in head
5. Test and validate

### Phase 2: CSS Optimization (Day 2)
1. Remove continuous animations
2. Simplify scroll animations
3. Optimize backdrop-filters
4. Fix sticky nav CLS
5. Test and validate

### Phase 3: Additional Optimizations (Day 3)
1. Lazy load gallery images
2. Convert remaining images to WebP
3. Add resource hints
4. Final testing and validation

## Monitoring

### Key Metrics to Track
- Lighthouse Performance Score
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TBT (Total Blocking Time)

### Success Criteria
- ✓ LCP < 2.5s (from 15.9s)
- ✓ Performance Score > 85 (from 72)
- ✓ CLS < 0.1 (from 0.114)
- ✓ Maintain 100/100 on A11y, SEO, Best Practices
- ✓ Keep excellent UX (flip cards, sticky nav, hover effects)

## Notes
- Focus on image optimization first - it's 90% of the problem
- Keep the UX improvements that make the site memorable
- Prioritize user experience over perfect scores
- Test on real devices, not just emulators
