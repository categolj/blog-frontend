import React from "react";
import {Link} from "react-router-dom";
import {Foot} from "../styled/Foot.tsx";
import {useTheme} from "next-themes";

const Footer: React.FC = () => {
    const {setTheme} = useTheme();
    return <>
        <hr/>
        <Foot>
            <Link to={`/`}>IK.AM</Link> — &copy; 2010-{new Date().getFullYear()}
            &nbsp;Toshiaki Maki (<Link to={`/aboutme`}>About</Link>) / <Link to={'/info'}>Info</Link> / <a
            onClick={() => setTheme('light')}>Light Mode</a> / <a onClick={() => setTheme('dark')}>Dark Mode</a>
        </Foot>
    </>;
};

export default Footer;