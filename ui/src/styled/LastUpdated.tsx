import React from 'react';

interface LastUpdatedProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const LastUpdated: React.FC<LastUpdatedProps> = ({ className = '', ...props }) => {
  return <span className={`text-meta text-smaller ${className}`} {...props} />;
};
