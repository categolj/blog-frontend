import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css'
import routes from "./routes.tsx";
import {HelmetProvider} from "react-helmet-async";

const initDataText = document.getElementById('__INIT_DATA__');
const initData = initDataText && initDataText.textContent ? JSON.parse(initDataText.textContent) : {};
const router = createBrowserRouter(routes(initData));

ReactDOM.hydrateRoot(document.getElementById('root')!,
    <React.StrictMode>
        <HelmetProvider>
            <RouterProvider router={router}/>
        </HelmetProvider>
    </React.StrictMode>,
)
