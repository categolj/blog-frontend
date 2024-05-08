import React, {ReactElement} from "react";


export interface MessageProps {
    status: 'success' | 'info' | 'warning' | 'error',
    text: ReactElement | null,
}

const Message: React.FC<MessageProps> = ({status, text}) => {
    return text && <p><strong>{status}</strong>: {text}</p>;

};

export default Message;