import React from "react";
import {styled} from "styled-components";

interface ShareWithHatebuProps {
    url: string,
}

const Hatebu = styled.a`
  background-color: #00a4de;
  background-image: url(/hatebu.svg);
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 4px;
  display: block;
  height: 32px;
  transition: background-color .2s;
  width: 32px;
`

export const ShareWithHatebu: React.FC<ShareWithHatebuProps> = ({
                                                               url,
                                                           }) =>
    <Hatebu href={`https://b.hatena.ne.jp/entry/s/${url.replace('https://', '')}`} target={'_blank'}></Hatebu>;