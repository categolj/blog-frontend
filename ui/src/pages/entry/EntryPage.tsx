import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import {ApiError, Entry, EntryService, ProblemDetail} from "../../clients/entry";
import Loading from "../../components/Loading.tsx";
import BackToTop from "../../components/BackToTop";
import {addCopyButton} from '../../utils/copy.ts';
import marked, {PlainTextRenderer} from '../../utils/marked.ts'
import Category from "../../components/Category.tsx";
import Message from "../../components/Message.tsx";
import Counter from "../../components/Counter.tsx";
import {OGP} from "../../components/OGP.tsx";
import {ShareWithX} from "../../components/ShareWithX.tsx";
import {ShareWithBlueSky} from "../../components/ShareWithBlueSky.tsx";
import {ShareWithHatebu} from "../../components/ShareWithHatebu.tsx";
import {NotTranslated} from "./NotTranslated.tsx";

export interface EntryProps {
    preLoadedEntry?: Entry;
    tenantId?: string;
    repo: string,
    branch: string,
}

interface FetchKey {
    entryId: string;
    tenantId?: string;
}

const plainTextRenderer = new PlainTextRenderer();

const EntryPage: React.FC<EntryProps> = ({preLoadedEntry, tenantId, repo, branch}) => {
    const {entryId} = useParams();
    const isPreLoaded = preLoadedEntry && preLoadedEntry.entryId == Number(entryId);
    const fetcher: Fetcher<Entry, FetchKey> = ({entryId, tenantId}) => tenantId ?
        EntryService.getEntryForTenant({entryId: Number(entryId), tenantId}) :
        EntryService.getEntry({entryId: Number(entryId)});
    const {data, isLoading, error} = useSWR<Entry, ApiError, FetchKey | null>(isPreLoaded ? null : {
        entryId,
        tenantId
    } as FetchKey, fetcher);
    const entry = data || preLoadedEntry;
    useEffect(addCopyButton, [entry]);
    if (error) {
        if (tenantId && error.status === 404) {
            return <NotTranslated entryId={entryId}/>;
        } else {
            const problem: ProblemDetail = error.body ? (error.body as ProblemDetail) : {
                title: error.statusText,
                detail: error.statusText
            };
            return <>
                <h2 className="text-2xl m-0 mb-4">{problem.title}</h2>
                <Message status={'error'} text={<>{problem.detail}</>}/>
            </>;
        }
    } else if (isLoading || !entry) {
        return <Loading/>
    }
    const contentHtml = marked.parse(entry.content, {async: false, gfm: true}) as string;
    const contentText = marked.parse(entry.content,
        {async: false, gfm: true, renderer: plainTextRenderer}) as string;
    const tags = entry.frontMatter.tags.length > 0 ? entry.frontMatter.tags
        .map<React.ReactNode>(t => <Link key={t.name}
                                         to={`/tags/${t.name}/entries`}>{t.name}</Link>)
        .reduce((prev, curr) => [prev, ' | ', curr]) : '';
    const metaDescription = contentText
        .replace('<', '')
        .replace('>', '')
        .substring(0, 150)
        .replace(/[\n\r]/g, '') + '...';
    const entryUrl = `https://ik.am/entries/${entry.entryId}${tenantId ? '/' + tenantId : ''}`
    return <>
        <OGP title={`${entry.frontMatter.title} - IK.AM`} url={entryUrl}
             description={metaDescription}/>
        <p id="entry-categories" className="mb-6"><Category
            categories={entry.frontMatter.categories}/></p>
        <h2 id="entry-title" className="text-2xl m-0 mb-4">
            <Link to={`/entries/${entry.entryId}${tenantId ? '/' + tenantId : ''}`}>
                {entry.frontMatter.title}
            </Link>
        </h2>
        <div id="entry-meta" className="m-0 text-meta inline-block w-full">
            Created on <span
            title={entry.created.date}>{entry.created.date ? new Date(
            entry.created.date).toDateString() : 'N/A'}</span> •
            Last Updated on <span
            title={entry.updated.date}>{entry.updated.date ? new Date(
            entry.updated.date).toDateString() : 'N/A'}</span> • <Counter
            entryId={entryId!}/>
            <p id="entry-tags" className="text-meta float-right text-smaller m-0 mr-4">
                🏷️ {tags}
            </p>
        </div>
        <article id="entry" dangerouslySetInnerHTML={{__html: contentHtml}}/>
        <div className="m-0 text-meta inline-block w-full">
            <blockquote>
                Found a mistake? Update <a
                href={`https://github.com/making/${repo}/blob/${branch}/content/${entry.entryId.toString().padStart(
                    5, '0')}.md`}>the
                entry</a>.
            </blockquote>
            <p style={{display: 'flex'}}>
                <ShareWithX url={entryUrl} text={entry.frontMatter.title}/>
                &nbsp;
                <ShareWithBlueSky url={entryUrl} text={entry.frontMatter.title}/>
                &nbsp;
                <ShareWithHatebu url={entryUrl}/>
            </p>
        </div>
        <BackToTop/>
    </>;
};

export default EntryPage;