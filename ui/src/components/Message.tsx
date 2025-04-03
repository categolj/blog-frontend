import React, {ReactElement} from "react";

export type MessageStatus = 'success' | 'info' | 'warning' | 'error';

export interface MessageProps {
    status: MessageStatus,
    text: ReactElement | null,
}

// Color map for message types
const colors = {
    success: '#5CBD9D',
    error: '#E74C3C',
    warning: '#F29C33',
    info: '#3998DB',
};

const Message: React.FC<MessageProps> = ({status, text}) => {
    if (!text) return null;
    
    return (
        <p 
            className="p-5 mb-6 rounded-[0.25rem] text-fg2 gap-3 leading-7 w-[800px] max-w-full border border-l-[5px]"
            style={{ 
                borderColor: colors[status], 
                borderLeftColor: colors[status] 
            }}
        >
            <strong style={{ color: colors[status] }}>{status}</strong> {text}
        </p>
    );
};

export default Message;