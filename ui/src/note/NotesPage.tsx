import React from 'react';
import useSWR, {Fetcher} from "swr";
import {NoteService, NoteSummary} from "../clients/note";
import Loading from "../components/Loading.tsx";
import {Link, useNavigate} from "react-router-dom";
import styled from "styled-components";
import ReactTimeAgo from "react-time-ago";

const Button = styled.button`
  padding: 8px;
`;

interface JWT {
    preferred_username: string;
}

const NotesPage: React.FC = () => {
    const navigate = useNavigate();
    const notesFetcher: Fetcher<NoteSummary[], string> = () => NoteService.getNotes();
    const meFetcher: Fetcher<JWT, string> = () => fetch('/api/me').then(res => res.json());
    const {data, isLoading, error} = useSWR<NoteSummary[]>('/notes', notesFetcher);
    const {data: me} = useSWR<JWT>('/me', meFetcher);
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
        <h2>Notes</h2>
        <p>
            ようこそ {me && me.preferred_username} さん <Button onClick={handleLogout}>Logout</Button>
        </p>
        <h3>はじめるSpring Boot 3</h3>
        <table>
            <thead>
            <tr>
                <th>タイトル</th>
                <th>購読済み (*)</th>
                <th>更新日</th>
            </tr>
            </thead>
            <tbody>
            {
                data.map((note: NoteSummary) => <tr key={note.entryId}
                                                    className={!note.subscribed ? 'bg-neutral-100 dark:bg-neutral-700' : ''}>
                    <td>{note.title ? (note.subscribed ? <Link
                        to={`/notes/${note.entryId}`}>{note.title}</Link> : note.title) : 'タイトル未定'}
                    </td>
                    <td>{note.subscribed ? `✅` : <>{`⛔️`} <a href={note.noteUrl}
                                                             target={'_blank'}
                                                             rel={'noopener noreferrer'}>購読化リンクの確認</a> (要購入)</>}</td>
                    <td>{note.updatedDate ?
                        <ReactTimeAgo date={new Date(note.updatedDate)} locale={'en-US'}/> : '-'}</td>
                </tr>)
            }
            </tbody>
        </table>
    </>;
};

export default NotesPage;