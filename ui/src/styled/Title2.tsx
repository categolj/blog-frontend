import React from 'react';

interface Title2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const Title2: React.FC<Title2Props> = ({ className = '', children, ...props }) => {
  return (
    <h2 className={`text-2xl m-0 mb-4 ${className}`} {...props}>
      {children}
    </h2>
  );
};
