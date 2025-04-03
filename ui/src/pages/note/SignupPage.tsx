import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import {ApiError, ReaderService} from "../../clients/note";
import Message, {MessageProps} from "../../components/Message.tsx";
import {OGP} from "../../components/OGP.tsx";

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
            const response = await ReaderService.createReader({
                requestBody: {
                    email: email,
                    rawPassword: password
                }
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
        <p>
            &quot;はじめるSpring Boot 3&quot;を読むには、<a
            href={'https://note.com/makingx/m/m2dc6f318899c'}>note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。<br/>
            Emailアドレスとパスワードを設定してアカウントを作成して下さい。<br/>
            登録後に確認メールが送信されます。メールに記載されているアクティベーションリンクをクリックしてください。<br/>
            アクティベーション後は<Link to={`/note/login`}>こちら</Link>からログインしてください。
        </p>
        <form 
            className="flex flex-col w-[600px] max-w-full ml-0 gap-4"
            onSubmit={async event => {
                setFreeze(true);
                await handleSubmit(event);
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
            <label className="mb-3 block font-medium" htmlFor='password'>Password</label>
            <input
                className="mb-5 p-3 w-full border border-fg2 rounded-md focus:ring-2 focus:ring-fg2 focus:border-fg2"
                type='password'
                name='password'
                id='password'
                autoComplete='new-password'
                value={password}
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
                Sign up
            </button>
        </form>
    </>;
};

export default SignupPage;