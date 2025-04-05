import React from 'react';

// Email icon component
export const EmailIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Lock icon component
export const LockIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// User icon component
export const UserIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// RSS Feed icon component
export const RssIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11a9 9 0 0 1 9 9"></path>
    <path d="M4 4a16 16 0 0 1 16 16"></path>
    <circle cx="5" cy="19" r="1"></circle>
  </svg>
);

// Japanese language icon component (JA in a square box)
export const JaIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="2" strokeWidth="1.5" />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">JA</text>
  </svg>
);

// English language icon component (EN in a square box)
export const EnIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="2" strokeWidth="1.5" />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold" fontFamily="sans-serif">EN</text>
  </svg>
);

// X (Twitter) icon component
export const XIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 240 240" fill="none">
    <path d="M88.2 60.6602L169.46 178.81H151.42L70.16 60.6602H88.2ZM92.93 51.6602H53.04L146.68 187.81H186.57L92.93 51.6602Z" fill="currentColor"/>
    <path d="M132.54 109.25L182.24 51.6602H170.99L127.55 101.99L132.54 109.25Z" fill="currentColor"/>
    <path d="M105.36 127.72L53.04 188.34H64.3L110.35 134.98L105.36 127.72Z" fill="currentColor"/>
  </svg>
);

// BlueSky icon component
export const BlueSkyIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 256 256" fill="none">
    <path d="M 60.901 37.747 C 88.061 58.137 117.273 99.482 127.999 121.666 C 138.727 99.482 167.938 58.137 195.099 37.747 C 214.696 23.034 246.45 11.651 246.45 47.874 C 246.45 55.109 242.302 108.648 239.869 117.34 C 231.413 147.559 200.6 155.266 173.189 150.601 C 221.101 158.756 233.288 185.766 206.966 212.776 C 156.975 264.073 135.115 199.905 129.514 183.464 C 128.487 180.449 128.007 179.038 127.999 180.238 C 127.992 179.038 127.512 180.449 126.486 183.464 C 120.884 199.905 99.024 264.073 49.033 212.776 C 22.711 185.766 34.899 158.756 82.81 150.601 C 55.4 155.266 24.587 147.559 16.13 117.34 C 13.697 108.648 9.55 55.109 9.55 47.874 C 9.55 11.651 41.304 23.034 60.901 37.747 Z" fill="currentColor"/>
  </svg>
);

// Hatena Bookmark icon component
export const HatebuIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 500 500">
    <g fill="currentColor">
      <path d="M278.2 258.1q-13.6-15.2-37.8-17c14.4-3.9 24.8-9.6 31.4-17.3s9.8-17.8 9.8-30.7A55 55 0 0 0 275 166a48.8 48.8 0 0 0-19.2-18.6c-7.3-4-16-6.9-26.2-8.6s-28.1-2.4-53.7-2.4h-62.3v227.2h64.2q38.7 0 55.8-2.6c11.4-1.8 20.9-4.8 28.6-8.9a52.5 52.5 0 0 0 21.9-21.4c5.1-9.2 7.7-19.9 7.7-32.1 0-16.9-4.5-30.4-13.6-40.5zm-107-71.4h13.3q23.1 0 31 5.2c5.3 3.5 7.9 9.5 7.9 18s-2.9 14-8.5 17.4-16.1 5-31.4 5h-12.3v-45.6zM224 317c-6.1 3.7-16.5 5.5-31.1 5.5h-21.7V273h22.6c15 0 25.4 1.9 30.9 5.7s8.4 10.4 8.4 20-3 14.7-9.2 18.4zM357.6 306.1a28.8 28.8 0 1 0 28.8 28.8 28.8 28.8 0 0 0-28.8-28.8zM332.6 136.4h50v151.52h-50z"/>
    </g>
  </svg>
);

// Arrow Up icon for BackToTop component
export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    fill="none" 
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 10l7-7m0 0l7 7m-7-7v18" 
    />
  </svg>
);

// Sun icon for light mode (shown in dark mode)
export const SunIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" 
    />
  </svg>
);

// Moon icon for dark mode (shown in light mode)
export const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" 
    />
  </svg>
);

// Search icon
export const SearchIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
);

// Clock icon
export const ClockIcon: React.FC<{ className?: string }> = ({ className = "h-3 w-3" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    className={className} 
    fill="none" 
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// List icon
export const ListIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 6h16M4 12h16M4 18h7" 
    />
  </svg>
);

// Calendar icon
export const CalendarIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
    />
  </svg>
);

// Edit/Pencil icon
export const EditIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
    />
  </svg>
);

// Eye icon
export const EyeIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
    />
  </svg>
);

// Info/Note icon
export const InfoIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
);

// Empty document icon
export const EmptyDocumentIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    className={className} 
    fill="none" 
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Empty hashtags icon for TagsPage
export const EmptyHashtagsIcon: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1} 
      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" 
    />
  </svg>
);

// Check icon for subscribed content
export const CheckIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

// No Access / Forbidden icon for unsubscribed content
export const NoAccessIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M5.5 5.5l13 13" 
    />
  </svg>
);