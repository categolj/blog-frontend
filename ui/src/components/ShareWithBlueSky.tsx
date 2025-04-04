import React from "react";
import { BlueSkyIcon } from "./icons";

interface ShareWithBlueSkyProps {
    url: string,
    text: string,
}

export const ShareWithBlueSky: React.FC<ShareWithBlueSkyProps> = ({
    url,
    text,
}) => (
    <a 
        href={`https://bsky.app/intent/compose?text=${text}%20${url}`} 
        target={'_blank'}
        title="Share on BlueSky"
        className="flex items-center justify-center w-8 h-8 bg-black dark:bg-white rounded transition-colors duration-200"
    >
        <BlueSkyIcon className="w-5 h-5 text-white dark:text-black" />
    </a>
);