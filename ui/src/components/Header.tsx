import React from "react";
import {Link} from "react-router-dom";
import {styled} from "styled-components";

const Title = styled.h1`
  font-size: 1.75rem;

  a {
    color: #333;
    text-decoration: none;
  }
`;

const Header: React.FC = () => {
    return <>
        <Title><Link to={`/`}>IK.AM</Link></Title>
    </>;
};

export default Header;