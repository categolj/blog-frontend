import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import routes from "./routes.tsx";
import {HelmetProvider} from "react-helmet-async";
import {ThemeProvider} from "next-themes";
import {GlobalStyle} from "./styled/GlobalStyle.tsx";

const initDataText = document.getElementById('__INIT_DATA__');
const initData = initDataText && initDataText.textContent ? JSON.parse(initDataText.textContent) : {};
const router = createBrowserRouter(routes(initData));

ReactDOM.hydrateRoot(document.getElementById('root')!,
    <React.StrictMode>
        <GlobalStyle/>
        <ThemeProvider disableTransitionOnChange={true}>
            <HelmetProvider>
                <RouterProvider router={router}/>
            </HelmetProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
