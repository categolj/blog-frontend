import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import useSWR from 'swr';
import Loading from "../../components/Loading.tsx";
import BackToTop from "../../components/BackToTop";
import { addCopyButton } from '../../utils/copy.ts';
import marked, { PlainTextRenderer } from '../../utils/marked.ts'
import Category from "../../components/Category.tsx";
import Message from "../../components/Message.tsx";
import Counter from "../../components/Counter.tsx";
import { OGP } from "../../components/OGP.tsx";
import { ShareWithX } from "../../components/ShareWithX.tsx";
import { ShareWithBlueSky } from "../../components/ShareWithBlueSky.tsx";
import { ShareWithHatebu } from "../../components/ShareWithHatebu.tsx";
import { NotTranslated } from "./NotTranslated.tsx";
import { useTheme } from "../../hooks/useTheme";
import { ListIcon, CalendarIcon, EditIcon, EyeIcon, InfoIcon } from "../../components/icons";
import { getEntry, Entry } from "../../api/entryApi";
import { ApiError, ProblemDetail } from "../../utils/fetch";

export interface EntryProps {
    preLoadedEntry?: Entry;
    tenantId?: string;
    repo: string,
    branch: string,
}

const plainTextRenderer = new PlainTextRenderer();

/**
 * EntryPage component displays a single blog entry
 * Includes styling for both light and dark modes
 */
const EntryPage: React.FC<EntryProps> = ({ preLoadedEntry, tenantId, repo, branch }) => {
    const { entryId } = useParams();
    const { isDark } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    
    // Determine if the entry is preloaded or needs to be fetched
    const isPreLoaded = preLoadedEntry && preLoadedEntry.entryId == Number(entryId);
    
    // Fetch data using SWR if not preloaded
    const { data, isLoading, error } = useSWR<Entry, ApiError>(
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
    // Check both patterns: URL ending with /en or exactly matching /entries/en
    const isEnglish = location.pathname.endsWith('/en') || location.pathname === '/entries/en';
    
    // Add copy button functionality to code blocks
    useEffect(addCopyButton, [entry]);
    
    // Fade-in animation for the entry content
    useEffect(() => {
        if (entry) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [entry]);
    
    // Handle error states
    if (error) {
        if (tenantId && error.status === 404) {
            return <NotTranslated entryId={entryId} />;
        } else {
            const problem: ProblemDetail = error.body ? (error.body as ProblemDetail) : {
                title: error.statusText,
                detail: error.statusText
            };
            return (
                <div className="p-4 rounded-lg shadow-sm bg-opacity-10 bg-fg">
                    <h2 className="text-2xl m-0 mb-4">{problem.title}</h2>
                    <Message status={'error'} text={<>{problem.detail}</>} />
                </div>
            );
        }
    } else if (isLoading || !entry) {
        return <Loading />
    }
    
    // Parse content from markdown to HTML and plain text
    const contentHtml = marked.parse(entry.content, { async: false, gfm: true }) as string;
    const contentText = marked.parse(entry.content,
        { async: false, gfm: true, renderer: plainTextRenderer }) as string;
    
    // Format tags with links
    const tags = entry.frontMatter.tags.length > 0 ? entry.frontMatter.tags
        .map<React.ReactNode>(t => (
            <Link 
                key={t.name}
                to={`/tags/${t.name}/entries`}
                className={`px-2 py-1 mr-2 text-xs rounded font-medium transition-all 
                    ${isDark 
                        ? 'bg-[#F4E878] text-gray-800 hover:bg-[#f5ec92]' 
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
            >
                {t.name}
            </Link>
        ))
        : '';
    
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
        <div 
            className={`transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <OGP 
                title={`${entry.frontMatter.title} - IK.AM`} 
                url={entryUrl}
                description={metaDescription}
            />
            
            {/* Categories navigation with improved styling */}
            <div 
                id="entry-categories" 
                className="mb-6 flex items-center text-sm font-medium"
            >
                <div className="flex items-center text-meta">
                    <ListIcon className="h-4 w-4 mr-1" />
                    <Category categories={entry.frontMatter.categories} />
                </div>
            </div>
            
            {/* Entry title with hover effect */}
            <h2 
                id="entry-title" 
                className={`text-3xld mb-4 transition-all duration-300 ${
                    isDark ? 'hover:text-[#F4E878]' : 'hover:text-fg2'
                }`}
            >
                <Link to={`/entries/${entry.entryId}${tenantId ? '/' + tenantId : ''}`}>
                    {entry.frontMatter.title}
                </Link>
            </h2>
            
            {/* Meta information with improved layout */}
            <div 
                id="entry-meta" 
                className="mb-8 pb-6 border-b border-fg border-opacity-10 text-meta"
            >
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap items-center text-sm mb-2 sm:mb-0">
                        <div className="flex items-center mr-4">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span title={entry.created.date}>
                                {formatDate(entry.created.date)}
                            </span>
                        </div>
                        
                        <div className="flex items-center mr-4">
                            <EditIcon className="h-4 w-4 mr-1" />
                            <span title={entry.updated.date}>
                                {formatDate(entry.updated.date)}
                            </span>
                        </div>
                        
                        <div className="flex items-center">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            <Counter entryId={entryId!} />
                        </div>
                    </div>
                    
                    {/* Tags with improved styling */}
                    {entry.frontMatter.tags.length > 0 && (
                        <div id="entry-tags" className="flex flex-wrap items-center">
                            {tags}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Warning message for outdated content */}
            {isContentOutdated(entry) && (
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
                    />
                </div>
            )}
            
            {/* Main content with enhanced styling */}
            <article 
                id="entry" 
                className="prose prose-sm max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: contentHtml }} 
            />
            
            {/* Footer section with edit link and share buttons */}
            <div className="mt-10 pt-6 border-t border-fg border-opacity-10 text-meta">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} mb-6`}>
                    <div className="flex items-start">
                        <InfoIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                            Found a mistake? <a
                                href={`https://github.com/making/${repo}/blob/${branch}/content/${entry.entryId.toString().padStart(5, '0')}.md`}
                                className="underline hover:text-fg transition-colors"
                            >
                                Update the entry
                            </a>.
                        </span>
                    </div>
                </div>
                
                {/* Share buttons with improved layout */}
                <div className="flex flex-col">
                    <div className="text-sm mb-2">
                        Share this article:
                    </div>
                    <div className="flex space-x-2">
                        <ShareWithX url={entryUrl} text={entry.frontMatter.title} />
                        <ShareWithBlueSky url={entryUrl} text={entry.frontMatter.title} />
                        <ShareWithHatebu url={entryUrl} />
                    </div>
                </div>
            </div>
            
            <BackToTop />
        </div>
    );
};

export default EntryPage;