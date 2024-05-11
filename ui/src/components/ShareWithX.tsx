import React from "react";

interface ShareWithXProps {
    url: string,
    text: string,
}

export const ShareWithX: React.FC<ShareWithXProps> = ({
                                                          url,
                                                          text,
                                                      }) =>
    <>
        &lt;<a href={`https://x.com/share?url=${url}&text=${text}`} target={'_blank'}>Share with X</a>&gt;
    </>;