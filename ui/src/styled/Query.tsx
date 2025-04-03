import React from 'react';

interface QueryProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Query: React.FC<QueryProps> = ({ className = '', ...props }) => {
  return <p className={`text-meta text-sm ${className}`} {...props} />;
};
