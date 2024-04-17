import {RouteObject} from "react-router-dom";
import Entry, {EntryProps} from "./Entry.tsx";
import Entries, {EntriesProps} from "./Entries.tsx";

export default function routes(initData: object): RouteObject[] {
    return [
        {
            path: "/", element: <Entries {...initData as EntriesProps} />
        },
        {
            path: "/entries", element: <Entries {...initData as EntriesProps} />
        },
        {
            path: "/entries/:entryId", element: <Entry {...initData as EntryProps} />
        }
    ];
}