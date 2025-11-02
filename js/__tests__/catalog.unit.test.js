import { describe, it, expect } from 'vitest';
import {
    calculateTotalCards,
    calculateRarityDistribution,
    calculateStatistics,
    formatCardData
} from '../catalog.js';

describe('calculateTotalCards', () => {
    it('should return 0 for empty array', () => {
        const result = calculateTotalCards([]);
        expect(result).toBe(0);
    });

    it('should return 1 for single card', () => {
        const cards = [
            { id: 1, title: 'Test Card', rarity: 'blue' }
        ];
        const result = calculateTotalCards(cards);
        expect(result).toBe(1);
    });

    it('should return correct count for multiple cards', () => {
        const cards = [
            { id: 1, title: 'Card 1', rarity: 'blue' },
            { id: 2, title: 'Card 2', rarity: 'silver' },
            { id: 3, title: 'Card 3', rarity: 'gold' }
        ];
        const result = calculateTotalCards(cards);
        expect(result).toBe(3);
    });
});

describe('calculateRarityDistribution', () => {
    it('should return zero counts for empty array', () => {
        const result = calculateRarityDistribution([]);
        expect(result).toEqual({
            blue: 0,
            silver: 0,
            gold: 0
        });
    });

    it('should count single blue card correctly', () => {
        const cards = [
            { id: 1, title: 'Blue Card', rarity: 'blue' }
        ];
        const result = calculateRarityDistribution(cards);
        expect(result).toEqual({
            blue: 1,
            silver: 0,
            gold: 0
        });
    });

    it('should count single silver card correctly', () => {
        const cards = [
            { id: 1, title: 'Silver Card', rarity: 'silver' }
        ];
        const result = calculateRarityDistribution(cards);
        expect(result).toEqual({
            blue: 0,
            silver: 1,
            gold: 0
        });
    });

    it('should count single gold card correctly', () => {
        const cards = [
            { id: 1, title: 'Gold Card', rarity: 'gold' }
        ];
        const result = calculateRarityDistribution(cards);
        expect(result).toEqual({
            blue: 0,
            silver: 0,
            gold: 1
        });
    });

    it('should count multiple cards of different rarities', () => {
        const cards = [
            { id: 1, title: 'Card 1', rarity: 'blue' },
            { id: 2, title: 'Card 2', rarity: 'blue' },
            { id: 3, title: 'Card 3', rarity: 'silver' },
            { id: 4, title: 'Card 4', rarity: 'gold' }
        ];
        const result = calculateRarityDistribution(cards);
        expect(result).toEqual({
            blue: 2,
            silver: 1,
            gold: 1
        });
    });

    it('should handle cards with array rarity values', () => {
        const cards = [
            { id: 1, title: 'Card 1', rarity: ['blue', 'silver'] },
            { id: 2, title: 'Card 2', rarity: 'gold' }
        ];
        const result = calculateRarityDistribution(cards);
        expect(result).toEqual({
            blue: 1,
            silver: 1,
            gold: 1
        });
    });
});

describe('calculateStatistics', () => {
    it('should return correct stats for empty array', () => {
        const result = calculateStatistics([]);
        expect(result).toEqual({
            total: 0,
            blue: 0,
            silver: 0,
            gold: 0,
            uniqueSubjects: 0
        });
    });

    it('should calculate stats for single card', () => {
        const cards = [
            {
                id: 1,
                title: 'Test Card',
                rarity: 'blue'
            }
        ];
        const result = calculateStatistics(cards);
        expect(result).toEqual({
            total: 1,
            blue: 1,
            silver: 0,
            gold: 0,
            uniqueSubjects: 1
        });
    });

    it('should calculate stats for multiple cards with different rarities', () => {
        const cards = [
            { id: 1, title: 'Card 1', rarity: 'blue' },
            { id: 2, title: 'Card 2', rarity: 'silver' },
            { id: 3, title: 'Card 3', rarity: 'gold' }
        ];
        const result = calculateStatistics(cards);
        expect(result).toEqual({
            total: 3,
            blue: 1,
            silver: 1,
            gold: 1,
            uniqueSubjects: 3
        });
    });

    it('should count unique subjects correctly with front and back cards', () => {
        const cards = [
            { id: 1, title: 'Mountain View', rarity: 'blue' },
            { id: 2, title: 'Mountain View (Back)', rarity: 'blue' },
            { id: 3, title: 'Ocean Sunset', rarity: 'silver' }
        ];
        const result = calculateStatistics(cards);
        expect(result).toEqual({
            total: 3,
            blue: 2,
            silver: 1,
            gold: 0,
            uniqueSubjects: 2
        });
    });

    it('should handle cards with array rarity values in stats', () => {
        const cards = [
            { id: 1, title: 'Card 1', rarity: ['blue', 'silver'] },
            { id: 2, title: 'Card 2', rarity: 'gold' }
        ];
        const result = calculateStatistics(cards);
        expect(result).toEqual({
            total: 2,
            blue: 1,
            silver: 1,
            gold: 1,
            uniqueSubjects: 2
        });
    });
});

describe('formatCardData', () => {
    it('should format card with string rarity', () => {
        const card = {
            id: 1,
            title: 'Test Card',
            description: 'Test description',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: 'blue',
            edition: '1/100',
            imageHash: 'test-hash',
            availability: 'available'
        };
        const result = formatCardData(card);
        
        expect(result).toEqual({
            id: 1,
            title: 'Test Card',
            baseTitle: 'Test Card',
            description: 'Test description',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: 'blue',
            rarityDisplay: 'Blue',
            edition: '1/100',
            imageHash: 'test-hash',
            availability: 'available',
            availabilityDisplay: 'Available',
            isBack: false
        });
    });

    it('should format card with array rarity', () => {
        const card = {
            id: 1,
            title: 'Test Card',
            description: 'Test description',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: ['blue', 'silver'],
            edition: '1/50',
            imageHash: 'test-hash',
            availability: 'available'
        };
        const result = formatCardData(card);
        
        expect(result.rarityDisplay).toBe('Blue & Silver');
        expect(result.rarity).toEqual(['blue', 'silver']);
    });

    it('should identify back cards correctly', () => {
        const card = {
            id: 2,
            title: 'Mountain View (Back)',
            description: 'Back view',
            location: 'Test Location',
            blockHeight: 800001,
            rarity: 'gold',
            edition: '1/1',
            imageHash: 'test-hash-back'
        };
        const result = formatCardData(card);
        
        expect(result.isBack).toBe(true);
        expect(result.baseTitle).toBe('Mountain View');
    });

    it('should handle missing availability field', () => {
        const card = {
            id: 1,
            title: 'Test Card',
            description: 'Test description',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: 'silver',
            edition: '1/10',
            imageHash: 'test-hash'
        };
        const result = formatCardData(card);
        
        expect(result.availability).toBe('unknown');
        expect(result.availabilityDisplay).toBe('Unknown');
    });

    it('should capitalize availability status', () => {
        const card = {
            id: 1,
            title: 'Test Card',
            description: 'Test description',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: 'gold',
            edition: '1/1',
            imageHash: 'test-hash',
            availability: 'collected'
        };
        const result = formatCardData(card);
        
        expect(result.availabilityDisplay).toBe('Collected');
    });
});
