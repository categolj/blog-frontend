import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSWR, { Fetcher } from 'swr';
import { ApiError, Entry, EntryService, ProblemDetail } from "../../clients/entry";
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

/**
 * EntryPage component displays a single blog entry
 * Includes styling for both light and dark modes
 */
const EntryPage: React.FC<EntryProps> = ({ preLoadedEntry, tenantId, repo, branch }) => {
    const { entryId } = useParams();
    const { isDark } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    
    // Determine if the entry is preloaded or needs to be fetched
    const isPreLoaded = preLoadedEntry && preLoadedEntry.entryId == Number(entryId);
    
    // Fetcher function for SWR to get entry data
    const fetcher: Fetcher<Entry, FetchKey> = ({ entryId, tenantId }) => tenantId ?
        EntryService.getEntryForTenant({ entryId: Number(entryId), tenantId }) :
        EntryService.getEntry({ entryId: Number(entryId) });
    
    // Fetch data using SWR if not preloaded
    const { data, isLoading, error } = useSWR<Entry, ApiError, FetchKey | null>(isPreLoaded ? null : {
        entryId,
        tenantId
    } as FetchKey, fetcher);
    
    const entry = data || preLoadedEntry;
    
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
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 6h16M4 12h16M4 18h7" 
                        />
                    </svg>
                    <Category categories={entry.frontMatter.categories} />
                </div>
            </div>
            
            {/* Entry title with hover effect */}
            <h2 
                id="entry-title" 
                className={`text-3xl font-bold mb-4 transition-all duration-300 ${
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
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 mr-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                />
                            </svg>
                            <span title={entry.created.date}>
                                {formatDate(entry.created.date)}
                            </span>
                        </div>
                        
                        <div className="flex items-center mr-4">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 mr-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                                />
                            </svg>
                            <span title={entry.updated.date}>
                                {formatDate(entry.updated.date)}
                            </span>
                        </div>
                        
                        <div className="flex items-center">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 mr-1" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                />
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                />
                            </svg>
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
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
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