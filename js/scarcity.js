// Lumimenta Scarcity Visualization Module

/**
 * Integration with catalog system:
 * - Imports loadCatalog() to reuse existing data loading mechanism
 * - Avoids duplicate network requests by sharing catalog data
 * - Uses IntersectionObserver for lazy loading when section is visible
 * - Provides fallback for browsers without IntersectionObserver support
 */
import { loadCatalog } from './catalog.js';

/**
 * Calculate annotation ink color distribution
 * @param {Array} cards - Array of card objects from catalog
 * @returns {Object} Distribution with counts and percentages
 */
function calculateDistribution(cards) {
    // Handle invalid input
    if (!Array.isArray(cards)) {
        return {
            blue: { count: 0, percentage: 0 },
            silver: { count: 0, percentage: 0 },
            gold: { count: 0, percentage: 0 },
            total: 0
        };
    }

    const distribution = {
        blue: 0,
        silver: 0,
        gold: 0
    };

    // Count rarities, handling both string and array formats
    cards.forEach(card => {
        if (!card.rarity) return;

        const rarities = Array.isArray(card.rarity) ? card.rarity : [card.rarity];
        rarities.forEach(rarity => {
            if (rarity === 'blue') distribution.blue++;
            else if (rarity === 'silver') distribution.silver++;
            else if (rarity === 'gold') distribution.gold++;
        });
    });

    // Calculate total
    const total = distribution.blue + distribution.silver + distribution.gold;

    // Calculate percentages (to one decimal place)
    const calculatePercentage = (count) => {
        if (total === 0) return 0;
        return Math.round((count / total) * 1000) / 10;
    };

    return {
        blue: {
            count: distribution.blue,
            percentage: calculatePercentage(distribution.blue)
        },
        silver: {
            count: distribution.silver,
            percentage: calculatePercentage(distribution.silver)
        },
        gold: {
            count: distribution.gold,
            percentage: calculatePercentage(distribution.gold)
        },
        total: total
    };
}

/**
 * Calculate forecast recommendation for next mint
 * @param {Object} distribution - Distribution object from calculateDistribution
 * @returns {Object} Forecast with recommended color and rationale
 */
function calculateForecast(distribution) {
    const counts = {
        blue: distribution.blue.count,
        silver: distribution.silver.count,
        gold: distribution.gold.count
    };

    // Find the minimum count
    const minCount = Math.min(counts.blue, counts.silver, counts.gold);

    // Determine recommended color with priority: gold > silver > blue
    let recommendedColor;
    if (counts.gold === minCount) {
        recommendedColor = 'gold';
    } else if (counts.silver === minCount) {
        recommendedColor = 'silver';
    } else {
        recommendedColor = 'blue';
    }

    // Generate rationale
    let rationale;
    if (counts.blue === counts.silver && counts.silver === counts.gold) {
        rationale = `All annotation colors are perfectly balanced at ${counts.gold} each. Minting with gold ink maintains the premium tier while preserving balance.`;
    } else if (minCount === 0) {
        rationale = `${recommendedColor.charAt(0).toUpperCase() + recommendedColor.slice(1)} annotations have not been minted yet. Starting with ${recommendedColor} ink will establish this rarity tier.`;
    } else {
        const colorName = recommendedColor.charAt(0).toUpperCase() + recommendedColor.slice(1);
        const percentage = distribution[recommendedColor].percentage;
        rationale = `${colorName} annotations are currently underrepresented at ${percentage}% (${minCount} cards). Minting with ${recommendedColor} ink will help balance the distribution.`;
    }

    return {
        recommendedColor: recommendedColor,
        rationale: rationale
    };
}

/**
 * Render scarcity chart visualization using Canvas API
 * @param {Object} distribution - Distribution object from calculateDistribution
 * @param {HTMLCanvasElement} canvas - Canvas element for rendering
 */
function renderScarcityChart(distribution, canvas) {
    // Check if canvas is available
    if (!canvas || !canvas.getContext) {
        renderCSSFallback(distribution, canvas);
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        renderCSSFallback(distribution, canvas);
        return;
    }

    // Canonical rarity colors
    const colors = {
        blue: '#4a90e2',
        silver: '#c0c0c0',
        gold: '#c79f60'
    };

    // Responsive sizing
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Chart configuration
    const padding = { top: 20, right: 120, bottom: 20, left: 100 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barHeight = 40;
    const barSpacing = 30;

    // Data for rendering
    const data = [
        { label: 'Blue', color: colors.blue, count: distribution.blue.count, percentage: distribution.blue.percentage },
        { label: 'Silver', color: colors.silver, count: distribution.silver.count, percentage: distribution.silver.percentage },
        { label: 'Gold', color: colors.gold, count: distribution.gold.count, percentage: distribution.gold.percentage }
    ];

    // Find max count for scaling
    const maxCount = Math.max(distribution.blue.count, distribution.silver.count, distribution.gold.count);
    const scale = maxCount > 0 ? chartWidth / maxCount : 0;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animation state
    let animationProgress = prefersReducedMotion ? 1 : 0;
    let animationStartTime = null;
    const animationDuration = 800; // 800ms as per design

    function drawChart(progress) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set font for labels
        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.textBaseline = 'middle';

        // Draw bars
        data.forEach((item, index) => {
            const y = padding.top + index * (barHeight + barSpacing);
            const barWidth = item.count * scale * progress;

            // Draw label on the left
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'right';
            ctx.fillText(item.label, padding.left - 10, y + barHeight / 2);

            // Draw bar background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(padding.left, y, chartWidth, barHeight);

            // Draw bar
            ctx.fillStyle = item.color;
            ctx.fillRect(padding.left, y, barWidth, barHeight);

            // Draw count and percentage on the right
            if (progress > 0.5) {
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'left';
                const text = `${item.count} (${item.percentage.toFixed(1)}%)`;
                ctx.fillText(text, padding.left + chartWidth + 10, y + barHeight / 2);
            }
        });
    }

    function animate(timestamp) {
        if (!animationStartTime) {
            animationStartTime = timestamp;
        }

        const elapsed = timestamp - animationStartTime;
        animationProgress = Math.min(elapsed / animationDuration, 1);

        // Easing function (easeOutCubic)
        const easedProgress = 1 - Math.pow(1 - animationProgress, 3);

        drawChart(easedProgress);

        if (animationProgress < 1) {
            requestAnimationFrame(animate);
        }
    }

    // Start animation or draw immediately
    if (prefersReducedMotion) {
        drawChart(1);
    } else {
        requestAnimationFrame(animate);
    }

    // Handle window resize
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderScarcityChart(distribution, canvas);
        }, 100);
    };

    window.addEventListener('resize', handleResize);
}

/**
 * Fallback to CSS-based visualization if canvas unavailable
 * @param {Object} distribution - Distribution object
 * @param {HTMLElement} element - Element to render fallback in
 */
function renderCSSFallback(distribution, element) {
    if (!element || !element.parentElement) return;

    const container = element.parentElement;
    
    // Create fallback HTML structure
    const fallbackHTML = `
        <div class="scarcity-chart-fallback" role="img" aria-label="Scarcity distribution chart">
            <div class="fallback-bar blue">
                <span class="fallback-label">Blue</span>
                <div class="fallback-bar-fill" style="width: ${distribution.blue.percentage}%"></div>
                <span class="fallback-value">${distribution.blue.count} (${distribution.blue.percentage.toFixed(1)}%)</span>
            </div>
            <div class="fallback-bar silver">
                <span class="fallback-label">Silver</span>
                <div class="fallback-bar-fill" style="width: ${distribution.silver.percentage}%"></div>
                <span class="fallback-value">${distribution.silver.count} (${distribution.silver.percentage.toFixed(1)}%)</span>
            </div>
            <div class="fallback-bar gold">
                <span class="fallback-label">Gold</span>
                <div class="fallback-bar-fill" style="width: ${distribution.gold.percentage}%"></div>
                <span class="fallback-value">${distribution.gold.count} (${distribution.gold.percentage.toFixed(1)}%)</span>
            </div>
        </div>
    `;

    // Replace canvas with fallback
    element.style.display = 'none';
    container.insertAdjacentHTML('beforeend', fallbackHTML);
}

/**
 * Animate statistics counters with easing
 * @param {Object} distribution - Distribution object from calculateDistribution
 * @param {HTMLElement} container - Container element with stat cards
 */
function animateStatistics(distribution, container) {
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Find all stat cards
    const statCards = container.querySelectorAll('.stat-card');
    if (statCards.length === 0) return;

    // Animation configuration
    const animationDuration = 1200; // 1200ms as per design
    let animationStartTime = null;

    // easeOutCubic easing function
    const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
    };

    // Get target values for each rarity
    const targets = {
        blue: { count: distribution.blue.count, percentage: distribution.blue.percentage },
        silver: { count: distribution.silver.count, percentage: distribution.silver.percentage },
        gold: { count: distribution.gold.count, percentage: distribution.gold.percentage }
    };

    // If reduced motion is preferred, set values immediately
    if (prefersReducedMotion) {
        statCards.forEach(card => {
            const rarity = card.classList.contains('blue') ? 'blue' :
                          card.classList.contains('silver') ? 'silver' : 'gold';
            
            const valueElement = card.querySelector('.stat-value');
            const percentageElement = card.querySelector('.stat-percentage');

            if (valueElement) {
                valueElement.textContent = targets[rarity].count;
            }
            if (percentageElement) {
                percentageElement.textContent = `${targets[rarity].percentage.toFixed(1)}%`;
            }
        });
        return;
    }

    // Animation function
    function animate(timestamp) {
        if (!animationStartTime) {
            animationStartTime = timestamp;
        }

        const elapsed = timestamp - animationStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const easedProgress = easeOutCubic(progress);

        // Update each stat card
        statCards.forEach(card => {
            const rarity = card.classList.contains('blue') ? 'blue' :
                          card.classList.contains('silver') ? 'silver' : 'gold';
            
            const valueElement = card.querySelector('.stat-value');
            const percentageElement = card.querySelector('.stat-percentage');

            if (valueElement) {
                const currentCount = Math.round(targets[rarity].count * easedProgress);
                valueElement.textContent = currentCount;
            }

            if (percentageElement) {
                const currentPercentage = targets[rarity].percentage * easedProgress;
                percentageElement.textContent = `${currentPercentage.toFixed(1)}%`;
            }
        });

        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    // Start animation
    requestAnimationFrame(animate);
}

/**
 * Update forecast panel with recommendation
 * @param {Object} forecast - Forecast object from calculateForecast
 * @param {HTMLElement} panel - Forecast panel element
 */
function updateForecastPanel(forecast, panel) {
    if (!panel || !forecast) return;

    // Canonical rarity colors
    const colors = {
        blue: '#4a90e2',
        silver: '#c0c0c0',
        gold: '#c79f60'
    };

    // Find forecast elements
    const colorIndicator = panel.querySelector('.forecast-color-indicator');
    const colorName = panel.querySelector('.forecast-color-name');
    const rationale = panel.querySelector('.forecast-rationale');

    if (!colorIndicator || !colorName || !rationale) return;

    // Update color indicator background
    colorIndicator.style.backgroundColor = colors[forecast.recommendedColor];

    // Update color name text
    const displayName = forecast.recommendedColor.charAt(0).toUpperCase() + forecast.recommendedColor.slice(1);
    colorName.textContent = displayName;

    // Update rationale text
    rationale.textContent = forecast.rationale;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia ? 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

    // Add fade-in animation (400ms)
    if (!prefersReducedMotion) {
        // Set initial state
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(10px)';

        // Trigger reflow to ensure initial state is applied
        panel.offsetHeight;

        // Apply transition
        panel.style.transition = 'opacity 400ms ease-out, transform 400ms ease-out';
        
        // Animate to final state
        requestAnimationFrame(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        });

        // Clean up transition after animation completes
        setTimeout(() => {
            panel.style.transition = '';
        }, 400);
    } else {
        // Instant display for reduced motion
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
    }
}

/**
 * Display error message in the scarcity section
 * @param {string} message - Error message to display
 */
function displayErrorMessage(message) {
    const scarcitySection = document.getElementById('scarcity');
    if (!scarcitySection) return;

    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'scarcity-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.style.cssText = 'text-align: center; padding: 40px 20px; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); border-radius: 8px; margin: 20px 0;';
    errorDiv.textContent = message;

    // Insert error message after the section description
    const description = scarcitySection.querySelector('.section-description');
    if (description && description.nextSibling) {
        description.parentNode.insertBefore(errorDiv, description.nextSibling);
    } else {
        scarcitySection.appendChild(errorDiv);
    }
}

/**
 * Initialize scarcity visualization with catalog data
 * Loads catalog, calculates distribution, and renders all components
 */
async function initializeScarcityVisualization() {
    try {
        // Load catalog data (reuses existing fetch, no duplicate requests)
        const cards = await loadCatalog();
        
        // Validate catalog data
        if (!cards || cards.length === 0) {
            throw new Error('No catalog data available');
        }

        // Calculate distribution and forecast
        const distribution = calculateDistribution(cards);
        const forecast = calculateForecast(distribution);

        // Get DOM elements
        const canvas = document.getElementById('scarcity-chart');
        const statsGrid = document.querySelector('.scarcity-stats-grid');
        const forecastPanel = document.querySelector('.forecast-panel');

        // Render chart
        if (canvas) {
            renderScarcityChart(distribution, canvas);
        }

        // Animate statistics
        if (statsGrid) {
            animateStatistics(distribution, statsGrid);
        }

        // Update forecast panel
        if (forecastPanel) {
            updateForecastPanel(forecast, forecastPanel);
        }

    } catch (error) {
        console.error('Error initializing scarcity visualization:', error);
        displayErrorMessage('Unable to load scarcity data. Please refresh the page.');
    }
}

/**
 * Set up IntersectionObserver to trigger visualization when section is visible
 * Provides fallback for browsers without IntersectionObserver support
 */
function setupScarcityObserver() {
    const scarcitySection = document.getElementById('scarcity');
    if (!scarcitySection) {
        console.warn('Scarcity section not found in DOM');
        return;
    }

    // Check for IntersectionObserver support
    if ('IntersectionObserver' in window) {
        // Use IntersectionObserver for lazy loading
        const observerOptions = {
            root: null,
            rootMargin: '50px', // Start loading slightly before section is visible
            threshold: 0.1 // Trigger when 10% of section is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section is visible, initialize visualization
                    initializeScarcityVisualization();
                    // Unobserve to ensure initialization happens only once
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Start observing the scarcity section
        observer.observe(scarcitySection);
    } else {
        // Fallback: Initialize immediately if IntersectionObserver not supported
        initializeScarcityVisualization();
    }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupScarcityObserver);
    } else {
        // DOM already loaded
        setupScarcityObserver();
    }
}

// Export functions for testing and integration
export {
    calculateDistribution,
    calculateForecast,
    renderScarcityChart,
    animateStatistics,
    updateForecastPanel,
    initializeScarcityVisualization,
    setupScarcityObserver
};
