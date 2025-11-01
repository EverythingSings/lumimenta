---
inclusion: always
---

# Tech Stack

## Core Technologies

- **HTML5**: Semantic markup with comprehensive SEO meta tags
- **CSS3**: Custom styling with gradients, grid layouts, and responsive design
- **Vanilla JavaScript**: No frameworks, pure ES6+ for catalog management
- **JSON**: Data storage for card catalog

## Architecture

- Static website (no build process required)
- Client-side rendering with async data loading
- No backend or database dependencies

## Key Libraries & APIs

- **Fetch API**: For loading catalog data
- **Schema.org structured data**: For SEO optimization
- **Open Graph & Twitter Cards**: For social media sharing

## File Organization

- `index.html`: Single-page application entry point
- `css/style.css`: All styling in one file
- `js/catalog.js`: Catalog loading and statistics display
- `catalog.json`: Card metadata and collection data
- `images/`: Documentation photos of physical cards (SHA-256 hashed filenames)

## Development Workflow

This is a static site with no build process. To work on it:

1. Edit files directly
2. Open `index.html` in a browser to preview
3. Use a local server for testing (e.g., `python -m http.server` or VS Code Live Server)

## Deployment

Static hosting (GitHub Pages). The site is served from the root directory with a custom domain configured via `CNAME` file.

## Browser Compatibility

Modern browsers with ES6+ support. Uses CSS Grid, Flexbox, and async/await.
