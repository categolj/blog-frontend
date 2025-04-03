import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Track theme preferences and system settings
    const root = document.documentElement;
    
    // Detect system theme preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    // Priority: saved theme → system theme → default (light)
    const initialTheme = savedTheme || systemTheme || 'light';
    setTheme(initialTheme);

    // Apply theme by toggling dark class which Tailwind uses for dark mode
    root.classList.toggle('dark', initialTheme === 'dark');

    // Monitor system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      root.classList.toggle('dark', newTheme === 'dark');
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    const root = document.documentElement;
    root.classList.toggle('dark', newTheme === 'dark');
    
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
}