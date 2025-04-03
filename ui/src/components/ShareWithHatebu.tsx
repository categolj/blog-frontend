import React from "react";

interface ShareWithHatebuProps {
    url: string,
}

export const ShareWithHatebu: React.FC<ShareWithHatebuProps> = ({
    url,
}) => (
    <a 
        href={`https://b.hatena.ne.jp/entry/s/${url.replace('https://', '')}`} 
        target={'_blank'} 
        className="block w-8 h-8 bg-[#00a4de] bg-[url(/hatebu.svg)] bg-no-repeat bg-contain rounded transition-colors duration-200"
    ></a>
);