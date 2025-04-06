import React from 'react'
import {Link, useParams, useSearchParams} from "react-router-dom";
import useSWRInfinite from "swr/infinite";
import Loading from "../../components/Loading.tsx";
import Category from "../../components/Category.tsx";
import LoadMore from "../../components/LoadMore.tsx";
import BackToTop from "../../components/BackToTop";
import ReactTimeAgo from "react-time-ago";
import {OGP} from "../../components/OGP.tsx";
import {
    ClockIcon,
    EmptyDocumentIcon,
    FilterIcon,
    FolderIcon,
    SearchIcon,
    TagIcon
} from "../../components/icons";
import {CursorPageEntryInstant, EntriesParams, Entry, getEntries} from "../../api/entryApi";
import PageHeader from "../../components/PageHeader";
import Badge from "../../components/Badge";
import FilterSection from "../../components/FilterSection";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import EntryTag from "../../components/EntryTag";

export interface EntriesProps {
    preLoadedEntries?: CursorPageEntryInstant;
    tenantId?: string;
}

const EntriesPage: React.FC<EntriesProps> = ({preLoadedEntries, tenantId}) => {
    const {categories, tag} = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const limit = searchParams.has('limit') ? Number(searchParams.get('limit')) : 30;
    const isPreLoaded = preLoadedEntries && !query;

    // Accent color from CSS variables
    const accentColor = 'var(--accent)';

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
                <PageHeader title="Entries">
                    {hasFilters && (
                        <Badge
                            variant="tag"
                            icon={<FilterIcon className="h-3 w-3"/>}
                            className="ml-2"
                        >
                            Filtered
                        </Badge>
                    )}
                </PageHeader>

                {/* Filter section using our reusable component */}
                {hasFilters && (
                    <FilterSection clearHref="/entries">
                        {categories && (
                            <Badge variant="tag" icon={<FolderIcon className="h-3 w-3"/>}>
                                <Category
                                    categories={categories.split(',').map(c => ({name: c}))}
                                    className="text-[color:var(--tag-text)]"
                                />
                            </Badge>
                        )}

                        {tag && (
                            <Badge
                                variant="tag"
                                icon={<TagIcon className="h-3 w-3"/>}
                                href={`/tags/${tag}/entries`}
                            >
                                {tag}
                            </Badge>
                        )}

                        {query && (
                            <Badge variant="tag" icon={<SearchIcon className="h-3 w-3"/>}>
                                {query}
                            </Badge>
                        )}
                    </FilterSection>
                )}

                {/* Entries list using Card component */}
                <div className="space-y-4">
                    {entries && entries.map(entry => (
                        <Card
                            key={entry.entryId}
                            accentColor={accentColor}
                            isHighlighted={true}
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
                                            <EntryTag 
                                                key={tag.name} 
                                                name={tag.name}
                                                className="p-0 m-0 mr-1 bg-transparent hover:underline"
                                            />
                                        ))}
                                        {entry.frontMatter.tags.length > 3 && (
                                            <span className="text-xs opacity-70">
                                                +{entry.frontMatter.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}

                    {entries && entries.length === 0 && (
                        <EmptyState
                            icon={<EmptyDocumentIcon className="h-16 w-16"/>}
                            message="No entries found"
                        />
                    )}
                </div>
            </div>

            {/* Load more section */}
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
