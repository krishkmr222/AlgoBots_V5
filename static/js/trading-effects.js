// Trading-specific visual effects for OpenAlgo
// Real-time data visualization and interactive elements

class TradingEffects {
    constructor() {
        this.priceAnimations = new Map();
        this.chartInstances = new Map();
        this.soundEnabled = true;
        this.init();
    }

    init() {
        this.initPriceAnimations();
        this.initSoundSystem();
        this.initRealTimeUpdates();
        this.initTradingCharts();
    }

    // Animate price changes with color coding
    animatePrice(element, newValue, oldValue = null) {
        if (!element) return;

        const numericNew = parseFloat(newValue);
        const numericOld = oldValue ? parseFloat(oldValue) : null;
        
        // Determine price movement
        let direction = 'neutral';
        if (numericOld !== null) {
            direction = numericNew > numericOld ? 'up' : numericNew < numericOld ? 'down' : 'neutral';
        }

        // Color scheme for price movements
        const colors = {
            up: '#10b981',    // green
            down: '#ef4444',  // red
            neutral: '#64748b' // gray
        };

        // Animate the price change
        gsap.timeline()
            .set(element, { color: colors[direction] })
            .to(element, {
                scale: 1.1,
                duration: 0.2,
                ease: 'power2.out'
            })
            .to(element, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(element, {
                color: 'inherit',
                duration: 2,
                ease: 'power1.out'
            });

        // Play sound for significant changes
        if (Math.abs(numericNew - (numericOld || 0)) > 0.01) {
            this.playTradingSound(direction);
        }
    }

    // Initialize price animation system
    initPriceAnimations() {
        // Observe all price elements for changes
        const priceElements = document.querySelectorAll('.price, .stat-value, [data-price]');
        
        priceElements.forEach(element => {
            this.observePriceChanges(element);
        });
    }

    // Observe price element changes
    observePriceChanges(element) {
        if (!element) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const newValue = element.textContent.trim();
                    const oldValue = element.dataset.lastValue;
                    
                    if (oldValue && oldValue !== newValue) {
                        this.animatePrice(element, newValue, oldValue);
                    }
                    
                    element.dataset.lastValue = newValue;
                }
            });
        });

        observer.observe(element, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Store initial value
        element.dataset.lastValue = element.textContent.trim();
    }

    // Sound system for trading feedback
    initSoundSystem() {
        this.sounds = {
            up: this.createAudioContext(800, 0.1, 'sine'),
            down: this.createAudioContext(400, 0.15, 'sine'),
            notification: this.createAudioContext(600, 0.1, 'square'),
            error: this.createAudioContext(200, 0.2, 'sawtooth')
        };
    }

    createAudioContext(frequency, duration, type = 'sine') {
        return () => {
            if (!this.soundEnabled) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn('Audio playback failed:', error);
            }
        };
    }

    playTradingSound(type) {
        if (this.sounds[type]) {
            this.sounds[type]();
        }
    }

    // Toggle sound on/off
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    // Real-time updates simulation
    initRealTimeUpdates() {
        // Simulate real-time price updates for demo
        if (document.querySelector('.demo-mode')) {
            this.startDemoUpdates();
        }
    }

    startDemoUpdates() {
        const priceElements = document.querySelectorAll('.stat-value[data-demo="true"]');
        
        priceElements.forEach(element => {
            setInterval(() => {
                const currentValue = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
                if (!isNaN(currentValue)) {
                    const change = (Math.random() - 0.5) * currentValue * 0.02; // ±2% change
                    const newValue = (currentValue + change).toFixed(2);
                    element.textContent = newValue;
                }
            }, 3000 + Math.random() * 2000); // Random interval 3-5 seconds
        });
    }

    // Initialize trading charts
    initTradingCharts() {
        const chartContainers = document.querySelectorAll('.trading-chart');
        
        chartContainers.forEach(container => {
            this.createMiniChart(container);
        });
    }

    createMiniChart(container) {
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth || 200;
        canvas.height = container.offsetHeight || 100;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        
        // Generate sample trading data
        const data = this.generateSampleData(50);
        this.drawCandlestickChart(ctx, data, canvas.width, canvas.height);
        
        // Store chart instance
        this.chartInstances.set(container, { canvas, ctx, data });
    }

    generateSampleData(points) {
        const data = [];
        let price = 100 + Math.random() * 50;
        
        for (let i = 0; i < points; i++) {
            const change = (Math.random() - 0.5) * 5;
            price += change;
            
            data.push({
                time: i,
                open: price,
                high: price + Math.random() * 2,
                low: price - Math.random() * 2,
                close: price + (Math.random() - 0.5),
                volume: Math.random() * 1000
            });
        }
        
        return data;
    }

    drawCandlestickChart(ctx, data, width, height) {
        if (!ctx || !data.length) return;

        ctx.clearRect(0, 0, width, height);
        
        const padding = 10;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Find min/max values
        const prices = data.flatMap(d => [d.high, d.low]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;
        
        // Draw candlesticks
        const candleWidth = chartWidth / data.length * 0.8;
        
        data.forEach((candle, index) => {
            const x = padding + (index * chartWidth / data.length) + candleWidth / 2;
            const openY = padding + (maxPrice - candle.open) / priceRange * chartHeight;
            const closeY = padding + (maxPrice - candle.close) / priceRange * chartHeight;
            const highY = padding + (maxPrice - candle.high) / priceRange * chartHeight;
            const lowY = padding + (maxPrice - candle.low) / priceRange * chartHeight;
            
            // Determine candle color
            const isGreen = candle.close > candle.open;
            ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
            ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
            
            // Draw wick
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.stroke();
            
            // Draw body
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        });
    }

    // Create loading skeleton for trading cards
    createTradingCardSkeleton(container) {
        if (!container) return;

        const skeleton = document.createElement('div');
        skeleton.className = 'trading-card-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-price"></div>
            <div class="skeleton-line skeleton-change"></div>
            <div class="skeleton-chart"></div>
        `;
        
        container.appendChild(skeleton);
        
        // Animate skeleton
        gsap.to(skeleton.querySelectorAll('.skeleton-line, .skeleton-chart'), {
            opacity: 0.5,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            stagger: 0.1
        });
        
        return skeleton;
    }

    // Update chart with new data
    updateChart(container, newData) {
        const chartInstance = this.chartInstances.get(container);
        if (chartInstance) {
            chartInstance.data = newData;
            this.drawCandlestickChart(
                chartInstance.ctx, 
                newData, 
                chartInstance.canvas.width, 
                chartInstance.canvas.height
            );
        }
    }

    // Cleanup function
    destroy() {
        this.chartInstances.clear();
        this.priceAnimations.clear();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.tradingEffects = new TradingEffects();
});

// Export for external use
window.TradingEffects = TradingEffects;