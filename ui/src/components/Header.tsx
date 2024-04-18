import React from "react";
import {Link} from "react-router-dom";

const Header: React.FC = () => {
    return <>
        <h1><Link to={`/`}>IK.AM</Link></h1>
    </>;
};

export default Header;