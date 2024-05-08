import React, {useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Fetcher} from 'swr';
import useSWRImmutable from 'swr/immutable';
import Loading from "../../components/Loading.tsx";
import ScrollToTop from "react-scroll-to-top";
import {addCopyButton} from '../../utils/copy.ts';
import marked from '../../utils/marked.ts'
import 'highlight.js/styles/default.min.css';
import {Title2} from "../../styled/Title2.tsx";
import {Meta} from "../../styled/Meta.tsx";
import {ApiError, NoteDetails, NoteService} from "../../clients/note";
import Message from "../../components/Message.tsx";

const NotePage: React.FC = () => {
    const navigate = useNavigate();
    const {entryId} = useParams();
    const fetcher: Fetcher<NoteDetails, string> = (entryId) => NoteService.getNoteByEntryId({entryId: Number(entryId)});
    const {data, isLoading, error} = useSWRImmutable<NoteDetails, ApiError>(entryId, fetcher);
    useEffect(addCopyButton, [data]);
    if (error) {
        if (error.status === 401) {
            navigate('/note/login');
            return <></>;
        } else if (error.status === 403) {
            return <Message status={'error'} text={<>未購読です。</>}/>
        } else {
            return <Message status={'error'} text={<>{error.body || error.statusText}</>}/>
        }
    } else if (isLoading || !data) {
        return <Loading/>
    }
    const contentHtml = marked.parse(data.content, {async: false, gfm: true}) as string;
    return <>
        <Title2 id="entry-title"><Link to={`/entries/${data.entryId}`}>{data.frontMatter.title}</Link></Title2>
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