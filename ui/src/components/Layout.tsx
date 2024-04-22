import Header from './Header.tsx';
import {Outlet} from 'react-router-dom';
import Footer from "./Footer.tsx";
import Navi from "./Navi.tsx";

const Layout = () => {
    return <>
        <Header/>
        <Navi/>
        <hr/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </>;
};

export default Layout;