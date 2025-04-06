import React, { ReactNode } from 'react';

interface ShareSectionProps {
    children: ReactNode;
    label?: string;
    className?: string;
}

/**
 * A standardized component for sharing options section
 */
const ShareSection: React.FC<ShareSectionProps> = ({
    children,
    label = 'Share this article:',
    className = ''
}) => {
    return (
        <div className={`flex flex-col text-meta ${className}`}>
            <div className="text-sm mb-2">
                {label}
            </div>
            <div className="flex space-x-2">
                {children}
            </div>
        </div>
    );
};

export default ShareSection;
