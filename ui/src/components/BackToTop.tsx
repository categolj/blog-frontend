import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowUpIcon } from './icons';

// Custom Back to Top component with dark/light mode support
const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode using the 'dark' class on the root element
  useEffect(() => {
    const checkDarkMode = () => {
      const html = document.documentElement;
      setIsDarkMode(html.classList.contains('dark'));
    };

    // Initial check
    checkDarkMode();

    // Listen for changes to dark mode
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down more than 300 pixels
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // If not visible, return null
  if (!isVisible) return null;

  return (
    <button 
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={twMerge(
        'fixed bottom-4 right-4 z-50 p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-hidden focus:ring-2 focus:ring-offset-2',
        // Dark mode styles
        isDarkMode 
          ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500' 
          : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-700'
      )}
    >
      <ArrowUpIcon />
    </button>
  );
};

export default BackToTop;