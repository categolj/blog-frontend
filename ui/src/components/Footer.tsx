import React from "react";
import {Link} from "react-router-dom";
import {Foot} from "../styled/Foot.tsx";
import {useTheme} from "next-themes";

const Footer: React.FC = () => {
    const {setTheme} = useTheme();
    return <>
        <hr/>
        <Foot>
            <Link to={`/`} className="text-fg2">IK.AM</Link> — &copy; 2010-{new Date().getFullYear()}
            &nbsp;Toshiaki Maki (<Link to={`/aboutme`} className="text-fg2">About</Link>) / <Link to={'/info'} className="text-fg2">Info</Link> / <a
            onClick={() => setTheme('light')} className="text-fg2 cursor-pointer">Light Mode</a> / <a onClick={() => setTheme('dark')} className="text-fg2 cursor-pointer">Dark Mode</a>
        </Foot>
    </>;
};

export default Footer;