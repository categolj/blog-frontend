import ReactDOMServer from 'react-dom/server'
import './index.css'
import routes from "./routes.tsx";
import { StaticRouter } from "react-router-dom/server";
import { Route, RouteObject, Routes } from "react-router-dom";
import { RouteProps } from "react-router/dist/lib/components";
import Layout from "./components/Layout.tsx";
import { HelmetProvider } from "react-helmet-async";

const helmetContext = {};

export function render(url: string, input: string) {
    const initData = input ? JSON.parse(input) : {};
    const router = routes(initData)[0].children as RouteObject[];
    
    // Default to light theme for server-side rendering
    const defaultTheme = 'light' as const;
    
    const html = ReactDOMServer.renderToString(
        <div className={defaultTheme === 'light' ? '' : 'dark'}>
            <HelmetProvider context={helmetContext}>
                <StaticRouter location={url}>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            {router.map(route => <Route {...route as RouteProps} />)}
                        </Route>
                    </Routes>
                </StaticRouter>
            </HelmetProvider>
        </div>
    );
    
    // @ts-expect-error TODO
    const {helmet} = helmetContext;
    const head = [
        helmet.title,
        helmet.priority,
        helmet.meta,
        helmet.link,
        helmet.script
    ].map(x => x.toString()).join('');
    
    return {html, head};
}