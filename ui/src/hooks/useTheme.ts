import { useState, useEffect } from 'react';

// Helper function to determine current theme state directly from DOM
export function getCurrentTheme(): 'light' | 'dark' {
  // Check if document exists (for SSR compatibility)
  if (typeof document === 'undefined' || typeof document.documentElement === 'undefined') {
    return 'light';
  }
  // Check if dark class is present on html element
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function useTheme() {
  // Initialize state with the current actual theme from DOM
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof document !== 'undefined' ? getCurrentTheme() : 'light'
  );

  useEffect(() => {
    // SSR compatibility check
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    // Track theme preferences and system settings
    const root = document.documentElement;
    
    // Detect system theme preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    // Priority: saved theme → system theme → default (light)
    const initialTheme = savedTheme || systemTheme || 'light';
    
    // Apply theme by toggling dark class which Tailwind uses for dark mode
    root.classList.toggle('dark', initialTheme === 'dark');
    
    // Update state to match the actual applied theme
    setTheme(getCurrentTheme());

    // Monitor system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      // Only apply system theme changes if no saved preference exists
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        root.classList.toggle('dark', newTheme === 'dark');
        setTheme(getCurrentTheme());
      }
    };

    // Watch for theme changes from other components
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
    });
    
    // Watch for class changes on the html element
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class']
    });

    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    // SSR compatibility check
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    const root = document.documentElement;
    root.classList.toggle('dark', newTheme === 'dark');
    
    localStorage.setItem('theme', newTheme);
    setTheme(getCurrentTheme());
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
}