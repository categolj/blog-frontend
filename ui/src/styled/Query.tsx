import React from 'react';

export const Query: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...props }) => {
  return <p className={`text-meta text-sm ${className}`} {...props} />;
};
