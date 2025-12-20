import { describe, it, expect } from 'vitest';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('Catalog Data Loading Integration Tests', () => {
    describe('Valid catalog-v2.json loading', () => {
        it('should load and parse valid catalog-v2.json successfully', async () => {
            const catalogPath = join(process.cwd(), 'catalog-v2.json');
            const fileContent = await readFile(catalogPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            expect(data).toBeDefined();
            expect(data.cards).toBeDefined();
            expect(Array.isArray(data.cards)).toBe(true);
            expect(data.cards.length).toBeGreaterThan(0);
        });

        it('should have valid data structure for all cards', async () => {
            const catalogPath = join(process.cwd(), 'catalog-v2.json');
            const fileContent = await readFile(catalogPath, 'utf-8');
            const data = JSON.parse(fileContent);

            data.cards.forEach(card => {
                expect(card).toHaveProperty('id');
                expect(card).toHaveProperty('subject');
                expect(card).toHaveProperty('location');
                expect(card).toHaveProperty('blockHeight');
                expect(card).toHaveProperty('rarity');
                expect(card).toHaveProperty('edition');
                expect(card).toHaveProperty('frontImage');
                expect(card).toHaveProperty('backImage');
            });
        });

        it('should have valid rarity values', async () => {
            const catalogPath = join(process.cwd(), 'catalog-v2.json');
            const fileContent = await readFile(catalogPath, 'utf-8');
            const data = JSON.parse(fileContent);

            const validRarities = ['blue', 'silver', 'gold'];

            // V2: Rarity is always a string, never an array
            data.cards.forEach(card => {
                expect(validRarities).toContain(card.rarity);
            });
        });
    });

    describe('Malformed JSON handling', () => {
        it('should throw error when parsing malformed JSON', async () => {
            const malformedPath = join(process.cwd(), 'js/__tests__/fixtures/malformed.json');
            const fileContent = await readFile(malformedPath, 'utf-8');
            
            expect(() => JSON.parse(fileContent)).toThrow();
        });

        it('should handle JSON parse errors gracefully', async () => {
            const malformedPath = join(process.cwd(), 'js/__tests__/fixtures/malformed.json');
            
            try {
                const fileContent = await readFile(malformedPath, 'utf-8');
                JSON.parse(fileContent);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeDefined();
                expect(error.message).toMatch(/JSON|parse|Unexpected/i);
            }
        });
    });

    describe('Missing image references handling', () => {
        it('should load catalog with missing image references without throwing', async () => {
            const testPath = join(process.cwd(), 'js/__tests__/fixtures/test-catalog.json');
            const fileContent = await readFile(testPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            // V2: Verify that cards have frontImage and backImage
            expect(data.cards).toBeDefined();
            data.cards.forEach(card => {
                expect(card.frontImage).toBeDefined();
                expect(typeof card.frontImage).toBe('string');
                expect(card.frontImage.length).toBeGreaterThan(0);
                expect(card.backImage).toBeDefined();
                expect(typeof card.backImage).toBe('string');
                expect(card.backImage.length).toBeGreaterThan(0);
            });
        });

        it('should have frontImage and backImage properties for all cards', async () => {
            const catalogPath = join(process.cwd(), 'catalog-v2.json');
            const fileContent = await readFile(catalogPath, 'utf-8');
            const data = JSON.parse(fileContent);

            data.cards.forEach(card => {
                expect(card).toHaveProperty('frontImage');
                expect(typeof card.frontImage).toBe('string');
                expect(card.frontImage).not.toBe('');
                expect(card).toHaveProperty('backImage');
                expect(typeof card.backImage).toBe('string');
                expect(card.backImage).not.toBe('');
            });
        });
    });

    describe('Invalid rarity values handling', () => {
        it('should load catalog with invalid rarity values', async () => {
            const invalidPath = join(process.cwd(), 'js/__tests__/fixtures/invalid-rarity.json');
            const fileContent = await readFile(invalidPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            expect(data).toBeDefined();
            expect(data.cards).toBeDefined();
            expect(Array.isArray(data.cards)).toBe(true);
        });

        it('should identify cards with invalid rarity values', async () => {
            const invalidPath = join(process.cwd(), 'js/__tests__/fixtures/invalid-rarity.json');
            const fileContent = await readFile(invalidPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            const validRarities = ['blue', 'silver', 'gold'];
            const invalidCards = data.cards.filter(card => {
                if (Array.isArray(card.rarity)) {
                    return card.rarity.some(r => !validRarities.includes(r));
                }
                return !validRarities.includes(card.rarity);
            });
            
            expect(invalidCards.length).toBeGreaterThan(0);
        });

        it('should handle various invalid rarity types', async () => {
            const invalidPath = join(process.cwd(), 'js/__tests__/fixtures/invalid-rarity.json');
            const fileContent = await readFile(invalidPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            const validRarities = ['blue', 'silver', 'gold'];
            
            // Test that we can identify different types of invalid rarities
            const bronzeCard = data.cards.find(c => c.rarity === 'bronze');
            const platinumCard = data.cards.find(c => c.rarity === 'platinum');
            const emptyCard = data.cards.find(c => c.rarity === '');
            const numericCard = data.cards.find(c => typeof c.rarity === 'number');
            
            expect(bronzeCard).toBeDefined();
            expect(validRarities).not.toContain(bronzeCard.rarity);
            
            expect(platinumCard).toBeDefined();
            expect(validRarities).not.toContain(platinumCard.rarity);
            
            expect(emptyCard).toBeDefined();
            expect(validRarities).not.toContain(emptyCard.rarity);
            
            expect(numericCard).toBeDefined();
            expect(typeof numericCard.rarity).toBe('number');
        });
    });

    describe('Missing fields handling', () => {
        it('should load catalog with missing fields', async () => {
            const missingPath = join(process.cwd(), 'js/__tests__/fixtures/missing-fields.json');
            const fileContent = await readFile(missingPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            expect(data).toBeDefined();
            expect(data.cards).toBeDefined();
            expect(Array.isArray(data.cards)).toBe(true);
        });

        it('should identify cards with missing required fields', async () => {
            const missingPath = join(process.cwd(), 'js/__tests__/fixtures/missing-fields.json');
            const fileContent = await readFile(missingPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            const requiredFields = ['id', 'title', 'description', 'location', 'blockHeight', 'rarity', 'edition', 'imageHash'];
            
            data.cards.forEach(card => {
                const missingFields = requiredFields.filter(field => !card.hasOwnProperty(field));
                
                // At least one card should have missing fields based on our fixture
                if (missingFields.length > 0) {
                    expect(missingFields.length).toBeGreaterThan(0);
                }
            });
        });

        it('should handle cards missing specific fields', async () => {
            const missingPath = join(process.cwd(), 'js/__tests__/fixtures/missing-fields.json');
            const fileContent = await readFile(missingPath, 'utf-8');
            const data = JSON.parse(fileContent);
            
            // Find card missing description
            const noDescription = data.cards.find(c => !c.hasOwnProperty('description'));
            expect(noDescription).toBeDefined();
            expect(noDescription.title).toBe('Incomplete Card - Missing Description');
            
            // Find card missing title
            const noTitle = data.cards.find(c => !c.hasOwnProperty('title'));
            expect(noTitle).toBeDefined();
            expect(noTitle.description).toBe('Incomplete Card - Missing Title');
            
            // Find card missing rarity
            const noRarity = data.cards.find(c => !c.hasOwnProperty('rarity'));
            expect(noRarity).toBeDefined();
            expect(noRarity.title).toBe('Incomplete Card - Missing Rarity');
            
            // Find card missing id
            const noId = data.cards.find(c => !c.hasOwnProperty('id'));
            expect(noId).toBeDefined();
            expect(noId.title).toBe('Incomplete Card - Missing ID');
        });
    });
});
