import {RouteObject} from "react-router-dom";
import EntryPage, {EntryProps} from "./pages/entry/EntryPage.tsx";
import EntriesPage, {EntriesProps} from "./pages/entry/EntriesPage.tsx";
import Layout from "./components/Layout.tsx";
import TagsPage, {TagsProps} from "./pages/entry/TagsPage.tsx";
import CategoriesPage, {CategoriesProps} from "./pages/entry/CategoriesPage.tsx";
import en from 'javascript-time-ago/locale/en'
import TimeAgo from "javascript-time-ago";
import AboutMePage from "./pages/etc/AboutMePage.tsx";
import Error404Page from "./pages/etc/Error404Page.tsx";
import InfoPage from "./components/InfoPage.tsx";
import LoginPage from "./pages/note/LoginPage.tsx";
import NotesPage from "./pages/note/NotesPage.tsx";
import NotePage from "./pages/note/NotePage.tsx";
import SubscribePage from "./pages/note/SubscribePage.tsx";
import SignupPage from "./pages/note/SignupPage.tsx";
import ActivationPage from "./pages/note/ActivationPage.tsx";
import PasswordResetPage from "./pages/note/PasswordResetPage.tsx";
import 'highlight.js/styles/school-book.min.css';

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
                    path: "/entries/en",
                    element: <EntriesPage {...{...initData, ...{tenantId: 'en'} as EntriesProps}} />
                },
                {
                    path: "/entries/:entryId",
                    element: <EntryPage {...{
                        ...initData, ...{
                            repo: 'blog.ik.am',
                            branch: 'master'
                        }
                    } as EntryProps} />
                },
                {
                    path: "/entries/:entryId/en",
                    element: <EntryPage {...{
                        ...initData, ...{
                            tenantId: 'en',
                            repo: 'ik.am_en',
                            branch: 'main'
                        }
                    } as EntryProps} />
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
                    path: "/note/readers/:readerId/activations/:activationLinkId", element: <ActivationPage/>
                },
                {
                    path: "/note/password_reset/:resetId", element: <PasswordResetPage/>
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