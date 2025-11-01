// Lumimenta Catalog Manager

async function loadCatalog() {
    try {
        const response = await fetch('catalog.json');
        const data = await response.json();
        return data.cards;
    } catch (error) {
        console.error('Error loading catalog:', error);
        return [];
    }
}

function calculateStats(cards) {
    const stats = {
        total: cards.length,
        blue: cards.filter(c => c.rarity === 'blue').length,
        silver: cards.filter(c => c.rarity === 'silver').length,
        gold: cards.filter(c => c.rarity === 'gold').length,
        uniqueSubjects: new Set(cards.map(c => c.title)).size
    };
    return stats;
}

function displayStats(stats) {
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
    if (statsElement) {
        statsElement.innerHTML = statsHTML;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    const cards = await loadCatalog();
    const stats = calculateStats(cards);
    displayStats(stats);
});
