import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from './icons';

interface FilterSectionProps {
    children: ReactNode;
    clearHref: string;
    className?: string;
}

/**
 * A standardized filter section component that displays filter badges with a clear option
 */
const FilterSection: React.FC<FilterSectionProps> = ({
    children,
    clearHref,
    className = ''
}) => {
    return (
        <div className={`
            mb-6 p-4 rounded-lg
            bg-[color:var(--filter-bg)] border border-[color:var(--card-border)]
            ${className}
        `}>
            <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {children}
                </div>
                
                <Link
                    to={clearHref}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium
                        border border-fg hover:bg-fg hover:text-bg
                        transition-all duration-200"
                    aria-label="Clear all filters"
                >
                    <CloseIcon className="h-3 w-3 mr-1"/>
                    Clear all
                </Link>
            </div>
        </div>
    );
};

export default FilterSection;
