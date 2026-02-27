import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBox from './SearchBox';
import ThemeToggleIcon from './ThemeToggleIcon';
import LanguageToggle from './LanguageToggle';
import { RssIcon } from './icons';

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="md:hidden relative" ref={menuRef}>
      {/* Hamburger button */}
      <button 
        onClick={toggleMenu} 
        className="flex flex-col justify-center items-center w-8 h-8 border-none bg-transparent cursor-pointer"
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line block w-6 h-0.5 bg-fg mb-1.5 ${isOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
        <span className={`hamburger-line block w-6 h-0.5 bg-fg mb-1.5 ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`hamburger-line block w-6 h-0.5 bg-fg ${isOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile menu dropdown */}
      <div 
        className={`mobile-menu-container absolute top-10 right-0 w-72 bg-bg border border-fg2 rounded-md mobile-menu-shadow z-20 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-4 px-4">
          <ul className="flex flex-col space-y-3 mb-4">
            <li className="font-bold">
              <NavLink 
                to={'/'} 
                className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="font-bold">
              <NavLink 
                to={'/tags'} 
                className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}
                onClick={() => setIsOpen(false)}
              >
                Tags
              </NavLink>
            </li>
            <li className="font-bold">
              <NavLink 
                to={'/categories'} 
                className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}
                onClick={() => setIsOpen(false)}
              >
                Categories
              </NavLink>
            </li>
            <li className="font-bold">
              <NavLink 
                to={'/notes'} 
                className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}
                onClick={() => setIsOpen(false)}
              >
                Notes
              </NavLink>
            </li>
            <li className="font-bold">
              <NavLink
                to={'/lab'}
                className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}
                onClick={() => setIsOpen(false)}
              >
                Lab
              </NavLink>
            </li>
            <li className="font-bold">
              <NavLink
                to={'/aboutme'}
                className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}
                onClick={() => setIsOpen(false)}
              >
                About
              </NavLink>
            </li>
          </ul>
          <div className="pt-2 border-t border-fg2">
            <div className="grow mb-3">
              <SearchBox />
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <ThemeToggleIcon />
              </div>
              <div>
                <LanguageToggle />
              </div>
              <div>
                <a 
                  href="/rss" 
                  aria-label="RSS Feed"
                  className="w-6 h-6 flex items-center justify-center text-fg2 hover:text-fg transition-colors"
                >
                  <RssIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
