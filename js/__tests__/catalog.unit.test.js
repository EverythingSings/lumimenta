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
            { id: 'card-001', subject: 'Card 1', rarity: 'blue' },
            { id: 'card-002', subject: 'Card 2', rarity: 'silver' },
            { id: 'card-003', subject: 'Card 3', rarity: 'gold' }
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
            { id: 'card-001', subject: 'Card 1', rarity: 'blue' },
            { id: 'card-002', subject: 'Card 2', rarity: 'silver' },
            { id: 'card-003', subject: 'Card 3', rarity: 'gold' }
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

    it('should count unique subjects correctly', () => {
        const cards = [
            { id: 'card-001', subject: 'Mountain View', rarity: 'blue' },
            { id: 'card-002', subject: 'Mountain View', rarity: 'blue' },
            { id: 'card-003', subject: 'Ocean Sunset', rarity: 'silver' }
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
});

describe('formatCardData', () => {
    it('should format card with v2 schema', () => {
        const card = {
            id: 'card-001',
            subject: 'Test Card',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: 'blue',
            edition: '1/100',
            frontImage: 'test-hash-front',
            backImage: 'test-hash-back',
            availability: 'available'
        };
        const result = formatCardData(card);

        expect(result).toEqual({
            id: 'card-001',
            subject: 'Test Card',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: 'blue',
            rarityDisplay: 'Blue',
            edition: '1/100',
            frontImage: 'test-hash-front',
            backImage: 'test-hash-back',
            availability: 'available',
            availabilityDisplay: 'Available'
        });
    });

    it('should handle missing availability field', () => {
        const card = {
            id: 'card-001',
            subject: 'Test Card',
            location: 'Test Location',
            blockHeight: 800000,
            rarity: 'silver',
            edition: '1/10',
            frontImage: 'test-hash-front',
            backImage: 'test-hash-back'
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
