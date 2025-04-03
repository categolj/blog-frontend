import React from 'react';

export const Tag: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...props }) => {
  return <p className={`text-meta ${className}`} {...props} />;
};
