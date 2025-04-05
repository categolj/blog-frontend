import React, { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode;
}

/**
 * A standardized page header component with title and optional description
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
    return (
        <div className="relative mb-6">
            <div className="relative z-10">
                <h2 className="mb-2">{title}</h2>
                {description && (
                    <p className="text-fg2 text-sm">
                        {description}
                    </p>
                )}
                {children}
            </div>
        </div>
    );
};

export default PageHeader;
