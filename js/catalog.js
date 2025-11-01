// Lumimenta Catalog Manager

// Feature detection for backdrop-filter support
function detectBackdropFilterSupport() {
    if (!CSS.supports('backdrop-filter', 'blur(10px)') && 
        !CSS.supports('-webkit-backdrop-filter', 'blur(10px)')) {
        document.body.classList.add('no-backdrop-filter');
    }
}

// Run feature detection immediately
detectBackdropFilterSupport();

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

// Counter animation function with configurable duration and easing
function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    // Easing function for smooth animation (easeOutCubic)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing to progress
        const easedProgress = easeOutCubic(progress);
        const current = Math.floor(start + (target - start) * easedProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is exact
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize counter animations for stats
function initCounterAnimations() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // Graceful degradation: numbers display immediately without animation
        return;
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all stat numbers in the stats container
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => {
                    const target = parseInt(num.textContent);
                    if (!isNaN(target)) {
                        // Reset to 0 before animating
                        num.textContent = '0';
                        // Animate to target value
                        animateCounter(num, target, 1000);
                    }
                });
                // Unobserve to ensure animation triggers only once
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe the stats container
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
}

// Scroll-triggered animations with Intersection Observer
function initScrollAnimations() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // Graceful degradation: show all content immediately
        document.body.classList.add('no-intersection-observer');
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('animate-in');
        });
        return;
    }

    // Configure Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    // Limit simultaneous animations to prevent frame drops
    let animationQueue = [];
    let isAnimating = false;
    const MAX_SIMULTANEOUS_ANIMATIONS = 2;

    function processAnimationQueue() {
        if (isAnimating || animationQueue.length === 0) {
            return;
        }

        isAnimating = true;
        const batch = animationQueue.splice(0, MAX_SIMULTANEOUS_ANIMATIONS);
        
        batch.forEach(element => {
            element.classList.add('animate-in');
        });

        // Wait for animations to complete before processing next batch
        setTimeout(() => {
            isAnimating = false;
            processAnimationQueue();
        }, 100); // Small delay between batches
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
                animationQueue.push(entry.target);
                processAnimationQueue();
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    const cards = await loadCatalog();
    const stats = calculateStats(cards);
    displayStats(stats);
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize counter animations for stats
    initCounterAnimations();
});
