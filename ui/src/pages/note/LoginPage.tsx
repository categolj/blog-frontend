import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {PasswordResetService} from '../../clients/note';
import {ApiResult} from '../../clients/note/core/ApiResult.ts';
import Message, {MessageProps} from "../../components/Message.tsx";
import {OGP} from "../../components/OGP.tsx";

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
            setMessage((e as ApiResult).body || (e as ApiResult).statusText);
        }
    }
    const handleSubmitReset = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await PasswordResetService.sendLink({
                requestBody: {email}
            });
            setMessage({
                status: 'info',
                text: <>{response.message}</>
            });
            setEmail('');
        } catch (e) {
            setMessage((e as ApiResult).body || (e as ApiResult).statusText);
        }
    }
    return <>
        <OGP title={`はじめるSpring Boot 3`} url={`https://ik.am/notes`}/>
        <h2>Login</h2>
        <Message {...message}/>
        <p>
            当システムに登録済みのEmailアドレスをパスワード入力し、ログインして下さい。<br/>
            <strong>note.comのアカウントではありません</strong>。&quot;はじめるSpring Boot3&quot;を読むには、<a
            href={'https://note.com/makingx/m/m2dc6f318899c'}>note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。<br/>
            未登録の場合は<Link to={`/note/signup`}>こちら</Link>から登録してください。
        </p>
        <form 
            className="flex flex-col w-[600px] max-w-full ml-0 gap-4"
            onSubmit={async event => {
                setFreeze(true);
                await handleSubmitLogin(event);
                setFreeze(false);
            }}
        >
            <label className="mb-3 block font-medium" htmlFor='username'>Email</label>
            <input
                className="mb-5 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-fg2 focus:border-fg2"
                type='email'
                name='username'
                id='username'
                autoComplete='email'
                value={username}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <label className="mb-3 block font-medium" htmlFor='password'>Password</label>
            <input
                className="mb-5 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-fg2 focus:border-fg2"
                type='password'
                name='password'
                id='password'
                autoComplete='current-password'
                value={password}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <button 
                className="p-3 bg-fg text-bg border border-fg rounded-md hover:bg-fg2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type='submit'
                disabled={freeze}
            >
                Login
            </button>
        </form>
        <p>
            パスワードが未設定の場合、またはパスワードをリセットしたい場合は、以下より登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </p>
        <form
            className="flex flex-col w-[600px] max-w-full ml-0 gap-4"
            onSubmit={async event => {
                setFreeze(true);
                await handleSubmitReset(event);
                setFreeze(false);
            }}
        >
            <label className="mb-3 block font-medium" htmlFor='email'>Email</label>
            <input
                className="mb-5 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-fg2 focus:border-fg2"
                type='email'
                name='email'
                id='email'
                autoComplete='email'
                value={email}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <button 
                className="p-3 bg-fg text-bg border border-fg rounded-md hover:bg-fg2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type='submit'
                disabled={freeze}
            >
                Reset
            </button>
        </form>
    </>;
};

export default LoginPage;