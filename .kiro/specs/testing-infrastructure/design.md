# Testing Infrastructure Design

## Overview

This design document outlines the testing infrastructure for the Lumimenta project. The solution provides automated testing for the static site's JavaScript functionality while maintaining the project's philosophy of simplicity and zero build dependencies. The testing system will use Vitest as the test runner, chosen for its native ES modules support, fast execution, and excellent developer experience without requiring complex configuration.

**Design Rationale**: Vitest was selected over alternatives like Jest because it works seamlessly with modern ES modules, requires minimal configuration, and provides built-in coverage reporting. Unlike Jest, Vitest doesn't require Babel transforms for ES6+ code, aligning with the project's no-build-process philosophy for the main application.

## Architecture

### Testing Layers

The testing infrastructure consists of four distinct layers:

1. **Unit Tests**: Test individual functions in isolation (calculations, data transformations)
2. **Integration Tests**: Test data loading and error handling with real JSON files
3. **DOM Tests**: Test UI updates and rendering logic using JSDOM
4. **Performance Tests**: Automated Lighthouse audits for performance, accessibility, SEO, and best practices

### Test Environment

- **Runtime**: Node.js with native ES modules support
- **Test Framework**: Vitest (fast, modern, zero-config)
- **DOM Simulation**: JSDOM (lightweight DOM implementation for Node.js)
- **Coverage Tool**: Vitest's built-in coverage via c8/v8
- **Performance Auditing**: Lighthouse CLI for automated performance testing
- **File Structure**: Tests colocated near source files in `js/__tests__/` directory

**Design Rationale**: Keeping tests in a `__tests__` subdirectory maintains clean separation while keeping test files close to the code they test. This is a common pattern that makes tests easy to find and maintain.

### Current Lighthouse Usage

The project currently has ad-hoc Lighthouse reports in the root directory:
- `lighthouse-report-current.report.json/html`
- `lighthouse-report-fractal.report.json/html`
- `lighthouse-report-hero.report.json/html`
- `lighthouse-phase1-2.report.json/html`
- `perf-test-report.json`
- `throttled-report.json`

**Design Rationale**: These reports indicate performance testing is already valued but lacks automation and consistency. The testing infrastructure will formalize this process with automated Lighthouse runs, baseline thresholds, and historical tracking.

## Components and Interfaces

### Test Runner Configuration

**File**: `vitest.config.js`

```javascript
export default {
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['js/**/*.js'],
      exclude: ['js/__tests__/**']
    }
  }
}
```

**Design Rationale**: Using JSDOM as the default environment allows all tests to access DOM APIs without configuration overhead. The `globals` option makes test functions available without imports, reducing boilerplate.

### Test File Organization

```
js/
├── catalog.js                    # Source code
└── __tests__/
    ├── catalog.unit.test.js      # Unit tests for pure functions
    ├── catalog.integration.test.js # Integration tests for data loading
    └── catalog.dom.test.js       # DOM manipulation tests
```

### Package Configuration

**File**: `package.json` (new file)

```json
{
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:lighthouse": "node scripts/lighthouse-test.js",
    "test:all": "npm test && npm run test:lighthouse"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "lighthouse": "^11.0.0",
    "http-server": "^14.0.0"
  }
}
```

**Design Rationale**: The `"type": "module"` field enables native ES modules, allowing the test files to import from `catalog.js` using the same syntax as the browser. Multiple test scripts provide flexibility for different workflows (single run, watch mode, coverage, UI). The `test:all` command runs both unit/integration tests and performance audits for comprehensive validation.

## Data Models

### Test Data Fixtures

**File**: `js/__tests__/fixtures/test-catalog.json`

```json
{
  "cards": [
    {
      "id": 1,
      "title": "Test Card Blue",
      "description": "Test description",
      "location": "Test Location",
      "blockHeight": 800000,
      "rarity": "blue",
      "edition": "1/100",
      "imageHash": "test-hash-blue"
    },
    {
      "id": 2,
      "title": "Test Card Silver",
      "description": "Test description",
      "location": "Test Location",
      "blockHeight": 800001,
      "rarity": "silver",
      "edition": "1/10",
      "imageHash": "test-hash-silver"
    },
    {
      "id": 3,
      "title": "Test Card Gold",
      "description": "Test description",
      "location": "Test Location",
      "blockHeight": 800002,
      "rarity": "gold",
      "edition": "1/1",
      "imageHash": "test-hash-gold"
    }
  ]
}
```

**Design Rationale**: Test fixtures provide controlled, predictable data for testing. Having one card of each rarity allows comprehensive testing of rarity distribution calculations and styling logic.

### Invalid Data Fixtures

Additional fixtures for error handling tests:

- `malformed.json`: Invalid JSON syntax
- `missing-fields.json`: Valid JSON but missing required card fields
- `invalid-rarity.json`: Cards with unsupported rarity values

**Design Rationale**: Separate fixtures for error cases make tests more readable and maintainable than inline test data.

## Lighthouse Performance Testing

### Automated Performance Audits

**File**: `scripts/lighthouse-test.js`

This script will:
1. Start a local HTTP server on port 8080
2. Run Lighthouse against `http://localhost:8080`
3. Generate JSON and HTML reports in `lighthouse-reports/` directory
4. Compare scores against baseline thresholds
5. Fail the test if scores drop below thresholds
6. Clean up server process

**Baseline Thresholds**:
```javascript
{
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 95
}
```

**Design Rationale**: These thresholds are set high to maintain the project's excellent performance characteristics. The static site architecture should easily achieve these scores, and any regression indicates a real problem.

### Lighthouse Configuration

**File**: `lighthouse.config.js`

```javascript
export default {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1
    }
  }
}
```

**Design Rationale**: Desktop configuration matches the primary use case for a documentation/catalog site. Throttling is minimal since the site is optimized for modern connections. Mobile audits can be added as a separate test if needed.

### Report Organization

```
lighthouse-reports/
├── latest.report.json          # Most recent run
├── latest.report.html          # Human-readable latest
├── baseline.json               # Reference scores
└── history/
    ├── 2024-11-01-12-30.json  # Timestamped historical runs
    └── 2024-11-01-12-30.html
```

**Design Rationale**: Keeping historical reports allows tracking performance trends over time. The `latest` files provide quick access to current status, while timestamped files in `history/` enable regression analysis.

### Migrating Existing Reports

Current ad-hoc reports in the root directory will be:
1. Moved to `lighthouse-reports/archive/` for reference
2. Analyzed to establish baseline thresholds
3. Replaced by automated, consistent reporting

**Design Rationale**: Preserving existing reports maintains historical context while cleaning up the root directory. The archive serves as documentation of past performance investigations.

## Testing Strategy

### Unit Testing Approach

**Target Functions** (to be extracted/refactored from catalog.js if needed):
- `calculateTotalCards(cards)`: Returns total card count
- `calculateRarityDistribution(cards)`: Returns count by rarity
- `calculateStatistics(cards)`: Returns aggregated stats object
- `formatCardData(card)`: Transforms raw card data for display

**Test Coverage Goals**:
- 100% coverage of calculation functions
- All rarity types tested (blue, silver, gold)
- Edge cases: empty arrays, single card, all same rarity

**Design Rationale**: Pure calculation functions are easiest to test and provide the highest confidence. Extracting these functions from the main module (if they're currently inline) improves testability without changing behavior.

### Integration Testing Approach

**Test Scenarios**:
1. Load valid catalog.json and verify data structure
2. Load malformed JSON and verify error handling
3. Load catalog with missing image references
4. Load catalog with invalid rarity values

**Mock Strategy**: Use real file system access via Node.js `fs` module for authentic integration testing. No mocking of fetch API needed since tests run in Node.js.

**Design Rationale**: Integration tests should use real file I/O to catch actual issues with JSON parsing and file access. Mocking would reduce confidence in these critical paths.

### DOM Testing Approach

**Test Scenarios**:
1. Statistics display updates when data loads
2. Rarity cards render with correct styling classes
3. Error messages display on load failure
4. Card grid populates with correct number of elements

**JSDOM Setup**:
```javascript
import { beforeEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = `
    <div id="stats-container"></div>
    <div id="rarity-cards"></div>
    <div id="error-message"></div>
  `;
});
```

**Design Rationale**: JSDOM provides a lightweight DOM implementation that's sufficient for testing element creation, class manipulation, and text content updates. It's faster than launching a real browser and works in CI environments without additional setup.

## Error Handling

### Test Failure Reporting

Vitest provides detailed failure output including:
- Expected vs actual values
- Stack traces with line numbers
- Diff visualization for objects and arrays

### Test Timeout Configuration

```javascript
// In vitest.config.js
export default {
  test: {
    testTimeout: 5000, // 5 seconds max per test
  }
}
```

**Design Rationale**: The 5-second timeout ensures tests fail fast if they hang, meeting Requirement 1.4 for quick test execution.

### Coverage Thresholds

```javascript
// In vitest.config.js
export default {
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
}
```

**Design Rationale**: Setting coverage thresholds ensures the test suite maintains quality over time. The 80% target balances thoroughness with pragmatism, allowing some uncovered edge cases while ensuring core functionality is tested.

## Deployment Integration

### Pre-deployment Test Hook

**File**: `.github/workflows/deploy.yml` (if using GitHub Actions)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:all  # Runs both Vitest and Lighthouse
      - name: Upload Lighthouse Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-report
          path: lighthouse-reports/latest.report.html
      - name: Deploy to GitHub Pages
        if: success()
        # deployment steps here
```

**Design Rationale**: Running tests in CI before deployment prevents broken code from reaching production. The `if: success()` condition ensures deployment only proceeds when all tests pass, satisfying Requirement 5.2.

### Manual Override

For emergency deployments, developers can:
1. Push directly to the `gh-pages` branch (bypassing CI)
2. Use `git push --no-verify` to skip local pre-commit hooks
3. Temporarily disable the workflow in GitHub Actions settings

**Design Rationale**: Emergency overrides should be possible but require deliberate action, reducing accidental bypasses while allowing flexibility for critical fixes.

## Performance Considerations

### Test Execution Speed

**Optimization Strategies**:
- Run tests in parallel (Vitest default behavior)
- Use `--no-coverage` flag during development for faster feedback
- Minimize file I/O in unit tests
- Use `beforeAll` instead of `beforeEach` for expensive setup

**Expected Performance**:
- Unit tests: < 1 second
- Integration tests: < 2 seconds
- DOM tests: < 2 seconds
- Vitest suite total: < 5 seconds (meeting Requirement 1.4)
- Lighthouse audit: ~10-15 seconds (run separately, not part of rapid iteration)

**Design Rationale**: Fast test execution encourages developers to run tests frequently. Vitest's parallel execution and fast startup time make this achievable even as the test suite grows. Lighthouse runs separately since it's slower and typically only needed before commits/deployment.

### Coverage Report Generation

Coverage reports add ~2-3 seconds to test execution. The design separates coverage into a dedicated command (`npm run test:coverage`) so developers can skip it during rapid iteration.

**Design Rationale**: Developers need fast feedback during development but detailed coverage analysis before commits. Separate commands optimize for both workflows.

## Development Workflow

### Running Tests During Development

```bash
# Run unit/integration/DOM tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open interactive UI
npm run test:ui

# Run Lighthouse performance audit
npm run test:lighthouse

# Run all tests (unit + performance)
npm run test:all
```

### Writing New Tests

1. Create test file in `js/__tests__/` with `.test.js` extension
2. Import functions to test from `catalog.js`
3. Write test cases using `describe` and `it` blocks
4. Run tests with `npm test`
5. Check coverage with `npm run test:coverage`

**Design Rationale**: This workflow requires zero configuration after initial setup. Developers can focus on writing tests rather than configuring tools.

## Migration Path

### Phase 1: Setup Infrastructure
- Install dependencies
- Create configuration files
- Set up test directory structure

### Phase 2: Extract Testable Functions
- Refactor `catalog.js` to export calculation functions
- Maintain backward compatibility with existing code
- No changes to HTML or user-facing behavior

### Phase 3: Write Tests
- Start with unit tests (highest ROI)
- Add integration tests for data loading
- Add DOM tests for UI updates
- Create Lighthouse automation script

### Phase 4: Organize Existing Reports
- Move existing Lighthouse reports to archive
- Analyze historical reports to set baseline thresholds
- Clean up root directory

### Phase 5: CI Integration
- Add GitHub Actions workflow
- Configure deployment gates
- Document override procedures

**Design Rationale**: Phased implementation allows incremental progress and early validation. Each phase delivers value independently, reducing risk.

## Alternatives Considered

### Jest vs Vitest
- **Jest**: More mature, larger ecosystem, but requires Babel for ES modules
- **Vitest**: Native ES modules, faster, better DX, but newer
- **Decision**: Vitest chosen for ES module support and speed

### Playwright vs JSDOM
- **Playwright**: Real browser testing, more accurate, but slower and heavier
- **JSDOM**: Lightweight, fast, sufficient for current needs
- **Decision**: JSDOM chosen for speed and simplicity; can add Playwright later for E2E tests if needed

### Test File Location
- **Option 1**: Separate `test/` directory at root
- **Option 2**: Colocated `__tests__/` subdirectories
- **Decision**: Colocated tests chosen for easier navigation and maintenance

**Design Rationale**: These decisions prioritize simplicity, speed, and alignment with the project's no-build-process philosophy while leaving room for future expansion if needs change.
