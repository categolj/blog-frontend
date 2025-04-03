import React from 'react';

export const LastUpdated: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = '', ...props }) => {
  return <span className={`text-meta text-smaller ${className}`} {...props} />;
};
