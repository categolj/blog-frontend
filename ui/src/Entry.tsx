import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Entry as EntryModel} from "./types.ts";
import marked from './utils/marked.ts'

export interface EntryProps {
    preLoadedEntry: EntryModel;
}

const Entry: React.FC<EntryProps> = ({preLoadedEntry}) => {
    const {entryId} = useParams();
    const isPreLoaded = preLoadedEntry && preLoadedEntry.entryId == Number(entryId);
    const [entry, setEntry] = useState<EntryModel>(isPreLoaded ? preLoadedEntry : {} as EntryModel);
    const [loading, setLoading] = useState(!isPreLoaded);

    useEffect(() => {
        if (entryId && !isPreLoaded) {
            fetch(`/api/entries/${entryId}`)
                .then(res => res.json())
                .then(data => setEntry(data))
                .finally(() => setLoading(false));
        }
    }, [entryId, isPreLoaded]);

    if (loading) {
        return <div>Loading ...</div>
    }
    const contentHtml = marked.parse(entry.content, {async: false, gfm: true}) as string;
    return <>
        <h3 id="title"><Link to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link></h3>
        <div id="entry" dangerouslySetInnerHTML={{__html: contentHtml}} />
        <hr/>
        <Link to={'/'}>&laquo; Go to Entries</Link>
    </>;
};

export default Entry;