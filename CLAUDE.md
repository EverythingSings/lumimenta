# Lumimenta Project Documentation

## Overview

Lumimenta is a physical photography trading card project. Cards are printed using a Kodak C210R dye-sublimation printer and hand-annotated with metallic ink. Each card is timestamped with the Bitcoin block height at the time of creation.

## Key Concepts

### Bitcoin Block Height
The numbers written on the back of each card (e.g., `928761`) represent the **Bitcoin block height** at the time the card was created. This serves as a decentralized, immutable timestamp anchoring each physical artifact to a specific moment in blockchain time.

### Rarity System
Cards are annotated with one of three metallic ink colors:
- **Blue**: Most common, standard edition
- **Silver**: Rare, limited edition
- **Gold**: Rarest, one-of-a-kind

### Edition Numbers
Cards are marked with edition numbers like `1/1`, `1/2`, `2/2` indicating:
- `1/1`: Unique one-of-a-kind card
- `1/2`, `2/2`: Part of a limited run of 2 cards

## Catalog Schema (v2)

The catalog (`catalog-v2.json`) uses a card-centric schema where each entry represents one physical card:

```json
{
  "id": "card-001",
  "subject": "Oregon Coast Hillside",
  "location": "Oregon Coast",
  "blockHeight": 920048,
  "rarity": "blue",
  "edition": "1/2",
  "availability": "available",
  "frontImage": "sha256hash",
  "backImage": "sha256hash"
}
```

## Image Naming Convention

Images are stored in the `/images` directory using their SHA256 hash as the filename:
```
images/{sha256hash}.jpg
```

This ensures content-addressable storage and prevents duplicates.

## Adding New Cards

1. Generate SHA256 hash for front and back images
2. Copy images to `/images/{hash}.jpg`
3. Add entry to `catalog-v2.json` with:
   - Unique card ID (e.g., `card-018`)
   - Subject description
   - Location (or "Unknown")
   - Bitcoin block height from card back
   - Rarity (blue/silver/gold)
   - Edition number
   - Front and back image hashes (without extension)

## Deployment

The site auto-deploys to GitHub Pages when pushing to `main` branch. The workflow:
1. Runs tests (`npm run test:all`)
2. Deploys to `gh-pages` branch

## Testing

```bash
npm test           # Run unit tests
npm run test:all   # Run all tests including Lighthouse
```

## File Structure

```
lumimenta/
├── index.html         # Main page
├── catalog-v2.json    # Card catalog (v2 schema)
├── catalog.json       # Legacy catalog (symlink to v2)
├── css/style.css      # Styles
├── js/
│   ├── catalog.js     # Catalog display logic
│   └── scarcity.js    # Scarcity visualization
└── images/            # Card images (SHA256 named)
```
