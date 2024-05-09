import React from "react";

interface ShareWithXProps {
    url: string,
    text: string,
    via?: string,
}

export const ShareWithX: React.FC<ShareWithXProps> = ({
                                                          url,
                                                          text,
                                                          via = `making`
                                                      }) =>
    <>
        &lt;<a href={`https://x.com/share?url=${url}&text=${text}？&via=${via}`}>Share with X</a>&gt;
    </>;