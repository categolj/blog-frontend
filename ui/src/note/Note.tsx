import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import Loading from "../components/Loading.tsx";
import ScrollToTop from "react-scroll-to-top";
import {addCopyButton} from '../utils/copy';
import marked from '../utils/marked.ts'
import 'highlight.js/styles/default.min.css';
import {Title} from "../styled/Title.tsx";
import {Meta} from "../styled/Meta.tsx";
import {NoteDetails, NoteService} from "../clients/note";


const Note: React.FC = () => {
    const {entryId} = useParams();
    const fetcher: Fetcher<NoteDetails, string> = (entryId) => NoteService.getNoteByEntryId({entryId: Number(entryId)});
    const {data, isLoading} = useSWR(entryId, fetcher);
    useEffect(addCopyButton, [data]);
    if (isLoading || !data) {
        return <Loading/>
    }
    const contentHtml = marked.parse(data.content, {async: false, gfm: true}) as string;
    return <>
        <Title id="entry-title"><Link to={`/entries/${data.entryId}`}>{data.frontMatter.title}</Link></Title>
        <Meta id="entry-meta">
            Created on <span
            title={data.created && data.created.date}>{data.created && data.created.date ? new Date(data.created.date).toDateString() : 'N/A'}</span> •
            Last Updated on <span
            title={data.updated.date}>{data.updated.date ? new Date(data.updated.date).toDateString() : 'N/A'}</span>
        </Meta>
        <div id="entry" dangerouslySetInnerHTML={{__html: contentHtml}}/>
        <ScrollToTop smooth/>
    </>;
};

export default Note;