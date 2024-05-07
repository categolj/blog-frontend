import {NavLink} from 'react-router-dom';
import {styled} from "styled-components";
import SearchBox from "./SearchBox.tsx";

const NaviContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
`;

const NaviList = styled.ul`
  margin: 0;

  li {
    list-style: none;
    display: inline;
    padding-right: 1em;
    font-weight: bold;
  }
  
  li a.active {
    border-bottom: dashed;
  }
`;

const Navi = () => {
    return <NaviContainer>
        <NaviList id='navi'>
            <li><NavLink to={'/'}>Home</NavLink></li>
            <li><NavLink to={'/tags'}>Tags</NavLink></li>
            <li><NavLink to={'/categories'}>Categories</NavLink></li>
            <li><NavLink to={'/notes'}>Notes</NavLink></li>
        </NaviList>
        <SearchBox/>
    </NaviContainer>;
};

export default Navi;