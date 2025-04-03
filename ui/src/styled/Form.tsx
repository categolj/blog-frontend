import React from 'react';

export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({ className = '', ...props }) => {
  return (
    <form 
      className={`flex flex-col w-[600px] max-w-full ml-0 gap-4 ${className}`} 
      {...props} 
    />
  );
};
