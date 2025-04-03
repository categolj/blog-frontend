import React from 'react';

interface Title1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const Title1: React.FC<Title1Props> = ({ className = '', children, ...props }) => {
  return (
    <h1 className={`text-[1.75rem] mt-0 mb-6 ${className}`} {...props}>
      {children}
    </h1>
  );
};
