import React from "react";
import { XIcon } from "./icons";

interface ShareWithXProps {
    url: string,
    text: string,
}

export const ShareWithX: React.FC<ShareWithXProps> = ({
    url,
    text,
}) => (
    <a 
        href={`https://x.com/intent/tweet?url=${url}&text=${text}`} 
        target={'_blank'}
        title="Share on X (Twitter)"
        className="flex items-center justify-center w-8 h-8 bg-black dark:bg-white rounded transition-colors duration-200"
    >
        <XIcon className="w-5 h-5 text-white dark:text-black" />
    </a>
);