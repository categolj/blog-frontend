import {Link} from 'react-router-dom';
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
`;

const Navi = () => {
    return <NaviContainer>
        <NaviList id='navi'>
            <li><Link to={'/'}>Home</Link></li>
            <li><Link to={'/tags'}>Tags</Link></li>
            <li><Link to={'/categories'}>Categories</Link></li>
            <li><Link to={'/notes'}>Notes</Link></li>
        </NaviList>
        <SearchBox/>
    </NaviContainer>;
};

export default Navi;