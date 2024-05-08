import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import {ApiResult} from '../clients/note/core/ApiResult.ts';
import {Button} from "../styled/Button.tsx";
import {Input} from "../styled/Input.tsx";
import {Label} from "../styled/Label.tsx";
import {Form} from "../styled/Form.tsx";
import {ReaderService} from "../clients/note";
import Message, {MessageProps} from "../components/Message.tsx";

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
        try {
            const response = await ReaderService.createReader({
                requestBody: {
                    email: email,
                    rawPassword: password
                }
            });
            setMessage({
                status: 'info',
                text: <>{response.message}</>
            });
        } catch (e) {
            setMessage({
                status: 'error',
                text: (e as ApiResult).body || (e as ApiResult).statusText
            });
        }
    }

    return <>
        <h2>Sign up</h2>
        <Message {...message} />
        <p>
            &quot;はじめるSpring Boot 3&quot;を読むには、<a
            href={'https://note.com/makingx/m/m2dc6f318899c'}>note.com</a>でノートまたはマガジン購入した上で、note.comとは別に当システムにアカウントを作成する必要があります。<br/>
            Emailアドレスとパスワードを設定してアカウントを作成して下さい。<br/>
            登録後に確認メールが送信されます。メールに記載されているアクティベーションリンクをクリックしてください。<br/>
            アクティベーション後は<Link to={`/note/login`}>こちら</Link>からログインしてください。
        </p>
        <Form onSubmit={async event => {
            setFreeze(true);
            await handleSubmit(event);
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
            <Label htmlFor='password'>Password</Label>
            <Input
                type='password'
                name='password'
                id='password'
                autoComplete='new-password'
                value={password}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <Label htmlFor='confirmPassword'>Password (confirm)</Label>
            <Input
                type='password'
                name='confirmPassword'
                id='confirmPassword'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={handleInputChange}
                disabled={freeze}
                required={true}
            />
            <Button type='submit'
                    disabled={freeze}>Sign up</Button>
        </Form>
    </>;
};

export default SignupPage;