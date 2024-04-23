import React from 'react'
import {Entries as EntriesModel} from "./types.ts";
import {Link, useParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import Loading from "./components/Loading.tsx";
import Category from "./components/Category.tsx";
import {styled} from "styled-components";

export interface EntriesProps {
    preLoadedEntries: EntriesModel;
}

const Tag = styled.p`
  color: #031b4e99;
`

const Entries: React.FC<EntriesProps> = ({preLoadedEntries}) => {
    const isPreLoaded = !!preLoadedEntries;
    const {categories, tag} = useParams();
    let url = isPreLoaded ? null : '/api/entries?a';
    if (url && categories) {
        url += `&categories=${categories}`;
    }
    if (url && tag) {
        url += `&tag=${tag}`;
    }
    console.log(url);
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
            <h2>Entries</h2>
            <ul>
                {entries.content.map(post => <li key={post.entryId}><Link
                    to={`/entries/${post.entryId}`}>{post.frontMatter.title}</Link></li>)}
            </ul>
        </div>
    </>)
}

export default Entries
