# Design Document

## Overview

This design document outlines the technical approach for enhancing the Lumimenta website with improved visual hierarchy, navigation, social connectivity, and card availability information. The enhancements maintain the existing static architecture while adding new UI components that integrate seamlessly with the current design system.

## Architecture

### Current Architecture
- Static single-page application (SPA)
- Client-side rendering with vanilla JavaScript
- JSON-based data storage (catalog.json)
- No build process or backend dependencies
- CSS custom properties for design system consistency

### Enhancement Strategy
- Preserve existing static architecture
- Extend current CSS design system with new components
- Enhance JavaScript catalog.js with new display functions
- Maintain mobile-first responsive approach
- Ensure accessibility compliance (WCAG 2.1 AA)

## Components and Interfaces

### 1. Hero Flip Card Component

**Purpose**: Display an interactive flip card at the top of the page to immediately demonstrate the physical artifact concept and allow visitors to see both front and annotated back.

**Location**: Between `<header>` and first `<section>` in index.html

**HTML Structure**: Reuse existing flip-card component structure
```html
<section class="hero" aria-label="Featured card example">
    <div class="flip-card hero-flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <img src="images/8e587a9a699dd2035b5b63727396587a7ff9979eb029f8bf57caeb4d6aa60f83.jpg" 
                     alt="Oregon Beach Scenes - front view" 
                     loading="eager">
                <p class="card-caption">Oregon Beach Scenes — front view</p>
            </div>
            <div class="flip-card-back">
                <img src="images/91304d4d005b21135e6361f489320828fbe974ea8517c94b9dd0402f46df0252.jpg" 
                     alt="Oregon Beach Scenes - back with gold and silver annotations" 
                     loading="eager">
                <p class="card-caption">Oregon Beach Scenes — back view with annotations</p>
            </div>
        </div>
        <button class="flip-button" aria-label="Flip card to see back">
            <span class="flip-text">See Back</span>
            <span class="flip-icon">↻</span>
        </button>
    </div>
</section>
```

**CSS Specifications**:
- Reuse existing .flip-card styles
- Add .hero-flip-card modifier for hero-specific sizing
- Desktop: max-width 900px, centered with auto margins
- Mobile: max-width 100% with appropriate padding
- Use loading="eager" for hero images (not lazy loaded)
- Larger scale than gallery cards for prominence

**Card Selection**: Use Oregon Beach Scenes (front: 8e587a9a699dd2035b5b63727396587a7ff9979eb029f8bf57caeb4d6aa60f83, back: 91304d4d005b21135e6361f489320828fbe974ea8517c94b9dd0402f46df0252) as it shows both gold and silver annotations clearly.

**JavaScript Requirements**: 
- Initialize flip button event listener for hero card using existing initializeFlipButtons() function
- No additional JavaScript needed beyond existing flip card functionality

### 2. Hook Text Component

**Purpose**: Provide a concise one-sentence explanation immediately below the hero image.

**Location**: Within hero section, below hero image

**HTML Structure**:
```html
<p class="hero-hook">Photography that exists only as physical objects—never as digital files.</p>
```

**CSS Specifications**:
- Font-size: 1.3em (mobile), 1.5em (tablet), 1.8em (desktop)
- Font-weight: 300 (light)
- Text-align: center
- Color: var(--color-text-white)
- Letter-spacing: 1px
- Max-width: 800px, centered
- Margin: var(--spacing-md) auto

**Content**: "Photography that exists only as physical objects—never as digital files."

### 3. Sticky Navigation Component

**Purpose**: Provide persistent access to page sections while scrolling.

**Location**: Fixed position at top of viewport

**HTML Structure**:
```html
<nav class="sticky-nav" role="navigation" aria-label="Main navigation">
    <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span class="hamburger-icon"></span>
    </button>
    <ul class="nav-menu">
        <li><a href="#concept">Concept</a></li>
        <li><a href="#rarity">Rarity</a></li>
        <li><a href="#collection">Collection</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>
</nav>
```

**CSS Specifications**:
- Position: fixed, top: 0, z-index: 1000
- Background: var(--color-bg-surface) with backdrop-filter blur
- Border-bottom: 1px solid var(--color-border-light)
- Height: 60px
- Full width with max-width matching container
- Box-shadow: var(--shadow-medium)

**Mobile Behavior** (viewport < 768px):
- Hamburger menu icon (three horizontal lines)
- Collapsible menu that slides down from top
- Touch-friendly tap targets (min 48x48px)
- Menu closes on link click or outside tap

**Desktop Behavior** (viewport >= 768px):
- Horizontal menu layout
- Active section highlighting based on scroll position
- Smooth scroll to section on click

**JavaScript Requirements**:
- Scroll position tracking with IntersectionObserver
- Active section highlighting
- Smooth scroll behavior
- Mobile menu toggle functionality
- Debounced scroll event handling for performance

### 4. Contact & Social Links Component

**Purpose**: Provide easy access to artist's website and Nostr profile.

**Location**: New section before footer

**HTML Structure**:
```html
<section id="contact" aria-labelledby="contact-heading">
    <h2 id="contact-heading">CONNECT</h2>
    <div class="contact-links">
        <a href="https://www.EverythingSings.Art" 
           target="_blank" 
           rel="noopener noreferrer"
           class="contact-link">
            <span class="link-icon">🌐</span>
            <span class="link-text">Visit EverythingSings.Art</span>
        </a>
        <a href="https://primal.net/EverythingSings" 
           target="_blank" 
           rel="noopener noreferrer"
           class="contact-link">
            <span class="link-icon">⚡</span>
            <span class="link-text">Follow on Nostr</span>
        </a>
    </div>
</section>
```

**CSS Specifications**:
- Links styled as cards with glassmorphism effect
- Display: flex with gap for spacing
- Mobile: stack vertically
- Desktop: horizontal layout, centered
- Min touch target: 44x44px (mobile: 48x48px)
- Hover effects: translateY(-4px), enhanced shadow
- Icons: emoji or simple unicode characters for simplicity

### 5. Card Availability Component

**Purpose**: Display all cards with availability status indicators.

**Location**: Within existing "COLLECTION" section, after stats

**Data Model Extension** (catalog.json):
```json
{
  "id": 1,
  "title": "Oregon Coast Hillside",
  "availability": "available" | "collected" | "unknown"
}
```

**HTML Structure** (generated by JavaScript):
```html
<div class="availability-grid">
    <div class="availability-card" data-status="available">
        <img src="images/[hash].jpg" alt="[title]" loading="lazy">
        <div class="card-info">
            <h4 class="card-title">[title]</h4>
            <p class="card-rarity">[rarity] • [edition]</p>
            <span class="availability-badge available">Available</span>
        </div>
    </div>
</div>
```

**CSS Specifications**:
- Grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Card styling: glassmorphism background, border-radius, shadow
- Image: aspect-ratio 3/4, object-fit cover
- Availability badges:
  - Available: green (#4caf50)
  - Collected: gray (#757575)
  - Unknown: orange (#ff9800)
- Badge position: absolute, bottom-right of card
- Hover effect: scale(1.02), enhanced shadow

**JavaScript Functions**:
```javascript
function displayAvailability(cards) {
    // Generate availability grid HTML
    // Apply status-based styling
    // Handle lazy loading for images
}
```

## Data Models

### Extended Catalog Schema

```json
{
  "cards": [
    {
      "id": number,
      "title": string,
      "description": string,
      "location": string,
      "blockHeight": number,
      "rarity": string | string[],
      "edition": string,
      "imageHash": string,
      "availability": "available" | "collected" | "unknown" // NEW FIELD
    }
  ]
}
```

**Default Behavior**: If `availability` field is missing, default to "unknown".

## Error Handling

### Image Loading Failures
- Implement onerror handlers for all images
- Display placeholder with descriptive text
- Log errors to console for debugging

### Catalog Loading Failures
- Display user-friendly error message
- Provide retry mechanism
- Graceful degradation: show static content

### Navigation Failures
- Fallback to standard anchor links if JavaScript fails
- Ensure all sections have proper IDs
- No-JS fallback: display navigation as simple list

## Testing Strategy

### Visual Regression Testing
- Test hero image display across viewport sizes
- Verify sticky navigation behavior on scroll
- Confirm card availability grid layout responsiveness

### Accessibility Testing
- Keyboard navigation for all interactive elements
- Screen reader compatibility (NVDA, JAWS)
- Color contrast verification (WCAG AA)
- Touch target size validation (min 44x44px)

### Performance Testing
- Lighthouse audit (target: 90+ performance score)
- Image lazy loading verification
- Scroll performance with sticky navigation
- Mobile network throttling tests

### Cross-Browser Testing
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile Safari (iOS)
- Chrome Mobile (Android)
- Fallback behavior for older browsers

### Functional Testing
- Smooth scroll to sections
- Mobile menu toggle
- Active section highlighting
- External links open in new tabs
- Flip card functionality remains intact

## Implementation Notes

### Performance Considerations
- Use IntersectionObserver for scroll tracking (better than scroll events)
- Debounce scroll handlers if needed
- Lazy load all gallery images
- Minimize reflows/repaints with CSS transforms
- Use will-change sparingly for animations

### Accessibility Considerations
- Maintain skip-to-content link
- Ensure focus indicators are visible
- Provide aria-labels for icon-only buttons
- Use semantic HTML5 elements
- Support keyboard navigation throughout
- Respect prefers-reduced-motion

### Mobile Considerations
- Touch-friendly tap targets (48x48px minimum)
- Prevent double-tap zoom on buttons
- Optimize for touch interactions
- Test on actual devices, not just emulators
- Consider thumb-reach zones for navigation

### SEO Considerations
- Update meta description to mention new features
- Add structured data for contact information
- Ensure hero image has descriptive alt text
- Maintain semantic heading hierarchy

## Design System Integration

All new components will use existing CSS custom properties:

**Spacing**: var(--spacing-xs) through var(--spacing-4xl)
**Colors**: var(--color-primary), var(--color-bg-surface), etc.
**Borders**: var(--radius-sm/md/lg)
**Shadows**: var(--shadow-low/medium/high)

This ensures visual consistency and maintainability.

## Migration Strategy

1. Add hero section to HTML
2. Implement sticky navigation HTML/CSS
3. Add navigation JavaScript functionality
4. Create contact section
5. Extend catalog.json with availability field
6. Implement availability display function
7. Update section IDs for navigation
8. Test across devices and browsers
9. Deploy incrementally if possible

## Future Enhancements (Out of Scope)

- Search/filter functionality for cards
- Card detail modal views
- Collection wishlist feature
- Email notification for new cards
- Print-on-demand integration
