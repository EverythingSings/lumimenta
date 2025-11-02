# Scripts

## Test Scripts

### `lighthouse-test.js`
Legacy Lighthouse test runner with absolute score thresholds.
- Runs single Lighthouse audit
- Checks against fixed thresholds (Performance: 80, Accessibility: 100, etc.)
- Saves reports to `lighthouse-reports/`

### `lhci-server.js`
Simple HTTP server for Lighthouse CI testing.
- Used by `lighthouserc.json` configuration
- Serves static files from project root
- Handles graceful shutdown

## Utility Scripts

### `clean.js`
Cleans up test artifacts and temporary files.

**Usage:**
```bash
npm run clean        # Clean test artifacts
npm run clean:all    # Clean everything including node_modules
```

**Removes:**
- `.lighthouseci/` - Lighthouse CI artifacts
- `coverage/` - Test coverage reports
- `.nyc_output/` - NYC coverage output
- `lighthouse-reports/latest.*` - Latest Lighthouse reports
- `lighthouse-reports/history/` - Historical Lighthouse reports

**Note:** These directories are git-ignored and safe to delete.

## Running Tests

```bash
npm test              # Run unit tests only
npm run test:lhci     # Run Lighthouse CI with budgets
npm run test:all      # Run all tests (unit + Lighthouse CI)
```

## Lighthouse CI vs Legacy Lighthouse

**Lighthouse CI** (`test:lhci`) is recommended because:
- Runs multiple times and averages results (more stable)
- Uses performance budgets instead of arbitrary scores
- Better suited for CI environments
- Tracks specific metrics (LCP, FCP, CLS, etc.)

**Legacy Lighthouse** (`test:lighthouse`) is kept for:
- Quick local checks
- Backward compatibility
- Simple pass/fail testing
