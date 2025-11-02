---
inclusion: always
---

# Tech Stack

## Stack Constraints

- Vanilla JavaScript (ES6+) only - no frameworks, no build tools, no transpilation
- Single CSS file - no preprocessors, no CSS-in-JS
- Static HTML - no server-side rendering, no backend
- JSON for data - no databases, no APIs

## Required Technologies

- HTML5 semantic markup with SEO meta tags
- CSS3 Grid and Flexbox for layout
- Fetch API for async data loading from `catalog.json`
- Schema.org JSON-LD structured data
- Open Graph and Twitter Card meta tags
- IntersectionObserver API for scroll animations and lazy loading
- ES6 modules for code organization

## Development Workflow

Edit files directly and test in browser with local server. No build step required.

## Testing Infrastructure

- **Vitest** for unit, integration, and DOM tests
- **JSDOM** for browser environment simulation
- **Lighthouse** for performance, accessibility, SEO audits
- **Lighthouse CI** for automated performance budgets
- Coverage thresholds: 80% lines, 80% functions, 75% branches

### Test Commands
- `npm test` - Run unit/integration tests
- `npm run test:watch` - Watch mode for development
- `npm run test:coverage` - Generate coverage reports
- `npm run test:lighthouse` - Run Lighthouse audit
- `npm run test:lhci` - Run Lighthouse CI with budgets
- `npm run test:all` - Full test suite (unit + Lighthouse CI)

## Deployment

GitHub Pages from root directory. Domain configured via `CNAME` file.

### CI/CD Pipeline
- **Automated testing** on all pull requests and main branch pushes
- **Deployment blocked** if tests fail
- **Lighthouse reports** uploaded as artifacts for review
- **Emergency override** available via workflow_dispatch (use sparingly)

## Browser Target

Modern evergreen browsers with ES6+, CSS Grid, and async/await support.

## Performance Optimization Patterns

- Critical CSS inlined in `<head>` for faster initial render
- Non-critical CSS loaded asynchronously with `rel="preload"`
- JavaScript deferred with `defer` attribute
- Responsive images with `<picture>` and `srcset`
- WebP format with JPEG fallbacks
- Lazy loading for below-the-fold images
- Preload hero images for faster LCP
- GPU acceleration hints (`transform: translateZ(0)`) used sparingly
- Animations disabled for `prefers-reduced-motion`
- IntersectionObserver for scroll-triggered animations (with fallbacks)
