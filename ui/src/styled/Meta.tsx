import React from 'react';

export const Meta: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return <div className={`m-0 text-meta inline-block w-full ${className}`} {...props} />;
};
