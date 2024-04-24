import React from 'react'
import {Entries as EntriesModel} from "./types.ts";
import {Link, useParams, useSearchParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import Loading from "./components/Loading.tsx";
import Category from "./components/Category.tsx";
import {styled} from "styled-components";

export interface EntriesProps {
    preLoadedEntries?: EntriesModel;
}

const Tag = styled.p`
  color: #031b4e99;
`
const Query = styled.span`
  color: #031b4e99;
  font-size: small;
`
const Entries: React.FC<EntriesProps> = ({preLoadedEntries}) => {
    const isPreLoaded = !!preLoadedEntries;
    const {categories, tag} = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
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
    const entries = data || preLoadedEntries;
    if (isLoading || !entries) {
        return <Loading/>
    }
    return (<>
        <div id="entries">
            {categories && <Category categories={categories.split(',').map(c => ({name: c}))}/>}
            {tag && <Tag>🏷️ {tag}</Tag>}
            <h2>Entries {query && <Query>({query})</Query>}</h2>
            <ul>
                {entries.content.map(post => <li key={post.entryId}><Link
                    to={`/entries/${post.entryId}`}>{post.frontMatter.title}</Link></li>)}
            </ul>
        </div>
    </>)
}

export default Entries
