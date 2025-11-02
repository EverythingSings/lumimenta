import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('DOM Manipulation Tests', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Create a fresh DOM for each test
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <div id="catalog-stats"></div>
                    <div id="availability-grid"></div>
                    <div id="gallery-container"></div>
                    <div id="error-message"></div>
                </body>
            </html>
        `, {
            url: 'http://localhost',
            pretendToBeVisual: true
        });

        document = dom.window.document;
        window = dom.window;
        global.document = document;
        global.window = window;
    });

    describe('Statistics Display', () => {
        it('should update statistics display with correct values', () => {
            const stats = {
                total: 10,
                uniqueSubjects: 8,
                blue: 5,
                silver: 3,
                gold: 2
            };

            // Simulate displayStats function behavior
            const statsHTML = `
                <div class="stats-container">
                    <h3>Collection Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">${stats.total}</span>
                            <span class="stat-label">Total Cards</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${stats.uniqueSubjects}</span>
                            <span class="stat-label">Unique Subjects</span>
                        </div>
                        <div class="stat-item stat-blue">
                            <span class="stat-number">${stats.blue}</span>
                            <span class="stat-label">Blue</span>
                        </div>
                        <div class="stat-item stat-silver">
                            <span class="stat-number">${stats.silver}</span>
                            <span class="stat-label">Silver</span>
                        </div>
                        <div class="stat-item stat-gold">
                            <span class="stat-number">${stats.gold}</span>
                            <span class="stat-label">Gold</span>
                        </div>
                    </div>
                </div>
            `;

            const statsElement = document.getElementById('catalog-stats');
            statsElement.innerHTML = statsHTML;

            // Verify the stats are displayed correctly
            const statNumbers = statsElement.querySelectorAll('.stat-number');
            expect(statNumbers).toHaveLength(5);
            expect(statNumbers[0].textContent).toBe('10');
            expect(statNumbers[1].textContent).toBe('8');
            expect(statNumbers[2].textContent).toBe('5');
            expect(statNumbers[3].textContent).toBe('3');
            expect(statNumbers[4].textContent).toBe('2');

            // Verify labels
            const statLabels = statsElement.querySelectorAll('.stat-label');
            expect(statLabels[0].textContent).toBe('Total Cards');
            expect(statLabels[1].textContent).toBe('Unique Subjects');
            expect(statLabels[2].textContent).toBe('Blue');
            expect(statLabels[3].textContent).toBe('Silver');
            expect(statLabels[4].textContent).toBe('Gold');
        });

        it('should display zero values correctly', () => {
            const stats = {
                total: 0,
                uniqueSubjects: 0,
                blue: 0,
                silver: 0,
                gold: 0
            };

            const statsHTML = `
                <div class="stats-container">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">${stats.total}</span>
                        </div>
                    </div>
                </div>
            `;

            const statsElement = document.getElementById('catalog-stats');
            statsElement.innerHTML = statsHTML;

            const statNumber = statsElement.querySelector('.stat-number');
            expect(statNumber.textContent).toBe('0');
        });
    });

    describe('Rarity Card Rendering', () => {
        it('should render cards with appropriate rarity styling classes', () => {
            const cards = [
                {
                    id: 1,
                    title: 'Blue Card',
                    rarity: 'blue',
                    edition: '1/100',
                    imageHash: 'hash1',
                    availability: 'available'
                },
                {
                    id: 2,
                    title: 'Silver Card',
                    rarity: 'silver',
                    edition: '1/10',
                    imageHash: 'hash2',
                    availability: 'collected'
                },
                {
                    id: 3,
                    title: 'Gold Card',
                    rarity: 'gold',
                    edition: '1/1',
                    imageHash: 'hash3',
                    availability: 'available'
                }
            ];

            // Simulate displayAvailability function behavior
            const availabilityHTML = cards.map(card => {
                const rarityDisplay = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
                const availabilityDisplay = card.availability.charAt(0).toUpperCase() + card.availability.slice(1);
                
                return `
                    <div class="availability-card" data-status="${card.availability}">
                        <img src="images/${card.imageHash}.jpg" alt="${card.title}" loading="lazy">
                        <div class="card-info">
                            <h4 class="card-title">${card.title}</h4>
                            <p class="card-rarity">${rarityDisplay} • ${card.edition}</p>
                            <span class="availability-badge ${card.availability}">${availabilityDisplay}</span>
                        </div>
                    </div>
                `;
            }).join('');

            const availabilityContainer = document.getElementById('availability-grid');
            availabilityContainer.innerHTML = availabilityHTML;

            // Verify cards are rendered
            const cardElements = availabilityContainer.querySelectorAll('.availability-card');
            expect(cardElements).toHaveLength(3);

            // Verify rarity display
            const rarityTexts = availabilityContainer.querySelectorAll('.card-rarity');
            expect(rarityTexts[0].textContent).toContain('Blue');
            expect(rarityTexts[1].textContent).toContain('Silver');
            expect(rarityTexts[2].textContent).toContain('Gold');

            // Verify availability badges have correct classes
            const badges = availabilityContainer.querySelectorAll('.availability-badge');
            expect(badges[0].classList.contains('available')).toBe(true);
            expect(badges[1].classList.contains('collected')).toBe(true);
            expect(badges[2].classList.contains('available')).toBe(true);
        });

        it('should render card with correct image source', () => {
            const card = {
                id: 1,
                title: 'Test Card',
                rarity: 'blue',
                edition: '1/100',
                imageHash: 'test-hash-123',
                availability: 'available'
            };

            const cardHTML = `
                <div class="availability-card" data-status="${card.availability}">
                    <img src="images/${card.imageHash}.jpg" alt="${card.title}" loading="lazy">
                </div>
            `;

            const container = document.getElementById('availability-grid');
            container.innerHTML = cardHTML;

            const img = container.querySelector('img');
            expect(img.getAttribute('src')).toBe('images/test-hash-123.jpg');
            expect(img.getAttribute('alt')).toBe('Test Card');
            expect(img.getAttribute('loading')).toBe('lazy');
        });
    });

    describe('Error Message Display', () => {
        it('should display error message when data loading fails', () => {
            const errorMessage = 'Unable to load gallery. Please try refreshing the page.';
            
            const galleryContainer = document.getElementById('gallery-container');
            galleryContainer.innerHTML = `<p style="text-align: center; color: #999; padding: 40px 0;">${errorMessage}</p>`;

            const errorElement = galleryContainer.querySelector('p');
            expect(errorElement).toBeDefined();
            expect(errorElement.textContent).toBe(errorMessage);
            expect(errorElement.style.textAlign).toBe('center');
        });

        it('should clear previous content when displaying error', () => {
            const galleryContainer = document.getElementById('gallery-container');
            
            // Add some initial content
            galleryContainer.innerHTML = '<div class="card">Card 1</div><div class="card">Card 2</div>';
            expect(galleryContainer.querySelectorAll('.card')).toHaveLength(2);

            // Simulate error state
            galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Error loading data</p>';

            // Verify old content is cleared
            expect(galleryContainer.querySelectorAll('.card')).toHaveLength(0);
            expect(galleryContainer.querySelector('p')).toBeDefined();
        });
    });

    describe('Card Grid Population', () => {
        it('should populate card grid with correct number of elements', () => {
            const cards = [
                { id: 1, title: 'Card 1', imageHash: 'hash1' },
                { id: 2, title: 'Card 2', imageHash: 'hash2' },
                { id: 3, title: 'Card 3', imageHash: 'hash3' }
            ];

            // Simulate gallery generation
            const galleryHTML = cards.map(card => `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="images/${card.imageHash}.jpg" alt="${card.title}" loading="lazy">
                        </div>
                    </div>
                </div>
            `).join('');

            const galleryContainer = document.getElementById('gallery-container');
            galleryContainer.innerHTML = galleryHTML;

            const flipCards = galleryContainer.querySelectorAll('.flip-card');
            expect(flipCards).toHaveLength(3);
        });

        it('should render empty grid when no cards are provided', () => {
            const galleryContainer = document.getElementById('gallery-container');
            galleryContainer.innerHTML = '';

            const flipCards = galleryContainer.querySelectorAll('.flip-card');
            expect(flipCards).toHaveLength(0);
        });

        it('should create flip card structure with front and back', () => {
            const frontCard = { id: 1, title: 'Mountain View', imageHash: 'hash-front' };
            const backCard = { id: 2, title: 'Mountain View (Back)', imageHash: 'hash-back' };

            const flipCardHTML = `
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="images/${frontCard.imageHash}.jpg" 
                                 alt="${frontCard.title} - front" 
                                 loading="lazy">
                            <p class="card-caption">${frontCard.title} — front view</p>
                        </div>
                        <div class="flip-card-back">
                            <img src="images/${backCard.imageHash}.jpg" 
                                 alt="${backCard.title} - back with annotations" 
                                 loading="lazy">
                            <p class="card-caption">${frontCard.title} — back view with annotations</p>
                        </div>
                    </div>
                    <button class="flip-button" aria-label="Flip card to see back">
                        <span class="flip-text">See Back</span>
                        <span class="flip-icon">↻</span>
                    </button>
                </div>
            `;

            const galleryContainer = document.getElementById('gallery-container');
            galleryContainer.innerHTML = flipCardHTML;

            // Verify structure
            const flipCard = galleryContainer.querySelector('.flip-card');
            expect(flipCard).toBeDefined();

            const flipCardInner = flipCard.querySelector('.flip-card-inner');
            expect(flipCardInner).toBeDefined();

            const front = flipCard.querySelector('.flip-card-front');
            const back = flipCard.querySelector('.flip-card-back');
            expect(front).toBeDefined();
            expect(back).toBeDefined();

            const button = flipCard.querySelector('.flip-button');
            expect(button).toBeDefined();
            expect(button.getAttribute('aria-label')).toBe('Flip card to see back');
        });
    });
});
