import React, {ReactElement} from "react";
import {MessageBox, MessageStatus} from "../styled/MessageBox.tsx";

export interface MessageProps {
    status: MessageStatus,
    text: ReactElement | null,
}

const Message: React.FC<MessageProps> = ({status, text}) => {
    return text && <MessageBox status={status}><strong>{status}</strong> {text}</MessageBox>;
};

export default Message;