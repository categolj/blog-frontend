import {RouteObject} from "react-router-dom";
import Entry, {EntryProps} from "./Entry.tsx";
import Entries, {EntriesProps} from "./Entries.tsx";
import Layout from "./components/Layout.tsx";
import Tags, {TagsProps} from "./Tags.tsx";
import Categories, {CategoriesProps} from "./Categories.tsx";

export default function routes(initData: object): RouteObject[] {
    return [
        {
            element: <Layout/>,
            children: [
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
                    path: "/categories", element: <Categories {...initData as CategoriesProps} />
                }
            ]
        },
    ];
}