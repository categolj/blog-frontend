import {RouteObject} from "react-router-dom";
import EntryPage, {EntryProps} from "./entry/EntryPage.tsx";
import EntriesPage, {EntriesProps} from "./entry/EntriesPage.tsx";
import Layout from "./components/Layout.tsx";
import TagsPage, {TagsProps} from "./entry/TagsPage.tsx";
import CategoriesPage, {CategoriesProps} from "./entry/CategoriesPage.tsx";
import en from 'javascript-time-ago/locale/en'
import TimeAgo from "javascript-time-ago";
import AboutMePage from "./components/AboutMePage.tsx";
import Error404Page from "./components/Error404Page.tsx";
import InfoPage from "./components/InfoPage.tsx";
import LoginPage from "./note/LoginPage.tsx";
import NotesPage from "./note/NotesPage.tsx";
import NotePage from "./note/NotePage.tsx";
import SubscribePage from "./note/SubscribePage.tsx";
import SignupPage from "./note/SignupPage.tsx";

TimeAgo.addDefaultLocale(en);
export default function routes(initData: object): RouteObject[] {
    return [
        {
            element: <Layout/>,
            children: [
                {
                    path: "*", element: <Error404Page/>
                },
                {
                    path: "/", element: <EntriesPage {...initData as EntriesProps} />
                },
                {
                    path: "/entries", element: <EntriesPage {...initData as EntriesProps} />
                },
                {
                    path: "/entries/:entryId", element: <EntryPage {...initData as EntryProps} />
                },
                {
                    path: "/tags", element: <TagsPage {...initData as TagsProps} />
                },
                {
                    path: "/tags/:tag/entries", element: <EntriesPage/>
                },
                {
                    path: "/categories", element: <CategoriesPage {...initData as CategoriesProps} />
                },
                {
                    path: "/categories/:categories/entries", element: <EntriesPage/>
                },
                {
                    path: "/note/login", element: <LoginPage/>
                },
                {
                    path: "/note/signup", element: <SignupPage/>
                },
                {
                    path: "/notes", element: <NotesPage/>
                },
                {
                    path: "/notes/:entryId", element: <NotePage/>
                },
                {
                    path: "/notes/:noteId/subscribe", element: <SubscribePage/>
                },
                {
                    path: "/aboutme", element: <AboutMePage/>
                },
                {
                    path: "/info", element: <InfoPage/>
                }
            ]
        },
    ];
}