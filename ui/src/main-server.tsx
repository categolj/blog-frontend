import ReactDOMServer from 'react-dom/server'
import './index.css'
import routes from "./routes.tsx";
import { createStaticRouter, StaticRouterProvider, matchRoutes } from "react-router";
import type { StaticHandlerContext } from "react-router";
import { HelmetProvider } from "react-helmet-async";

const helmetContext = {};

export function render(url: string, input: string) {
    const initData = input ? JSON.parse(input) : {};
    const routeConfig = routes(initData);

    // Parse URL to extract pathname, search, and hash
    // The base URL is only used to parse relative paths; the host doesn't matter
    const urlObj = new URL(url, "http://ssr");

    // Match routes manually
    const matches = matchRoutes(routeConfig, urlObj.pathname) || [];

    // Build StaticHandlerContext manually
    const context = {
        basename: "",
        location: {
            pathname: urlObj.pathname,
            search: urlObj.search,
            hash: urlObj.hash,
            state: null,
            key: "default"
        },
        matches: matches,
        loaderData: {},
        actionData: null,
        errors: null,
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {}
    } as StaticHandlerContext;

    const router = createStaticRouter(routeConfig, context);

    const html = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouterProvider router={router} context={context} />
        </HelmetProvider>
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
