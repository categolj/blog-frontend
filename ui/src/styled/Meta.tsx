import React from 'react';

interface MetaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Meta: React.FC<MetaProps> = ({ className = '', ...props }) => {
  return <div className={`m-0 text-meta inline-block w-full ${className}`} {...props} />;
};
