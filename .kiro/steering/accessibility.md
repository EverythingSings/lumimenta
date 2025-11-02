---
inclusion: always
---

# Accessibility & Performance Standards

## Accessibility Requirements (WCAG 2.1 AA)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators (2px solid outline, 4px offset)
- Skip links for bypassing navigation
- Logical tab order following visual flow
- Support Enter and Space keys for button activation

### Touch Targets
- Minimum 44x44px for all interactive elements (WCAG 2.1)
- Increase to 48x48px on mobile (< 480px)
- Adequate spacing between adjacent interactive elements (8px minimum)

### Screen Reader Support
- Semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`)
- ARIA labels for icon-only buttons
- ARIA roles for custom components
- ARIA live regions for dynamic content updates
- Descriptive alt text for all images
- `aria-expanded` state for collapsible menus
- `aria-label` for context where visual labels insufficient

### Color & Contrast
- Never rely on color alone to convey information
- Text contrast ratios: 4.5:1 minimum for normal text, 3:1 for large text
- Focus indicators must have 3:1 contrast against background
- Rarity system uses both color AND text labels

### Motion & Animation
- Respect `prefers-reduced-motion` media query
- Disable all animations when user prefers reduced motion
- Provide fade transitions as fallback for 3D transforms
- Never use auto-playing animations that cannot be paused

### Forms & Inputs
- Associate labels with form controls
- Provide clear error messages
- Use appropriate input types for mobile keyboards

## Performance Standards

### Lighthouse Thresholds
- **Performance**: 70+ (CI), 80+ (local)
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 4000ms (warn at 2000ms)
- **FCP (First Contentful Paint)**: < 2000ms
- **CLS (Cumulative Layout Shift)**: < 0.1 (error threshold)
- **TBT (Total Blocking Time)**: < 300ms
- **Speed Index**: < 3000ms

### Image Optimization
- Use WebP format with JPEG fallbacks
- Implement responsive images with `srcset` and `sizes`
- Lazy load below-the-fold images with `loading="lazy"`
- Preload hero images for faster LCP
- Use `fetchpriority="high"` for critical images
- Specify width and height attributes to prevent CLS

### CSS Performance
- Inline critical CSS in `<head>` (< 14KB)
- Load non-critical CSS asynchronously with `rel="preload"`
- Use CSS custom properties for design system
- Avoid expensive properties: `box-shadow`, `filter`, `backdrop-filter` (use sparingly)
- Use `contain` property for layout optimization
- Minimize use of `will-change` (only during active animations)

### JavaScript Performance
- Defer non-critical JavaScript with `defer` attribute
- Use ES6 modules for better tree-shaking
- Debounce scroll events (100ms minimum)
- Use `requestAnimationFrame` for animations
- Implement IntersectionObserver for lazy loading and scroll triggers
- Avoid layout thrashing (batch DOM reads/writes)
- Clean up event listeners to prevent memory leaks

### Animation Performance
- Use CSS transforms and opacity (GPU-accelerated)
- Avoid animating layout properties (width, height, margin, padding)
- Use `transform: translateZ(0)` sparingly for GPU hints
- Limit simultaneous animations (max 2-3)
- Queue animations to prevent frame drops
- Remove `will-change` after animation completes

### Network Performance
- Minimize HTTP requests
- Use HTTP/2 for multiplexing
- Implement proper caching headers
- Compress text assets (HTML, CSS, JS, JSON)
- Use CDN for static assets (if applicable)

## Testing Requirements

### Automated Testing
- Unit tests for all calculation functions (80% coverage minimum)
- Integration tests for data loading and error handling
- DOM tests for UI rendering and interactions
- Lighthouse audits on every deployment
- Coverage thresholds enforced in CI

### Manual Testing Checklist
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces content correctly
- [ ] Touch targets are adequate on mobile devices
- [ ] Reduced motion preference is respected
- [ ] Focus indicators are visible on all elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Images have descriptive alt text
- [ ] Forms are accessible and error messages clear
- [ ] Page loads quickly on 3G connection
- [ ] No layout shift during page load

## Browser Support

### Minimum Requirements
- ES6+ support (async/await, arrow functions, template literals)
- CSS Grid and Flexbox
- IntersectionObserver API (with fallback)
- Fetch API
- CSS custom properties
- `backdrop-filter` (with fallback)

### Graceful Degradation
- Provide fallbacks for unsupported features
- Use feature detection, not browser detection
- Ensure core content accessible without JavaScript
- Test in browsers without IntersectionObserver support
- Provide solid backgrounds when `backdrop-filter` unavailable

## Common Patterns

### Feature Detection
```javascript
if ('IntersectionObserver' in window) {
  // Use IntersectionObserver
} else {
  // Fallback implementation
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch-Friendly Buttons
```css
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(74, 144, 226, 0.2);
}
```

### Accessible Focus Indicators
```css
*:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}
```
