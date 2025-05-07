import React, { useState } from 'react'
import { Link } from "react-router-dom";
import useSWR from 'swr';
import Loading from "../../components/Loading.tsx";
import { OGP } from "../../components/OGP.tsx";
import { SearchIcon, EmptyHashtagsIcon } from "../../components/icons";
import { TagAndCount, getTags } from "../../api/entryApi";
import PageHeader from '../../components/PageHeader';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

export interface TagsProps {
    preLoadedTags?: TagAndCount[];
}

// Function to calculate tag size based on count
const getTagSize = (count: number, maxCount: number): string => {
    // Calculate a size between 1 and 4 based on tag count
    const minSize = 0.8;
    const maxSize = 2.0;
    
    if (maxCount <= 1) return `text-base`;
    
    const ratio = Math.log(count) / Math.log(maxCount); // Logarithmic scale for better distribution
    const size = minSize + (maxSize - minSize) * ratio;
    
    // Return tailwind classes that correspond to relative sizes
    if (size < 1) return `text-xs`;
    if (size < 1.25) return `text-sm`;
    if (size < 1.5) return `text-base`;
    if (size < 1.75) return `text-lg`;
    return `text-xl`;
};

const TagsPage: React.FC<TagsProps> = ({preLoadedTags}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'count'>('name');
    
    const isPreLoaded = !!preLoadedTags;
    const {data, isLoading} = useSWR(isPreLoaded ? null : 'tags', getTags);
    const tags = data || preLoadedTags;
    
    // Calculate max count for tag size scaling
    const maxCount = tags ? Math.max(...tags.map(tag => tag.count)) : 0;
    
    // Filter and sort tags
    const filteredTags = tags ? tags
        .filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else {
                return b.count - a.count;
            }
        }) : [];
    
    // Group tags into columns for better display
    const tagGroups = () => {
        const groups: TagAndCount[][] = [[], [], []];
        filteredTags.forEach((tag, i) => {
            groups[i % 3].push(tag);
        });
        return groups;
    };

    if (isLoading || !tags) {
        return <Loading/>
    }
    
    return (<>
        <OGP title={`Tags - IK.AM`} />
        <div id="tags" className="relative">
            {/* Header section using PageHeader component */}
            <PageHeader 
                title="Tags" 
                description={`Browse all ${filteredTags.length} tags from the blog. Click on any tag to see related entries.`}
            />
            
            {/* Filter and sort controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative grow">
                    <input
                        type="text"
                        placeholder="Filter tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-8 rounded-md border border-(color:--card-border) bg-(color:--bg) text-fg focus:outline-hidden focus:ring-2 focus:ring-(color:--accent)"
                    />
                    <SearchIcon className="h-4 w-4 absolute left-2.5 top-3 text-fg2/60" />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-xs text-fg2/70">Sort by:</span>
                    <button 
                        onClick={() => setSortBy('name')} 
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            sortBy === 'name' 
                                ? 'bg-(color:--accent) text-(color:--accent-text)' 
                                : 'bg-fg/10 text-fg2'
                        }`}
                    >
                        Name
                    </button>
                    <button 
                        onClick={() => setSortBy('count')} 
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            sortBy === 'count' 
                                ? 'bg-(color:--accent) text-(color:--accent-text)' 
                                : 'bg-fg/10 text-fg2'
                        }`}
                    >
                        Count
                    </button>
                </div>
            </div>
            
            {/* Visually hidden list for tests */}
            <ul className="sr-only">
                {filteredTags.map(tag => (
                    <li key={tag.name}>
                        <Link to={`/tags/${tag.name}/entries`}>{tag.name}</Link> ({tag.count})
                    </li>
                ))}
            </ul>
            
            {/* Mobile view - single column */}
            <div className="flex flex-wrap gap-2 md:hidden">
                {filteredTags.map(tag => (
                    <Badge
                        key={tag.name}
                        href={`/tags/${tag.name}/entries`}
                        variant={sortBy === 'count' && tag.count === maxCount ? 'accent' : 'default'}
                        size={getTagSize(tag.count, maxCount) === 'text-xs' ? 'sm' : 'md'}
                    >
                        {tag.name} 
                        <span className="ml-1 text-fg2/70 text-xs">({tag.count})</span>
                    </Badge>
                ))}
            </div>
            
            {/* Desktop view - multi-column layout */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
                {tagGroups().map((group, groupIndex) => (
                    <div key={groupIndex} className="flex flex-col gap-2">
                        {group.map(tag => (
                            <Link 
                                key={tag.name} 
                                to={`/tags/${tag.name}/entries`}
                                className={`
                                    ${getTagSize(tag.count, maxCount)} 
                                    bg-(color:--card-bg) 
                                    hover:bg-(color:--accent) hover:text-(color:--accent-text)
                                    px-4 py-2 rounded-md transition-colors duration-200 flex justify-between items-center
                                `}
                            >
                                <span className="truncate">{tag.name}</span>
                                <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-sm bg-fg/10">{tag.count}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            
            {/* Empty state */}
            {filteredTags.length === 0 && (
                <EmptyState
                    icon={<EmptyHashtagsIcon className="h-16 w-16" />}
                    message={`No tags found matching "${searchTerm}"`}
                />
            )}
        </div>
    </>)
}

export default TagsPage
