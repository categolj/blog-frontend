import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className = '', ...props }) => {
  return <label className={`mb-3 block font-medium ${className}`} {...props} />;
};
