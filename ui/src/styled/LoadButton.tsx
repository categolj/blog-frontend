import React from 'react';

interface LoadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const LoadButton: React.FC<LoadButtonProps> = ({ className = '', ...props }) => {
  return (
    <button 
      className={`
        bg-fg text-bg border-none p-3 cursor-pointer rounded-[0.35rem] 
        transition-colors duration-300 mt-6 mb-4 w-[600px] max-w-full
        hover:bg-fg2 focus:outline-none ${className}
      `} 
      {...props} 
    />
  );
};
