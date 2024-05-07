import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import {Entry, EntryService} from "../clients/entry";
import Loading from "../components/Loading.tsx";
import ScrollToTop from "react-scroll-to-top";
import {addCopyButton} from '../utils/copy.ts';
import marked from '../utils/marked.ts'
import 'highlight.js/styles/default.min.css';
import Category from "../components/Category.tsx";
import {Title} from "../styled/Title.tsx";
import {Meta} from "../styled/Meta.tsx";
import {Tags} from "../styled/Tags.tsx";

export interface EntryProps {
    preLoadedEntry?: Entry;
}

const EntryPage: React.FC<EntryProps> = ({preLoadedEntry}) => {
    const {entryId} = useParams();
    const isPreLoaded = preLoadedEntry && preLoadedEntry.entryId == Number(entryId);
    const fetcher: Fetcher<Entry, string> = (entryId) => EntryService.getEntry({entryId: Number(entryId)});
    const {data, isLoading} = useSWR(isPreLoaded ? null : entryId, fetcher);
    const entry = data || preLoadedEntry;
    useEffect(addCopyButton, [entry]);
    if (isLoading || !entry) {
        return <Loading/>
    }
    const contentHtml = marked.parse(entry.content, {async: false, gfm: true}) as string;
    const tags = entry.frontMatter.tags.length > 0 ? entry.frontMatter.tags
        .map<React.ReactNode>(t => <Link key={t.name}
                                         to={`/tags/${t.name}/entries`}>{t.name}</Link>)
        .reduce((prev, curr) => [prev, ' | ', curr]) : '';
    return <>
        <p id="entry-categories"><Category categories={entry.frontMatter.categories}/></p>
        <Title id="entry-title"><Link to={`/entries/${entry.entryId}`}>{entry.frontMatter.title}</Link></Title>
        <Meta id="entry-meta">
            Created on <span
            title={entry.created.date}>{entry.created.date ? new Date(entry.created.date).toDateString() : 'N/A'}</span> •
            Last Updated on <span
            title={entry.updated.date}>{entry.updated.date ? new Date(entry.updated.date).toDateString() : 'N/A'}</span>
            <Tags id="entry-tags">🏷️ {tags}</Tags>
        </Meta>
        <div id="entry" dangerouslySetInnerHTML={{__html: contentHtml}}/>
        <Meta>
            <blockquote>
                Found a mistake? Update <a
                href={`https://github.com/making/blog.ik.am/blob/master/content/${entry.entryId.toString().padStart(5, '0')}.md`}>the
                entry</a>.
            </blockquote>
        </Meta>
        <ScrollToTop smooth/>
    </>;
};

export default EntryPage;