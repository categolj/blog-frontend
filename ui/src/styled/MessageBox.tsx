import React from 'react';

const colors = {
  success: '#5CBD9D',
  error: '#E74C3C',
  warning: '#F29C33',
  info: '#3998DB',
};

export type MessageStatus = 'success' | 'info' | 'warning' | 'error';

interface MessageBoxProps extends React.HTMLAttributes<HTMLParagraphElement> {
  status: MessageStatus;
  children: React.ReactNode;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ 
  status, 
  className = '', 
  children, 
  ...props 
}) => {
  const borderColor = colors[status];
  
  return (
    <p 
      className={`
        p-5 mb-6 border border-[${borderColor}] rounded-[0.25rem] text-fg2 
        gap-3 leading-7 w-[800px] max-w-full border-l-[5px]
        ${className}
      `} 
      style={{ borderColor, borderLeftColor: borderColor }}
      {...props}
    >
      {children}
    </p>
  );
};
