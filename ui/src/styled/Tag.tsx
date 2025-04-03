import React from 'react';

interface TagProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Tag: React.FC<TagProps> = ({ className = '', ...props }) => {
  return <p className={`text-meta ${className}`} {...props} />;
};
