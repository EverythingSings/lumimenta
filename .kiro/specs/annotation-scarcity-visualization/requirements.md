# Requirements Document

## Introduction

This feature adds visualization and forecasting capabilities for annotation ink color distribution across the Lumimenta trading card collection. The system will display a scarcity curve showing the current distribution of blue, silver, and gold annotations, and provide intelligent recommendations for the next mint's ink color to maintain balanced rarity distribution. This supports the physical-first philosophy by helping guide future card production decisions based on existing scarcity patterns.

## Glossary

- **Annotation System**: The hand-signed markings on physical trading cards using Sharpie oil-based paint pens in blue, silver, or gold ink
- **Scarcity Curve**: A visual representation showing the distribution of annotation ink colors across all minted cards
- **Rarity Distribution**: The count and percentage of cards annotated with each ink color (blue, silver, gold)
- **Forecast Engine**: The calculation logic that recommends the next mint's ink color based on current distribution
- **Multi-Rarity Card**: A card that exists in multiple rarity tiers (e.g., both gold and silver versions)
- **Catalog Data**: The JSON data structure containing all card metadata including rarity information
- **Visualization Component**: The UI element that displays the scarcity curve and distribution statistics

## Requirements

### Requirement 1

**User Story:** As a collector, I want to see a visual representation of the current annotation ink color distribution, so that I can understand the scarcity of each rarity tier

#### Acceptance Criteria

1. WHEN the page loads, THE Visualization Component SHALL fetch and parse the Catalog Data to extract rarity information
2. WHEN rarity data is processed, THE Visualization Component SHALL calculate the count of each annotation ink color including Multi-Rarity Cards
3. WHEN Multi-Rarity Cards are encountered, THE Visualization Component SHALL count each rarity tier separately in the distribution
4. WHEN calculations are complete, THE Visualization Component SHALL display a Scarcity Curve showing the distribution of blue, silver, and gold annotations
5. WHEN the Scarcity Curve is rendered, THE Visualization Component SHALL use the canonical rarity colors (blue: #4a90e2, silver: #c0c0c0, gold: #c79f60)

### Requirement 2

**User Story:** As a collector, I want to see percentage and count statistics for each annotation ink color, so that I can quantify the scarcity of each tier

#### Acceptance Criteria

1. WHEN the Rarity Distribution is calculated, THE Visualization Component SHALL compute the total count of each annotation ink color
2. WHEN counts are computed, THE Visualization Component SHALL calculate the percentage of each annotation ink color relative to the total
3. WHEN statistics are ready, THE Visualization Component SHALL display both count and percentage for each rarity tier
4. WHEN displaying statistics, THE Visualization Component SHALL format percentages to one decimal place
5. WHEN Multi-Rarity Cards exist, THE Visualization Component SHALL include each rarity tier in the total count calculation

### Requirement 3

**User Story:** As a card creator, I want to receive a recommendation for the next mint's annotation ink color, so that I can maintain balanced rarity distribution

#### Acceptance Criteria

1. WHEN the Rarity Distribution is calculated, THE Forecast Engine SHALL identify the annotation ink color with the lowest current count
2. WHEN multiple colors have equal lowest counts, THE Forecast Engine SHALL prioritize in order: gold, silver, blue
3. WHEN the recommendation is determined, THE Forecast Engine SHALL display the suggested annotation ink color for the next mint
4. WHEN displaying the recommendation, THE Forecast Engine SHALL provide a rationale explaining why that color was chosen
5. WHEN the recommendation is shown, THE Forecast Engine SHALL use the canonical rarity color for visual emphasis

### Requirement 4

**User Story:** As a mobile user, I want the scarcity visualization to be responsive and accessible, so that I can view it on any device

#### Acceptance Criteria

1. WHEN the page is viewed on mobile devices, THE Visualization Component SHALL adapt the layout to fit screen widths below 480px
2. WHEN the page is viewed on tablet devices, THE Visualization Component SHALL adapt the layout to fit screen widths between 480px and 768px
3. WHEN the page is viewed on desktop devices, THE Visualization Component SHALL optimize the layout for screen widths above 768px
4. WHEN interactive elements are rendered, THE Visualization Component SHALL ensure all touch targets meet the minimum 44x44px size requirement
5. WHEN the visualization is displayed, THE Visualization Component SHALL maintain WCAG 2.1 AA accessibility standards including keyboard navigation and screen reader support

### Requirement 5

**User Story:** As a user with motion sensitivity, I want animations to respect my preferences, so that I can view the visualization comfortably

#### Acceptance Criteria

1. WHEN the user has enabled reduced motion preferences, THE Visualization Component SHALL disable all animated transitions
2. WHEN the user has enabled reduced motion preferences, THE Visualization Component SHALL use instant state changes instead of animations
3. WHEN the Scarcity Curve is rendered with animations enabled, THE Visualization Component SHALL use smooth transitions with a maximum duration of 500ms
4. WHEN statistics are displayed with animations enabled, THE Visualization Component SHALL use easing functions for counter animations
5. WHEN the page loads, THE Visualization Component SHALL detect the prefers-reduced-motion media query before initializing animations

### Requirement 6

**User Story:** As a collector, I want the scarcity visualization to load quickly and perform well, so that I can access the information without delays

#### Acceptance Criteria

1. WHEN the Visualization Component initializes, THE Annotation System SHALL reuse existing Catalog Data loading mechanisms to avoid duplicate network requests
2. WHEN calculations are performed, THE Forecast Engine SHALL complete all distribution calculations in less than 100ms
3. WHEN the visualization is rendered, THE Visualization Component SHALL use CSS transforms and opacity for GPU-accelerated animations
4. WHEN the page is audited, THE Annotation System SHALL maintain Lighthouse performance scores above 70
5. WHEN the visualization updates, THE Visualization Component SHALL batch DOM operations to prevent layout thrashing
