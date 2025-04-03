import React from 'react';

export const Tags: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...props }) => {
  return (
    <p 
      className={`text-meta float-right text-smaller m-0 mr-4 ${className}`} 
      {...props} 
    />
  );
};
