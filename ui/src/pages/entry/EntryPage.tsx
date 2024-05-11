import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import {ApiError, Entry, EntryService} from "../../clients/entry";
import Loading from "../../components/Loading.tsx";
import ScrollToTop from "react-scroll-to-top";
import {addCopyButton} from '../../utils/copy.ts';
import marked, {PlainTextRenderer} from '../../utils/marked.ts'
import Category from "../../components/Category.tsx";
import {Title2} from "../../styled/Title2.tsx";
import {Meta} from "../../styled/Meta.tsx";
import {Tags} from "../../styled/Tags.tsx";
import Message from "../../components/Message.tsx";
import Counter from "../../components/Counter.tsx";
import {OGP} from "../../components/OGP.tsx";
import {ShareWithX} from "../../components/ShareWithX.tsx";
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
            return <Message status={'error'} text={<>{error.body || error.statusText}</>}/>;
        }
    } else if (isLoading || !entry) {
        return <Loading/>
    }
    const contentHtml = marked.parse(entry.content, {async: false, gfm: true}) as string;
    const contentText = marked.parse(entry.content, {async: false, gfm: true, renderer: plainTextRenderer}) as string;
    const tags = entry.frontMatter.tags.length > 0 ? entry.frontMatter.tags
        .map<React.ReactNode>(t => <Link key={t.name}
                                         to={`/tags/${t.name}/entries`}>{t.name}</Link>)
        .reduce((prev, curr) => [prev, ' | ', curr]) : '';
    const metaDescription = contentText.substring(0, 150).replace(/[\n\r]/g, '') + '...';
    const translationLink = tenantId ? <Link to={`/entries/${entryId}`}>🇯🇵 Japanese</Link> :
        <Link to={`/entries/${entryId}/en`}>🇬🇧 English</Link>;
    const entryUrl = `https://ik.am/entries/${entry.entryId}${tenantId ? '/' + tenantId : ''}`
    return <>
        <OGP title={`${entry.frontMatter.title} - IK.AM`} url={entryUrl} description={metaDescription}/>
        <p id="entry-categories"><Category categories={entry.frontMatter.categories}/></p>
        <Title2 id="entry-title"><Link
            to={`/entries/${entry.entryId}${tenantId ? '/' + tenantId : ''}`}>{entry.frontMatter.title}</Link></Title2>
        <Meta id="entry-meta">
            Created on <span
            title={entry.created.date}>{entry.created.date ? new Date(entry.created.date).toDateString() : 'N/A'}</span> •
            Last Updated on <span
            title={entry.updated.date}>{entry.updated.date ? new Date(entry.updated.date).toDateString() : 'N/A'}</span> • <Counter
            entryId={entryId!}/> {!isPreLoaded && <>• {translationLink}</>}
            <Tags id="entry-tags">🏷️ {tags}</Tags>
        </Meta>
        <article id="entry" dangerouslySetInnerHTML={{__html: contentHtml}}/>
        <Meta>
            <blockquote>
                Found a mistake? Update <a
                href={`https://github.com/making/${repo}/blob/${branch}/content/${entry.entryId.toString().padStart(5, '0')}.md`}>the
                entry</a>.
            </blockquote>
            <p>
                <ShareWithX url={entryUrl} text={entry.frontMatter.title}/>
            </p>
        </Meta>
        <ScrollToTop smooth/>
    </>;
};

export default EntryPage;