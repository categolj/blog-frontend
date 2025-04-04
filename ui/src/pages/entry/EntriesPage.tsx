import React from 'react'
import {
    CursorPageEntryInstant,
    Entry,
    EntryService,
    GetEntries1Data,
    GetEntriesForTenant1Data
} from "../../clients/entry";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fetcher} from 'swr';
import useSWRInfinite from "swr/infinite";
import Loading from "../../components/Loading.tsx";
import Category from "../../components/Category.tsx";
import LoadMore from "../../components/LoadMore.tsx";
import ReactTimeAgo from "react-time-ago";
import {OGP} from "../../components/OGP.tsx";
import {useTheme} from "../../hooks/useTheme";

export interface EntriesProps {
    preLoadedEntries?: CursorPageEntryInstant;
    tenantId?: string;
}

type FetchKey = GetEntries1Data | GetEntriesForTenant1Data;
const EntriesPage: React.FC<EntriesProps> = ({preLoadedEntries, tenantId}) => {
    const {categories, tag} = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const limit = searchParams.has('limit') ? Number(searchParams.get('limit')) : 30;
    const isPreLoaded = preLoadedEntries && !query;
    const {isDark} = useTheme();

    // Prepare card styling based on theme
    const cardStyle = `border-l-4 ${isDark ? 'border-fg/30' : 'border-fg2/20'} 
                      pl-4 py-2 mb-4 hover:border-l-[6px] transition-all duration-200`;

    // Filter badge styles - exactly matching EntryPage.tsx tag styles
    const filterBadgeStyle = `inline-flex items-center rounded text-xs font-medium transition-all
                           ${isDark ? 'bg-[#F4E878] hover:bg-[#f5ec92]'
        : 'bg-yellow-100 hover:bg-yellow-200'}`;

    let request: object = {size: limit};
    if (categories) {
        request = {categories, ...request}
    }
    if (tag) {
        request = {tag, ...request}
    }
    if (query) {
        request = {query, ...request};
    }

    const getKey = (pageIndex: number, previousPageData: Entry[] | null) => {
        if (previousPageData && !previousPageData.length) return null;
        const cursor = (previousPageData && pageIndex !== 0)
            ? previousPageData[previousPageData.length - 1].updated.date : '';
        return {tenantId, cursor, ...request} as FetchKey;
    }

    const fetcher: Fetcher<Entry[]> = (key: FetchKey) => ((key as GetEntriesForTenant1Data).tenantId
        ?
        EntryService.getEntriesForTenant1(key as GetEntriesForTenant1Data) :
        EntryService.getEntries1(key as GetEntries1Data))
        .then(entries => entries.content || []);

    const {data, isLoading, size, setSize} = useSWRInfinite(getKey, fetcher,
        {revalidateFirstPage: false});
    const entries = data ? ([] as Entry[]).concat(...data) : isPreLoaded
        && preLoadedEntries.content;

    if (!isPreLoaded && (isLoading || !entries)) {
        return <Loading/>
    }

    return (<>
        <OGP/>
        <div id="entries">
            <div className="mb-8">
                <h2 className="text-2xl mb-2">Entries</h2>

                {/* Filter section */}
                {(categories || tag || query) && (
                    <div className={`mt-0 mb-4 py-2 px-2 rounded-lg ${isDark ? 'bg-fg/5'
                        : 'bg-fg2/5'}`}>
                        <div className="flex flex-wrap gap-2 items-center">
                            {categories && (
                                <div className={filterBadgeStyle + " px-2 py-1"}>
                                    <span className="mr-1">📁</span>
                                    <span className="text-gray-900 dark:text-gray-900">
                                        <Category
                                            categories={categories.split(',').map(c => ({name: c}))}
                                            className={`text-gray-800`}/>
                                    </span>
                                </div>
                            )}

                            {tag && (
                                <Link
                                    to={`/tags/${tag}/entries`}
                                    className={filterBadgeStyle + " px-2 py-1"}
                                >
                                    <span className="mr-1">🏷️</span>
                                    <span className="text-gray-900 dark:text-gray-900">{tag}</span>
                                </Link>
                            )}

                            {query && (
                                <span className={filterBadgeStyle + " px-2 py-1"}>
                                    <span className="mr-1">🔍</span>
                                    <span
                                        className="text-gray-900 dark:text-gray-900">{query}</span>
                                </span>
                            )}

                            <Link
                                to="/entries"
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium 
                                          border-2 border-black dark:border-white bg-transparent
                                          text-fg hover:bg-fg hover:text-bg 
                                          transition-colors duration-200 ml-auto"
                                aria-label="Clear all filters"
                            >
                                <span className="mr-1">✕</span>
                                Clear all
                            </Link>
                        </div>
                    </div>
                )}

                {/* Entries list */}
                <div className="space-y-1">
                    {entries && entries.map(entry => (
                        <div key={entry.entryId} className={cardStyle}>
                            <Link
                                to={`/entries/${entry.entryId}${tenantId ? `/${tenantId}` : ''}`}
                                className="block mb-1 font-medium hover:underline"
                            >
                                {entry.frontMatter.title}
                            </Link>

                            <div className="flex items-center text-xs text-fg2/70">
                                <span className="inline-block mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className="h-3 w-3 inline" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </span>
                                <span>
                                    Last Updated {entry.updated.date ?
                                    <ReactTimeAgo date={new Date(entry.updated.date)} locale="en-US"
                                                  timeStyle="twitter"/> : 'N/A'}
                                </span>

                                {entry.frontMatter.tags && entry.frontMatter.tags.length > 0 && (
                                    <div className="ml-3 flex gap-1.5">
                                        {entry.frontMatter.tags.slice(0, 3).map(tag => (
                                            <Link
                                                key={tag.name}
                                                to={`/tags/${tag.name}/entries`}
                                                className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                        {entry.frontMatter.tags.length > 3 && (
                                            <span
                                                className="text-xs opacity-70">+{entry.frontMatter.tags.length
                                                - 3}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {entries && entries.length === 0 && (
                        <div className="text-center p-12 opacity-60">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-sm">No entries found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Load more section */}
            <div className="flex justify-start pl-4">
                <LoadMore data={data} limit={limit} size={size} setSize={setSize}
                          isPreLoaded={isPreLoaded}/>
            </div>
        </div>
    </>)
}

export default EntriesPage