# Implementation Plan

- [x] 1. Create scarcity calculation module with core functions





  - Create `js/scarcity.js` file with ES6 module structure
  - Implement `calculateDistribution(cards)` function that processes card array and returns distribution object with counts and percentages
  - Handle both single-rarity cards (string format) and multi-rarity cards (array format)
  - Implement `calculateForecast(distribution)` function that identifies lowest count color and generates recommendation
  - Add priority logic: when counts are equal, prioritize gold > silver > blue
  - Export all functions for testing and integration
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.5, 3.1, 3.2_

- [x] 1.1 Write unit tests for scarcity calculations


  - Create `js/__tests__/scarcity.test.js` file
  - Write tests for `calculateDistribution` with single-rarity cards
  - Write tests for `calculateDistribution` with multi-rarity cards
  - Write tests for percentage calculations
  - Write tests for `calculateForecast` with various distribution scenarios
  - Write tests for priority logic when counts are equal
  - Verify error handling for invalid input data
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.5, 3.1, 3.2_

- [x] 2. Add HTML structure for scarcity section





  - Add new `<section id="scarcity">` to `index.html` after statistics section
  - Create semantic HTML structure with proper heading hierarchy
  - Add canvas element for chart visualization with `role="img"` and descriptive `aria-label`
  - Create statistics grid with three stat cards (blue, silver, gold)
  - Add forecast panel with recommendation display area
  - Include ARIA labels and roles for accessibility
  - Ensure all interactive elements meet 44x44px minimum touch target size
  - Add skip link support for keyboard navigation
  - _Requirements: 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3. Implement CSS styling for scarcity visualization





  - Add scarcity section styles to `css/style.css`
  - Style chart container with glassmorphism effect using existing backdrop-filter pattern
  - Create responsive grid layout for stat cards (1 col mobile, 2-3 cols desktop)
  - Style stat cards with rarity-specific border colors using CSS custom properties
  - Add hover effects with GPU-accelerated transforms
  - Style forecast panel with gradient background
  - Implement responsive breakpoints at 480px and 768px
  - Add reduced motion support with `@media (prefers-reduced-motion: reduce)`
  - Ensure color contrast meets WCAG 2.1 AA standards (4.5:1 for text)
  - Add visible focus indicators (2px solid outline, 4px offset)
  - _Requirements: 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2_
-

- [x] 4. Implement chart rendering with canvas




  - Create `renderScarcityChart(distribution, container)` function in `scarcity.js`
  - Implement horizontal bar chart visualization using Canvas API
  - Use canonical rarity colors: blue (#4a90e2), silver (#c0c0c0), gold (#c79f60)
  - Add labels showing count and percentage for each bar
  - Implement responsive sizing that adapts to container width
  - Add animation for bar growth using requestAnimationFrame
  - Respect reduced motion preferences (instant render when enabled)
  - Provide fallback to CSS-based visualization if canvas unavailable
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 5.3, 5.4, 6.3_

- [x] 5. Implement statistics animation





  - Create `animateStatistics(distribution, container)` function in `scarcity.js`
  - Implement counter animation using requestAnimationFrame
  - Use easeOutCubic easing function for smooth animation
  - Animate from 0 to target value over 1200ms duration
  - Update both count and percentage displays
  - Respect reduced motion preferences (instant display when enabled)
  - Ensure animation doesn't block main thread
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 5.4, 6.3, 6.5_

- [x] 6. Implement forecast recommendation display





  - Create `updateForecastPanel(forecast, panel)` function in `scarcity.js`
  - Update forecast panel DOM with recommended color name
  - Set color indicator background to match recommended rarity color
  - Display rationale text explaining the recommendation
  - Add fade-in animation for forecast panel (400ms)
  - Respect reduced motion preferences
  - Ensure text is readable with proper contrast
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2_
-

- [x] 7. Integrate with existing catalog system




  - Import `loadCatalog()` function from `catalog.js` in `scarcity.js`
  - Create initialization function that loads catalog data and triggers visualization
  - Add IntersectionObserver to trigger rendering when section scrolls into view
  - Provide fallback for browsers without IntersectionObserver support
  - Ensure no duplicate network requests for catalog data
  - Handle loading states and errors gracefully
  - Display error message if catalog data fails to load
  - _Requirements: 1.1, 6.1, 6.2, 6.4_

-

- [x] 8. Wire up scarcity module to page



  - Add `<script type="module" src="js/scarcity.js" defer></script>` to `index.html`
  - Initialize scarcity visualization on DOMContentLoaded event
  - Connect all event listeners and observers
  - Verify chart renders correctly with real catalog data
  - Test statistics animation triggers on scroll
  - Verify forecast recommendation displays correctly
  - Test responsive behavior at all breakpoints
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 3.1, 3.3, 4.1, 4.2, 4.3_
-

- [x] 9. Add integration and DOM tests







  - Write integration test for full scarcity visualization initialization
  - Test DOM rendering of stat cards with correct values
  - Test forecast panel updates with recommendation
  - Test IntersectionObserver triggers animation correctly
  - Test error handling when catalog fails to load
  - Verify accessibility attributes are present (ARIA labels, roles)
  - Test keyboard navigation through interactive elements
  - _Requirements: 1.1, 2.1, 3.1, 4.5_

-

- [x] 10. Validate performance and accessibility





  - Run Lighthouse audit to verify performance score remains above 70
  - Verify accessibility score remains at 100
  - Test with screen reader to ensure proper announcements
  - Verify keyboard navigation works for all interactive elements
  - Test with reduced motion preferences enabled
  - Verify color contrast ratios meet WCAG AA standards
  - Test on mobile devices to verify touch targets are adequate
  - Measure calculation time to ensure under 100ms
  - _Requirements: 4.4, 4.5, 5.1, 5.2, 5.5, 6.2, 6.3, 6.4, 6.5_
