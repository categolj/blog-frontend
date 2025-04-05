import React from 'react'
import {Link, useParams, useSearchParams} from "react-router-dom";
import useSWRInfinite from "swr/infinite";
import Loading from "../../components/Loading.tsx";
import Category from "../../components/Category.tsx";
import LoadMore from "../../components/LoadMore.tsx";
import BackToTop from "../../components/BackToTop";
import ReactTimeAgo from "react-time-ago";
import {OGP} from "../../components/OGP.tsx";
import {useTheme} from "../../hooks/useTheme";
import {
    ClockIcon,
    CloseIcon,
    EmptyDocumentIcon,
    FilterIcon,
    FolderIcon,
    SearchIcon,
    TagIcon
} from "../../components/icons";
import {CursorPageEntryInstant, EntriesParams, Entry, getEntries} from "../../api/entryApi";

export interface EntriesProps {
    preLoadedEntries?: CursorPageEntryInstant;
    tenantId?: string;
}

// Use EntriesParams for fetch key type
const EntriesPage: React.FC<EntriesProps> = ({preLoadedEntries, tenantId}) => {
    const {categories, tag} = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const limit = searchParams.has('limit') ? Number(searchParams.get('limit')) : 30;
    const isPreLoaded = preLoadedEntries && !query;
    const {isDark} = useTheme();

    // Main accent color for badges and highlights - lemon color in both modes
    const accentColor = "#F4E878";

    // Create params object for entries API
    const params: EntriesParams = {
        size: limit,
        tenantId
    };

    if (categories) {
        params.categories = categories.split(',');
    }

    if (tag) {
        params.tag = tag;
    }

    if (query) {
        params.query = query;
    }

    // Get key function for SWR Infinite
    const getKey = (pageIndex: number, previousPageData: Entry[] | null): EntriesParams | null => {
        // Return null to stop fetching when we've reached the end
        if (previousPageData && !previousPageData.length) return null;

        // Use the last item's date as cursor for pagination
        const cursor = (previousPageData && pageIndex !== 0)
            ? previousPageData[previousPageData.length - 1].updated.date : '';

        return {
            ...params,
            cursor
        };
    };

    // Fetcher function for SWR Infinite
    const fetcher = async (params: EntriesParams): Promise<Entry[]> => {
        const result = await getEntries(params);
        return result.content || [];
    };

    const {data, isLoading, size, setSize} = useSWRInfinite(getKey, fetcher,
        {revalidateFirstPage: false});
    const entries = data ? ([] as Entry[]).concat(...data) : isPreLoaded
        && preLoadedEntries.content;

    if (!isPreLoaded && (isLoading || !entries)) {
        return <Loading/>
    }

    // Check if filters are active
    const hasFilters = categories || tag || query;

    return (<>
        <OGP/>
        <div id="entries">
            <div>
                {/* Header section with title and optional filter indicator */}
                <div className="flex items-center justify-between mt-0">
                    <h2 className="mt-4">
                        Entries
                        {hasFilters && (
                            <span
                                className="ml-2 text-sm font-normal px-2 py-1 rounded-full inline-flex items-center"
                                style={{backgroundColor: accentColor, color: '#000'}}>
                                <FilterIcon className="h-3 w-3 mr-1"/>
                                Filtered
                            </span>
                        )}
                    </h2>
                </div>

                {/* Filter section - modernized with icons and cleaner layout */}
                {hasFilters && (
                    <div className={`mb-6 p-4 rounded-lg ${isDark
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-white border border-black/10 shadow-sm'}`}>
                        <div className="flex flex-wrap gap-2 items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                {categories && (
                                    <div className="inline-flex items-center rounded-full text-xs font-medium 
                                               px-3 py-1.5 transition-all"
                                         style={{backgroundColor: accentColor, color: '#000'}}>
                                        <FolderIcon className="h-3 w-3 mr-1"/>
                                        <Category
                                            categories={categories.split(',').map(c => ({name: c}))}
                                            className="text-gray-900"
                                        />
                                    </div>
                                )}

                                {tag && (
                                    <Link
                                        to={`/tags/${tag}/entries`}
                                        className="inline-flex items-center rounded-full text-xs font-medium 
                                                px-3 py-1.5 transition-all hover:shadow-sm"
                                        style={{backgroundColor: accentColor, color: '#000'}}
                                    >
                                        <TagIcon className="h-3 w-3 mr-1"/>
                                        <span>{tag}</span>
                                    </Link>
                                )}

                                {query && (
                                    <div className="inline-flex items-center rounded-full text-xs font-medium 
                                               px-3 py-1.5 transition-all"
                                         style={{backgroundColor: accentColor, color: '#000'}}>
                                        <SearchIcon className="h-3 w-3 mr-1"/>
                                        <span>{query}</span>
                                    </div>
                                )}
                            </div>
                            
                            <Link
                                to="/entries"
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium
                                        ${isDark
                                    ? 'border border-white hover:bg-white hover:text-black'
                                    : 'border border-black hover:bg-black hover:text-white'} 
                                        transition-all duration-200`}
                                aria-label="Clear all filters"
                            >
                                <CloseIcon className="h-3 w-3 mr-1"/>
                                Clear all
                            </Link>
                        </div>
                    </div>
                )}

                {/* Entries list - modernized with better spacing and hover effects */}
                <div className="space-y-4">
                    {entries && entries.map(entry => (
                        <div
                            key={entry.entryId}
                            className={`
                                p-4 rounded-lg
                                ${isDark ? 'bg-white/5 hover:bg-white/10'
                                : 'bg-white hover:bg-gray-50'} 
                                transition-all duration-200 shadow-sm
                            `}
                            style={{
                                borderLeft: `4px solid ${accentColor}`,
                                boxShadow: isDark ? '0 1px 3px rgba(255,255,255,0.05)'
                                    : '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Link
                                to={`/entries/${entry.entryId}${tenantId ? `/${tenantId}` : ''}`}
                                className="block mb-2 font-medium text-base hover:underline"
                            >
                                {entry.frontMatter.title}
                            </Link>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-fg2/80">
                                <span className="inline-flex items-center">
                                    <ClockIcon className="h-3 w-3 mr-1"/>
                                    <span>
                                        {entry.updated.date ?
                                            <ReactTimeAgo
                                                date={new Date(entry.updated.date)}
                                                locale="en-US"
                                                timeStyle="twitter"
                                            />
                                            : 'N/A'
                                        }
                                    </span>
                                </span>

                                {entry.frontMatter.tags && entry.frontMatter.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 items-center">
                                        <TagIcon className="h-3 w-3"/>
                                        {entry.frontMatter.tags.slice(0, 3).map(tag => (
                                            <Link
                                                key={tag.name}
                                                to={`/tags/${tag.name}/entries`}
                                                className="text-xs hover:underline transition-all"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                        {entry.frontMatter.tags.length > 3 && (
                                            <span className="text-xs opacity-70">
                                                +{entry.frontMatter.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {entries && entries.length === 0 && (
                        <div className={`text-center p-12 rounded-lg border border-dashed ${isDark
                            ? 'border-white/20' : 'border-black/20'}`}>
                            <EmptyDocumentIcon
                                className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'opacity-50'
                                    : 'opacity-30'}`}/>
                            <p className="text-sm font-medium">No entries found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Load more section - better centered */}
            {entries && entries.length > 0 && (
                <div className="flex justify-center w-full mb-12">
                    <LoadMore
                        data={data}
                        limit={limit}
                        size={size}
                        setSize={setSize}
                        isPreLoaded={isPreLoaded}
                    />
                </div>
            )}

            <BackToTop/>
        </div>
    </>)
}

export default EntriesPage