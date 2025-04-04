import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const Footer: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return <>
        <hr/>
        <footer className="text-base">
            <Link to={`/`} className="text-fg2">IK.AM</Link> — &copy; 2010-{new Date().getFullYear()}
            &nbsp;Toshiaki Maki / <Link to={'/info'} className="text-fg2">Info</Link> / <a
            onClick={() => toggleTheme()} className="text-fg2 cursor-pointer">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</a>
        </footer>
    </>;
};

export default Footer;