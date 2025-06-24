// Advanced Animations for OpenAlgo
// Using GSAP, AOS, Typed.js, and custom effects

class OpenAlgoAnimations {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        } catch (error) {
            console.error('Animation initialization failed:', error);
        }
    }

    initialize() {
        if (this.isInitialized) return;

        try {
            // Initialize AOS (Animate On Scroll)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 1000,
                    easing: 'ease-out-cubic',
                    once: true,
                    offset: 100,
                    delay: 0,
                });
            }

            // Initialize GSAP animations
            this.initGSAPAnimations();
            
            // Initialize typed text effects
            this.initTypedEffects();
            
            // Initialize particle effects
            this.initParticleEffects();
            
            // Initialize smooth scrolling
            this.initSmoothScrolling();
            
            // Initialize interactive elements
            this.initInteractiveElements();
            
            this.isInitialized = true;
            console.log('OpenAlgo Advanced Animations initialized successfully');
        } catch (error) {
            console.error('Failed to initialize animations:', error);
        }
    }

    initGSAPAnimations() {
        // Hero section entrance animation
        const heroTimeline = gsap.timeline();
        
        heroTimeline
            .from('.hero-title', {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            })
            .from('.hero-subtitle', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            }, '-=0.8')
            .from('.hero-buttons', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.6');

        // Navbar animation on scroll
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to('.navbar', {
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            scrollTrigger: {
                trigger: 'body',
                start: 'top -80',
                end: '99999',
                toggleActions: 'play none none reverse'
            }
        });

        // Stats counter animation
        gsap.utils.toArray('.stat-value').forEach(stat => {
            const value = stat.textContent;
            const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(numericValue)) {
                gsap.fromTo(stat, {
                    textContent: 0
                }, {
                    textContent: numericValue,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        });

        // Card hover animations
        gsap.utils.toArray('.card').forEach(card => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(card, {
                y: -10,
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });

            card.addEventListener('mouseenter', () => tl.play());
            card.addEventListener('mouseleave', () => tl.reverse());
        });
    }

    initTypedEffects() {
        // Typewriter effect for "Your Personal" text
        const personalTextElement = document.querySelector('.typed-personal-text');
        if (personalTextElement) {
            const texts = ['Your Personal', 'Your AI-Powered', 'Your Automated', 'Your Smart', 'Your Advanced'];
            let currentTextIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            
            function typeWriter() {
                const currentText = texts[currentTextIndex];
                
                if (isDeleting) {
                    personalTextElement.textContent = currentText.substring(0, currentCharIndex - 1);
                    currentCharIndex--;
                } else {
                    personalTextElement.textContent = currentText.substring(0, currentCharIndex + 1);
                    currentCharIndex++;
                }
                
                let typingSpeed = isDeleting ? 100 : 150;
                
                if (!isDeleting && currentCharIndex === currentText.length) {
                    // Pause at end of text
                    typingSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && currentCharIndex === 0) {
                    isDeleting = false;
                    currentTextIndex = (currentTextIndex + 1) % texts.length;
                    typingSpeed = 500;
                }
                
                setTimeout(typeWriter, typingSpeed);
            }
            
            // Start the typewriter effect
            typeWriter();
        }
        
        // Remove the old typed.js implementation for the platform text
        // Platform text now has static gradient animation via CSS
    }

    initParticleEffects() {
        // Particle.js background effect
        const particleContainer = document.querySelector('#particles-js');
        if (particleContainer && typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#64748b'
                    },
                    shape: {
                        type: 'circle'
                    },
                    opacity: {
                        value: 0.5,
                        random: false
                    },
                    size: {
                        value: 3,
                        random: true
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#64748b',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }

    initSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: target,
                            offsetY: 100
                        },
                        ease: 'power2.inOut'
                    });
                }
            });
        });
    }

    initInteractiveElements() {
        // Button hover effects
        gsap.utils.toArray('.btn').forEach(btn => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out'
            });

            btn.addEventListener('mouseenter', () => tl.play());
            btn.addEventListener('mouseleave', () => tl.reverse());
        });

        // Interactive dashboard cards
        gsap.utils.toArray('.stat-card').forEach(card => {
            const tl = gsap.timeline({ paused: true });
            
            tl.to(card, {
                y: -8,
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                duration: 0.3,
                ease: 'power2.out'
            });

            card.addEventListener('mouseenter', () => tl.play());
            card.addEventListener('mouseleave', () => tl.reverse());
        });

        // Page load animation
        const pageLoadTl = gsap.timeline();
        pageLoadTl.from('body', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    // Method to trigger specific animations
    triggerAnimation(elementSelector, animationType = 'fadeIn') {
        const element = document.querySelector(elementSelector);
        if (!element) return;

        switch (animationType) {
            case 'fadeIn':
                gsap.fromTo(element, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                );
                break;
            case 'slideIn':
                gsap.fromTo(element,
                    { x: -100, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                );
                break;
            case 'scaleIn':
                gsap.fromTo(element,
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
                );
                break;
        }
    }

    // Method to create custom loading spinner
    createLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-circle"></div>
            <div class="spinner-text">Loading OpenAlgo...</div>
        `;
        
        if (container) {
            container.appendChild(spinner);
        }
        
        return spinner;
    }

    // Clean up function
    destroy() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(t => t.kill());
        }
        this.isInitialized = false;
    }
}

// Auto-initialize when DOM is ready
const openAlgoAnimations = new OpenAlgoAnimations();

// Export for external use
window.OpenAlgoAnimations = OpenAlgoAnimations;
window.openAlgoAnimations = openAlgoAnimations;