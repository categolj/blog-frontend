import React from "react";
import {Link, useParams} from "react-router-dom";
import {Fetcher} from 'swr';
import useSWRImmutable from 'swr/immutable';

import 'highlight.js/styles/default.min.css';
import {ActivateData, ApiError, ReaderService, ResponseMessage} from "../../clients/note";
import Message, {MessageProps} from "../../components/Message.tsx";
import Loading from "../../components/Loading.tsx";

const ActivationPage: React.FC = () => {
    const {readerId, activationLinkId} = useParams();
    const fetcher: Fetcher<ResponseMessage> = (data: object) => ReaderService.activate(data as ActivateData);
    const {data, isLoading, error} = useSWRImmutable<ResponseMessage, ApiError>({
        readerId,
        activationLinkId
    }, fetcher);
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