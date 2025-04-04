import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return <>
        <hr/>
        <footer className="text-base">
            <Link to={`/`} className="text-fg2">IK.AM</Link> — &copy; 2010-{new Date().getFullYear()}
            &nbsp;Toshiaki Maki / <Link to={'/info'} className="text-fg2">Info</Link>
        </footer>
    </>;
};

export default Footer;