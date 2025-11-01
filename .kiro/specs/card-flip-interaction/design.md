# Design Document

## Overview

The card flip interaction feature transforms the static gallery into an interactive experience that mimics handling physical trading cards. Users will see the front of each card by default and can click a button to flip the card and reveal the back with annotations. The implementation uses CSS 3D transforms for smooth animations and maintains the existing design system's visual language.

## Architecture

### Component Structure

The feature introduces a new card component structure that wraps existing gallery images:

```
Card Container (flip-card)
├── Card Inner (flip-card-inner) - handles rotation
│   ├── Card Front (flip-card-front)
│   │   ├── Image (front photo)
│   │   └── Caption
│   └── Card Back (flip-card-back)
│       ├── Image (back photo with annotations)
│       └── Caption
└── Flip Button (flip-button)
```

### Data Model

The feature leverages the existing `catalog.json` structure but requires pairing front and back images. The current catalog has separate entries for front and back views of the same card. The implementation will:

1. Group cards by matching titles (e.g., "Oregon Coast Hillside" and "Oregon Coast Hillside (Back)")
2. Create flip card components only for cards that have both front and back images
3. Display standalone images (without pairs) in the traditional static format

### Card Pairing Logic

```javascript
{
  front: {
    id: 1,
    title: "Oregon Coast Hillside",
    imageHash: "a6cf6fc02dac25b73eaaa0919c0fac91b9d613ed768bc04a9ef6216a9f828d50"
  },
  back: {
    id: 3,
    title: "Oregon Coast Hillside (Back)",
    imageHash: "185d89123bdb948880a277745f67b77beba2a90844d5e606ca06f9f1042e6e13"
  }
}
```

## Components and Interfaces

### HTML Structure

Replace the current static gallery `<div>` elements with flip card components:

```html
<div class="flip-card">
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <img src="images/[front-hash].jpg" 
           alt="[card title] - front" 
           loading="lazy">
      <p class="card-caption">[card title] — front view</p>
    </div>
    <div class="flip-card-back">
      <img src="images/[back-hash].jpg" 
           alt="[card title] - back with annotations" 
           loading="lazy">
      <p class="card-caption">[card title] — back view with annotations</p>
    </div>
  </div>
  <button class="flip-button" aria-label="Flip card to see back">
    <span class="flip-text">See Back</span>
    <span class="flip-icon">↻</span>
  </button>
</div>
```

### CSS Implementation

#### Card Container
```css
.flip-card {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 30px;
  perspective: 1000px; /* Creates 3D space */
}
```

#### Card Inner (Rotation Handler)
```css
.flip-card-inner {
  position: relative;
  width: 100%;
  transition: transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
```

#### Card Faces
```css
.flip-card-front,
.flip-card-back {
  width: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card-back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
}
```

#### Flip Button
```css
.flip-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 200px;
  margin: 16px auto 0;
  padding: 12px 24px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: 1em;
  cursor: pointer;
  transition: all 300ms ease;
  min-height: 44px;
  min-width: 44px;
}

.flip-button:hover {
  background: var(--color-primary);
  color: var(--color-text-white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.flip-button:active {
  transform: translateY(0);
}
```

### JavaScript Implementation

#### Core Flip Logic
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const flipButtons = document.querySelectorAll('.flip-button');
  
  flipButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.flip-card');
      const isFlipped = card.classList.contains('flipped');
      
      card.classList.toggle('flipped');
      
      // Update button text and aria-label
      const flipText = button.querySelector('.flip-text');
      const ariaLabel = isFlipped ? 'Flip card to see back' : 'Flip card to see front';
      const buttonText = isFlipped ? 'See Back' : 'See Front';
      
      button.setAttribute('aria-label', ariaLabel);
      flipText.textContent = buttonText;
    });
  });
});
```

#### Gallery Generation from Catalog
```javascript
async function generateGallery() {
  try {
    const response = await fetch('catalog.json');
    const data = await response.json();
    
    // Pair front and back cards
    const cardPairs = pairCards(data.cards);
    
    // Generate HTML for each pair
    const galleryHTML = cardPairs.map(pair => {
      if (pair.back) {
        return createFlipCard(pair.front, pair.back);
      } else {
        return createStaticCard(pair.front);
      }
    }).join('');
    
    document.getElementById('gallery-container').innerHTML = galleryHTML;
    initializeFlipButtons();
  } catch (error) {
    console.error('Failed to load gallery:', error);
  }
}

function pairCards(cards) {
  const pairs = [];
  const processed = new Set();
  
  cards.forEach(card => {
    if (processed.has(card.id)) return;
    
    const isBack = card.title.includes('(Back)');
    if (isBack) return; // Skip back cards in main loop
    
    const backCard = cards.find(c => 
      c.title === `${card.title} (Back)` && !processed.has(c.id)
    );
    
    pairs.push({
      front: card,
      back: backCard || null
    });
    
    processed.add(card.id);
    if (backCard) processed.add(backCard.id);
  });
  
  return pairs;
}
```

## Error Handling

### Missing Images
- If a front image fails to load, display a placeholder with the card title
- If a back image fails to load, disable the flip button and show a message
- Use `onerror` event handlers on images to detect loading failures

### Animation Performance
- Use `will-change: transform` sparingly and only during active animations
- Apply `transform: translateZ(0)` to trigger GPU acceleration
- Use `contain: layout style paint` for performance isolation

### Browser Compatibility
- Provide fallback for browsers without 3D transform support
- Use feature detection: `@supports (transform-style: preserve-3d)`
- Fallback to fade transition for unsupported browsers

```css
@supports not (transform-style: preserve-3d) {
  .flip-card-inner {
    transition: opacity 300ms ease;
  }
  
  .flip-card.flipped .flip-card-front {
    opacity: 0;
    pointer-events: none;
  }
  
  .flip-card.flipped .flip-card-back {
    opacity: 1;
    position: relative;
    transform: none;
  }
}
```

## Testing Strategy

### Visual Testing
1. Verify flip animation smoothness at 60fps
2. Test on various screen sizes (mobile, tablet, desktop)
3. Verify card aspect ratios are maintained during flip
4. Check that images don't show visual artifacts during rotation

### Interaction Testing
1. Click flip button and verify card rotates
2. Click again and verify card returns to front
3. Test keyboard navigation (Tab to button, Enter/Space to flip)
4. Test touch interaction on mobile devices
5. Verify multiple cards can be flipped independently

### Accessibility Testing
1. Test with screen reader (NVDA, JAWS, VoiceOver)
2. Verify focus indicators are visible
3. Verify aria-labels update correctly
4. Test with keyboard-only navigation
5. Verify reduced motion preference is respected

### Performance Testing
1. Measure animation frame rate during flip
2. Test with multiple cards on page simultaneously
3. Verify no layout shifts during flip
4. Check memory usage with DevTools

### Cross-Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS and iOS)
- Samsung Internet (Android)

## Design Decisions and Rationales

### 3D Transform vs. Fade Transition
**Decision:** Use CSS 3D transforms for the primary flip animation

**Rationale:**
- More engaging and realistic card-flipping experience
- Better mimics physical trading card interaction
- Modern browsers have excellent support
- Fallback to fade ensures universal compatibility

### Button Placement
**Decision:** Place flip button below the card, centered

**Rationale:**
- Doesn't obscure the card images
- Clear call-to-action placement
- Consistent with existing design patterns
- Accessible touch target size (44x44px minimum)

### Animation Duration
**Decision:** 600ms for flip animation

**Rationale:**
- Fast enough to feel responsive
- Slow enough to be visually clear
- Matches existing transition durations in the design system
- Aligns with Material Design motion guidelines

### Independent Card State
**Decision:** Each card maintains its own flip state

**Rationale:**
- Users may want to compare multiple cards
- Allows flexible exploration of the gallery
- Simpler state management
- More intuitive user experience

### Lazy Loading Preservation
**Decision:** Keep lazy loading for both front and back images

**Rationale:**
- Maintains performance benefits
- Back images load when needed (on first flip)
- Reduces initial page load time
- Follows existing optimization strategy

### Reduced Motion Support
**Decision:** Replace flip with fade transition for users with motion preferences

**Rationale:**
- Accessibility requirement (WCAG 2.1)
- Prevents discomfort for motion-sensitive users
- Maintains functionality while respecting preferences
- Uses `prefers-reduced-motion` media query

## Integration with Existing System

### CSS Variables
The flip card components will use existing CSS custom properties:
- `--color-bg-surface` for button background
- `--color-primary` for button text and hover states
- `--color-border-light` for button borders
- `--radius-md` for button border radius
- `--shadow-medium` for button hover shadow
- `--spacing-sm`, `--spacing-md` for consistent spacing

### Typography
- Button text uses existing body font (Georgia, serif)
- Font sizes align with existing scale
- Letter spacing matches design system

### Responsive Behavior
- Cards maintain existing max-width (800px)
- Button scales appropriately on mobile (48x48px touch target)
- Flip animation works consistently across breakpoints

### Accessibility Features
- Maintains existing focus indicator styles
- Uses semantic HTML (`<button>` element)
- Includes ARIA labels for screen readers
- Respects existing skip-link functionality
