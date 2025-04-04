import React from "react";
import {Link, useParams} from "react-router-dom";
import {Fetcher} from 'swr';
import useSWRImmutable from 'swr/immutable';
import Loading from "../../components/Loading.tsx";
import 'highlight.js/styles/default.min.css';
import {SubscribeOutput, subscribe} from "../../api/noteApi";
import {ApiError} from "../../utils/fetch";
import Message, {MessageProps} from "../../components/Message.tsx";

const SubscribePage: React.FC = () => {
    const {noteId} = useParams();
    
    const fetcher: Fetcher<SubscribeOutput, string> = async (noteId) => {
        if (!noteId) {
            throw new Error("Note ID is required");
        }
        return subscribe(noteId);
    };
    
    const {data, isLoading, error} = useSWRImmutable<SubscribeOutput, ApiError>(
        noteId ? noteId : null, 
        fetcher
    );
    
    let message = {
        status: 'info',
        text: <></>
    };
    
    if (error) {
        if (error.status === 401) {
            message = {
                status: 'warning',
                text: <>アカウント情報を入力した上で、Subscribeボタンをクリックし、記事を購読状態にしてください。<br/>
                    <strong>note.comのアカウントではありません</strong>。note.comとは別に当システムにアカウントを作成する必要があります。<br/>
                    アカウント登録済みの場合は<Link to={`/note/login`}>こちら</Link>からログインし、再度このURLにアクセスしてください。
                    未登録の場合は<Link to={`/note/signup`}>こちら</Link>から登録してください</>
            };
        }
        if (error.status === 404) {
            message = {
                status: 'error',
                text: <>存在しないNoteです</>
            };
        }
        if (error.status === 403) {
            message = {
                status: 'error',
                text: <>まだアクセスできないNoteです</>
            };
        }
    } else if (isLoading || !data) {
        return <Loading/>
    } else if (data.subscribed) {
        message = {
            status: 'info',
            text: <>既に購読状態になっています。<Link to={`/notes/${data.entryId}`}>記事</Link>にアクセスしてください。</>
        };
    } else {
        message = {
            status: 'success',
            text: <>記事が購読状態になりました。<Link to={`/notes/${data.entryId}`}>記事</Link>にアクセスしてください。</>
        };
    }
    
    return <>
        <h2>Subscribe</h2>
        <Message {...message as MessageProps} />
    </>;
};

export default SubscribePage;