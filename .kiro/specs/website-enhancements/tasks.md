# Implementation Plan

- [x] 1. Add hero flip card section to HTML





  - Insert new hero section between header and first content section
  - Reuse existing flip-card component structure with Oregon Beach Scenes (front: 8e587a9a699dd2035b5b63727396587a7ff9979eb029f8bf57caeb4d6aa60f83, back: 91304d4d005b21135e6361f489320828fbe974ea8517c94b9dd0402f46df0252)
  - Add hero hook text below flip card: "Photography that exists only as physical objects—never as digital files."
  - Use loading="eager" for hero card images (not lazy loaded)
  - Include proper semantic HTML and ARIA labels
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_
-

- [x] 2. Implement hero section CSS styling




  - Add .hero and .hero-hook styles
  - Add .hero-flip-card modifier for hero-specific sizing (max-width 900px desktop, 100% mobile)
  - Reuse existing flip-card styles (no duplication needed)
  - Implement responsive typography for hook text (1.3em mobile, 1.5em tablet, 1.8em desktop)
  - Center hero flip card with auto margins
  - _Requirements: 1.1, 1.2, 1.4, 2.3, 2.4_

- [x] 3. Create sticky navigation HTML structure





  - Add nav element with sticky-nav class before main content
  - Implement hamburger menu button for mobile
  - Create navigation menu with links to all major sections (Concept, Rarity, Collection, Gallery, Contact)
  - Add proper ARIA attributes for accessibility
  - Ensure all target sections have corresponding IDs
  - _Requirements: 3.1, 3.3, 3.5_
-

- [x] 4. Implement sticky navigation CSS




  - Add fixed positioning with z-index: 1000
  - Implement glassmorphism background with backdrop-filter
  - Create mobile hamburger menu styles (< 768px viewport)
  - Create desktop horizontal menu layout (>= 768px viewport)
  - Add active section highlighting styles
  - Implement smooth transitions and hover effects
  - Ensure touch-friendly tap targets (48x48px mobile, 44x44px desktop)
  - _Requirements: 3.1, 3.2, 3.5_
- [x] 5. Implement sticky navigation JavaScript functionality




- [ ] 5. Implement sticky navigation JavaScript functionality

  - Add scroll position tracking using IntersectionObserver
  - Implement active section highlighting based on scroll position
  - Add smooth scroll behavior for navigation link clicks
  - Create mobile menu toggle functionality
  - Add click-outside-to-close behavior for mobile menu
  - Implement debounced scroll handling for performance
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Create contact and social links section





  - Add new "CONNECT" section before footer with id="contact"
  - Add link to https://www.EverythingSings.Art with descriptive text and icon
  - Add link to https://primal.net/EverythingSings with descriptive text and icon
  - Implement target="_blank" and rel="noopener noreferrer" for security
  - Add proper ARIA labels and semantic HTML
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. Implement contact section CSS styling





  - Style contact links as cards with glassmorphism effect
  - Implement responsive layout (vertical on mobile, horizontal on desktop)
  - Add hover effects (translateY, enhanced shadow)
  - Ensure minimum touch target sizes (48x48px mobile, 44x44px desktop)
  - Add icons using emoji or unicode characters
  - _Requirements: 4.1, 4.2, 4.3_
- [x] 8. Extend catalog.json with availability data




- [ ] 8. Extend catalog.json with availability data

  - Add "availability" field to each card object
  - Set appropriate values: "available", "collected", or "unknown"
  - Maintain backward compatibility (default to "unknown" if field missing)
  - _Requirements: 5.5_

- [x] 9. Implement card availability display function





  - Create displayAvailability() function in catalog.js
  - Generate availability grid HTML from catalog data
  - Display card image, title, rarity, edition, and availability badge
  - Implement lazy loading for card images
  - Apply status-based badge styling (green for available, gray for collected, orange for unknown)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10. Implement availability grid CSS styling






  - Create responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
  - Style availability cards with glassmorphism background
  - Add card image styling with aspect-ratio and object-fit
  - Create availability badge styles with color coding
  - Implement hover effects (scale, shadow)
  - Position badges absolutely at bottom-right of cards
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 11. Update section IDs and navigation targets




  - Ensure all major sections have proper IDs matching navigation links
  - Add id="concept" to concept section
  - Add id="rarity" to rarity section
  - Verify id="collection" exists on collection section
  - Verify id="gallery" exists on gallery section
  - Verify id="contact" exists on new contact section
  - _Requirements: 3.3_
-

- [x] 12. Update SEO meta tags




  - Update meta description to mention new features
  - Ensure hero image has descriptive alt text
  - Verify semantic heading hierarchy is maintained
  - Update Open Graph image if needed
  - _Requirements: 1.3_
