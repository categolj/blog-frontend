import React, {ReactElement} from "react";
import { InfoIcon, SuccessIcon, ErrorIcon, WarningIcon } from "./icons";

export type MessageStatus = 'success' | 'info' | 'warning' | 'error';

export interface MessageProps {
    status: MessageStatus,
    text: ReactElement | null,
}

// Define message icon mapping from icons/index.tsx
const MessageIcons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
};

// Get tailwind classes based on message status and theme
const getMessageStyles = (status: MessageStatus) => {
    // Using only black, white, and lemon color as requested
    const baseClasses = "flex items-start p-4 mb-6 rounded-lg max-w-full border";
    
    // Style mapping using only the allowed colors
    const statusClasses = {
        success: "bg-white dark:bg-black border-[#FFDC00] border-l-[8px] text-black dark:text-white",
        error: "bg-white dark:bg-black border-black dark:border-white border-l-[8px] text-black dark:text-white",
        warning: "bg-white dark:bg-black border-[#FFDC00] border-l-[8px] text-black dark:text-white",
        info: "bg-white dark:bg-black border-[#FFDC00] border-l-[8px] text-black dark:text-white"
    };
    
    const iconClasses = {
        success: "text-[#FFDC00]",
        error: "text-black dark:text-white",
        warning: "text-[#FFDC00]",
        info: "text-[#FFDC00]"
    };
    
    return {
        container: `${baseClasses} ${statusClasses[status]}`,
        icon: `mr-3 flex-shrink-0 ${iconClasses[status]}`,
        title: `font-medium text-black dark:text-white capitalize mr-2`
    };
};

const Message: React.FC<MessageProps> = ({status, text}) => {
    if (!text) return null;
    
    const Icon = MessageIcons[status];
    const styles = getMessageStyles(status);
    
    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                <Icon />
            </div>
            <div className="flex-1">
                <div className="flex items-start">
                    <span className={styles.title}>{status}</span>
                    <div className="flex-1 leading-normal">{text}</div>
                </div>
            </div>
        </div>
    );
};

export default Message;