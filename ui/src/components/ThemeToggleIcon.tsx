import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggleIcon: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-6 h-6 flex items-center justify-center text-fg2 hover:text-fg transition-colors"
    >
      {isDark ? (
        // Sun icon for dark mode (clicking switches to light)
        <SunIcon />
      ) : (
        // Moon icon for light mode (clicking switches to dark)
        <MoonIcon />
      )}
    </button>
  );
};

export default ThemeToggleIcon;