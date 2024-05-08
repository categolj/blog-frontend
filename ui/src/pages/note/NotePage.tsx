import React, {useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import Loading from "../../components/Loading.tsx";
import ScrollToTop from "react-scroll-to-top";
import {addCopyButton} from '../../utils/copy.ts';
import marked from '../../utils/marked.ts'
import 'highlight.js/styles/default.min.css';
import {Title} from "../../styled/Title.tsx";
import {Meta} from "../../styled/Meta.tsx";
import {ApiError, NoteDetails, NoteService} from "../../clients/note";

const NotePage: React.FC = () => {
    const navigate = useNavigate();
    const {entryId} = useParams();
    const fetcher: Fetcher<NoteDetails, string> = (entryId) => NoteService.getNoteByEntryId({entryId: Number(entryId)});
    const {data, isLoading, error} = useSWR<NoteDetails, ApiError>(entryId, fetcher);
    useEffect(addCopyButton, [data]);
    if (isLoading || !data) {
        return <Loading/>
    }
    if (error && error.status === 401) {
        navigate('/note/login');
        return <></>;
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

export default NotePage;