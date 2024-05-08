import React from "react";
import {Link} from "react-router-dom";
import {Title1} from "../styled/Title1.tsx";

const Header: React.FC = () => {
    return <>
        <Title1><Link to={`/`}>IK.AM</Link></Title1>
    </>;
};

export default Header;