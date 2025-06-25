// Enhanced Theme Management System - Single Source of Truth
// Supports only Light and Dark themes with system preference detection
const THEME_CONFIG = {
    STORAGE_KEY: 'algobots-theme',
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },
    DEFAULT: 'light',
    TRANSITION_DURATION: 300
};

class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.systemPreference = this.detectSystemPreference();
        this.controllers = [];
        this.isInitialized = false;
        
        // Initialize theme immediately to prevent FOUC
        this.initializeTheme();
        
        // Set up system preference listener
        this.setupSystemPreferenceListener();
    }

    /**
     * Detect system color scheme preference
     */
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEME_CONFIG.THEMES.DARK;
        }
        return THEME_CONFIG.THEMES.LIGHT;
    }

    /**
     * Get saved theme from localStorage with fallback to system preference
     */
    getSavedTheme() {
        const saved = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
        if (saved && Object.values(THEME_CONFIG.THEMES).includes(saved)) {
            return saved;
        }
        return this.systemPreference;
    }

    /**
     * Apply theme to document and store in localStorage
     */
    setTheme(theme, skipSave = false) {
        // Validate theme
        if (!Object.values(THEME_CONFIG.THEMES).includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Using default.`);
            theme = THEME_CONFIG.DEFAULT;
        }

        // Apply theme immediately
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Update CSS custom properties for better transitions
        this.updateCSSProperties(theme);
        
        // Save to localStorage unless skipped
        if (!skipSave) {
            localStorage.setItem(THEME_CONFIG.STORAGE_KEY, theme);
        }
        
        // Update all theme controllers
        this.updateControllers(theme);
        
        // Store current theme
        this.currentTheme = theme;
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(theme);
        
        console.log(`Theme applied: ${theme}`);
    }

    /**
     * Update CSS custom properties for smooth transitions
     */
    updateCSSProperties(theme) {
        const root = document.documentElement;
        
        // Add transition class for smooth theme switching
        document.body.classList.add('theme-transitioning');
        
        // Set theme-specific CSS variables
        if (theme === THEME_CONFIG.THEMES.DARK) {
            root.style.setProperty('--theme-transition', `all ${THEME_CONFIG.TRANSITION_DURATION}ms ease`);
            root.style.setProperty('--navbar-bg', 'rgba(0, 0, 0, 0.8)');
            root.style.setProperty('--glass-opacity', '0.1');
            root.style.setProperty('--hero-overlay', 'rgba(0, 0, 0, 0.8)');
        } else {
            root.style.setProperty('--theme-transition', `all ${THEME_CONFIG.TRANSITION_DURATION}ms ease`);
            root.style.setProperty('--navbar-bg', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--glass-opacity', '0.05');
            root.style.setProperty('--hero-overlay', 'rgba(0, 0, 0, 0.5)');
        }
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, THEME_CONFIG.TRANSITION_DURATION);
    }

    /**
     * Update all registered theme controllers
     */
    updateControllers(theme) {
        this.controllers.forEach(controller => {
            if (controller && controller.type === 'checkbox') {
                controller.checked = theme === THEME_CONFIG.THEMES.DARK;
            }
        });
    }

    /**
     * Register a theme controller (checkbox input)
     */
    registerController(controller) {
        if (controller && !this.controllers.includes(controller)) {
            this.controllers.push(controller);
            
            // Set initial state
            controller.checked = this.currentTheme === THEME_CONFIG.THEMES.DARK;
            
            // Add event listener
            controller.addEventListener('change', (e) => {
                const newTheme = e.target.checked ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
                this.setTheme(newTheme);
                
                // Add visual feedback
                this.addVisualFeedback(e.target);
            });
            
            console.log('Theme controller registered');
        }
    }

    /**
     * Add visual feedback to theme toggle
     */
    addVisualFeedback(element) {
        const parent = element.closest('.theme-switcher') || element.parentElement;
        if (parent) {
            parent.style.transform = 'scale(0.95)';
            setTimeout(() => {
                parent.style.transform = 'scale(1)';
            }, 150);
        }
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === THEME_CONFIG.THEMES.DARK 
            ? THEME_CONFIG.THEMES.LIGHT 
            : THEME_CONFIG.THEMES.DARK;
        this.setTheme(newTheme);
        return newTheme;
    }

    /**
     * Initialize theme system
     */
    initializeTheme() {
        const savedTheme = this.getSavedTheme();
        this.setTheme(savedTheme, false);
        this.isInitialized = true;
    }

    /**
     * Set up system preference change listener
     */
    setupSystemPreferenceListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                this.systemPreference = e.matches ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
                
                // Only auto-switch if no manual preference is saved
                const hasManualPreference = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
                if (!hasManualPreference) {
                    this.setTheme(this.systemPreference, true); // Don't save auto-switches
                }
            });
        }
    }

    /**
     * Dispatch custom theme change event
     */
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { 
                theme,
                isDark: theme === THEME_CONFIG.THEMES.DARK,
                isLight: theme === THEME_CONFIG.THEMES.LIGHT
            },
            bubbles: true
        });
        window.dispatchEvent(event);
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if current theme is dark
     */
    isDarkTheme() {
        return this.currentTheme === THEME_CONFIG.THEMES.DARK;
    }

    /**
     * Reset to system preference
     */
    resetToSystemPreference() {
        localStorage.removeItem(THEME_CONFIG.STORAGE_KEY);
        this.setTheme(this.systemPreference, true);
    }
}

// Create global theme manager instance
const themeManager = new ThemeManager();

// DOM Content Loaded event listener for additional setup
document.addEventListener('DOMContentLoaded', function() {
    // Register all theme controllers
    const controllers = document.querySelectorAll('.theme-controller');
    controllers.forEach(controller => {
        themeManager.registerController(controller);
    });

    // Handle page visibility changes for consistency
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && themeManager.isInitialized) {
            // Re-apply current theme when page becomes visible
            const currentTheme = themeManager.getCurrentTheme();
            themeManager.updateControllers(currentTheme);
        }
    });

    // Handle storage events for cross-tab synchronization
    window.addEventListener('storage', function(e) {
        if (e.key === THEME_CONFIG.STORAGE_KEY && e.newValue) {
            const newTheme = e.newValue;
            if (Object.values(THEME_CONFIG.THEMES).includes(newTheme)) {
                themeManager.setTheme(newTheme, true); // Don't save again
            }
        }
    });

    console.log('Theme system initialized successfully');
});

// Export for global access
window.themeManager = themeManager;
window.THEME_CONFIG = THEME_CONFIG;

// Backward compatibility exports
window.setTheme = (theme) => themeManager.setTheme(theme);
window.toggleTheme = () => themeManager.toggleTheme();
window.getCurrentTheme = () => themeManager.getCurrentTheme();