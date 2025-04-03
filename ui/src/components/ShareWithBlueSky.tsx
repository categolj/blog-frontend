import React from "react";

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
        className="block w-8 h-8 bg-[#0A7AFF] bg-[url(/bluesky.svg)] bg-no-repeat bg-contain rounded transition-colors duration-200"
    ></a>
);