import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => {
  return <button 
    className={`
      p-3 bg-fg text-bg border border-fg rounded-md 
      hover:bg-fg2 transition-colors duration-200 cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `} 
    {...props} 
  />;
};
