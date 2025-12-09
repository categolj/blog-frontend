import React, {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import useSWR from 'swr';
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
import {CalendarIcon, EditIcon, EyeIcon, FolderIcon, InfoIcon, MarkdownIcon} from "../../components/icons";
import {Entry, getEntry} from "../../api/entryApi";
import {ApiError, ProblemDetail} from "../../utils/fetch";
import EntryTag from "../../components/EntryTag";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import EntryMetaSection from "../../components/EntryMetaSection";
import InfoBox from "../../components/InfoBox";
import ShareSection from "../../components/ShareSection";

export interface EntryProps {
    preLoadedEntry?: Entry;
    tenantId?: string;
    repo: string,
    branch: string,
}

const plainTextRenderer = new PlainTextRenderer();

/**
 * EntryPage component displays a single blog entry
 */
const EntryPage: React.FC<EntryProps> = ({preLoadedEntry, tenantId, repo, branch}) => {
    const {entryId} = useParams();
    const [showOutdatedWarning, setShowOutdatedWarning] = useState(true);
    const [showErrorMessage, setShowErrorMessage] = useState(true);
    const location = useLocation();

    // Determine if the entry is preloaded or needs to be fetched
    const isPreLoaded = preLoadedEntry && preLoadedEntry.entryId == Number(entryId);

    // Fetch data using SWR if not preloaded
    const {data, isLoading, error} = useSWR<Entry, ApiError>(
        isPreLoaded || !entryId ? null : [entryId, tenantId],
        ([id, tId]) => getEntry(Number(id), typeof tId === 'string' ? tId : undefined)
    );

    const entry = data || preLoadedEntry;

    // Check if content is outdated (more than 2 years old)
    const isContentOutdated = (entry?: Entry) => {
        if (!entry?.updated?.date) return false;

        const updatedDate = new Date(entry.updated.date);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        return updatedDate < twoYearsAgo;
    };

    // Determine if we're in English mode
    const isEnglish = location.pathname.endsWith('/en') || location.pathname === '/entries/en';

    // Add copy button functionality to code blocks
    useEffect(addCopyButton, [entry]);

    // Handle error states
    if (error) {
        if (tenantId && error.status === 404) {
            return <NotTranslated entryId={entryId}/>;
        } else {
            const problem: ProblemDetail = error.body ? (error.body as ProblemDetail) : {
                title: error.statusText,
                detail: error.statusText
            };
            return (
                <Card>
                    <h2 className="text-2xl m-0 mb-4">{problem.title}</h2>
                    {showErrorMessage && (
                        <Message
                            status={'error'}
                            text={<>{problem.detail}</>}
                            onClose={() => setShowErrorMessage(false)}
                        />
                    )}
                </Card>
            );
        }
    } else if (isLoading || !entry) {
        return <Loading/>
    }

    // Parse content from markdown to HTML and plain text
    const contentHtml = marked.parse(entry.content, {async: false, gfm: true}) as string;
    const contentText = marked.parse(entry.content,
        {async: false, gfm: true, renderer: plainTextRenderer}) as string;

    // Create meta description for OGP
    const metaDescription = contentText
        .replace('<', '')
        .replace('>', '')
        .substring(0, 150)
        .replace(/[\n\r]/g, '') + '...';

    // Build entry URL
    const entryUrl = `https://ik.am/entries/${entry.entryId}${tenantId ? '/' + tenantId : ''}`;

    // Format dates nicely
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div>
            <OGP
                title={`${entry.frontMatter.title} - IK.AM`}
                url={entryUrl}
                description={metaDescription}
            />

            {/* Categories navigation */}
            <div className="mb-6 flex items-center text-sm font-medium">
                <div className="flex items-center text-meta">
                    <FolderIcon className="h-4 w-4 mr-1"/>
                    <Category categories={entry.frontMatter.categories}/>
                </div>
            </div>

            {/* Entry title with proper page header component */}
            <PageHeader
                title={
                    <Link to={`/entries/${entry.entryId}${tenantId ? '/' + tenantId : ''}`}>
                        {entry.frontMatter.title}
                    </Link>
                }
            />

            {/* Meta information using EntryMetaSection component */}
            <EntryMetaSection>
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap items-center text-sm mb-2 sm:mb-0">
                        <div className="flex items-center mr-4">
                            <CalendarIcon className="h-4 w-4 mr-1"/>
                            <span title={entry.created.date}>
                                {formatDate(entry.created.date)}
                            </span>
                        </div>

                        <div className="flex items-center mr-4">
                            <EditIcon className="h-4 w-4 mr-1"/>
                            <span title={entry.updated.date}>
                                {formatDate(entry.updated.date)}
                            </span>
                        </div>

                        <div className="flex items-center mr-4">
                            <EyeIcon className="h-4 w-4 mr-1"/>
                            <Counter entryId={entryId!}/>
                        </div>

                        <a
                            href={`/entries/${entry.entryId}.md`}
                            className="flex items-center text-meta hover:text-fg transition-colors"
                            title="View as Markdown"
                            data-discover="false"
                        >
                            <MarkdownIcon className="h-4 w-4"/>
                        </a>
                    </div>

                    {/* Tags using EntryTag component */}
                    {entry.frontMatter.tags.length > 0 && (
                        <div className="flex flex-wrap items-center">
                            {entry.frontMatter.tags.map(tag => (
                                <EntryTag key={tag.name} name={tag.name} />
                            ))}
                        </div>
                    )}
                </div>
            </EntryMetaSection>

            {/* Warning message for outdated content */}
            {isContentOutdated(entry) && showOutdatedWarning && (
                <div className="mb-8">
                    <Message
                        status="warning"
                        text={
                            <span>
                                {isEnglish
                                    ? "This article was last updated more than 2 years ago. The information may be outdated."
                                    : "この記事は2年以上前に更新されたものです。情報が古くなっている可能性があります。"
                                }
                            </span>
                        }
                        onClose={() => setShowOutdatedWarning(false)}
                    />
                </div>
            )}

            {/* Main content */}
            <article
                className="prose prose-sm max-w-none mb-8"
                dangerouslySetInnerHTML={{__html: contentHtml}}
            />

            {/* Footer section with InfoBox component */}
            <div className="mt-10 pt-6 border-t border-(color:--entry-border-color) text-meta">
                <InfoBox icon={<InfoIcon className="h-5 w-5" />}>
                    Found a mistake? <a
                        href={`https://github.com/making/${repo}/blob/${branch}/content/${entry.entryId.toString().padStart(
                            5, '0')}.md`}
                        className="underline hover:text-fg transition-colors"
                    >
                        Update the entry
                    </a>.
                </InfoBox>

                {/* Share buttons using ShareSection component */}
                <ShareSection>
                    <ShareWithX url={entryUrl} text={entry.frontMatter.title}/>
                    <ShareWithBlueSky url={entryUrl} text={entry.frontMatter.title}/>
                    <ShareWithHatebu url={entryUrl}/>
                </ShareSection>
            </div>

            <BackToTop/>
        </div>
    );
};

export default EntryPage;
