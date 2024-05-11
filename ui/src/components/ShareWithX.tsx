import React from "react";
import {styled} from "styled-components";
interface ShareWithXProps {
    url: string,
    text: string,
}

const X = styled.a`
  background-color: black;
  background-image: url(/X.svg);
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 4px;
  display: block;
  height: 32px;
  transition: background-color .2s;
  width: 32px;
`

export const ShareWithX: React.FC<ShareWithXProps> = ({
                                                          url,
                                                          text,
                                                      }) =>
    <X href={`https://x.com/intent/tweet?url=${url}&text=${text}`} target={'_blank'}></X>;