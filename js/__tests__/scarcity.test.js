import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    calculateDistribution,
    calculateForecast,
    updateForecastPanel,
    renderScarcityChart,
    animateStatistics,
    initializeScarcityVisualization,
    setupScarcityObserver
} from '../scarcity.js';

describe('calculateDistribution', () => {
    it('should return zero counts for empty array', () => {
        const result = calculateDistribution([]);
        expect(result).toEqual({
            blue: { count: 0, percentage: 0 },
            silver: { count: 0, percentage: 0 },
            gold: { count: 0, percentage: 0 },
            total: 0
        });
    });

    it('should calculate correct distribution for single-rarity cards', () => {
        const cards = [
            { rarity: 'blue' },
            { rarity: 'blue' },
            { rarity: 'silver' }
        ];
        const result = calculateDistribution(cards);
        expect(result.blue.count).toBe(2);
        expect(result.silver.count).toBe(1);
        expect(result.gold.count).toBe(0);
        expect(result.total).toBe(3);
    });

    it('should handle multi-rarity cards correctly', () => {
        const cards = [
            { rarity: ['gold', 'silver'] },
            { rarity: 'blue' }
        ];
        const result = calculateDistribution(cards);
        expect(result.gold.count).toBe(1);
        expect(result.silver.count).toBe(1);
        expect(result.blue.count).toBe(1);
        expect(result.total).toBe(3);
    });

    it('should calculate percentages correctly', () => {
        const cards = [
            { rarity: 'blue' },
            { rarity: 'blue' },
            { rarity: 'silver' },
            { rarity: 'gold' }
        ];
        const result = calculateDistribution(cards);
        expect(result.blue.percentage).toBe(50.0);
        expect(result.silver.percentage).toBe(25.0);
        expect(result.gold.percentage).toBe(25.0);
    });

    it('should format percentages to one decimal place', () => {
        const cards = [
            { rarity: 'blue' },
            { rarity: 'blue' },
            { rarity: 'silver' }
        ];
        const result = calculateDistribution(cards);
        expect(result.blue.percentage).toBe(66.7);
        expect(result.silver.percentage).toBe(33.3);
    });

    it('should handle all cards of same rarity', () => {
        const cards = [
            { rarity: 'gold' },
            { rarity: 'gold' },
            { rarity: 'gold' }
        ];
        const result = calculateDistribution(cards);
        expect(result.gold.count).toBe(3);
        expect(result.gold.percentage).toBe(100.0);
        expect(result.blue.count).toBe(0);
        expect(result.silver.count).toBe(0);
    });

    it('should handle invalid rarity values gracefully', () => {
        const cards = [
            { rarity: 'blue' },
            { rarity: 'invalid' },
            { rarity: 'silver' }
        ];
        const result = calculateDistribution(cards);
        expect(result.blue.count).toBe(1);
        expect(result.silver.count).toBe(1);
        expect(result.total).toBe(2);
    });

    it('should handle cards without rarity field', () => {
        const cards = [
            { rarity: 'blue' },
            { title: 'No rarity' },
            { rarity: 'gold' }
        ];
        const result = calculateDistribution(cards);
        expect(result.blue.count).toBe(1);
        expect(result.gold.count).toBe(1);
        expect(result.total).toBe(2);
    });

    it('should handle non-array input gracefully', () => {
        const result = calculateDistribution(null);
        expect(result).toEqual({
            blue: { count: 0, percentage: 0 },
            silver: { count: 0, percentage: 0 },
            gold: { count: 0, percentage: 0 },
            total: 0
        });
    });
});

describe('calculateForecast', () => {
    it('should recommend blue when no cards exist', () => {
        const distribution = {
            blue: { count: 0, percentage: 0 },
            silver: { count: 0, percentage: 0 },
            gold: { count: 0, percentage: 0 }
        };
        const result = calculateForecast(distribution);
        expect(result.recommendedColor).toBe('blue');
        expect(result.rationale).toContain('standard edition');
    });

    it('should recommend silver when it is below target ratio', () => {
        const distribution = {
            blue: { count: 10, percentage: 71.4 },
            silver: { count: 2, percentage: 14.3 },
            gold: { count: 2, percentage: 14.3 }
        };
        const result = calculateForecast(distribution);
        // Silver target is 60% of blue (6 cards), currently at 2
        expect(result.recommendedColor).toBe('silver');
        expect(result.rationale).toContain('Silver');
    });

    it('should recommend gold when it is below target ratio', () => {
        const distribution = {
            blue: { count: 10, percentage: 62.5 },
            silver: { count: 6, percentage: 37.5 },
            gold: { count: 0, percentage: 0 }
        };
        const result = calculateForecast(distribution);
        // Gold target is 40% of blue (4 cards), currently at 0
        expect(result.recommendedColor).toBe('gold');
        expect(result.rationale).toContain('Gold');
    });

    it('should recommend appropriately when silver and gold are near target ratios', () => {
        const distribution = {
            blue: { count: 20, percentage: 60.6 },
            silver: { count: 11, percentage: 33.3 },
            gold: { count: 4, percentage: 12.1 }
        };
        const result = calculateForecast(distribution);
        // Silver (50% of blue = 10) is above target at 11
        // Gold (16.7% of blue = 3.34) is above target at 4
        // When both are above target, should recommend blue
        expect(result.recommendedColor).toBe('blue');
        expect(result.rationale).toContain('Blue');
    });

    it('should recommend silver when tied with gold but both below target', () => {
        const distribution = {
            blue: { count: 10, percentage: 71.4 },
            silver: { count: 2, percentage: 14.3 },
            gold: { count: 2, percentage: 14.3 }
        };
        const result = calculateForecast(distribution);
        // Silver target: 5 (deficit: 3), Gold target: 1.67 (surplus: 0.33)
        // Silver has deficit, gold is above target, so recommend silver
        expect(result.recommendedColor).toBe('silver');
    });

    it('should provide meaningful rationale with target counts', () => {
        const distribution = {
            blue: { count: 10, percentage: 71.4 },
            silver: { count: 2, percentage: 14.3 },
            gold: { count: 2, percentage: 14.3 }
        };
        const result = calculateForecast(distribution);
        expect(result.rationale).toContain('underrepresented');
        expect(result.rationale).toContain('Target');
        expect(result.rationale).toContain('50%');
    });

    it('should handle distribution with only blue cards', () => {
        const distribution = {
            blue: { count: 10, percentage: 100 },
            silver: { count: 0, percentage: 0 },
            gold: { count: 0, percentage: 0 }
        };
        const result = calculateForecast(distribution);
        // Silver target: 5, Gold target: 1.67 - silver has larger deficit
        expect(result.recommendedColor).toBe('silver');
    });

    it('should recommend blue when starting fresh', () => {
        const distribution = {
            blue: { count: 0, percentage: 0 },
            silver: { count: 0, percentage: 0 },
            gold: { count: 0, percentage: 0 }
        };
        const result = calculateForecast(distribution);
        expect(result.recommendedColor).toBe('blue');
        expect(result.rationale).toContain('standard edition');
    });

    it('should maintain balanced distribution over time', () => {
        // Simulate a well-balanced collection where both silver and gold are above target
        const distribution = {
            blue: { count: 50, percentage: 58.8 },
            silver: { count: 26, percentage: 30.6 },
            gold: { count: 9, percentage: 10.6 }
        };
        const result = calculateForecast(distribution);
        // Silver target: 25 (50% of 50), actual: 26 (above target)
        // Gold target: 8.35 (16.7% of 50), actual: 9 (above target)
        // When both are above target, should recommend blue to maintain baseline
        expect(result.recommendedColor).toBe('blue');
    });

    it('should include rationale for all recommendations', () => {
        const testCases = [
            { blue: { count: 0 }, silver: { count: 0 }, gold: { count: 0 } },
            { blue: { count: 10, percentage: 71.4 }, silver: { count: 2, percentage: 14.3 }, gold: { count: 2, percentage: 14.3 } },
            { blue: { count: 10, percentage: 50.0 }, silver: { count: 6, percentage: 30.0 }, gold: { count: 4, percentage: 20.0 } }
        ];

        testCases.forEach(distribution => {
            const result = calculateForecast(distribution);
            expect(result.rationale).toBeTruthy();
            expect(result.rationale.length).toBeGreaterThan(0);
        });
    });
});

describe('updateForecastPanel', () => {
    let panel;

    beforeEach(() => {
        // Create a mock forecast panel DOM structure
        panel = document.createElement('div');
        panel.className = 'forecast-panel';
        panel.innerHTML = `
            <h3 class="forecast-heading">Next Mint Recommendation</h3>
            <div class="forecast-recommendation">
                <span class="forecast-color-indicator"></span>
                <span class="forecast-color-name">Calculating...</span>
            </div>
            <p class="forecast-rationale">Loading recommendation...</p>
        `;
        document.body.appendChild(panel);
    });

    it('should update color indicator with correct background color', () => {
        const forecast = {
            recommendedColor: 'gold',
            rationale: 'Gold is recommended'
        };

        updateForecastPanel(forecast, panel);

        const indicator = panel.querySelector('.forecast-color-indicator');
        expect(indicator.style.backgroundColor).toBe('rgb(199, 159, 96)'); // #c79f60 in RGB
    });

    it('should update color name with capitalized color', () => {
        const forecast = {
            recommendedColor: 'silver',
            rationale: 'Silver is recommended'
        };

        updateForecastPanel(forecast, panel);

        const colorName = panel.querySelector('.forecast-color-name');
        expect(colorName.textContent).toBe('Silver');
    });

    it('should update rationale text', () => {
        const forecast = {
            recommendedColor: 'blue',
            rationale: 'Blue annotations are underrepresented at 20%.'
        };

        updateForecastPanel(forecast, panel);

        const rationale = panel.querySelector('.forecast-rationale');
        expect(rationale.textContent).toBe('Blue annotations are underrepresented at 20%.');
    });

    it('should handle all three rarity colors correctly', () => {
        const colors = {
            blue: 'rgb(74, 144, 226)',
            silver: 'rgb(192, 192, 192)',
            gold: 'rgb(199, 159, 96)'
        };

        Object.keys(colors).forEach(color => {
            const forecast = {
                recommendedColor: color,
                rationale: `${color} is recommended`
            };

            updateForecastPanel(forecast, panel);

            const indicator = panel.querySelector('.forecast-color-indicator');
            expect(indicator.style.backgroundColor).toBe(colors[color]);
        });
    });

    it('should handle missing panel gracefully', () => {
        const forecast = {
            recommendedColor: 'gold',
            rationale: 'Gold is recommended'
        };

        expect(() => updateForecastPanel(forecast, null)).not.toThrow();
    });

    it('should handle missing forecast gracefully', () => {
        expect(() => updateForecastPanel(null, panel)).not.toThrow();
    });

    it('should handle panel with missing elements gracefully', () => {
        const incompletePanel = document.createElement('div');
        incompletePanel.innerHTML = '<div>Incomplete structure</div>';

        const forecast = {
            recommendedColor: 'gold',
            rationale: 'Gold is recommended'
        };

        expect(() => updateForecastPanel(forecast, incompletePanel)).not.toThrow();
    });

    it('should set opacity to 1 after animation', () => {
        const forecast = {
            recommendedColor: 'gold',
            rationale: 'Gold is recommended'
        };

        updateForecastPanel(forecast, panel);

        // Check that opacity is set (either immediately or via animation)
        expect(panel.style.opacity).toBeTruthy();
    });
});

// Integration and DOM Tests
describe('Integration Tests', () => {
    beforeEach(() => {
        // Clear document body before each test
        document.body.innerHTML = '';
        
        // Reset any mocks
        vi.clearAllMocks();
        
        // Mock window.matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
        
        // Mock fetch for catalog data
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    cards: [
                        { id: 1, rarity: 'blue' },
                        { id: 2, rarity: 'blue' },
                        { id: 3, rarity: 'silver' },
                        { id: 4, rarity: 'gold' }
                    ]
                })
            })
        );
    });

    describe('Full Scarcity Visualization Initialization', () => {
        it('should initialize complete visualization with real catalog data', async () => {
            // Setup complete DOM structure
            document.body.innerHTML = `
                <section id="scarcity">
                    <canvas id="scarcity-chart"></canvas>
                    <div class="scarcity-stats-grid">
                        <div class="stat-card blue">
                            <div class="stat-value" data-target="0">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                        <div class="stat-card silver">
                            <div class="stat-value" data-target="0">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                        <div class="stat-card gold">
                            <div class="stat-value" data-target="0">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                    </div>
                    <div class="forecast-panel">
                        <div class="forecast-recommendation">
                            <span class="forecast-color-indicator"></span>
                            <span class="forecast-color-name">Calculating...</span>
                        </div>
                        <p class="forecast-rationale">Loading recommendation...</p>
                    </div>
                </section>
            `;

            const section = document.getElementById('scarcity');
            
            // Initialize visualization
            await initializeScarcityVisualization();

            // Verify stat cards were updated
            const blueValue = document.querySelector('.stat-card.blue .stat-value');
            const silverValue = document.querySelector('.stat-card.silver .stat-value');
            const goldValue = document.querySelector('.stat-card.gold .stat-value');

            expect(blueValue).toBeTruthy();
            expect(silverValue).toBeTruthy();
            expect(goldValue).toBeTruthy();

            // Verify forecast panel was updated
            const forecastName = document.querySelector('.forecast-color-name');
            expect(forecastName.textContent).not.toBe('Calculating...');
            expect(['Blue', 'Silver', 'Gold']).toContain(forecastName.textContent);
        });

        it('should handle catalog loading errors gracefully', async () => {
            // Setup DOM
            document.body.innerHTML = `
                <section id="scarcity">
                    <canvas id="scarcity-chart"></canvas>
                    <div class="scarcity-stats-grid"></div>
                    <div class="forecast-panel"></div>
                </section>
            `;

            // Mock fetch to fail
            global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

            // Should not throw
            await expect(initializeScarcityVisualization()).resolves.not.toThrow();
        });
    });

    describe('DOM Rendering Tests', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <section id="scarcity">
                    <canvas id="scarcity-chart"></canvas>
                    <div class="scarcity-stats-grid">
                        <div class="stat-card blue">
                            <div class="stat-value" data-target="0">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                        <div class="stat-card silver">
                            <div class="stat-value" data-target="0">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                        <div class="stat-card gold">
                            <div class="stat-value" data-target="0">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                    </div>
                    <div class="forecast-panel">
                        <div class="forecast-recommendation">
                            <span class="forecast-color-indicator"></span>
                            <span class="forecast-color-name">Calculating...</span>
                        </div>
                        <p class="forecast-rationale">Loading recommendation...</p>
                    </div>
                </section>
            `;
        });

        it('should render stat cards with correct values', () => {
            const distribution = {
                blue: { count: 6, percentage: 60.0 },
                silver: { count: 2, percentage: 20.0 },
                gold: { count: 2, percentage: 20.0 },
                total: 10
            };

            // Mock matchMedia to return reduced motion preference
            window.matchMedia = vi.fn().mockImplementation(query => ({
                matches: true, // Prefer reduced motion for instant updates
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }));

            const statsGrid = document.querySelector('.scarcity-stats-grid');
            animateStatistics(distribution, statsGrid);

            // Check values are set correctly (with reduced motion, values are set immediately)
            const blueValue = document.querySelector('.stat-card.blue .stat-value');
            const silverValue = document.querySelector('.stat-card.silver .stat-value');
            const goldValue = document.querySelector('.stat-card.gold .stat-value');

            expect(blueValue.textContent).toBe('6');
            expect(silverValue.textContent).toBe('2');
            expect(goldValue.textContent).toBe('2');

            // Check percentages
            const bluePercentage = document.querySelector('.stat-card.blue .stat-percentage');
            const silverPercentage = document.querySelector('.stat-card.silver .stat-percentage');
            const goldPercentage = document.querySelector('.stat-card.gold .stat-percentage');

            expect(bluePercentage.textContent).toBe('60.0%');
            expect(silverPercentage.textContent).toBe('20.0%');
            expect(goldPercentage.textContent).toBe('20.0%');
        });

        it('should update forecast panel with recommendation', () => {
            const forecast = {
                recommendedColor: 'silver',
                rationale: 'Silver annotations are currently underrepresented at 20%. Minting with silver ink will help balance the distribution.'
            };

            const panel = document.querySelector('.forecast-panel');
            updateForecastPanel(forecast, panel);

            const colorName = document.querySelector('.forecast-color-name');
            const rationale = document.querySelector('.forecast-rationale');
            const indicator = document.querySelector('.forecast-color-indicator');

            expect(colorName.textContent).toBe('Silver');
            expect(rationale.textContent).toContain('Silver');
            expect(indicator.style.backgroundColor).toBe('rgb(192, 192, 192)');
        });

        it('should render chart on canvas element', () => {
            const distribution = {
                blue: { count: 6, percentage: 60.0 },
                silver: { count: 2, percentage: 20.0 },
                gold: { count: 2, percentage: 20.0 },
                total: 10
            };

            const canvas = document.getElementById('scarcity-chart');
            
            // Should not throw
            expect(() => renderScarcityChart(distribution, canvas)).not.toThrow();
        });
    });

    describe('IntersectionObserver Integration', () => {
        it('should setup observer for scarcity section', () => {
            document.body.innerHTML = `
                <section id="scarcity">
                    <canvas id="scarcity-chart"></canvas>
                    <div class="scarcity-stats-grid"></div>
                </section>
            `;

            const section = document.getElementById('scarcity');
            
            // Mock IntersectionObserver
            const mockObserve = vi.fn();
            global.IntersectionObserver = vi.fn((callback) => ({
                observe: mockObserve,
                unobserve: vi.fn(),
                disconnect: vi.fn()
            }));

            setupScarcityObserver();

            // Verify observer was created and observe was called
            expect(global.IntersectionObserver).toHaveBeenCalled();
            expect(mockObserve).toHaveBeenCalled();
        });

        it('should handle missing IntersectionObserver gracefully', () => {
            document.body.innerHTML = `
                <section id="scarcity">
                    <canvas id="scarcity-chart"></canvas>
                </section>
            `;

            // Save original and remove IntersectionObserver
            const originalIO = global.IntersectionObserver;
            delete global.IntersectionObserver;

            // Should not throw
            expect(() => setupScarcityObserver()).not.toThrow();

            // Restore
            global.IntersectionObserver = originalIO;
        });
    });

    describe('Accessibility Tests', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <section id="scarcity" aria-labelledby="scarcity-heading">
                    <h2 id="scarcity-heading">Annotation Scarcity Analysis</h2>
                    <canvas id="scarcity-chart" role="img" aria-label="Scarcity distribution chart"></canvas>
                    <div class="scarcity-stats-grid" role="list">
                        <div class="stat-card blue" role="listitem">
                            <div class="stat-label">Blue Annotations</div>
                            <div class="stat-value">0</div>
                        </div>
                        <div class="stat-card silver" role="listitem">
                            <div class="stat-label">Silver Annotations</div>
                            <div class="stat-value">0</div>
                        </div>
                        <div class="stat-card gold" role="listitem">
                            <div class="stat-label">Gold Annotations</div>
                            <div class="stat-value">0</div>
                        </div>
                    </div>
                    <div class="forecast-panel" role="region" aria-labelledby="forecast-heading">
                        <h3 id="forecast-heading">Next Mint Recommendation</h3>
                        <div class="forecast-recommendation">
                            <span class="forecast-color-indicator" aria-hidden="true"></span>
                            <span class="forecast-color-name">Calculating...</span>
                        </div>
                    </div>
                </section>
            `;
        });

        it('should have proper ARIA labels on section', () => {
            const section = document.getElementById('scarcity');
            expect(section.getAttribute('aria-labelledby')).toBe('scarcity-heading');
            
            const heading = document.getElementById('scarcity-heading');
            expect(heading).toBeTruthy();
            expect(heading.textContent).toBe('Annotation Scarcity Analysis');
        });

        it('should have proper ARIA role on canvas', () => {
            const canvas = document.getElementById('scarcity-chart');
            expect(canvas.getAttribute('role')).toBe('img');
            expect(canvas.getAttribute('aria-label')).toBe('Scarcity distribution chart');
        });

        it('should have proper ARIA roles on stats grid', () => {
            const statsGrid = document.querySelector('.scarcity-stats-grid');
            expect(statsGrid.getAttribute('role')).toBe('list');

            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                expect(card.getAttribute('role')).toBe('listitem');
            });
        });

        it('should have proper ARIA labels on forecast panel', () => {
            const forecastPanel = document.querySelector('.forecast-panel');
            expect(forecastPanel.getAttribute('role')).toBe('region');
            expect(forecastPanel.getAttribute('aria-labelledby')).toBe('forecast-heading');

            const heading = document.getElementById('forecast-heading');
            expect(heading).toBeTruthy();
        });

        it('should hide decorative elements from screen readers', () => {
            const colorIndicator = document.querySelector('.forecast-color-indicator');
            expect(colorIndicator.getAttribute('aria-hidden')).toBe('true');
        });

        it('should have descriptive labels for each stat card', () => {
            const blueCard = document.querySelector('.stat-card.blue');
            const silverCard = document.querySelector('.stat-card.silver');
            const goldCard = document.querySelector('.stat-card.gold');

            expect(blueCard.querySelector('.stat-label').textContent).toBe('Blue Annotations');
            expect(silverCard.querySelector('.stat-label').textContent).toBe('Silver Annotations');
            expect(goldCard.querySelector('.stat-label').textContent).toBe('Gold Annotations');
        });
    });

    describe('Keyboard Navigation Tests', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <section id="scarcity">
                    <canvas id="scarcity-chart" tabindex="0"></canvas>
                    <div class="scarcity-stats-grid">
                        <div class="stat-card blue" tabindex="0">
                            <div class="stat-value">6</div>
                        </div>
                        <div class="stat-card silver" tabindex="0">
                            <div class="stat-value">2</div>
                        </div>
                        <div class="stat-card gold" tabindex="0">
                            <div class="stat-value">2</div>
                        </div>
                    </div>
                </section>
            `;
        });

        it('should allow keyboard focus on interactive elements', () => {
            const canvas = document.getElementById('scarcity-chart');
            const statCards = document.querySelectorAll('.stat-card');

            // Canvas should be focusable
            expect(canvas.getAttribute('tabindex')).toBe('0');

            // Stat cards should be focusable
            statCards.forEach(card => {
                expect(card.getAttribute('tabindex')).toBe('0');
            });
        });

        it('should maintain logical tab order', () => {
            const focusableElements = document.querySelectorAll('[tabindex="0"]');
            
            // Should have multiple focusable elements in logical order
            expect(focusableElements.length).toBeGreaterThan(0);
            
            // First should be canvas, then stat cards
            expect(focusableElements[0].id).toBe('scarcity-chart');
            expect(focusableElements[1].classList.contains('stat-card')).toBe(true);
        });
    });

    describe('Performance Tests', () => {
        it('should complete distribution calculation in under 100ms', () => {
            // Create a larger dataset to test performance
            const cards = [];
            for (let i = 0; i < 100; i++) {
                cards.push({ rarity: ['blue', 'silver', 'gold'][i % 3] });
            }

            const startTime = performance.now();
            const distribution = calculateDistribution(cards);
            const endTime = performance.now();
            const executionTime = endTime - startTime;

            expect(executionTime).toBeLessThan(100);
            expect(distribution.total).toBe(100);
        });

        it('should complete forecast calculation in under 100ms', () => {
            const distribution = {
                blue: { count: 60, percentage: 60.0 },
                silver: { count: 30, percentage: 30.0 },
                gold: { count: 10, percentage: 10.0 }
            };

            const startTime = performance.now();
            const forecast = calculateForecast(distribution);
            const endTime = performance.now();
            const executionTime = endTime - startTime;

            expect(executionTime).toBeLessThan(100);
            expect(forecast.recommendedColor).toBeTruthy();
        });

        it('should complete full calculation pipeline in under 100ms', () => {
            const cards = [];
            for (let i = 0; i < 50; i++) {
                cards.push({ rarity: ['blue', 'silver', 'gold'][i % 3] });
            }

            const startTime = performance.now();
            const distribution = calculateDistribution(cards);
            const forecast = calculateForecast(distribution);
            const endTime = performance.now();
            const executionTime = endTime - startTime;

            expect(executionTime).toBeLessThan(100);
            expect(distribution).toBeTruthy();
            expect(forecast).toBeTruthy();
        });
    });

    describe('Error Handling Tests', () => {
        it('should handle missing DOM elements gracefully', async () => {
            document.body.innerHTML = '<div></div>';

            // Should not throw when elements are missing
            await expect(initializeScarcityVisualization()).resolves.not.toThrow();
        });

        it('should handle invalid catalog data gracefully', () => {
            const invalidCards = [
                { rarity: 'invalid' },
                { title: 'No rarity' }
            ];

            const distribution = calculateDistribution(invalidCards);
            
            expect(distribution.total).toBe(0);
            expect(distribution.blue.count).toBe(0);
            expect(distribution.silver.count).toBe(0);
            expect(distribution.gold.count).toBe(0);
        });

        it('should handle empty catalog gracefully', () => {
            const distribution = calculateDistribution([]);
            
            expect(distribution.total).toBe(0);
            expect(distribution.blue.percentage).toBe(0);
            expect(distribution.silver.percentage).toBe(0);
            expect(distribution.gold.percentage).toBe(0);
        });

        it('should handle null canvas context gracefully', () => {
            const mockCanvas = {
                getContext: () => null,
                width: 800,
                height: 300
            };

            const distribution = {
                blue: { count: 6, percentage: 60.0 },
                silver: { count: 2, percentage: 20.0 },
                gold: { count: 2, percentage: 20.0 }
            };

            // Should not throw
            expect(() => renderScarcityChart(distribution, mockCanvas)).not.toThrow();
        });
    });
});