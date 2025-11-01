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

// Pair front and back cards from catalog
function pairCards(cards) {
    const pairs = [];
    const processed = new Set();
    
    cards.forEach(card => {
        if (processed.has(card.id)) return;
        
        // Skip if this is a back card (will be paired with its front)
        const isBack = card.title.includes('(Back)');
        if (isBack) return;
        
        // Look for matching back card
        const frontTitle = card.title;
        const backCard = cards.find(c => 
            c.title === `${frontTitle} (Back)` && !processed.has(c.id)
        );
        
        pairs.push({
            front: card,
            back: backCard || null
        });
        
        processed.add(card.id);
        if (backCard) {
            processed.add(backCard.id);
        }
    });
    
    return pairs;
}

// Create flip card HTML for paired cards
function createFlipCard(frontCard, backCard) {
    return `
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
}

// Create static card HTML for unpaired cards
function createStaticCard(card) {
    return `
        <div style="margin-bottom: 30px;">
            <img src="images/${card.imageHash}.jpg" 
                 alt="${card.description}" 
                 loading="lazy"
                 tabindex="0"
                 style="width: 100%; max-width: 800px; display: block; margin: 0 auto; border: 1px solid #333; border-radius: 4px;">
            <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 10px; font-style: italic;">
                ${card.title}
            </p>
        </div>
    `;
}

// Initialize flip button event listeners
function initializeFlipButtons() {
    const flipButtons = document.querySelectorAll('.flip-button');
    
    flipButtons.forEach(button => {
        let lastTouchTime = 0;
        
        // Shared flip logic
        const performFlip = () => {
            const card = button.closest('.flip-card');
            const isFlipped = card.classList.contains('flipped');
            
            // Add flipping class for performance optimization
            card.classList.add('flipping');
            
            // Toggle flipped state
            card.classList.toggle('flipped');
            
            // Update button text and aria-label
            const flipText = button.querySelector('.flip-text');
            if (isFlipped) {
                button.setAttribute('aria-label', 'Flip card to see back');
                flipText.textContent = 'See Back';
            } else {
                button.setAttribute('aria-label', 'Flip card to see front');
                flipText.textContent = 'See Front';
            }
            
            // Remove flipping class after animation completes
            setTimeout(() => {
                card.classList.remove('flipping');
            }, 600);
        };
        
        // Click event listener
        button.addEventListener('click', (event) => {
            // Prevent click if it's from a touch event (handled by touchend)
            if (event.detail === 0) return; // Keyboard-triggered click
            
            const now = Date.now();
            // Prevent rapid successive clicks/taps
            if (now - lastTouchTime < 300) {
                event.preventDefault();
                return;
            }
            lastTouchTime = now;
            
            performFlip();
        });
        
        // Touch event listener for better mobile support
        button.addEventListener('touchend', (event) => {
            event.preventDefault(); // Prevent ghost click
            
            const now = Date.now();
            // Prevent double-tap
            if (now - lastTouchTime < 300) {
                return;
            }
            lastTouchTime = now;
            
            performFlip();
        });
        
        // Keyboard event listener for Enter and Space keys
        button.addEventListener('keydown', (event) => {
            // Handle Enter (key code 13) and Space (key code 32)
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent default space scrolling
                performFlip();
            }
        });
    });
}

// Generate gallery from catalog data
async function generateGallery() {
    try {
        const cards = await loadCatalog();
        
        if (cards.length === 0) {
            const galleryContainer = document.getElementById('gallery-container');
            if (galleryContainer) {
                galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Unable to load gallery. Please try refreshing the page.</p>';
            }
            return;
        }
        
        // Pair front and back cards
        const cardPairs = pairCards(cards);
        
        // Generate HTML for each pair
        const galleryHTML = cardPairs.map(pair => {
            if (pair.back) {
                return createFlipCard(pair.front, pair.back);
            } else {
                return createStaticCard(pair.front);
            }
        }).join('');
        
        const galleryContainer = document.getElementById('gallery-container');
        if (galleryContainer) {
            galleryContainer.innerHTML = galleryHTML;
            // Initialize flip button event listeners after HTML is inserted
            initializeFlipButtons();
        }
    } catch (error) {
        console.error('Failed to generate gallery:', error);
        const galleryContainer = document.getElementById('gallery-container');
        if (galleryContainer) {
            galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Unable to load gallery. Please try refreshing the page.</p>';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    const cards = await loadCatalog();
    const stats = calculateStats(cards);
    displayStats(stats);
    
    // Generate gallery with flip cards
    await generateGallery();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize counter animations for stats
    initCounterAnimations();
});
