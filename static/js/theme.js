// Enhanced Theme management with improved persistence
const themeKey = 'theme';
const previousThemeKey = 'previousTheme';
const defaultTheme = 'light';
const themes = ['light', 'dark'];

// Set theme and persist to localStorage with session backup
function setTheme(theme, force = false) {
    if (!themes.includes(theme)) {
        theme = defaultTheme;
    }
    
    // Store current theme before changing to garden
    if (!force && theme === 'garden') {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme !== 'garden') {
            localStorage.setItem(previousThemeKey, currentTheme);
            sessionStorage.setItem(previousThemeKey, currentTheme);
        }
    }
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Update CSS custom properties for smooth transitions
    updateCSSProperties(theme);
    
    // Only update localStorage if not garden theme or if forced
    if (theme !== 'garden' || force) {
        localStorage.setItem(themeKey, theme);
        sessionStorage.setItem(themeKey, theme);
    }
    
    // Update theme controller checkboxes and visibility
    updateThemeControllers(theme);
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// Update CSS custom properties for better theme transitions
function updateCSSProperties(theme) {
    const root = document.documentElement;
    
    // Set theme-specific CSS variables
    if (theme === 'dark') {
        root.style.setProperty('--theme-transition', 'all 0.3s ease');
        root.style.setProperty('--glass-opacity', '0.1');
        root.style.setProperty('--navbar-bg', 'rgba(0, 0, 0, 0.8)');
    } else if (theme === 'light') {
        root.style.setProperty('--theme-transition', 'all 0.3s ease');
        root.style.setProperty('--glass-opacity', '0.05');
        root.style.setProperty('--navbar-bg', 'rgba(255, 255, 255, 0.8)');
    }
}

// Update theme controllers with enhanced feedback
function updateThemeControllers(theme) {
    const themeControllers = document.querySelectorAll('.theme-controller');
    const themeSwitcher = document.querySelector('.theme-switcher');
    
    themeControllers.forEach(controller => {
        controller.checked = theme === 'dark';
        controller.disabled = theme === 'garden';
        
        // Add visual feedback
        if (theme === 'garden') {
            controller.parentElement.classList.add('disabled');
        } else {
            controller.parentElement.classList.remove('disabled');
        }
    });

    // Toggle theme switcher disabled state with enhanced styling
    if (themeSwitcher) {
        if (theme === 'garden') {
            themeSwitcher.classList.add('disabled');
            themeSwitcher.setAttribute('data-tip', 'Theme locked in garden mode');
        } else {
            themeSwitcher.classList.remove('disabled');
            themeSwitcher.setAttribute('data-tip', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }
    }
}

// Enhanced theme toggle event handler
function handleThemeToggle(e) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'garden') {
        e.preventDefault();
        return false; // Don't allow theme toggle in garden mode
    }
    
    const newTheme = e.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Add subtle animation feedback
    if (e.target.parentElement) {
        e.target.parentElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.parentElement.style.transform = 'scale(1)';
        }, 150);
    }
}

// Enhanced initialization with fallback and validation
function initializeTheme() {
    // Check sessionStorage first for navigation consistency
    const sessionTheme = sessionStorage.getItem(themeKey);
    const localTheme = localStorage.getItem(themeKey);
    
    // Validate theme exists in our supported themes list
    const savedTheme = validateTheme(sessionTheme) || validateTheme(localTheme) || defaultTheme;
    
    // Set theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update CSS properties
    updateCSSProperties(savedTheme);
    
    // Update controllers
    updateThemeControllers(savedTheme);
    
    return savedTheme;
}

// Validate theme exists in supported themes
function validateTheme(theme) {
    return theme && themes.includes(theme) ? theme : null;
}

// Function to restore previous theme with validation
function restorePreviousTheme() {
    const previousTheme = validateTheme(localStorage.getItem(previousThemeKey)) || 
                         validateTheme(sessionStorage.getItem(previousThemeKey)) || 
                         defaultTheme;
    
    if (previousTheme && previousTheme !== 'garden') {
        setTheme(previousTheme, true);
        // Clear the stored previous theme after restoration
        localStorage.removeItem(previousThemeKey);
        sessionStorage.removeItem(previousThemeKey);
    } else {
        setTheme(defaultTheme, true);
    }
}

// System theme detection
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Auto theme based on system preference (optional feature)
function enableAutoTheme() {
    const systemTheme = detectSystemTheme();
    if (!localStorage.getItem(themeKey)) {
        setTheme(systemTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(themeKey)) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Initialize theme immediately to prevent flash (IIFE)
(function() {
    const savedTheme = localStorage.getItem(themeKey) || 
                      sessionStorage.getItem(themeKey) || 
                      detectSystemTheme();
    const validTheme = validateTheme(savedTheme) || defaultTheme;
    
    document.documentElement.setAttribute('data-theme', validTheme);
    document.body.setAttribute('data-theme', validTheme);
})();

// Enhanced event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const currentTheme = initializeTheme();
    
    // Set initial state of theme toggles and add event listeners
    const themeControllers = document.querySelectorAll('.theme-controller');
    themeControllers.forEach(controller => {
        controller.checked = currentTheme === 'dark';
        controller.addEventListener('change', handleThemeToggle);
        
        // Add smooth transition effects
        controller.style.transition = 'all 0.3s ease';
    });

    // Enhanced page visibility handler
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // When page becomes visible, ensure theme is consistent
            const sessionTheme = sessionStorage.getItem(themeKey);
            if (sessionTheme && validateTheme(sessionTheme)) {
                setTheme(sessionTheme);
            }
        }
    });

    // Enhanced storage events for cross-tab consistency
    window.addEventListener('storage', function(e) {
        if (e.key === themeKey && e.newValue) {
            const newTheme = validateTheme(e.newValue);
            if (newTheme) {
                setTheme(newTheme);
            }
        }
    });
    
    // Optional: Enable auto theme detection
    // enableAutoTheme();
});

// Export enhanced functions for use in other scripts
window.themeManager = {
    setTheme,
    restorePreviousTheme,
    initializeTheme,
    detectSystemTheme,
    enableAutoTheme,
    validateTheme,
    defaultTheme,
    themes
};
