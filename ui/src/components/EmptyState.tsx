import React, { ReactNode } from 'react';

interface EmptyStateProps {
    icon: ReactNode;
    message: string;
    className?: string;
}

/**
 * A standardized empty state component with icon and message
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    message,
    className = ''
}) => {
    return (
        <div className={`
            text-center p-12 border border-dashed rounded-lg
            border-(color:--empty-border)
            ${className}
        `}>
            <div className="h-16 w-16 mx-auto mb-4 opacity-50">
                {icon}
            </div>
            <p className="text-sm font-medium text-fg2/70">{message}</p>
        </div>
    );
};

export default EmptyState;
