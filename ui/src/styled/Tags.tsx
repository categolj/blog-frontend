import React from 'react';

interface TagsProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Tags: React.FC<TagsProps> = ({ className = '', ...props }) => {
  return (
    <p 
      className={`text-meta float-right text-smaller m-0 mr-4 ${className}`} 
      {...props} 
    />
  );
};
