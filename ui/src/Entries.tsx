import React from 'react'
import {Entries as EntriesModel} from "./types.ts";
import {Link} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import Loading from "./components/Loading.tsx";

export interface EntriesProps {
    preLoadedEntries: EntriesModel;
}

const Entries: React.FC<EntriesProps> = ({preLoadedEntries}) => {
    const isPreLoaded = !!preLoadedEntries;
    const fetcher: Fetcher<EntriesModel, string> = (url) => fetch(url).then(res => res.json());
    const {data, isLoading} = useSWR(isPreLoaded ? null : '/api/entries', fetcher);
    const entries = data || preLoadedEntries;
    if (isLoading || !entries) {
        return <Loading/>
    }
    return (<>
        <div id="entries">
            <h2>Entries</h2>
            <ul>
                {entries.content.map(post => <li key={post.entryId}><Link
                    to={`/entries/${post.entryId}`}>{post.frontMatter.title}</Link></li>)}
            </ul>
        </div>
    </>)
}

export default Entries
