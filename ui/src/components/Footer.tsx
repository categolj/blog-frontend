import React from "react";
import {Link} from "react-router-dom";
import {styled} from "styled-components";

const Foot = styled.footer`
  font-size: 1em;

  a {
    color: #333;
    text-decoration: none;
  }
`;

const Footer: React.FC = () => {
    return <>
        <hr/>
        <Foot>
            <Link to={`/`}>IK.AM</Link> — &copy; 2010-{new Date().getFullYear()}
            &nbsp;<Link to={`/aboutme`}>Toshiaki Maki</Link>
        </Foot>
    </>;
};

export default Footer;