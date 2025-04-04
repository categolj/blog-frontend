import {NavLink} from 'react-router-dom';
import SearchBox from "./SearchBox.tsx";
import MobileMenu from "./MobileMenu.tsx";
import ThemeToggleIcon from "./ThemeToggleIcon.tsx";
import LanguageToggle from "./LanguageToggle.tsx";
import { RssIcon } from "./icons";

const Navi = () => {
    return (
        <div className="flex justify-between items-center max-w-[600px]">
            {/* Desktop Navigation - Hidden on mobile screens */}
            <div className="hidden md:block flex-grow">
                <ul className="m-0" id='navi'>
                    <li className="list-none inline pr-4 font-bold">
                        <NavLink to={'/'} className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}>Home</NavLink>
                    </li>
                    <li className="list-none inline pr-4 font-bold">
                        <NavLink to={'/tags'} className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}>Tags</NavLink>
                    </li>
                    <li className="list-none inline pr-4 font-bold">
                        <NavLink to={'/categories'} className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}>Categories</NavLink>
                    </li>
                    <li className="list-none inline pr-4 font-bold">
                        <NavLink to={'/notes'} className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}>Notes</NavLink>
                    </li>
                    <li className="list-none inline pr-4 font-bold">
                        <NavLink to={'/aboutme'} className={({isActive}) => isActive ? "no-underline border-b border-dashed border-1" : "no-underline"}>About</NavLink>
                    </li>
                </ul>
            </div>
            
            {/* Desktop Search & Theme toggle - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
                <div className="w-[180px]">
                    <SearchBox/>
                </div>
                <div className="ml-2">
                    <ThemeToggleIcon />
                </div>
                <div className="ml-3">
                    <LanguageToggle />
                </div>
                <div className="ml-3">
                    <a 
                        href="/rss" 
                        aria-label="RSS Feed"
                        className="w-6 h-6 flex items-center justify-center text-fg2 hover:text-fg transition-colors"
                    >
                        <RssIcon />
                    </a>
                </div>
            </div>
            
            {/* Mobile Menu - Visible only on mobile screens */}
            <div className="md:hidden ml-auto">
                <MobileMenu />
            </div>
        </div>
    );
};

export default Navi;