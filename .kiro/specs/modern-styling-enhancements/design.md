# Design Document

## Overview

This design implements modern web styling enhancements for the Lumimenta website using pure CSS3 and vanilla JavaScript. The approach focuses on glassmorphism effects, advanced gradients, smooth animations, mobile-first responsive design, and WCAG 2.1 AA accessibility compliance. All enhancements will be implemented without external dependencies, maintaining the project's minimalist philosophy.

## Architecture

### Design System Foundation

**Color Palette:**
- Primary: `#4a90e2` (Blue - existing)
- Secondary: `#c0c0c0` (Silver - existing)
- Accent: `#c79f60` (Gold - existing)
- Background Dark: `#0a0a0a` (existing)
- Background Medium: `#111111` (existing)
- Surface: `rgba(255, 255, 255, 0.05)` (glassmorphism)
- Text Primary: `#e0e0e0` (existing)
- Text Secondary: `#b0b0b0` (existing)

**Spacing Scale:**
- Base unit: 8px
- Scale: 8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px

**Typography Scale:**
- Desktop: h1 (3.5em), h2 (1.8em), body (1.05em)
- Mobile: h1 (2.5em), h2 (1.5em), body (1em)

**Animation Timing:**
- Fast: 200ms (micro-interactions)
- Medium: 300ms (hover states)
- Slow: 600ms (page transitions)
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1) for smooth acceleration

## Components and Interfaces

### 1. Glassmorphism Container System

**CSS Implementation:**
```css
.glass-container {
  background: rgba(17, 17, 17, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

**Applied to:**
- `.concept` section
- `.stats-container`
- `.rarity-card` elements
- `.specs` section
- `.example-images` container

### 2. Advanced Gradient System

**Multi-stop Gradients:**
```css
/* Header gradient */
background: linear-gradient(135deg, 
  #a8c0ff 0%, 
  #3f72af 25%, 
  #c79f60 50%,
  #4a90e2 75%,
  #a8c0ff 100%);
background-size: 200% 200%;
animation: gradientShift 8s ease infinite;

/* Philosophy section gradient */
background: linear-gradient(135deg,
  rgba(74, 144, 226, 0.1) 0%,
  rgba(192, 192, 192, 0.05) 50%,
  rgba(199, 159, 96, 0.1) 100%);
```

**Gradient Animation:**
```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### 3. Interactive Hover Effects

**Rarity Card Hover:**
```css
.rarity-card {
  transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1),
              box-shadow 300ms ease,
              border-color 300ms ease;
}

.rarity-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(74, 144, 226, 0.3);
}

.rarity-card.blue:hover {
  box-shadow: 0 12px 40px rgba(74, 144, 226, 0.4);
}

.rarity-card.silver:hover {
  box-shadow: 0 12px 40px rgba(192, 192, 192, 0.4);
}

.rarity-card.gold:hover {
  box-shadow: 0 12px 40px rgba(199, 159, 96, 0.4);
}
```

**Gallery Image Hover:**
```css
.example-images img {
  transition: transform 400ms ease, filter 400ms ease;
}

.example-images img:hover {
  transform: scale(1.03);
  filter: brightness(1.1);
}
```

### 4. Scroll-Triggered Animations

**JavaScript Intersection Observer:**
```javascript
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});
```

**CSS Animation Classes:**
```css
section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 600ms ease, transform 600ms ease;
}

section.animate-in {
  opacity: 1;
  transform: translateY(0);
}
```

### 5. Counter Animation for Stats

**JavaScript Implementation:**
```javascript
function animateCounter(element, target, duration = 1000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Trigger when stats enter viewport
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(num => {
        const target = parseInt(num.textContent);
        animateCounter(num, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
```

### 6. Mobile-First Responsive Design

**Breakpoints:**
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

**Media Query Structure:**
```css
/* Mobile-first base styles */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 480px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .container {
    padding: 40px 20px;
  }
}
```

**Touch Target Sizing:**
```css
/* Ensure minimum 44x44px touch targets */
.rarity-card,
a,
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### 7. Accessibility Enhancements

**Focus Indicators:**
```css
*:focus-visible {
  outline: 2px solid #4a90e2;
  outline-offset: 4px;
  border-radius: 4px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #4a90e2;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**ARIA Labels:**
```html
<!-- Add to HTML -->
<nav aria-label="Main navigation">
<section aria-labelledby="concept-heading">
  <h2 id="concept-heading">THE CONCEPT</h2>
</section>
```

### 8. Performance Optimizations

**GPU Acceleration:**
```css
.rarity-card,
.example-images img,
section {
  will-change: transform;
  transform: translateZ(0);
}
```

**Lazy Loading:**
```html
<img src="..." loading="lazy" alt="...">
```

**CSS Containment:**
```css
.rarity-card,
.stat-item {
  contain: layout style paint;
}
```

## Data Models

No new data models required. Existing `catalog.json` structure remains unchanged.

## Error Handling

### Animation Fallbacks

**Feature Detection:**
```javascript
// Check for backdrop-filter support
if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
  document.body.classList.add('no-backdrop-filter');
}
```

**CSS Fallback:**
```css
.no-backdrop-filter .glass-container {
  background: rgba(17, 17, 17, 0.95);
}
```

### Intersection Observer Polyfill

```javascript
// Graceful degradation if IntersectionObserver not supported
if (!('IntersectionObserver' in window)) {
  // Show all content immediately
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('animate-in');
  });
}
```

## Testing Strategy

### Visual Regression Testing
- Test on Chrome, Firefox, Safari, Edge
- Test on iOS Safari and Android Chrome
- Verify glassmorphism effects render correctly
- Confirm gradient animations are smooth

### Accessibility Testing
- Run axe DevTools audit
- Test keyboard navigation (Tab, Shift+Tab, Enter)
- Test with NVDA/JAWS screen readers
- Verify color contrast with WebAIM tool
- Test with prefers-reduced-motion enabled

### Performance Testing
- Lighthouse audit (target: 90+ performance score)
- Measure animation frame rate (target: 60fps)
- Test on throttled CPU (4x slowdown)
- Verify Cumulative Layout Shift < 0.1

### Responsive Testing
- Test at 320px, 375px, 768px, 1024px, 1920px widths
- Verify touch targets are 44x44px minimum
- Test landscape and portrait orientations
- Verify no horizontal scrolling on mobile

### Cross-Browser Testing
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## Implementation Notes

### GitHub Pages Deployment Considerations

**Static Asset Optimization:**
- All CSS and JavaScript remain inline or in single files (no build process)
- No external dependencies or CDN requirements
- Images already optimized with SHA-256 naming convention
- CNAME file preserved for custom domain

**Browser Compatibility:**
- Target modern browsers (ES6+ support) as per existing architecture
- Provide graceful degradation for older browsers
- No polyfills required for core functionality
- Progressive enhancement ensures baseline experience

**Performance on GitHub Pages:**
- Minimize CSS/JS file sizes (target < 50KB combined)
- Use native browser features (no frameworks)
- Leverage browser caching with proper cache headers
- Ensure fast First Contentful Paint (< 1.5s)

**HTTPS and Security:**
- GitHub Pages provides automatic HTTPS
- No mixed content issues (all assets relative paths)
- No external API calls or third-party scripts
- CSP-friendly implementation

### CSS Organization
- Add new styles to existing `css/style.css`
- Group related styles with comments
- Maintain existing class names where possible
- Add new utility classes for reusable patterns
- Use CSS custom properties for easy theming

### JavaScript Enhancements
- Extend existing `js/catalog.js`
- Add animation utilities as pure functions
- Initialize animations in DOMContentLoaded handler
- Keep functions small and focused
- No external libraries or dependencies

### HTML Modifications
- Add ARIA labels to existing semantic elements
- Add skip link before header
- Add loading="lazy" to images
- Maintain existing structure and IDs
- Preserve all SEO meta tags and structured data

### Progressive Enhancement
- Site remains functional without JavaScript
- Animations enhance but aren't required
- Glassmorphism degrades gracefully
- Core content always accessible
- Works on GitHub Pages without build step
