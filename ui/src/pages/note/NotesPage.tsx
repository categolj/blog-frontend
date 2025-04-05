import React from 'react';
import useSWR, {Fetcher} from "swr";
import useSWRImmutable from "swr/immutable";
import {NoteSummary, getNotes} from "../../api/noteApi";
import Loading from "../../components/Loading.tsx";
import {Link, useNavigate} from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import {OGP} from "../../components/OGP.tsx";
import {CheckIcon, NoAccessIcon} from "../../components/icons";

interface JWT {
    preferred_username: string;
}

const NotesPage: React.FC = () => {
    const navigate = useNavigate();
    const notesFetcher: Fetcher<NoteSummary[], string> = () => getNotes();
    const meFetcher: Fetcher<JWT, string> = (url) => fetch(url).then(res => res.json());
    const {data, isLoading, error} = useSWRImmutable<NoteSummary[]>('/notes', notesFetcher);
    const {data: me} = useSWR<JWT>('/api/me', meFetcher);
    
    if (!isLoading && error) {
        navigate('/note/login');
        return <></>;
    }
    
    if (isLoading || !data) {
        return <Loading/>
    }
    
    const handleLogout = async () => {
        await fetch(`/api/token`, {
            method: 'DELETE',
        });
        navigate('/note/login');
        return <></>;
    }
    
    return <>
        <OGP title={`はじめるSpring Boot 3`} url={`https://ik.am/notes`}/>
        
        {/* Header section */}
        <div className="mb-8">
            <h2>Notes</h2>
            <div className="flex items-center justify-between mt-4 mb-8 p-4 bg-bg border border-fg2 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 flex items-center justify-center bg-[#FFDC00] text-black rounded-full">
                        {me?.preferred_username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="text-fg">ようこそ <span className="font-medium">{me && me.preferred_username}</span> さん</span>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="py-2 px-4 bg-transparent border border-fg2 text-fg rounded-md hover:bg-[#FFDC00] hover:text-black transition-all duration-200">
                    Logout
                </button>
            </div>
        </div>
        
        {/* Main content section */}
        <div className="mb-6">
            <div className="flex items-baseline mb-4">
                <h3 className="mb-0 mr-2">はじめるSpring Boot 3</h3>
                <span className="bg-[#FFDC00] text-black text-xs py-1 px-2 rounded">
                    {data.filter(note => note.subscribed).length}/{data.length} 購読済み
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm">
                    <thead>
                        <tr className="bg-[#FFDC00] bg-opacity-10 dark:bg-opacity-5">
                            <th className="py-3 px-4 text-left border-b border-fg2">タイトル</th>
                            <th className="py-3 px-4 text-center border-b border-fg2 w-32">購読済み</th>
                            <th className="py-3 px-4 text-center border-b border-fg2 w-32">更新日</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((note: NoteSummary, index) => (
                            <tr 
                                key={note.entryId}
                                className={`
                                    hover:bg-[#FFDC00] hover:bg-opacity-5 transition-colors duration-150
                                    ${!note.subscribed ? 'bg-neutral-100 dark:bg-neutral-700' : ''}
                                    ${index === data.length - 1 ? '' : 'border-b border-fg2 border-opacity-50'}
                                `}
                            >
                                <td className="py-3 px-4">
                                    {note.title ? (
                                        note.subscribed ? (
                                            <Link 
                                                to={`/notes/${note.entryId}`}
                                                className="text-fg hover:text-[#FFDC00] transition-colors duration-200"
                                            >
                                                {note.title}
                                            </Link>
                                        ) : (
                                            <span className="text-fg opacity-75">{note.title}</span>
                                        )
                                    ) : (
                                        <span className="text-fg opacity-50 italic">タイトル未定</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {note.subscribed ? (
                                        <span className="inline-flex items-center justify-center h-8 w-8 bg-[#FFDC00] bg-opacity-20 dark:bg-opacity-10 rounded-full">
                                            <CheckIcon className="h-5 w-5 text-[#FFDC00] stroke-[2.5]" />
                                        </span>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="inline-flex items-center justify-center h-8 w-8 bg-red-500 bg-opacity-10 dark:bg-opacity-5 rounded-full">
                                                <NoAccessIcon className="h-5 w-5 text-red-500 dark:text-red-400 stroke-[2.5]" />
                                            </span>
                                            <a 
                                                href={note.noteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-fg hover:text-[#FFDC00] transition-colors duration-200 underline"
                                            >
                                                購読化リンクの確認 (要購入)
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-center text-fg opacity-75">
                                    {note.updatedDate ? (
                                        <span className="whitespace-nowrap">
                                            <ReactTimeAgo date={new Date(note.updatedDate)} locale={'en-US'}/>
                                        </span>
                                    ) : '-'}
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
        
        {/* Legend section */}
        <div className="mt-8 p-4 bg-bg border border-dashed border-fg2 rounded-lg text-sm text-fg opacity-75">
            <p className="mb-2 font-medium">表示について:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 bg-[#FFDC00] bg-opacity-20 dark:bg-opacity-10 rounded-full">
                        <CheckIcon className="h-3 w-3 text-[#FFDC00] stroke-[2.5]" />
                    </span>
                    購読済みのコンテンツはタイトルをクリックして閲覧できます
                </li>
                <li className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-5 w-5 bg-red-500 bg-opacity-10 dark:bg-opacity-5 rounded-full">
                        <NoAccessIcon className="h-3 w-3 text-red-500 dark:text-red-400 stroke-[2.5]" />
                    </span>
                    未購読のコンテンツはnote.comで購入後、購読登録が必要です
                </li>
            </ul>
        </div>
    </>;
};

export default NotesPage;