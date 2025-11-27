/**
 * Migration script to convert catalog v1 (photo-centric) to v2 (card-centric)
 *
 * V1: 14 entries (front/back pairs), array rarities, combined editions
 * V2: 13 entries (individual cards), single rarities, individual editions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse edition string to extract individual card editions
 * Examples:
 *   "1/2 & 2/2" → ["1/2", "2/2"]
 *   "1/2 each" → ["1/2", "1/2"]
 *   "2/2 each" → ["2/2", "2/2"]
 *   "1/1" → ["1/1"]
 */
function parseEditions(editionString) {
    if (editionString.includes('&')) {
        // "1/2 & 2/2" format
        return editionString.split('&').map(s => s.trim());
    } else if (editionString.includes('each')) {
        // "1/2 each" or "2/2 each" format
        const edition = editionString.replace('each', '').trim();
        return [edition, edition]; // Two cards with same edition
    } else {
        // Single card like "1/1"
        return [editionString];
    }
}

/**
 * Convert v1 catalog to v2 format
 */
function migrateCatalog(v1Data) {
    const v2Cards = [];
    let cardIdCounter = 1;

    // Process only front cards (backs will be extracted for backImage)
    const frontCards = v1Data.cards.filter(card => !card.title.includes('(Back)'));

    frontCards.forEach(frontCard => {
        // Find matching back card
        const backCard = v1Data.cards.find(c =>
            c.title === `${frontCard.title} (Back)`
        );

        // Parse editions
        const editions = parseEditions(frontCard.edition);

        // Handle rarity (could be string or array)
        const rarities = Array.isArray(frontCard.rarity)
            ? frontCard.rarity
            : editions.map(() => frontCard.rarity); // Repeat single rarity for each edition

        // Create a card entry for each edition
        editions.forEach((edition, index) => {
            const card = {
                id: `card-${String(cardIdCounter).padStart(3, '0')}`,
                subject: frontCard.title,
                location: frontCard.location,
                blockHeight: frontCard.blockHeight,
                rarity: rarities[index] || rarities[0],
                edition: edition,
                availability: frontCard.availability,
                frontImage: frontCard.imageHash,
                backImage: backCard ? backCard.imageHash : frontCard.imageHash
            };

            v2Cards.push(card);
            cardIdCounter++;
        });
    });

    return {
        version: "2.0.0",
        cards: v2Cards
    };
}

/**
 * Validate v2 catalog
 */
function validateCatalog(v2Data) {
    const cards = v2Data.cards;

    // Count totals
    const total = cards.length;
    const uniqueSubjects = new Set(cards.map(c => c.subject)).size;

    // Count rarities
    const rarityCount = {
        blue: cards.filter(c => c.rarity === 'blue').length,
        silver: cards.filter(c => c.rarity === 'silver').length,
        gold: cards.filter(c => c.rarity === 'gold').length
    };

    console.log('\n=== V2 Catalog Validation ===');
    console.log(`Total cards: ${total}`);
    console.log(`Unique subjects: ${uniqueSubjects}`);
    console.log(`Blue: ${rarityCount.blue}`);
    console.log(`Silver: ${rarityCount.silver}`);
    console.log(`Gold: ${rarityCount.gold}`);
    console.log('============================\n');

    // Check expected values
    const isValid =
        total === 13 &&
        uniqueSubjects === 7 &&
        rarityCount.blue === 8 &&
        rarityCount.silver === 3 &&
        rarityCount.gold === 2;

    if (isValid) {
        console.log('✅ Validation PASSED! Catalog v2 is correct.');
    } else {
        console.error('❌ Validation FAILED! Expected: 13 total, 7 subjects, 8 blue, 3 silver, 2 gold');
    }

    return isValid;
}

/**
 * Main migration function
 */
function main() {
    const catalogPath = path.join(__dirname, '..', 'catalog.json');
    const outputPath = path.join(__dirname, '..', 'catalog-v2.json');

    console.log('Reading v1 catalog from:', catalogPath);

    // Read v1 catalog
    const v1Data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

    console.log(`Found ${v1Data.cards.length} entries in v1 catalog`);

    // Migrate
    console.log('\nMigrating to v2 format...');
    const v2Data = migrateCatalog(v1Data);

    // Validate
    const isValid = validateCatalog(v2Data);

    if (!isValid) {
        console.error('\nMigration failed validation. Please review the output.');
        process.exit(1);
    }

    // Write v2 catalog
    fs.writeFileSync(outputPath, JSON.stringify(v2Data, null, 2), 'utf8');
    console.log(`\n✅ V2 catalog written to: ${outputPath}`);
    console.log('\nNext steps:');
    console.log('1. Review catalog-v2.json to ensure it looks correct');
    console.log('2. Update code to use v2 schema');
    console.log('3. Run tests to verify everything works');
    console.log('4. Replace catalog.json with catalog-v2.json');
}

// Run migration
main();

export { migrateCatalog, validateCatalog, parseEditions };
