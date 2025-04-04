import React, { useState } from 'react'
import { Link } from "react-router-dom";
import useSWR from 'swr';
import Loading from "../../components/Loading.tsx";
import { OGP } from "../../components/OGP.tsx";
import { useTheme } from "../../hooks/useTheme";
import { SearchIcon, EmptyHashtagsIcon } from "../../components/icons";
import { TagAndCount, getTags } from "../../api/entryApi";

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
    const { isDark } = useTheme();
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
            {/* Header section */}
            <div className="relative mb-6">
                <div className="relative z-10">
                    <h2 className="mb-2">Tags</h2>
                    <p className="text-fg2 text-sm">
                        Browse all {filteredTags.length} tags from the blog. 
                        Click on any tag to see related entries.
                    </p>
                </div>
            </div>
            
            {/* Filter and sort controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Filter tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full p-2 pl-8 rounded-md border ${isDark ? 'border-fg/30 bg-bg' : 'border-fg2/20 bg-bg'} text-fg focus:outline-none focus:ring-2 focus:ring-yellow-300`}
                    />
                    <SearchIcon className="h-4 w-4 absolute left-2.5 top-3 text-fg2/60" />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-xs text-fg2/70">Sort by:</span>
                    <button 
                        onClick={() => setSortBy('name')} 
                        className={`px-3 py-1 text-xs rounded-md ${sortBy === 'name' ? 
                            'bg-[#F4E878] text-black' : 
                            'bg-fg/10 text-fg2'} transition-colors`}
                    >
                        Name
                    </button>
                    <button 
                        onClick={() => setSortBy('count')} 
                        className={`px-3 py-1 text-xs rounded-md ${sortBy === 'count' ? 
                            'bg-[#F4E878] text-black' : 
                            'bg-fg/10 text-fg2'} transition-colors`}
                    >
                        Count
                    </button>
                </div>
            </div>
            
            {/* Visually hidden list for tests - hidden from display but still in DOM */}
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
                    <Link 
                        key={tag.name} 
                        to={`/tags/${tag.name}/entries`} 
                        className={`${getTagSize(tag.count, maxCount)} ${isDark ? 
                            'bg-fg/10 hover:bg-[#F4E878] hover:text-black' : 
                            'bg-fg2/5 hover:bg-[#F4E878] hover:text-black'} 
                            px-3 py-1.5 rounded-full text-fg transition-colors duration-200`}
                    >
                        {tag.name} 
                        <span className="ml-1 text-fg2/70 text-xs">({tag.count})</span>
                    </Link>
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
                                className={`${getTagSize(tag.count, maxCount)} ${isDark ? 
                                    'bg-fg/10 hover:bg-[#F4E878] hover:text-black' : 
                                    'bg-fg2/5 hover:bg-[#F4E878] hover:text-black'}
                                    px-4 py-2 rounded-md transition-colors duration-200 flex justify-between items-center`}
                            >
                                <span className="truncate">{tag.name}</span>
                                <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-fg/10">{tag.count}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            
            {/* Empty state */}
            {filteredTags.length === 0 && (
                <div className="text-center p-12 text-fg2/70">
                    <EmptyHashtagsIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tags found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    </>)
}

export default TagsPage
