import React, {ReactElement} from "react";
import {MessageBox, MessageStatus} from "../styled/MessageBox.tsx";

export interface MessageProps {
    status: MessageStatus,
    text: ReactElement | null,
}

const Message: React.FC<MessageProps> = ({status, text}) => {
    return text && <MessageBox status={status}><strong className={`text-[${status === 'success' ? '#5CBD9D' : status === 'error' ? '#E74C3C' : status === 'warning' ? '#F29C33' : '#3998DB'}]`}>{status}</strong> {text}</MessageBox>;
};

export default Message;