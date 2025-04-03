import {NavLink} from 'react-router-dom';
import SearchBox from "./SearchBox.tsx";

const Navi = () => {
    return (
        <div className="flex justify-between items-center max-w-[600px]">
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
            </ul>
            <SearchBox/>
        </div>
    );
};

export default Navi;