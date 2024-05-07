import React, {ChangeEvent, FormEvent, useState} from 'react';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom';
import {PasswordResetService} from '../clients/note';
import {ApiResult} from '../clients/note/core/ApiResult.ts';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 100%;
  margin-left: 0;
`;

const Label = styled.label`
  margin-bottom: 8px;
`;

const Input = styled.input`
  margin-bottom: 16px;
  padding: 8px;
`;

const Button = styled.button`
  padding: 8px;
`;

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>('');
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
            setMessage(JSON.stringify(error, null, 2));
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
            setMessage(JSON.stringify(response, null, 2));
        } catch (e) {
            setMessage((e as ApiResult).body || (e as ApiResult).statusText);
        }
    }
    return <>
        <h2>Login</h2>
        {message && <pre><code>{message}</code></pre>}
        <p>
            当システムに登録済みのEmailアドレスをパスワード入力し、ログインして下さい。<br/>
            <strong>note.comのアカウントではありません</strong>。&quot;はじめるSpring Boot3&quot;を読むには、<a
            href={'https://note.com/makingx/m/m2dc6f318899c'}>note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。<br/>
            未登録の場合は<Link to={`/note/signup`}>こちら</Link>から登録してください。
        </p>
        <Form onSubmit={async event => {
            setFreeze(true);
            await handleSubmitLogin(event);
            setFreeze(false);
        }}>
            <Label htmlFor='username'>Email</Label>
            <Input
                type='email'
                name='username'
                id='username'
                autoComplete='email'
                value={username}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <Label htmlFor='password'>Password</Label>
            <Input
                type='password'
                name='password'
                id='password'
                autoComplete='current-password'
                value={password}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <Button type='submit'
                    disabled={freeze}>Login</Button>
        </Form>
        <p>
            パスワードが未設定の場合、またはパスワードをリセットしたい場合は、以下より登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </p>
        <Form onSubmit={async event => {
            setFreeze(true);
            await handleSubmitReset(event);
            setFreeze(false);
        }}>
            <Label htmlFor='email'>Email</Label>
            <Input
                type='email'
                name='email'
                id='email'
                autoComplete='email'
                value={email}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <Button type='submit'
                    disabled={freeze}>Reset</Button>
        </Form>
    </>;
};

export default LoginPage;