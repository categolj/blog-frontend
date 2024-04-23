import {Link} from 'react-router-dom';
import {styled} from "styled-components";

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
    return <>
        <NaviList id='navi'>
            <li><Link to={'/'}>Home</Link></li>
            <li><Link to={'/tags'}>Tags</Link></li>
            <li><Link to={'/categories'}>Categories</Link></li>
        </NaviList>
    </>;
};

export default Navi;