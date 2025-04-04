import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import {createReader} from "../../api/noteApi";
import {ApiError} from "../../utils/fetch";
import Message, {MessageProps} from "../../components/Message.tsx";
import {OGP} from "../../components/OGP.tsx";
import {EmailIcon, LockIcon, UserIcon} from "../../components/icons";

const SignupPage: React.FC = () => {
    const [message, setMessage] = useState<MessageProps>({status: 'info', text: null});
    const [freeze, setFreeze] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === 'password') {
            setPassword(value);
        } else if (name == 'confirmPassword') {
            setConfirmPassword(value);
        } else if (name == 'email') {
            setEmail(value);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setMessage({
                status: 'error',
                text: <><code>password</code> and <code>confirmPassword</code> must be same</>,
            });
            return;
        }
        try {
            const response = await createReader({
                email: email,
                rawPassword: password
            });
            setMessage({
                status: 'success',
                text: <>{response.message}</>
            });
            setEmail('');
            setPassword('');
            setConfirmPassword('');
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
        <h2>Sign up</h2>
        <Message {...message} />
        
        {/* Main container */}
        <div className="w-full max-w-6xl ml-0">
            {/* Info message */}
            <div className="mb-6 p-4 border-l-4 border-[#FFDC00] bg-opacity-10 dark:bg-opacity-5 bg-[#FFDC00] text-fg">
                <p className="mb-2">
                    &quot;はじめるSpring Boot 3&quot;を読むには、<a
                    href={'https://note.com/makingx/m/m2dc6f318899c'} className="text-fg hover:text-[#FFDC00] transition-colors duration-200">note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。
                </p>
                <p className="mb-2">
                    Emailアドレスとパスワードを設定してアカウントを作成して下さい。
                </p>
                <p className="mb-2">
                    登録後に確認メールが送信されます。メールに記載されているアクティベーションリンクをクリックしてください。
                </p>
                <p className="mb-0">
                    アクティベーション後は<Link to={`/note/login`} className="text-fg hover:text-[#FFDC00] transition-colors duration-200 font-medium">こちら</Link>からログインしてください。
                </p>
            </div>
            
            {/* Signup card */}
            <div className="w-full max-w-6xl ml-0 bg-bg border border-fg2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-4 border-b border-fg2">
                    <div className="text-lg font-medium flex items-center gap-2 mb-0 text-fg">
                        <UserIcon /> アカウント作成
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
                            <label className="block text-sm font-medium mb-2" htmlFor='email'>メールアドレス</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg2">
                                    <EmailIcon />
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
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor='password'>パスワード</label>
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
                                    value={password}
                                    onChange={handleInputChange}
                                    disabled={freeze}
                                    required={true}
                                    placeholder="パスワードを入力してください"
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor='confirmPassword'>パスワード (確認)</label>
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
                            アカウント作成
                        </button>
                        
                        <div className="mt-4 text-center">
                            <span className="text-fg2 text-sm">すでにアカウントをお持ちの方は</span>
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

export default SignupPage;