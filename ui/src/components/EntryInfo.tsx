import React from 'react';
import ReactTimeAgo from 'react-time-ago';
import { ClockIcon, TagIcon } from './icons';
import EntryTag from './EntryTag';

interface EntryInfoProps {
  updated: { date?: string };
  frontMatter: {
    tags?: { name: string }[];
  };
  className?: string;
}

/**
 * A standardized component for displaying entry metadata (time, tags)
 */
const EntryInfo: React.FC<EntryInfoProps> = ({
  updated,
  frontMatter,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 text-xs text-fg2/80 ${className}`}>
      {/* Date/time information */}
      <span className="inline-flex items-center">
        <ClockIcon className="h-3 w-3 mr-1"/>
        <span>
          {updated.date ?
            <ReactTimeAgo
              date={new Date(updated.date)}
              locale="en-US"
              timeStyle="twitter"
            />
            : 'N/A'
          }
        </span>
      </span>

      {/* Tags information */}
      {frontMatter.tags && frontMatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <TagIcon className="h-3 w-3"/>
          {frontMatter.tags.slice(0, 3).map(tag => (
            <EntryTag 
              key={tag.name} 
              name={tag.name}
              className="p-0 m-0 mr-1 bg-transparent hover:underline"
            />
          ))}
          {frontMatter.tags.length > 3 && (
            <span className="text-xs opacity-70">
              +{frontMatter.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EntryInfo;
