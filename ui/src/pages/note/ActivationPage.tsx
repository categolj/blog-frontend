import React from "react";
import {Link, useParams} from "react-router-dom";
import {Fetcher} from 'swr';
import useSWRImmutable from 'swr/immutable';

import 'highlight.js/styles/default.min.css';
import {ResponseMessage, activateReader} from "../../api/noteApi";
import {ApiError} from "../../utils/fetch";
import Message, {MessageProps} from "../../components/Message.tsx";
import Loading from "../../components/Loading.tsx";

const ActivationPage: React.FC = () => {
    const {readerId, activationLinkId} = useParams();
    
    const fetcher: Fetcher<ResponseMessage> = async () => {
        if (!readerId || !activationLinkId) {
            throw new Error("Invalid activation link");
        }
        return activateReader(readerId, activationLinkId);
    };
    
    const {data, isLoading, error} = useSWRImmutable<ResponseMessage, ApiError>(
        readerId && activationLinkId ? ['activate', readerId, activationLinkId] : null, 
        fetcher
    );
    
    let message = {
        status: 'info',
        text: <></>
    };
    
    if (error) {
        if (error.status === 404) {
            message = {
                status: 'error',
                text: <>存在しないアクティベーションリンクです</>
            };
        } else {
            message = {
                status: 'error',
                text: <>
                    Activation failed!<br/>
                    {error.body || error.statusText}
                </>
            };
        }
    } else if (isLoading || !data) {
        return <Loading/>
    } else {
        message = {
            status: 'success',
            text: <>アカウントがアクティベートされました。<Link
                to={`/note/login`}>こちら</Link>からログインしてください。</>
        }
    }
    
    return <>
        <h2>Activation</h2>
        <Message {...message as MessageProps} />
    </>;
};

export default ActivationPage;