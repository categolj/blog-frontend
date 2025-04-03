import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return <input className={`mb-5 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-fg2 focus:border-fg2 ${className}`} {...props} />;
};
