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
        const cursor = (previousPageData && pageIndex !== 0) ? previousPageData[previousPageData.length - 1].updated.date : '';
        return {tenantId, cursor, ...request} as FetchKey;
    }
    const fetcher: Fetcher<Entry[]> = (key: FetchKey) => ((key as GetEntriesForTenant1Data).tenantId ?
        EntryService.getEntriesForTenant1(key as GetEntriesForTenant1Data) :
        EntryService.getEntries1(key as GetEntries1Data))
        .then(entries => entries.content || []);
    const {data, isLoading, size, setSize} = useSWRInfinite(getKey, fetcher, {revalidateFirstPage: false});
    const entries = data ? ([] as Entry[]).concat(...data) : isPreLoaded && preLoadedEntries.content;
    if (!isPreLoaded && (isLoading || !entries)) {
        return <Loading/>
    }
    const translationLink = tenantId ? <a href={`/entries`}>🇯🇵 Japanese</a> :
        <a href={`/entries/en`}>🇬🇧 English</a>;
    return (<>
        <OGP />
        <div id="entries">
            {categories && <p className="mb-6"><Category categories={categories.split(',').map(c => ({name: c}))}/></p>}
            {tag && <p className="text-meta mb-6">🏷️ {tag}</p>}
            {query && <p className="text-meta text-sm mb-6">Query: {query}</p>}
            <h2>Entries</h2>
            <ul>
                {entries && entries.map(entry => <li key={entry.entryId}><Link
                    to={`/entries/${entry.entryId}${tenantId ? `/${tenantId}` : ''}`}>{entry.frontMatter.title}</Link>&nbsp;
                    <span className="text-meta text-smaller">Last Updated {entry.updated.date ? <ReactTimeAgo date={new Date(entry.updated.date)}
                                                                                  locale="en-US"/> : 'N/A'}</span>
                </li>)}
            </ul>
            <LoadMore data={data} limit={limit} size={size} setSize={setSize} isPreLoaded={isPreLoaded}/>
            <br/>
            {(!categories && !tag && !query) && translationLink}
        </div>
    </>)
}

export default EntriesPage