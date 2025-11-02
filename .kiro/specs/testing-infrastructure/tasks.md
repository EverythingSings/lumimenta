# Implementation Plan

- [x] 1. Set up testing infrastructure and configuration





  - Create `package.json` with type: "module" and test scripts
  - Create `vitest.config.js` with JSDOM environment and coverage settings
  - Create `lighthouse.config.js` with desktop configuration and thresholds
  - Create directory structure: `js/__tests__/`, `js/__tests__/fixtures/`, `scripts/`, `lighthouse-reports/`
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 2. Create test data fixtures





  - Create `js/__tests__/fixtures/test-catalog.json` with sample cards (one of each rarity)
  - Create `js/__tests__/fixtures/malformed.json` with invalid JSON syntax
  - Create `js/__tests__/fixtures/missing-fields.json` with incomplete card data
  - Create `js/__tests__/fixtures/invalid-rarity.json` with unsupported rarity values
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
-

- [x] 3. Refactor catalog.js for testability




  - Extract calculation functions: `calculateTotalCards()`, `calculateRarityDistribution()`, `calculateStatistics()`
  - Extract data processing function: `formatCardData()`
  - Export functions for testing while maintaining backward compatibility
  - Ensure no changes to existing HTML or user-facing behavior
  - _Requirements: 1.2, 1.3_

- [x] 4. Implement unit tests for calculation functions





  - Create `js/__tests__/catalog.unit.test.js`
  - Write tests for `calculateTotalCards()` with various card arrays (empty, single, multiple)
  - Write tests for `calculateRarityDistribution()` covering all rarity types (blue, silver, gold)
  - Write tests for `calculateStatistics()` verifying aggregated stats object
  - Write tests for `formatCardData()` validating data transformation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 5. Implement integration tests for data loading





  - Create `js/__tests__/catalog.integration.test.js`
  - Write test for loading valid catalog.json and verifying data structure
  - Write test for loading malformed JSON and verifying error handling
  - Write test for handling missing image references
  - Write test for handling invalid rarity values
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 6. Implement DOM manipulation tests





  - Create `js/__tests__/catalog.dom.test.js`
  - Set up JSDOM environment with beforeEach hook creating DOM structure
  - Write test verifying statistics display elements update with correct values
  - Write test verifying rarity cards render with appropriate styling classes
  - Write test verifying error messages display on data loading failure
  - Write test verifying card grid populates with correct number of elements
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 7. Create Lighthouse automation script






  - Create `scripts/lighthouse-test.js` that starts local HTTP server
  - Implement Lighthouse audit execution against localhost:8080
  - Implement baseline threshold comparison (performance: 90, accessibility: 95, best-practices: 90, seo: 95)
  - Generate JSON and HTML reports in `lighthouse-reports/` directory
  - Implement server cleanup and exit code handling (0 for pass, 1 for fail)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
-

- [x] 8. Organize existing Lighthouse reports





  - Create `lighthouse-reports/archive/` directory
  - Move existing reports from root to archive: `lighthouse-report-*.json/html`, `perf-test-report.json`, `throttled-report.json`
  - Analyze archived reports to establish baseline scores
  - Create `lighthouse-reports/baseline.json` with reference scores
  - Update `.gitignore` to exclude `lighthouse-reports/latest.*` and `lighthouse-reports/history/`
  - _Requirements: 4.1, 4.2_

- [x] 9. Add coverage reporting configuration









  - Configure coverage thresholds in `vitest.config.js` (lines: 80%, functions: 80%, branches: 75%, statements: 80%)
  - Configure coverage output formats (text for terminal, HTML for detailed view)
  - Configure coverage include/exclude patterns to focus on `js/catalog.js`
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
-

- [x] 10. Create CI/CD workflow for automated testing




  - Create `.github/workflows/test.yml` that runs on pull requests
  - Add job steps: checkout, setup Node.js, install dependencies, run `npm run test:all`
  - Add step to upload Lighthouse report as artifact
  - Configure job to fail if any tests fail
  - _Requirements: 5.1, 5.2, 5.3_
-

- [x] 11. Create deployment workflow with test gates








  - Create `.github/workflows/deploy.yml` that runs on push to main branch
  - Add test execution before deployment steps
  - Configure deployment to only proceed if tests pass
  - Add manual workflow_dispatch trigger for emergency override
  - Document override procedure in README or deployment docs
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 12. Update project documentation









  - Add testing section to README.md explaining how to run tests
  - Document test commands: `npm test`, `npm run test:watch`, `npm run test:coverage`, `npm run test:lighthouse`, `npm run test:all`
  - Document coverage report location and how to view HTML reports
  - Document Lighthouse report location and interpretation
  - Document CI/CD testing workflow and emergency override procedure
  - _Requirements: 3.1, 3.4, 5.4_
