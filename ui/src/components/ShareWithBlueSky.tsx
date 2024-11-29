import React from "react";
import {styled} from "styled-components";

interface ShareWithBlueSkyProps {
    url: string,
    text: string,
}

const BlueSky = styled.a`
    background-color: #0A7AFF;
    background-image: url(/bluesky.svg);
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: 4px;
    display: block;
    height: 32px;
    transition: background-color .2s;
    width: 32px;
`

export const ShareWithBlueSky: React.FC<ShareWithBlueSkyProps> = ({
                                                                url,
                                                                text,
                                                            }) =>
    <BlueSky href={`https://bsky.app/intent/compose?text=${text}%20${url}`} target={'_blank'}></BlueSky>;