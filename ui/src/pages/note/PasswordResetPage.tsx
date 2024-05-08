import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Button} from "../../styled/Button.tsx";
import {Input} from "../../styled/Input.tsx";
import {Label} from "../../styled/Label.tsx";
import {Form} from "../../styled/Form.tsx";
import {ApiError, PasswordResetService} from "../../clients/note";
import Message, {MessageProps} from "../../components/Message.tsx";
import {Link, useParams} from "react-router-dom";

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
        <h2>Password Reset</h2>
        <Message {...message} />
        <Form onSubmit={async event => {
            setFreeze(true);
            await handleSubmit(event);
            setFreeze(false);
        }}>
            <Label htmlFor='password'>Password</Label>
            <Input
                type='password'
                name='password'
                id='password'
                autoComplete='new-password'
                value={newPassword}
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
                    disabled={freeze}>Password Reset</Button>
        </Form>
    </>;
};

export default PasswordResetPage;