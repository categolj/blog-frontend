import React from "react";
import {Link} from "react-router-dom";

const Header: React.FC = () => {
    return <>
        <footer>
            <Link to={`/`}>IK.AM</Link> — &copy; 2010-{new Date().getFullYear()}
            &nbsp;<Link to={`/aboutme`}>Toshiaki Maki</Link>
        </footer>
    </>;
};

export default Header;