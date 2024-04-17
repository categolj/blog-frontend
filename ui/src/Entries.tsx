import React, {useEffect, useState} from 'react'
import {Entries as EntriesModel, Entry} from "./types.ts";
import {Link} from "react-router-dom";

export interface EntriesProps {
    preLoadedEntries: EntriesModel;
}

const Entries: React.FC<EntriesProps> = ({preLoadedEntries}) => {
    const isPreLoaded = !!preLoadedEntries;
    const [entries, setEntries] = useState<EntriesModel>(isPreLoaded ? preLoadedEntries : {content: [] as Entry[]} as EntriesModel);
    const [loading, setLoading] = useState(!isPreLoaded);

    useEffect(() => {
        if (!isPreLoaded) {
            fetch('/api/entries')
                .then(res => res.json())
                .then(data => setEntries(data))
                .finally(() => setLoading(false));
        }
    }, [isPreLoaded]);

    if (loading) {
        return <div>Loading ...</div>
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
