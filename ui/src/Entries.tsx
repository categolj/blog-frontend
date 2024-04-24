import React from 'react'
import {Entries as EntriesModel, Entry} from "./types.ts";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {Fetcher} from 'swr';
import useSWRInfinite from "swr/infinite";
import Loading from "./components/Loading.tsx";
import Category from "./components/Category.tsx";
import LoadMore from "./components/LoadMore.tsx";
import ReactTimeAgo from "react-time-ago";
import {styled} from "styled-components";

export interface EntriesProps {
    preLoadedEntries?: EntriesModel;
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
const Entries: React.FC<EntriesProps> = ({preLoadedEntries}) => {
    const {categories, tag} = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const limit = searchParams.has('limit') ? Number(searchParams.get('limit')) : 30;
    const isPreLoaded = preLoadedEntries && !query;
    let url = `/api/entries?size=${limit}`;
    if (categories) {
        url += `&categories=${categories}`;
    }
    if (tag) {
        url += `&tag=${tag}`;
    }
    if (query) {
        url += `&query=${query}`;
    }
    const getKey = (pageIndex: number, previousPageData: Entry[] | null) => {
        if (previousPageData && !previousPageData.length) return null;
        const cursor = (previousPageData && pageIndex !== 0) ? previousPageData[previousPageData.length - 1].updated.date : '';
        return `${url}&cursor=${cursor}`;
    }
    const fetcher: Fetcher<Entry[], string> = (url) => fetch(url).then(res => res.json()).then(json => (json as EntriesModel).content);
    const {data, isLoading, size, setSize} = useSWRInfinite(getKey, fetcher, {revalidateFirstPage: false});
    const entries = data ? ([] as Entry[]).concat(...data) : isPreLoaded && preLoadedEntries.content;
    if (!isPreLoaded && (isLoading || !entries)) {
        return <Loading/>
    }
    return (<>
        <div id="entries">
            {categories && <Category categories={categories.split(',').map(c => ({name: c}))}/>}
            {tag && <Tag>🏷️ {tag}</Tag>}
            {query && <Query>Query: {query}</Query>}
            <h2>Entries</h2>
            <ul>
                {entries && entries.map(entry => <li key={entry.entryId}><Link
                    to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link>&nbsp;
                    <LastUpdated>Last Updated <ReactTimeAgo date={new Date(entry.updated.date)}
                                                            locale="en-US"/></LastUpdated>
                </li>)}
            </ul>
            <LoadMore data={data} limit={limit} size={size} setSize={setSize} isPreLoaded={isPreLoaded}/>
        </div>
    </>)
}

export default Entries
