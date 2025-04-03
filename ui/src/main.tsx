import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from "react-router-dom";
import './index.css'
import routes from "./routes.tsx";
import App from './App';

const initDataText = document.getElementById('__INIT_DATA__');
const initData = initDataText && initDataText.textContent ? JSON.parse(initDataText.textContent) : {};
const router = createBrowserRouter(routes(initData));

ReactDOM.hydrateRoot(document.getElementById('root')!,
  <App router={router} />,
)