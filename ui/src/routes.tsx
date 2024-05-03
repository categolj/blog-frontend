import {RouteObject} from "react-router-dom";
import Entry, {EntryProps} from "./Entry.tsx";
import Entries, {EntriesProps} from "./Entries.tsx";
import Layout from "./components/Layout.tsx";
import Tags, {TagsProps} from "./Tags.tsx";
import Categories, {CategoriesProps} from "./Categories.tsx";
import en from 'javascript-time-ago/locale/en'
import TimeAgo from "javascript-time-ago";
import AboutMe from "./AboutMe.tsx";
import Error404 from "./components/Error404.tsx";
import Info from "./Info.tsx";
import Login from "./note/Login.tsx";
import Notes from "./note/Notes.tsx";

TimeAgo.addDefaultLocale(en);
export default function routes(initData: object): RouteObject[] {
    return [
        {
            element: <Layout/>,
            children: [
                {
                    path: "*", element: <Error404/>
                },
                {
                    path: "/", element: <Entries {...initData as EntriesProps} />
                },
                {
                    path: "/entries", element: <Entries {...initData as EntriesProps} />
                },
                {
                    path: "/entries/:entryId", element: <Entry {...initData as EntryProps} />
                },
                {
                    path: "/tags", element: <Tags {...initData as TagsProps} />
                },
                {
                    path: "/tags/:tag/entries", element: <Entries/>
                },
                {
                    path: "/categories", element: <Categories {...initData as CategoriesProps} />
                },
                {
                    path: "/categories/:categories/entries", element: <Entries/>
                },
                {
                    path: "/note/login", element: <Login/>
                },
                {
                    path: "/notes", element: <Notes/>
                },
                {
                    path: "/aboutme", element: <AboutMe/>
                },
                {
                    path: "/info", element: <Info/>
                }
            ]
        },
    ];
}