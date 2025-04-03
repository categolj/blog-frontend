import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export const Form: React.FC<FormProps> = ({ className = '', ...props }) => {
  return (
    <form 
      className={`flex flex-col w-[600px] max-w-full ml-0 gap-4 ${className}`} 
      {...props} 
    />
  );
};
