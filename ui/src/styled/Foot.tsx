import React from 'react';

interface FootProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Foot: React.FC<FootProps> = ({ className = '', children, ...props }) => {
  return (
    <footer className={`text-base ${className}`} {...props}>
      {children}
    </footer>
  );
};
