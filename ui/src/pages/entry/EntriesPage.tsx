import React from 'react'
import {CursorPageEntryInstant, Entry, EntryService} from "../../clients/entry";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fetcher} from 'swr';
import useSWRInfinite from "swr/infinite";
import Loading from "../../components/Loading.tsx";
import Category from "../../components/Category.tsx";
import LoadMore from "../../components/LoadMore.tsx";
import ReactTimeAgo from "react-time-ago";
import {styled} from "styled-components";

export interface EntriesProps {
    preLoadedEntries?: CursorPageEntryInstant;
}

const Tag = styled.p`
  color: #031b4e99;
`
const Query = styled.p`
  color: #031b4e99;
  font-size: small;
`
const LastUpdated = styled.span`
  color: #031b4e99;
  font-size: smaller;
`
const EntriesPage: React.FC<EntriesProps> = ({preLoadedEntries}) => {
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
        return {cursor, ...request};
    }
    const fetcher: Fetcher<Entry[], object> = (data) => EntryService.getEntries1(data).then(entries => entries.content || []);
    const {data, isLoading, size, setSize} = useSWRInfinite(getKey, fetcher, {revalidateFirstPage: false});
    const entries = data ? ([] as Entry[]).concat(...data) : isPreLoaded && preLoadedEntries.content;
    if (!isPreLoaded && (isLoading || !entries)) {
        return <Loading/>
    }
    return (<>
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
        </div>
    </>)
}

export default EntriesPage
