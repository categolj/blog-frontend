import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    accentColor?: string;
    isHighlighted?: boolean;
    isDashed?: boolean;
    className?: string;
    onClick?: () => void;
}

/**
 * A standardized card component with consistent styling
 */
const Card: React.FC<CardProps> = ({
    children,
    accentColor,
    isHighlighted = false,
    isDashed = false,
    className = '',
    onClick
}) => {
    // Base classes for all cards
    const baseClasses = `
        p-4 rounded-lg transition-all duration-200 
        bg-(color:--card-bg) 
        ${isHighlighted ? 'hover:bg-(color:--card-hover-bg)' : ''}
        ${isDashed ? 'border border-dashed border-(color:--empty-border)' : 'shadow-xs'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
    `;
    
    // Apply accent color as left border if provided
    const style = accentColor ? {
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    } : {};
    
    return (
        <div className={baseClasses} style={style} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
