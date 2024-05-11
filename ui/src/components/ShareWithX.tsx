import React from "react";
import {X} from "../styled/X.tsx";

interface ShareWithXProps {
    url: string,
    text: string,
}

export const ShareWithX: React.FC<ShareWithXProps> = ({
                                                          url,
                                                          text,
                                                      }) =>
    <X href={`https://x.com/intent/tweet?url=${url}&text=${text}`} target={'_blank'}></X>;