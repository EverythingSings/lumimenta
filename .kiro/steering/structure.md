---
inclusion: always
---

# Project Structure

## Directory Layout

```
/
├── index.html          # Main single-page application
├── catalog.json        # Card metadata and collection data
├── CNAME              # Custom domain configuration
├── README.md          # Project documentation
├── css/
│   └── style.css      # All styles in one file
├── js/
│   └── catalog.js     # Catalog management and stats
└── images/            # Documentation photos (SHA-256 named)
```

## File Naming Conventions

- **HTML/CSS/JS**: Lowercase with standard extensions
- **Images**: SHA-256 hash filenames (e.g., `a6cf6fc02dac25b73eaaa0919c0fac91b9d613ed768bc04a9ef6216a9f828d50.jpg`)
- **Config files**: Uppercase for root-level configs (CNAME, README.md)

## Code Organization

### HTML Structure
- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- Comprehensive SEO meta tags in `<head>`
- Structured data using JSON-LD
- Inline image gallery with descriptive captions

### CSS Architecture
- Single stylesheet approach
- Mobile-first responsive design with media queries
- CSS Grid for layout (rarity cards, stats)
- Dark theme with gradient accents
- Rarity-specific color coding (blue: #4a90e2, silver: #c0c0c0, gold: #c79f60)

### JavaScript Patterns
- Async/await for data loading
- Pure functions for calculations
- DOM manipulation after DOMContentLoaded
- Error handling with try/catch

## Data Model

### catalog.json Schema
```json
{
  "cards": [
    {
      "id": number,
      "title": string,
      "description": string,
      "location": string,
      "blockHeight": number,
      "rarity": "blue" | "silver" | "gold",
      "edition": string,
      "imageHash": string
    }
  ]
}
```

## Design Patterns

- **Single-page application**: All content on one page
- **Static data**: No dynamic backend, all data in JSON
- **Documentation-first**: Images are documentation of physical artifacts
- **Minimalist**: No frameworks, no build tools, no dependencies
