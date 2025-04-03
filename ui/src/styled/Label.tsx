import React from 'react';

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = '', ...props }) => {
  return <label className={`mb-3 block font-medium ${className}`} {...props} />;
};
