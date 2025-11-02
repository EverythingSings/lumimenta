---
inclusion: always
---

# Product Rules

## Core Philosophy

Lumimenta is a physical-first photography trading card project. Physical cards are the primary artifacts; this website documents them.

## Critical Constraints

- Never suggest digital-first workflows, cloud storage, or digital asset management
- Images in `/images/` document physical cards - they are not source files
- Never suggest features that undermine physical scarcity:
  - No unlimited digital copies or downloads
  - No NFTs or blockchain tokens
  - No digital-only editions
- Use Bitcoin block heights for timestamps, never dates or centralized systems
- Maintain static site architecture - no backend, no database, no user accounts

## Rarity System (Immutable)

Three tiers only. Never add, remove, or modify:

- `"blue"` - Standard edition (`#4a90e2`)
- `"silver"` - Limited edition (`#c0c0c0`)
- `"gold"` - One-of-a-kind (`#c79f60`)

Rarity values must be lowercase strings. Hex colors must match exactly.

### Multi-Rarity Cards

Some cards may have multiple rarity tiers (e.g., a card with both gold and silver versions):
- Use array format: `"rarity": ["gold", "silver"]`
- Display format: "Gold & Silver"
- Each rarity counts separately in statistics
- Example: Oregon Beach Scenes card with gold 1/2 and silver 1/2

## Data Integrity Rules

- `id` - Sequential positive integers, never reuse deleted IDs
- `rarity` - Must be `"blue"`, `"silver"`, or `"gold"` (lowercase only), OR array of these values
- `blockHeight` - Valid Bitcoin block number (positive integer)
- `imageHash` - 64-character SHA-256 hex string, immutable once set
- `availability` - Optional field: `"available"`, `"collected"`, or `"unknown"` (default)

## Availability Tracking

Cards can have three availability states:
- **Available**: Card is available for trade/acquisition
- **Collected**: Card is in someone's collection (not available)
- **Unknown**: Availability status not specified or uncertain

This system allows collectors to see which cards exist and their current status without undermining scarcity.

## Content Guidelines

Emphasize physical ownership, tangibility, scarcity, and uniqueness. Reference decentralized systems positively. Avoid language suggesting mass production, digital reproduction, or infinite availability.

### Key Messaging Themes

- **Physical-first**: "Never exists digitally—only as tangible artifacts"
- **Scarcity**: Edition numbers (1/2, 2/2, 1/1), limited prints
- **Decentralization**: Bitcoin block heights, Nostr for documentation
- **Tangibility**: Hand-signed, metallic ink annotations, laminated cards
- **Documentation vs. Artwork**: Website shows documentation photos, not the actual artwork

### Prohibited Language

- "Download", "save", "digital copy", "unlimited"
- "Mass production", "print on demand" (except in technical specs)
- "Cloud storage", "backup", "digital archive"
- References to centralized platforms or services
- Anything suggesting cards can be replicated digitally

## Technical Specifications (Canonical)

When describing the physical cards, use these exact specifications:

- **Format**: Physical trading card prints
- **Printer**: Kodak C210R 4-pass dye-sublimation
- **Lamination**: Professional laminate coating for protection
- **Annotation**: Sharpie oil-based paint pens (blue, silver, or gold)
- **Archival Quality**: Dye-sublimation + lamination + oil-based ink
- **Timestamp**: Bitcoin block height
- **Edition Marking**: Hand-signed with version number
- **Digital Existence**: None—photos never saved as files
- **Documentation**: Photographs of cards posted online for catalog purposes

## User Experience Principles

- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Performance**: Fast load times, optimized images, minimal JavaScript
- **Progressive Enhancement**: Core content accessible without JavaScript
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Reduced Motion**: Respect user preferences for reduced motion
- **Touch-Friendly**: Minimum 44x44px touch targets on all interactive elements
