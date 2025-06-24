// Particle.js Configuration for OpenAlgo
// Trading-themed particle effects

const ParticleConfig = {
    hero: {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.6,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#3b82f6',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    },

    dashboard: {
        particles: {
            number: {
                value: 30,
                density: {
                    enable: true,
                    value_area: 1000
                }
            },
            color: {
                value: '#64748b'
            },
            shape: {
                type: 'triangle',
            },
            opacity: {
                value: 0.3,
                random: true,
            },
            size: {
                value: 2,
                random: true,
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'top',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: false
                },
                onclick: {
                    enable: false
                },
                resize: true
            }
        },
        retina_detect: true
    },

    trading: {
        particles: {
            number: {
                value: 40,
                density: {
                    enable: true,
                    value_area: 600
                }
            },
            color: {
                value: ['#10b981', '#ef4444', '#f59e0b']
            },
            shape: {
                type: 'circle',
            },
            opacity: {
                value: 0.8,
                random: false,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.3,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: true,
                anim: {
                    enable: true,
                    speed: 3,
                    size_min: 1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 120,
                color: '#10b981',
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'bounce',
                bounce: true
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'bubble'
                },
                onclick: {
                    enable: true,
                    mode: 'repulse'
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 200,
                    size: 8,
                    duration: 2,
                    opacity: 1,
                    speed: 2
                },
                repulse: {
                    distance: 300,
                    duration: 0.4
                }
            }
        },
        retina_detect: true
    }
};

// Initialize particles for specific containers
function initParticles(containerId, configType = 'hero') {
    const container = document.getElementById(containerId);
    if (container && typeof particlesJS !== 'undefined') {
        const config = ParticleConfig[configType] || ParticleConfig.hero;
        particlesJS(containerId, config);
        return true;
    }
    return false;
}

// Auto-initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero particles if container exists
    initParticles('particles-js', 'hero');
    
    // Initialize dashboard particles if container exists
    initParticles('particles-dashboard', 'dashboard');
    
    // Initialize trading particles if container exists
    initParticles('particles-trading', 'trading');
});

// Export for external use
window.ParticleConfig = ParticleConfig;
window.initParticles = initParticles;