import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BadgeProps {
    children: ReactNode;
    icon?: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'accent' | 'default' | 'outline' | 'tag';
    size?: 'sm' | 'md';
}

/**
 * A standardized badge component for tags, filters, and other label elements
 */
const Badge: React.FC<BadgeProps> = ({
    children,
    icon,
    href,
    onClick,
    className = '',
    variant = 'default',
    size = 'sm'
}) => {
    // Base classes for all badge variants
    const sizeClasses = size === 'sm' 
        ? 'text-xs px-3 py-1' 
        : 'text-sm px-3 py-1.5';
    
    // Classes specific to each variant
    const variantClasses = {
        accent: 'bg-[color:var(--accent)] text-[color:var(--accent-text)]',
        default: 'bg-fg/10 text-fg hover:bg-fg/20',
        outline: 'border border-fg text-fg hover:bg-fg hover:text-bg',
        tag: 'bg-[color:var(--tag-bg)] text-[color:var(--tag-text)] hover:bg-[color:var(--tag-hover-bg)]'
    }[variant];
    
    // Combined classes for the badge
    const badgeClasses = `
        inline-flex items-center rounded-full font-medium 
        ${sizeClasses} ${variantClasses} transition-all duration-200 ${className}
    `;
    
    // Content including optional icon
    const content = (
        <>
            {icon && <span className="mr-1">{icon}</span>}
            <span>{children}</span>
        </>
    );
    
    // Render as link, button, or span based on props
    if (href) {
        return (
            <Link to={href} className={badgeClasses}>
                {content}
            </Link>
        );
    } else if (onClick) {
        return (
            <button type="button" onClick={onClick} className={badgeClasses}>
                {content}
            </button>
        );
    } else {
        return (
            <span className={badgeClasses}>
                {content}
            </span>
        );
    }
};

export default Badge;
