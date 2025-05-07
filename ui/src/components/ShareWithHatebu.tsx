import React from "react";
import { HatebuIcon } from "./icons";

interface ShareWithHatebuProps {
    url: string,
}

export const ShareWithHatebu: React.FC<ShareWithHatebuProps> = ({
    url,
}) => (
    <a 
        href={`https://b.hatena.ne.jp/entry/s/${url.replace('https://', '')}`} 
        target={'_blank'}
        title="Share on Hatena Bookmark"
        className="flex items-center justify-center w-8 h-8 bg-black dark:bg-white rounded-sm transition-colors duration-200"
    >
        <HatebuIcon className="w-5 h-5 text-white dark:text-black" />
    </a>
);