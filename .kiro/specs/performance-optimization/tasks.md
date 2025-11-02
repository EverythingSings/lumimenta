# Performance Optimization Tasks

## Phase 1: Critical Image Optimization

### Task 1.1: Convert Hero Images to WebP
**Priority**: CRITICAL  
**Estimated Time**: 30 minutes

**Steps**:
1. Install image conversion tool (if needed)
   ```bash
   # Windows: Download cwebp.exe from Google
   # Or use online converter
   ```

2. Convert hero front image
   ```bash
   cwebp -q 85 -m 6 images/8e587a9a699dd2035b5b63727396587a7ff9979eb029f8bf57caeb4d6aa60f83.jpg -o images/hero-front-1200.webp
   ```

3. Convert hero back image
   ```bash
   cwebp -q 85 -m 6 images/91304d4d005b21135e6361f489320828fbe974ea8517c94b9dd0402f46df0252.jpg -o images/hero-back-1200.webp
   ```

4. Verify file sizes
   - Target: hero-front-1200.webp < 200 KB
   - Target: hero-back-1200.webp < 150 KB

**Acceptance Criteria**:
- [ ] Hero front WebP created and < 200 KB
- [ ] Hero back WebP created and < 150 KB
- [ ] Visual quality acceptable (no visible artifacts)

---

### Task 1.2: Create Responsive Image Sizes
**Priority**: CRITICAL  
**Estimated Time**: 45 minutes

**Steps**:
1. Resize and convert to 480w (mobile)
   ```bash
   # Resize to 480px width, maintain aspect ratio
   # Then convert to WebP at 85% quality
   ```

2. Resize and convert to 768w (tablet)
   ```bash
   # Resize to 768px width, maintain aspect ratio
   # Then convert to WebP at 85% quality
   ```

3. Verify all sizes
   - hero-front-480.webp (< 80 KB)
   - hero-front-768.webp (< 120 KB)
   - hero-front-1200.webp (< 200 KB)
   - hero-back-480.webp (< 60 KB)
   - hero-back-768.webp (< 100 KB)
   - hero-back-1200.webp (< 150 KB)

**Acceptance Criteria**:
- [ ] All 6 WebP files created
- [ ] All files meet size targets
- [ ] Aspect ratios maintained (3:4 for cards)

---

### Task 1.3: Update HTML with Picture Elements
**Priority**: CRITICAL  
**Estimated Time**: 30 minutes

**Steps**:
1. Update hero front image in index.html
   ```html
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
           alt="Oregon Beach Scenes - front view showing coastal landscape photography"
           width="1200"
           height="1600"
           loading="eager"
           fetchpriority="high">
   </picture>
   ```

2. Update hero back image in index.html
   ```html
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
           alt="Oregon Beach Scenes - back view with gold and silver metallic ink annotations"
           width="1200"
           height="1600"
           loading="eager">
   </picture>
   ```

**Acceptance Criteria**:
- [ ] Both hero images use `<picture>` elements
- [ ] WebP sources with srcset defined
- [ ] JPEG fallbacks present
- [ ] Width/height attributes added
- [ ] loading="eager" on both
- [ ] fetchpriority="high" on front image

---

### Task 1.4: Add Preload Link in Head
**Priority**: HIGH  
**Estimated Time**: 10 minutes

**Steps**:
1. Add preload link after favicon in `<head>`
   ```html
   <!-- Preload hero image for faster LCP -->
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
   ```

**Acceptance Criteria**:
- [ ] Preload link added to `<head>`
- [ ] Correct href and srcset
- [ ] Placed after favicon, before CSS

---

### Task 1.5: Test Phase 1 Changes
**Priority**: CRITICAL  
**Estimated Time**: 30 minutes

**Steps**:
1. Start local server
   ```bash
   python -m http.server 8080
   ```

2. Run Lighthouse audit
   ```bash
   lighthouse http://localhost:8080 --output=html --output-path=./lighthouse-phase1.report.html
   ```

3. Verify metrics
   - LCP should be < 2.5s (target: ~2.0s)
   - Performance score should be > 85
   - CLS should be similar or better

4. Test on different viewports
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1200px)

5. Verify WebP fallback
   - Test in browser without WebP support
   - Ensure JPEG loads correctly

**Acceptance Criteria**:
- [ ] LCP < 2.5s (from 15.9s)
- [ ] Performance score > 85 (from 72)
- [ ] Images load correctly on all viewports
- [ ] JPEG fallback works
- [ ] No visual regressions

---

## Phase 2: CSS Performance Optimization

### Task 2.1: Remove Continuous Gradient Animations
**Priority**: HIGH  
**Estimated Time**: 15 minutes

**Steps**:
1. Update h1 styling in css/style.css
   ```css
   h1 {
       font-size: 2.5em;
       font-weight: 300;
       letter-spacing: 4px;
       margin-bottom: var(--spacing-sm);
       background: linear-gradient(135deg, 
           #a8c0ff 0%, 
           var(--color-primary-dark) 50%, 
           var(--color-accent) 100%);
       -webkit-background-clip: text;
       -webkit-text-fill-color: transparent;
       background-clip: text;
       /* REMOVED: animation: gradientShift 8s ease infinite; */
       /* REMOVED: background-size: 200% 200%; */
   }
   ```

2. Update .philosophy styling
   ```css
   .philosophy {
       background: linear-gradient(135deg,
           rgba(74, 144, 226, 0.1) 0%,
           rgba(192, 192, 192, 0.05) 50%,
           rgba(199, 159, 96, 0.1) 100%);
       /* REMOVED: background-size: 200% 200%; */
       /* REMOVED: animation: gradientShift 8s ease infinite; */
       padding: 20px;
       margin: var(--spacing-lg) 0;
       border-radius: var(--spacing-sm);
       text-align: center;
   }
   ```

3. Remove or comment out @keyframes gradientShift
   ```css
   /* Gradient Animation Keyframes - DISABLED for performance */
   /*
   @keyframes gradientShift {
       0%, 100% { background-position: 0% 50%; }
       50% { background-position: 100% 50%; }
   }
   */
   ```

**Acceptance Criteria**:
- [ ] Gradient animations removed from h1
- [ ] Gradient animations removed from .philosophy
- [ ] Static gradients still look good
- [ ] No console errors

---

### Task 2.2: Simplify Scroll Animations
**Priority**: MEDIUM  
**Estimated Time**: 20 minutes

**Steps**:
1. Update section styling in css/style.css
   ```css
   /* Scroll-triggered animations - SIMPLIFIED */
   section {
       opacity: 1;
       transform: none;
       /* REMOVED: transition, will-change */
   }
   
   /* Only animate hero section */
   .hero {
       opacity: 0;
       transform: translateY(20px);
       transition: opacity 400ms ease, transform 400ms ease;
   }
   
   .hero.animate-in {
       opacity: 1;
       transform: translateY(0);
   }
   
   /* Ensure header is always visible */
   header {
       opacity: 1;
       transform: none;
   }
   ```

2. Update JavaScript in js/catalog.js
   ```javascript
   // Simplified Intersection Observer - only observe hero
   if ('IntersectionObserver' in window) {
       const observerOptions = {
           threshold: 0.1,
           rootMargin: '0px 0px -50px 0px'
       };
       
       const observer = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   entry.target.classList.add('animate-in');
                   observer.unobserve(entry.target);
               }
           });
       }, observerOptions);
       
       // Only observe hero section
       const hero = document.querySelector('.hero');
       if (hero) {
           observer.observe(hero);
       }
   } else {
       // Fallback: show hero immediately
       document.querySelector('.hero')?.classList.add('animate-in');
   }
   ```

**Acceptance Criteria**:
- [ ] Only hero section animates on scroll
- [ ] Other sections visible immediately
- [ ] Intersection Observer simplified
- [ ] Fallback for older browsers

---

### Task 2.3: Optimize Backdrop Filters
**Priority**: MEDIUM  
**Estimated Time**: 25 minutes

**Steps**:
1. Keep backdrop-filter only on sticky nav
   ```css
   .sticky-nav {
       /* Keep backdrop-filter */
       backdrop-filter: blur(10px);
       -webkit-backdrop-filter: blur(10px);
   }
   ```

2. Remove backdrop-filter from other elements
   ```css
   /* BEFORE */
   .concept,
   .rarity-card,
   .stats-container,
   .example-images,
   .contact-link,
   .availability-card {
       backdrop-filter: blur(10px); /* REMOVE */
   }
   
   /* AFTER - use solid backgrounds */
   .concept,
   .rarity-card,
   .stats-container,
   .example-images,
   .contact-link,
   .availability-card {
       background: var(--color-bg-surface-solid);
       /* backdrop-filter removed */
   }
   ```

3. Update fallback class usage
   ```css
   /* Fallback no longer needed for most elements */
   .no-backdrop-filter .sticky-nav {
       background: var(--color-bg-surface-solid);
   }
   ```

**Acceptance Criteria**:
- [ ] Backdrop-filter only on sticky nav
- [ ] Other elements use solid backgrounds
- [ ] Visual appearance acceptable
- [ ] Performance improved

---

### Task 2.4: Fix Sticky Nav CLS
**Priority**: HIGH  
**Estimated Time**: 15 minutes

**Steps**:
1. Add explicit height to .sticky-nav
   ```css
   .sticky-nav {
       position: fixed;
       top: 0;
       left: 0;
       right: 0;
       z-index: 1000;
       height: 60px; /* EXPLICIT HEIGHT */
       min-height: 60px; /* PREVENT SHRINKING */
       display: flex;
       align-items: center;
       justify-content: space-between;
       padding: 0 var(--spacing-md);
       background: var(--color-bg-surface);
       backdrop-filter: blur(10px);
       -webkit-backdrop-filter: blur(10px);
       border-bottom: 1px solid var(--color-border-light);
       box-shadow: var(--shadow-medium);
       transition: transform 300ms ease, box-shadow 300ms ease;
   }
   ```

2. Ensure body padding matches
   ```css
   body {
       padding-top: 60px; /* MATCHES NAV HEIGHT */
   }
   ```

**Acceptance Criteria**:
- [ ] Sticky nav has explicit height
- [ ] Body padding matches nav height
- [ ] No layout shift on scroll
- [ ] CLS improved

---

### Task 2.5: Simplify Hover Effects
**Priority**: LOW  
**Estimated Time**: 20 minutes

**Steps**:
1. Simplify rarity card hover
   ```css
   .rarity-card:hover {
       transform: translateY(-4px); /* SIMPLIFIED */
       /* REMOVED: scale(1.02) translateZ(0) */
       /* REMOVED: will-change */
   }
   ```

2. Simplify other hover effects
   ```css
   .example-images img:hover {
       transform: scale(1.02); /* SIMPLIFIED */
       filter: brightness(1.1);
       /* REMOVED: translateZ(0) */
       /* REMOVED: will-change */
   }
   
   .stat-item:hover {
       transform: translateY(-2px); /* SIMPLIFIED */
       /* REMOVED: will-change */
   }
   
   .contact-link:hover {
       transform: translateY(-3px); /* SIMPLIFIED */
       /* REMOVED: will-change */
   }
   ```

**Acceptance Criteria**:
- [ ] Hover effects simplified
- [ ] will-change removed from hover states
- [ ] Visual feedback still present
- [ ] Performance improved

---

### Task 2.6: Test Phase 2 Changes
**Priority**: HIGH  
**Estimated Time**: 30 minutes

**Steps**:
1. Run Lighthouse audit
   ```bash
   lighthouse http://localhost:8080 --output=html --output-path=./lighthouse-phase2.report.html
   ```

2. Verify metrics
   - Performance score should be > 90
   - CLS should be < 0.1
   - LCP should remain < 2.5s

3. Test animations
   - Hero fade-in works
   - Other sections visible immediately
   - Hover effects still work

4. Test sticky nav
   - No layout shift on scroll
   - Navigation works correctly

**Acceptance Criteria**:
- [ ] Performance score > 90
- [ ] CLS < 0.1
- [ ] LCP still < 2.5s
- [ ] All animations work correctly
- [ ] No visual regressions

---

## Phase 3: Additional Optimizations

### Task 3.1: Lazy Load Gallery Images
**Priority**: LOW  
**Estimated Time**: 15 minutes

**Steps**:
1. Add loading="lazy" to gallery images
   ```html
   <!-- In flip cards (except hero) -->
   <img src="..." alt="..." loading="lazy">
   ```

2. Add loading="lazy" to availability grid images
   ```html
   <!-- In availability cards -->
   <img src="..." alt="..." loading="lazy">
   ```

**Acceptance Criteria**:
- [ ] Gallery images have loading="lazy"
- [ ] Availability grid images have loading="lazy"
- [ ] Hero images still loading="eager"
- [ ] Images load as user scrolls

---

### Task 3.2: Convert Remaining Images to WebP
**Priority**: LOW  
**Estimated Time**: 2 hours

**Steps**:
1. Identify all gallery images
2. Convert each to WebP at 85% quality
3. Create responsive sizes if needed
4. Update HTML with `<picture>` elements
5. Test all images load correctly

**Acceptance Criteria**:
- [ ] All gallery images converted to WebP
- [ ] File sizes reduced by 50-80%
- [ ] Visual quality maintained
- [ ] JPEG fallbacks present

---

### Task 3.3: Add Resource Hints
**Priority**: LOW  
**Estimated Time**: 10 minutes

**Steps**:
1. Add DNS prefetch if using external resources
   ```html
   <link rel="dns-prefetch" href="//external-domain.com">
   ```

2. Add preconnect for critical external resources
   ```html
   <link rel="preconnect" href="//critical-domain.com">
   ```

**Acceptance Criteria**:
- [ ] Resource hints added if applicable
- [ ] No unnecessary hints
- [ ] Performance improved

---

### Task 3.4: Final Testing and Validation
**Priority**: HIGH  
**Estimated Time**: 1 hour

**Steps**:
1. Run final Lighthouse audit
   ```bash
   lighthouse http://localhost:8080 --output=html --output-path=./lighthouse-final.report.html
   ```

2. Test on real devices
   - iPhone (Safari)
   - Android (Chrome)
   - Desktop (Chrome, Firefox, Safari)

3. Test on slow connection
   - Throttle to Slow 3G
   - Verify LCP still acceptable

4. Validate accessibility
   - Screen reader test
   - Keyboard navigation
   - Focus indicators

5. Check CLS with DevTools
   - Enable Layout Shift Regions
   - Verify no unexpected shifts

**Acceptance Criteria**:
- [ ] Performance score > 85 (target: 90+)
- [ ] LCP < 2.5s (target: 2.0s)
- [ ] CLS < 0.1 (target: 0.05)
- [ ] Accessibility 100/100
- [ ] SEO 100/100
- [ ] Best Practices 100/100
- [ ] All UX features working
- [ ] No visual regressions

---

## Summary

### Phase 1 Tasks (Critical - Day 1)
- [x] Task 1.1: Convert hero images to WebP
- [x] Task 1.2: Create responsive image sizes
- [x] Task 1.3: Update HTML with picture elements
- [x] Task 1.4: Add preload link in head
- [x] Task 1.5: Test Phase 1 changes

### Phase 2 Tasks (Important - Day 2)
- [ ] Task 2.1: Remove continuous gradient animations
- [ ] Task 2.2: Simplify scroll animations
- [ ] Task 2.3: Optimize backdrop filters
- [ ] Task 2.4: Fix sticky nav CLS
- [ ] Task 2.5: Simplify hover effects
- [ ] Task 2.6: Test Phase 2 changes

### Phase 3 Tasks (Polish - Day 3)
- [ ] Task 3.1: Lazy load gallery images
- [ ] Task 3.2: Convert remaining images to WebP
- [ ] Task 3.3: Add resource hints
- [ ] Task 3.4: Final testing and validation

### Expected Results
- **LCP**: 15.9s → 2.0s (87% improvement)
- **Performance**: 72 → 90+ (25% improvement)
- **CLS**: 0.114 → 0.05 (56% improvement)
- **Maintain**: 100/100 on Accessibility, SEO, Best Practices
- **Keep**: All UX improvements (flip cards, sticky nav, animations)
