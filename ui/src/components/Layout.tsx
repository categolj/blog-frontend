import Header from './Header.tsx';
import {Outlet} from 'react-router-dom';
import Footer from "./Footer.tsx";
import Navi from "./Navi.tsx";

const Layout = () => {
    return (
        <div className="p-6 md:p-8 sm:px-2">
            <Header/>
            <Navi/>
            <hr className="my-4"/>
            <main className="my-6">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

export default Layout;