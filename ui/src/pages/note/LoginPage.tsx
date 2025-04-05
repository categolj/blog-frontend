import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {sendPasswordResetLink} from '../../api/noteApi';
import {ApiError} from '../../utils/fetch';
import Message, {MessageProps} from "../../components/Message.tsx";
import {OGP} from "../../components/OGP.tsx";
import {EmailIcon, LockIcon, UserIcon} from "../../components/icons";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<MessageProps>({status: 'info', text: null});
    const [freeze, setFreeze] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name == 'email') {
            setEmail(value);
        }
    };

    const handleSubmitLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/token`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({username, password}),
            });
            if (response.ok) {
                navigate('/notes');
                return <></>;
            }
            const error = await response.json();
            setMessage({
                status: 'error',
                text: <pre><code>{JSON.stringify(error, null, 2)}</code></pre>
            });
        } catch (e) {
            const error = e as ApiError;
            setMessage({
                status: 'error',
                text: <>{error.body || error.statusText}</>
            });
        }
    }
    
    const handleSubmitReset = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await sendPasswordResetLink({email});
            setMessage({
                status: 'info',
                text: <>{response.message}</>
            });
            setEmail('');
        } catch (e) {
            const error = e as ApiError;
            setMessage({
                status: 'error',
                text: <>{error.body || error.statusText}</>
            });
        }
    }
    
    return <>
        <OGP title={`はじめるSpring Boot 3`} url={`https://ik.am/notes`}/>
        <h2>Login</h2>
        <Message 
            {...message} 
            onClose={() => setMessage({status: 'info', text: null})}
        />

        {/* Main container for both forms */}
        <div className="w-full max-w-6xl ml-0">
            {/* Info message */}
            <div
                className="mb-6 p-4 border-l-4 border-[#FFDC00] bg-opacity-10 dark:bg-opacity-5 bg-[#FFDC00] text-fg">
                <p className="mb-2">
                    当システムに登録済みのEmailアドレスをパスワード入力し、ログインして下さい。
                </p>
                <p className="mb-2">
                    <strong>note.comのアカウントではありません</strong>。&quot;はじめるSpring
                    Boot3&quot;を読むには、<a
                    href={'https://note.com/makingx/m/m2dc6f318899c'}
                    className="text-fg hover:text-[#FFDC00] transition-colors duration-200">note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。
                </p>
                <p className="mb-0">
                    未登録の場合は<Link to={`/note/signup`}
                                        className="text-fg hover:text-[#FFDC00] transition-colors duration-200 font-medium">こちら</Link>から登録してください。
                </p>
            </div>

            {/* Form container with two columns on larger screens */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Login form */}
                <div
                    className="w-full md:w-1/2 ml-0 bg-bg border border-fg2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="p-4 border-b border-fg2">
                        <div className="text-lg font-medium flex items-center gap-2 mb-0 text-fg">
                            <UserIcon/> アカウントログイン
                        </div>
                    </div>

                    <form
                        className="p-6 flex flex-col gap-4"
                        onSubmit={async event => {
                            setFreeze(true);
                            await handleSubmitLogin(event);
                            setFreeze(false);
                        }}
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2"
                                   htmlFor='username'>Email</label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg2">
                                    <EmailIcon/>
                                </div>
                                <input
                                    className="pl-10 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-[#FFDC00] focus:border-[#FFDC00] transition-colors duration-200 bg-bg text-fg"
                                    type='email'
                                    name='username'
                                    id='username'
                                    autoComplete='email'
                                    value={username}
                                    onChange={handleInputChange}
                                    disabled={freeze}
                                    required={true}
                                    placeholder="メールアドレスを入力してください"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2"
                                   htmlFor='password'>パスワード</label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg2">
                                    <LockIcon/>
                                </div>
                                <input
                                    className="pl-10 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-[#FFDC00] focus:border-[#FFDC00] transition-colors duration-200 bg-bg text-fg"
                                    type='password'
                                    name='password'
                                    id='password'
                                    autoComplete='current-password'
                                    value={password}
                                    onChange={handleInputChange}
                                    disabled={freeze}
                                    required={true}
                                    placeholder="パスワードを入力してください"
                                />
                            </div>
                        </div>

                        <button
                            className="mt-2 py-3 px-4 bg-[#FFDC00] text-black font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 transform hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            type='submit'
                            disabled={freeze}
                        >
                            ログイン
                        </button>
                    </form>
                </div>

                {/* Password reset form */}
                <div
                    className="w-full md:w-1/2 ml-0 bg-bg border border-fg2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="p-4 border-b border-fg2">
                        <div className="text-lg font-medium flex items-center gap-2 mb-0 text-fg">
                            <LockIcon/> パスワードリセット
                        </div>
                    </div>

                    <div className="p-6">
                        <p className="text-fg2 mb-4 text-sm">
                            パスワードが未設定の場合、またはパスワードをリセットしたい場合は、以下より登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
                        </p>

                        <form
                            className="flex flex-col gap-4"
                            onSubmit={async event => {
                                setFreeze(true);
                                await handleSubmitReset(event);
                                setFreeze(false);
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2"
                                       htmlFor='email'>Email</label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg2">
                                        <EmailIcon/>
                                    </div>
                                    <input
                                        className="pl-10 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-[#FFDC00] focus:border-[#FFDC00] transition-colors duration-200 bg-bg text-fg"
                                        type='email'
                                        name='email'
                                        id='email'
                                        autoComplete='email'
                                        value={email}
                                        onChange={handleInputChange}
                                        disabled={freeze}
                                        required={true}
                                        placeholder="メールアドレスを入力してください"
                                    />
                                </div>
                            </div>

                            <button
                                className="py-3 px-4 bg-transparent border border-[#FFDC00] text-fg font-medium rounded-md hover:bg-[#FFDC00] hover:bg-opacity-10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                type='submit'
                                disabled={freeze}
                            >
                                リセットリンクを送信
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>;
};

export default LoginPage;