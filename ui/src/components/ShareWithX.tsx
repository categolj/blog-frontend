import React from "react";
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
        className="block w-8 h-8 bg-black bg-[url(/X.svg)] bg-no-repeat bg-contain rounded transition-colors duration-200"
    ></a>
);