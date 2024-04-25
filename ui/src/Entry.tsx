import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import useSWR, {Fetcher} from 'swr';
import {Entry as EntryModel} from "./types.ts";
import Loading from "./components/Loading.tsx";
import ScrollToTop from "react-scroll-to-top";
import {addCopyButton} from './utils/copy';
import marked from './utils/marked.ts'
import 'highlight.js/styles/default.min.css';
import {styled} from "styled-components";
import Category from "./components/Category.tsx";

export interface EntryProps {
    preLoadedEntry?: EntryModel;
}

const Title = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;

  a {
    color: #333;
  }
`;

const Meta = styled.div`
  margin: 0;
  color: #031b4e99;
  display: inline-block;
  width: 100%;
  a {
    color: #031b4e99;
  }
`

const Tags = styled.p`
  color: #031b4e99;
  float: right;
  font-size: smaller;
  margin: 0 1em 0 0;

  a {
    color: #031b4e99;
  }
`

const Entry: React.FC<EntryProps> = ({preLoadedEntry}) => {
    const {entryId} = useParams();
    const isPreLoaded = preLoadedEntry && preLoadedEntry.entryId == Number(entryId);
    const fetcher: Fetcher<EntryModel, string> = (entryId) => fetch(`/api/entries/${entryId}`).then(res => res.json());
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
            Created on <span title={entry.created.date}>{new Date(entry.created.date).toDateString()}</span> •
            Last Updated on <span title={entry.updated.date}>{new Date(entry.updated.date).toDateString()}</span>
            <Tags id="entry-tags">🏷️ {tags}</Tags>
        </Meta>
        <div id="entry" dangerouslySetInnerHTML={{__html: contentHtml}}/>
        <Meta>
            Found a mistake? Update <a
            href={`https://github.com/making/blog.ik.am/blob/master/content/${entry.entryId.toString().padStart(5, '0')}.md`}>the
            entry</a>.
        </Meta>
        <ScrollToTop smooth/>
    </>;
};

export default Entry;