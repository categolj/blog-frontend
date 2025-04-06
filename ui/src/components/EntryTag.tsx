import React from 'react';
import { Link } from 'react-router-dom';

interface EntryTagProps {
    name: string;
    linkPrefix?: string;
    className?: string;
}

/**
 * A standardized component for rendering entry tags with consistent styling
 */
const EntryTag: React.FC<EntryTagProps> = ({
    name,
    linkPrefix = '/tags',
    className = ''
}) => {
    return (
        <Link
            to={`${linkPrefix}/${name}/entries`}
            className={`
                inline-block px-2 py-1 mr-2 rounded text-xs font-medium
                bg-[color:var(--tag-bg)] text-[color:var(--tag-text)]
                hover:bg-[color:var(--tag-hover-bg)] transition-all duration-200
                ${className}
            `}
        >
            {name}
        </Link>
    );
};

export default EntryTag;
