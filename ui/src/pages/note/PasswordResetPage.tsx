import React, {ChangeEvent, FormEvent, useState} from 'react';
import {resetPassword} from "../../api/noteApi";
import {ApiError} from "../../utils/fetch";
import Message, {MessageProps} from "../../components/Message.tsx";
import {Link, useParams} from "react-router-dom";
import {OGP} from "../../components/OGP.tsx";
import {LockIcon} from "../../components/icons";

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
                text: <><code>パスワード</code>と<code>パスワード(確認)</code>が一致しません</>,
            });
            return;
        }
        try {
            await resetPassword({newPassword, resetId});
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
                    text: <>パスワードリセットリンクが無効です</>
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
        
        {/* Main container */}
        <div className="w-full max-w-6xl ml-0">
            {/* Info message */}
            <div className="mb-6 p-4 border-l-4 border-[#FFDC00] bg-opacity-10 dark:bg-opacity-5 bg-[#FFDC00] text-fg">
                <p className="mb-2">
                    パスワードを再設定します。新しいパスワードを入力してください。
                </p>
                <p className="mb-0">
                    パスワードを再設定後は<Link to={`/note/login`} className="text-fg hover:text-[#FFDC00] transition-colors duration-200 font-medium">こちら</Link>からログインしてください。
                </p>
            </div>
            
            {/* Password reset card */}
            <div className="w-full max-w-6xl ml-0 bg-bg border border-fg2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-4 border-b border-fg2">
                    <div className="text-lg font-medium flex items-center gap-2 mb-0 text-fg">
                        <LockIcon /> パスワードリセット
                    </div>
                </div>
                
                <div className="p-6">
                    <form 
                        className="flex flex-col gap-4"
                        onSubmit={async event => {
                            setFreeze(true);
                            await handleSubmit(event);
                            setFreeze(false);
                        }}
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor='password'>新しいパスワード</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg2">
                                    <LockIcon />
                                </div>
                                <input
                                    className="pl-10 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-[#FFDC00] focus:border-[#FFDC00] transition-colors duration-200 bg-bg text-fg"
                                    type='password'
                                    name='password'
                                    id='password'
                                    autoComplete='new-password'
                                    value={newPassword}
                                    onChange={handleInputChange}
                                    disabled={freeze}
                                    required={true}
                                    placeholder="新しいパスワードを入力してください"
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor='confirmPassword'>新しいパスワード (確認)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg2">
                                    <LockIcon />
                                </div>
                                <input
                                    className="pl-10 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-[#FFDC00] focus:border-[#FFDC00] transition-colors duration-200 bg-bg text-fg"
                                    type='password'
                                    name='confirmPassword'
                                    id='confirmPassword'
                                    autoComplete='new-password'
                                    value={confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={freeze}
                                    required={true}
                                    placeholder="もう一度パスワードを入力してください"
                                />
                            </div>
                        </div>
                        
                        <button 
                            className="mt-2 py-3 px-4 bg-[#FFDC00] text-black font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 transform hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            type='submit'
                            disabled={freeze}
                        >
                            パスワードを再設定する
                        </button>
                        
                        <div className="mt-4 text-center">
                            <span className="text-fg2 text-sm">アカウントをお持ちの方は</span>
                            <Link to="/note/login" className="ml-1 text-fg hover:text-[#FFDC00] transition-colors duration-200 text-sm font-medium">
                                ログインしてください
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>;
};

export default PasswordResetPage;