import React, {ReactElement} from "react";
import { InfoIcon, SuccessIcon, ErrorIcon, WarningIcon, CloseIcon } from "./icons";

export type MessageStatus = 'success' | 'info' | 'warning' | 'error';

export interface MessageProps {
    status: MessageStatus,
    text: ReactElement | null,
    onClose?: () => void, // Add optional callback for close event
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
    // Using CSS variables for consistent colors
    const baseClasses = "flex items-start p-4 mb-6 rounded-lg max-w-full border";
    
    // Style mapping using CSS variables
    const statusClasses = {
        success: "bg-(color:--message-bg) border-(color:--message-border) border-l-[8px] text-(color:--message-text)",
        error: "bg-(color:--message-bg) border-(color:--message-text) border-l-[8px] text-(color:--message-text)",
        warning: "bg-(color:--message-bg) border-(color:--message-border) border-l-[8px] text-(color:--message-text)",
        info: "bg-(color:--message-bg) border-(color:--message-border) border-l-[8px] text-(color:--message-text)"
    };
    
    const iconClasses = {
        success: "text-(color:--message-border)",
        error: "text-(color:--message-text)",
        warning: "text-(color:--message-border)",
        info: "text-(color:--message-border)"
    };
    
    return {
        container: `${baseClasses} ${statusClasses[status]}`,
        icon: `mr-3 shrink-0 ${iconClasses[status]}`,
        title: `font-medium text-(color:--message-text) capitalize mr-2`
    };
};

const Message: React.FC<MessageProps> = ({status, text, onClose}) => {
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
            {onClose && (
                <button 
                    onClick={onClose}
                    className="ml-3 text-black dark:text-white hover:text-[#FFDC00] dark:hover:text-[#FFDC00] transition-colors duration-200"
                    aria-label="Close message"
                >
                    <CloseIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default Message;