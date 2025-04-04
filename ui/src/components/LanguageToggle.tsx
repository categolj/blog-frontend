import React from 'react';
import { useLocation } from 'react-router-dom';

// This component provides a language toggle between English and Japanese
const LanguageToggle: React.FC = () => {
  const location = useLocation();
  
  // Determine if we're in English mode
  const isEnglish = location.pathname.endsWith('/en') || location.pathname === '/entries/en';
  
  // Determine the URL for language switching
  const getLanguageUrl = () => {
    const currentPath = location.pathname;
    
    // If we're on the entries list page
    if (currentPath === '/entries') {
      return '/entries/en'; // Switch to English entries list
    }
    
    // If we're on the English entries list page
    if (currentPath === '/entries/en') {
      return '/entries'; // Switch to Japanese entries list
    }
    
    // For individual entry pages - Japanese to English
    // Format: /entries/{id} -> /entries/{id}/en
    const entryMatch = /^\/entries\/([^\/]+)\/?$/.exec(currentPath);
    if (entryMatch) {
      const entryId = entryMatch[1];
      return `/entries/${entryId}/en`;
    }
    
    // For individual entry pages - English to Japanese
    // Format: /entries/{id}/en -> /entries/{id}
    const entryEnMatch = /^\/entries\/([^\/]+)\/en\/?$/.exec(currentPath);
    if (entryEnMatch) {
      const entryId = entryEnMatch[1];
      return `/entries/${entryId}`;
    }
    
    // Default fallback - just go to entries in the right language
    return isEnglish ? '/entries' : '/entries/en';
  };
  
  return (
    <a 
      href={getLanguageUrl()}
      className="inline-flex items-center space-x-1"
      title={isEnglish ? "Switch to Japanese" : "Switch to English"}
    >
      <span className="text-lg">
        {isEnglish ? "🇯🇵" : "🇬🇧"}
      </span>
    </a>
  );
};

export default LanguageToggle;