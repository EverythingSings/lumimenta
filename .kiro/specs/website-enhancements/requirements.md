# Requirements Document

## Introduction

This document outlines requirements for enhancing the Lumimenta website to improve user engagement, navigation, and information accessibility. The enhancements focus on visual impact, simplified messaging, improved navigation structure, social connectivity, and card availability transparency.

## Glossary

- **Website**: The Lumimenta single-page web application
- **Hero Image**: A prominent, large-format image displayed at the top of the webpage
- **Annotated Card**: A physical trading card photograph with metallic ink rarity annotations
- **Navigation System**: Interactive UI elements that allow users to jump to different sections
- **Sticky Header**: A navigation element that remains visible while scrolling
- **Nostr**: A decentralized social protocol where project updates are shared
- **Card Availability**: Information indicating which cards exist and their current status

## Requirements

### Requirement 1

**User Story:** As a first-time visitor, I want to immediately see what Lumimenta cards look like, so that I can understand the physical artifact concept before reading detailed explanations.

#### Acceptance Criteria

1. WHEN the Website loads, THE Website SHALL display a hero image of an annotated card above all other content
2. THE Website SHALL ensure the hero image is at least 800 pixels wide on desktop viewports
3. THE Website SHALL display the hero image with appropriate alt text describing the card's visual characteristics
4. WHEN a user views the Website on mobile devices, THE Website SHALL scale the hero image to fit the viewport width while maintaining aspect ratio

### Requirement 2

**User Story:** As a visitor scanning the page, I want a concise one-sentence explanation of the project, so that I can quickly grasp the core concept without reading lengthy text.

#### Acceptance Criteria

1. THE Website SHALL display a one-sentence hook immediately below the hero image and before the detailed explanation
2. THE Website SHALL limit the hook text to a maximum of 15 words
3. THE Website SHALL style the hook text to be visually distinct from body text using larger font size or different styling
4. THE Website SHALL ensure the hook text is visible without scrolling on desktop viewports

### Requirement 3

**User Story:** As a user exploring the website, I want clear section navigation, so that I can quickly jump to specific information without scrolling through the entire page.

#### Acceptance Criteria

1. THE Website SHALL provide a navigation menu with links to all major content sections
2. WHEN a user scrolls down the page, THE Website SHALL keep the navigation menu visible at the top of the viewport
3. WHEN a user clicks a navigation link, THE Website SHALL scroll smoothly to the corresponding section
4. THE Website SHALL highlight the current section in the navigation menu based on scroll position
5. WHEN viewed on mobile devices with viewport width less than 768 pixels, THE Website SHALL provide a collapsible navigation menu

### Requirement 4

**User Story:** As a visitor interested in following the project, I want easy access to social and contact links, so that I can connect with the artist and view updates on Nostr.

#### Acceptance Criteria

1. THE Website SHALL display a link to https://www.EverythingSings.Art with descriptive text
2. THE Website SHALL display a link to https://primal.net/EverythingSings with descriptive text indicating it is the Nostr profile
3. THE Website SHALL place social and contact links in a dedicated section or footer area
4. WHEN a user clicks a social or contact link, THE Website SHALL open the link in a new browser tab

### Requirement 5

**User Story:** As a potential collector, I want to see which cards currently exist and their availability status, so that I can understand what is part of the collection and what might be obtainable.

#### Acceptance Criteria

1. THE Website SHALL display a section showing all cards that exist in the collection
2. THE Website SHALL indicate the availability status for each card using clear visual indicators
3. THE Website SHALL display card information including title, rarity, and edition for each card
4. THE Website SHALL source card data from the existing catalog.json file
5. WHEN a card's availability status changes, THE Website SHALL reflect the updated status when catalog.json is updated
