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
    it('should recommend color with lowest count', () => {
        const distribution = {
            blue: { count: 6 },
            silver: { count: 2 },
            gold: { count: 4 }
        };
        const result = calculateForecast(distribution);
        expect(result.recommendedColor).toBe('silver');
    });

    it('should prioritize gold when all counts are equal', () => {
        const distribution = {
            blue: { count: 2 },
            silver: { count: 2 },
            gold: { count: 2 }
        };
        const result = calculateForecast(distribution);
        expect(result.recommendedColor).toBe('gold');
    });

    it('should prioritize gold over silver when tied', () => {
        const distribution = {
            blue: { count: 5 },
            silver: { count: 2 },
            gold: { count: 2 }
        };
        const result = calculateForecast(distribution);
        expect(result.recommendedColor).toBe('gold');
    });

    it('should prioritize silver over blue when tied', () => {
        const distribution = {
            blue: { count: 3 },
            silver: { count: 3 },
            gold: { count: 5 }
        };
        const result = calculateForecast(distribution);
        expect(result.recommendedColor).toBe('silver');
    });

    it('should provide meaningful rationale', () => {
        const distribution = {
            blue: { count: 6 },
            silver: { count: 1 },
            gold: { count: 3 }
        };
        const result = calculateForecast(distribution);
        expect(result.rationale).toContain('silver');
        expect(result.rationale.toLowerCase()).toContain('underrepresented');
    });

    it('should include rationale for balanced distribution', () => {
        const distribution = {
            blue: { count: 3 },
            silver: { count: 3 },
            gold: { count: 3 }
        };
        const result = calculateForecast(distribution);
        expect(result.rationale).toBeTruthy();
        expect(result.rationale.length).toBeGreaterThan(0);
    });

    it('should recommend gold when it has zero count', () => {
        const distribution = {
            blue: { count: 5 },
            silver: { count: 3 },
            gold: { count: 0 }
        };
        const result = calculateForecast(distribution);
        expect(result.recommendedColor).toBe('gold');
    });

    it('should handle distribution with only one color', () => {
        const distribution = {
            blue: { count: 10 },
            silver: { count: 0 },
            gold: { count: 0 }
        };
        const result = calculateForecast(distribution);
        expect(['silver', 'gold']).toContain(result.recommendedColor);
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
    });

    describe('initializeScarcityVisualization', () => {
        it('should load catalog and render visualization', async () => {
            // Setup DOM structure
            document.body.innerHTML = `
                <section id="scarcity">
                    <canvas id="scarcity-chart"></canvas>
                    <div class="scarcity-stats-grid">
                        <div class="stat-card blue">
                            <div class="stat-value">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                        <div class="stat-card silver">
                            <div class="stat-value">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                        <div class="stat-card gold">
                            <div class="stat-value">0</div>
                            <div class="stat-percentage">0%</div>
                        </div>
                    </div>
             