import React from "react";
import {Link} from "react-router-dom";
import {styled} from "styled-components";

const Foot = styled.footer`
  font-size: 1em;

  a {
    color: #333;
  }
`;

const Footer: React.FC = () => {
    return <>
        <hr/>
        <Foot>
            <Link to={`/`}>IK.AM</Link> — &copy; 2010-{new Date().getFullYear()}
            &nbsp;Toshiaki Maki (<Link to={`/aboutme`}>About</Link>) / <Link to={'/info'}>Info</Link>
        </Foot>
    </>;
};

export default Footer;