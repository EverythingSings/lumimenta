// Lumimenta Catalog Manager

// DOM element cache for performance
const domCache = {
    statsContainer: null,
    galleryContainer: null,
    availabilityGrid: null,
    nav: null,
    navToggle: null,
    navMenu: null,
    navLinks: null
};

// Initialize DOM cache
function initDOMCache() {
    if (typeof document === 'undefined') return;
    
    domCache.statsContainer = document.getElementById('catalog-stats');
    domCache.galleryContainer = document.getElementById('gallery-container');
    domCache.availabilityGrid = document.getElementById('availability-grid');
}

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

// Testable functions - exported for testing

/**
 * Calculate total number of cards
 * @param {Array} cards - Array of card objects
 * @returns {number} Total count of cards
 */
function calculateTotalCards(cards) {
    return cards.length;
}

/**
 * Calculate rarity distribution across cards
 * @param {Array} cards - Array of card objects
 * @returns {Object} Object with counts for each rarity (blue, silver, gold)
 */
function calculateRarityDistribution(cards) {
    const distribution = {
        blue: 0,
        silver: 0,
        gold: 0
    };
    
    // Count rarities, handling both string and array formats
    cards.forEach(card => {
        const rarities = Array.isArray(card.rarity) ? card.rarity : [card.rarity];
        rarities.forEach(rarity => {
            if (rarity === 'blue') distribution.blue++;
            else if (rarity === 'silver') distribution.silver++;
            else if (rarity === 'gold') distribution.gold++;
        });
    });
    
    return distribution;
}

/**
 * Calculate comprehensive statistics for card collection
 * @param {Array} cards - Array of card objects
 * @returns {Object} Statistics object with total, rarities, and unique subjects
 */
function calculateStatistics(cards) {
    // Extract base titles (remove "(Back)" suffix) to count unique subjects
    const baseTitles = cards.map(c => c.title.replace(/\s*\(Back\)$/, ''));
    
    const distribution = calculateRarityDistribution(cards);
    
    return {
        total: calculateTotalCards(cards),
        blue: distribution.blue,
        silver: distribution.silver,
        gold: distribution.gold,
        uniqueSubjects: new Set(baseTitles).size
    };
}

/**
 * Format card data for display
 * @param {Object} card - Card object
 * @returns {Object} Formatted card data with display-ready properties
 */
function formatCardData(card) {
    // Format rarity for display (handle both string and array formats)
    let rarityDisplay;
    if (Array.isArray(card.rarity)) {
        rarityDisplay = card.rarity.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(' & ');
    } else {
        rarityDisplay = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
    }
    
    // Get availability status, default to "unknown" if not specified
    const availability = card.availability || 'unknown';
    const availabilityDisplay = availability.charAt(0).toUpperCase() + availability.slice(1);
    
    // Check if this is a back card
    const isBack = card.title.includes('(Back)');
    const baseTitle = card.title.replace(/\s*\(Back\)$/, '');
    
    return {
        id: card.id,
        title: card.title,
        baseTitle: baseTitle,
        description: card.description,
        location: card.location,
        blockHeight: card.blockHeight,
        rarity: card.rarity,
        rarityDisplay: rarityDisplay,
        edition: card.edition,
        imageHash: card.imageHash,
        availability: availability,
        availabilityDisplay: availabilityDisplay,
        isBack: isBack
    };
}

// Backward compatibility: keep calculateStats as alias
function calculateStats(cards) {
    return calculateStatistics(cards);
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
    
    const statsElement = domCache.statsContainer || document.getElementById('catalog-stats');
    if (statsElement) {
        statsElement.innerHTML = statsHTML;
    }
}

// Counter animation function with configurable duration and easing
function animateCounter(element, target, duration = 1000) {
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.floor(target * easedProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
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
    if (!('IntersectionObserver' in window)) {
        document.body.classList.add('no-intersection-observer');
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('animate-in');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    let animationQueue = [];
    let isAnimating = false;

    function processAnimationQueue() {
        if (isAnimating || animationQueue.length === 0) return;

        isAnimating = true;
        const batch = animationQueue.splice(0, 2);
        batch.forEach(el => el.classList.add('animate-in'));

        setTimeout(() => {
            isAnimating = false;
            processAnimationQueue();
        }, 100);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
                animationQueue.push(entry.target);
                processAnimationQueue();
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => observer.observe(section));
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
        if (button.dataset.initialized === 'true') return;
        button.dataset.initialized = 'true';
        
        let lastInteractionTime = 0;
        const debounceDelay = 300;
        
        const performFlip = () => {
            const now = Date.now();
            if (now - lastInteractionTime < debounceDelay) return;
            lastInteractionTime = now;
            
            const card = button.closest('.flip-card');
            if (!card) return;
            
            const isFlipped = card.classList.contains('flipped');
            card.classList.add('flipping');
            card.classList.toggle('flipped');
            
            const flipText = button.querySelector('.flip-text');
            if (flipText) {
                if (isFlipped) {
                    button.setAttribute('aria-label', 'Flip card to see back');
                    flipText.textContent = 'See Back';
                } else {
                    button.setAttribute('aria-label', 'Flip card to see front');
                    flipText.textContent = 'See Front';
                }
            }
            
            setTimeout(() => card.classList.remove('flipping'), 600);
        };
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            performFlip();
        });
        
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
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
        
        const galleryContainer = domCache.galleryContainer || document.getElementById('gallery-container');
        if (galleryContainer) {
            galleryContainer.innerHTML = galleryHTML;
            initializeFlipButtons();
        }
    } catch (error) {
        console.error('Failed to generate gallery:', error);
        const galleryContainer = domCache.galleryContainer || document.getElementById('gallery-container');
        if (galleryContainer) {
            galleryContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Unable to load gallery. Please try refreshing the page.</p>';
        }
    }
}

// Sticky Navigation Functionality
function initStickyNavigation() {
    // Use cached elements or query once
    domCache.nav = domCache.nav || document.querySelector('.sticky-nav');
    domCache.navToggle = domCache.navToggle || document.querySelector('.nav-toggle');
    domCache.navMenu = domCache.navMenu || document.querySelector('.nav-menu');
    domCache.navLinks = domCache.navLinks || document.querySelectorAll('.nav-menu a');
    
    const { nav, navToggle, navMenu, navLinks } = domCache;
    
    if (!nav || !navToggle || !navMenu) {
        console.warn('Sticky navigation elements not found');
        return;
    }
    
    // Mobile menu toggle functionality
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Click-outside-to-close behavior for mobile menu
    document.addEventListener('click', (event) => {
        const isClickInsideNav = nav.contains(event.target);
        const isMenuActive = navMenu.classList.contains('active');
        
        if (!isClickInsideNav && isMenuActive) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Smooth scroll behavior for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for sticky nav height
                const navHeight = nav.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20; // 20px extra padding
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active section highlighting using IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -80% 0px', // Trigger when section is near top
            threshold: 0
        };
        
        let currentActiveSection = null;
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    // Only update if this is a different section
                    if (currentActiveSection !== sectionId) {
                        currentActiveSection = sectionId;
                        
                        // Remove active class from all links
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                        });
                        
                        // Add active class to corresponding link
                        const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        let scrollTimeout;
        
        function updateActiveSection() {
            const scrollPosition = window.scrollY + 100;
            let currentSection = null;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section;
                }
            });
            
            if (currentSection) {
                const sectionId = currentSection.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                
                const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        }
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveSection, 100);
        }, { passive: true });
        
        updateActiveSection();
    }
    
    // Simplified scroll animation - only for hero section
    const hero = document.querySelector('.hero');
    if (hero && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    heroObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        heroObserver.observe(hero);
    } else if (hero) {
        // Fallback: show hero immediately if no IntersectionObserver
        hero.classList.add('animate-in');
    }
}

// Display card availability grid
function displayAvailability(cards) {
    const frontCards = cards.filter(card => !card.title.includes('(Back)'));
    
    const availabilityHTML = frontCards.map(card => {
        const formattedCard = formatCardData(card);
        
        return `
            <div class="availability-card" data-status="${formattedCard.availability}">
                <img src="images/${formattedCard.imageHash}.jpg" 
                     alt="${formattedCard.title}" 
                     loading="lazy">
                <div class="card-info">
                    <h4 class="card-title">${formattedCard.title}</h4>
                    <p class="card-rarity">${formattedCard.rarityDisplay} • ${formattedCard.edition}</p>
                    <span class="availability-badge ${formattedCard.availability}">${formattedCard.availabilityDisplay}</span>
                </div>
            </div>
        `;
    }).join('');
    
    const availabilityContainer = domCache.availabilityGrid || document.getElementById('availability-grid');
    if (availabilityContainer) {
        availabilityContainer.innerHTML = availabilityHTML;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize DOM cache first
    initDOMCache();
    
    const cards = await loadCatalog();
    const stats = calculateStats(cards);
    displayStats(stats);
    
    displayAvailability(cards);
    initializeFlipButtons();
    
    await generateGallery();
    
    initScrollAnimations();
    initCounterAnimations();
    initStickyNavigation();
});

// Export functions for testing and integration
export {
    loadCatalog,
    calculateTotalCards,
    calculateRarityDistribution,
    calculateStatistics,
    formatCardData
};
