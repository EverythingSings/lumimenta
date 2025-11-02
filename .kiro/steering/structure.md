---
inclusion: always
---

# Code Structure & Patterns

## File Structure

- `index.html` - Single-page entry point with all markup
- `css/style.css` - All styles in one file
- `js/catalog.js` - Catalog loading and statistics calculation
- `catalog.json` - Card metadata (schema below)
- `images/` - SHA-256 hashed filenames (64-char hex + `.jpg`)
- `js/__tests__/` - Test files (unit, integration, DOM)
- `scripts/` - Build and test automation scripts
- `.github/workflows/` - CI/CD pipeline configuration

## HTML Rules

- Use semantic elements: `<header>`, `<main>`, `<section>`, `<footer>`
- Include SEO meta tags, JSON-LD structured data, Open Graph tags
- Add descriptive `alt` text and captions for accessibility
- Use `role` and `aria-*` attributes for enhanced accessibility
- Implement skip links for keyboard navigation
- Ensure all interactive elements meet 44x44px minimum touch target size
- Use `<picture>` elements with responsive `srcset` for images
- Inline critical CSS in `<head>` for faster initial render
- Preload hero images with `rel="preload"` for faster LCP

## CSS Rules

- Mobile-first responsive design with media queries
- CSS Grid for card layouts and statistics
- Dark theme with gradient accents
- Rarity colors (exact hex required):
  - Blue: `#4a90e2`
  - Silver: `#c0c0c0`
  - Gold: `#c79f60`
- Use CSS custom properties (`:root` variables) for design system
- Breakpoints: 480px (tablet), 768px (desktop)
- Glassmorphism effects with `backdrop-filter` (with fallbacks)
- Touch-friendly interactions with minimum 44x44px targets
- Reduced motion support via `@media (prefers-reduced-motion: reduce)`
- Performance: avoid expensive animations, use `contain` property

## JavaScript Rules

- Use async/await for data loading, wrap in try/catch
- Write pure functions for calculations
- Manipulate DOM only after `DOMContentLoaded`
- No global variables except necessary constants
- Export testable functions for unit testing
- Use ES6 modules (`export`/`import`)
- Feature detection for browser APIs (IntersectionObserver, backdrop-filter)
- Graceful degradation for unsupported features
- Debounce scroll events for performance
- Use `requestAnimationFrame` for animations
- Implement proper event cleanup to prevent memory leaks

## JavaScript Module Exports

Functions exported from `catalog.js` for testing:
- `calculateTotalCards(cards)` - Count total cards
- `calculateRarityDistribution(cards)` - Count by rarity
- `calculateStatistics(cards)` - Full stats with unique subjects
- `formatCardData(card)` - Format card for display

## catalog.json Schema

All fields required except `availability`. `imageHash` must match existing file in `/images/`.

```json
{
  "cards": [
    {
      "id": 1,
      "title": "Card Title",
      "description": "Card description",
      "location": "Location name",
      "blockHeight": 800000,
      "rarity": "blue",
      "edition": "Edition name",
      "imageHash": "a6cf6fc02dac25b73eaaa0919c0fac91b9d613ed768bc04a9ef6216a9f828d50",
      "availability": "available"
    }
  ]
}
```

- `id`: Sequential positive integer, never reuse
- `rarity`: Must be `"blue"`, `"silver"`, or `"gold"` (lowercase), OR array of rarities for multi-rarity cards
- `blockHeight`: Valid Bitcoin block number (positive integer)
- `imageHash`: 64-character SHA-256 hex string
- `availability`: Optional. Must be `"available"`, `"collected"`, or `"unknown"` (defaults to `"unknown"`)

## Card Pairing Convention

Front and back cards are paired by title:
- Front card: `"Card Title"`
- Back card: `"Card Title (Back)"`
- Both cards share same `blockHeight`, `location`, `rarity`, `edition`
- Each has unique `id` and `imageHash`

## UI Components

### Flip Cards
- 3D card flip animation using CSS transforms
- Front/back pairing based on title convention
- Flip button with keyboard support (Enter/Space)
- Reduced motion fallback (fade transition)
- Touch-friendly with debounced interactions

### Sticky Navigation
- Fixed header with glassmorphism effect
- Hamburger menu for mobile (< 768px)
- Horizontal menu for desktop (≥ 768px)
- Active section highlighting via IntersectionObserver
- Smooth scroll with offset for fixed header
- Click-outside-to-close for mobile menu

### Statistics Display
- Animated counters using `requestAnimationFrame`
- Triggered by IntersectionObserver when scrolled into view
- Easing function for smooth animation (easeOutCubic)
- Graceful degradation if IntersectionObserver unavailable

### Availability Grid
- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- Color-coded badges: green (available), gray (collected), orange (unknown)
- Shows only front cards to avoid duplicates
