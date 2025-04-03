import React, {ChangeEvent, FormEvent, useState} from 'react';
import {ApiError, PasswordResetService} from "../../clients/note";
import Message, {MessageProps} from "../../components/Message.tsx";
import {Link, useParams} from "react-router-dom";
import {OGP} from "../../components/OGP.tsx";

const PasswordResetPage: React.FC = () => {
    const {resetId} = useParams();

    const [message, setMessage] = useState<MessageProps>({status: 'info', text: null});
    const [freeze, setFreeze] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === 'password') {
            setNewPassword(value);
        } else if (name == 'confirmPassword') {
            setConfirmPassword(value);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({
                status: 'error',
                text: <><code>password</code> and <code>confirmPassword</code> must be same</>,
            });
            return;
        }
        try {
            await PasswordResetService.reset({requestBody: {newPassword, resetId}});
            setMessage({
                status: 'success',
                text: <>パスワードがリセットされました。<br/>
                    <code>noreply@sendgrid.net</code>から<code>【はじめるSpring Boot
                        3】パスワードリセットリンク通知</code>という件名のメールです。<br/>
                    受信までに時間がかかる場合があります。届いていない場合は、お手数ですが迷惑メールボックスを確認して下さい。<br/>
                    <Link to={`/note/login`}>こちら</Link>からログインしてください。</>
            });
            setNewPassword('');
            setConfirmPassword('');
        } catch (e) {
            const error = e as ApiError;
            if (error.status === 404) {
                setMessage({
                    status: 'error',
                    text: <>Invalid password reset link</>
                });
                return;
            } else {
                setMessage({
                    status: 'error',
                    text: <>{error.body || error.statusText}</>
                });
            }
        }
    }

    return <>
        <OGP title={`はじめるSpring Boot 3`} url={`https://ik.am/notes`}/>
        <h2>Password Reset</h2>
        <Message {...message} />
        <form 
            className="flex flex-col w-[600px] max-w-full ml-0 gap-4"
            onSubmit={async event => {
                setFreeze(true);
                await handleSubmit(event);
                setFreeze(false);
            }}
        >
            <label className="mb-3 block font-medium" htmlFor='password'>Password</label>
            <input
                className="mb-5 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-fg2 focus:border-fg2"
                type='password'
                name='password'
                id='password'
                autoComplete='new-password'
                value={newPassword}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <label className="mb-3 block font-medium" htmlFor='confirmPassword'>Password (confirm)</label>
            <input
                className="mb-5 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-fg2 focus:border-fg2"
                type='password'
                name='confirmPassword'
                id='confirmPassword'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <button 
                className="p-3 bg-fg text-bg border border-fg rounded-md hover:bg-fg2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type='submit'
                disabled={freeze}
            >
                Password Reset
            </button>
        </form>
    </>;
};

export default PasswordResetPage;