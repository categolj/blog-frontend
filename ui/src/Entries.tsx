import React from 'react'
import {Entries as EntriesModel} from "./types.ts";
import {Link, useParams, useSearchParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import Loading from "./components/Loading.tsx";
import Category from "./components/Category.tsx";
import {styled} from "styled-components";
import ReactTimeAgo from "react-time-ago";

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
    const query = searchParams.get("query");
    const isPreLoaded = preLoadedEntries && !query;
    let url = isPreLoaded ? null : '/api/entries?size=30';
    if (url && categories) {
        url += `&categories=${categories}`;
    }
    if (url && tag) {
        url += `&tag=${tag}`;
    }
    if (url && query) {
        url += `&query=${query}`;
    }
    const fetcher: Fetcher<EntriesModel, string> = (url) => fetch(url).then(res => res.json());
    const {data, isLoading} = useSWR(url, fetcher);
    const entries = isPreLoaded ? preLoadedEntries : data;
    if (isLoading || !entries) {
        return <Loading/>
    }
    return (<>
        <div id="entries">
            {categories && <Category categories={categories.split(',').map(c => ({name: c}))}/>}
            {tag && <Tag>🏷️ {tag}</Tag>}
            {query && <Query>Query: {query}</Query>}
            <h2>Entries</h2>
            <ul>
                {entries.content.map(entry => <li key={entry.entryId}><Link
                    to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link>&nbsp;
                    <LastUpdated>Last Updated <ReactTimeAgo date={new Date(entry.updated.date)}
                                                            locale="en-US"/></LastUpdated>
                </li>)}
            </ul>
        </div>
    </>)
}

export default Entries
