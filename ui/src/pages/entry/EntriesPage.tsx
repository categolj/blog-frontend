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
import {Helmet} from "react-helmet-async";
import {Tag} from "../../styled/Tag.tsx";
import {Query} from "../../styled/Query.tsx";
import {LastUpdated} from "../../styled/LastUpdated.tsx";

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
    const translationLink = tenantId ? <Link to={`/entries`}>🇯🇵 Japanese</Link> :
        <Link to={`/entries/en`}>🇬🇧 English</Link>;
    return (<>
        <Helmet prioritizeSeoTags>
            <meta property='og:title' content='IK.AM'/>
            <meta property='og:url' content='https://ik.am'/>
            <meta property='og:description' content="@making's tech note"/>
            <meta name='description' content="@making's tech note"/>
            <link rel='canonical' href='https://ik.am'/>
        </Helmet>
        <div id="entries">
            {categories && <p><Category categories={categories.split(',').map(c => ({name: c}))}/></p>}
            {tag && <Tag>🏷️ {tag}</Tag>}
            {query && <Query>Query: {query}</Query>}
            <h2>Entries</h2>
            <ul>
                {entries && entries.map(entry => <li key={entry.entryId}><Link
                    to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link>&nbsp;
                    <LastUpdated>Last Updated {entry.updated.date ? <ReactTimeAgo date={new Date(entry.updated.date)}
                                                                                  locale="en-US"/> : 'N/A'}</LastUpdated>
                </li>)}
            </ul>
            <LoadMore data={data} limit={limit} size={size} setSize={setSize} isPreLoaded={isPreLoaded}/>
            <br/>
            {(!categories && !tag && !query) && translationLink}
        </div>
    </>)
}

export default EntriesPage
