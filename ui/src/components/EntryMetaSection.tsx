import React, { ReactNode } from 'react';

interface EntryMetaSectionProps {
    children: ReactNode;
    className?: string;
    hasBorder?: boolean;
}

/**
 * A standardized component for entry metadata sections
 */
const EntryMetaSection: React.FC<EntryMetaSectionProps> = ({
    children,
    className = '',
    hasBorder = true
}) => {
    return (
        <div
            className={`
                mb-6 pb-4 text-meta
                ${hasBorder ? 'border-b border-(color:--entry-border-color)' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default EntryMetaSection;
