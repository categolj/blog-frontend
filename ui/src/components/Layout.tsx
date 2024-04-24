import Header from './Header.tsx';
import {Outlet} from 'react-router-dom';
import Footer from "./Footer.tsx";
import Navi from "./Navi.tsx";
import {styled} from "styled-components";

const Container = styled.div`
  padding: 20px;

  @media (max-width: 800px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Layout = () => {
    return <Container>
        <Header/>
        <Navi/>
        <hr/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </Container>;
};

export default Layout;