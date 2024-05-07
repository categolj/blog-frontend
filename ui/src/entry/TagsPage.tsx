import React from 'react'
import {Link} from "react-router-dom";
import {TagAndCount, TagService} from "../clients/entry";
import useSWR, {Fetcher} from 'swr';
import Loading from "../components/Loading.tsx";

export interface TagsProps {
    preLoadedTags?: TagAndCount[];
}

const TagsPage: React.FC<TagsProps> = ({preLoadedTags}) => {
    const isPreLoaded = !!preLoadedTags;
    const fetcher: Fetcher<TagAndCount[], string> = () => TagService.tags();
    const {data, isLoading} = useSWR(isPreLoaded ? null : '/api/tags', fetcher);
    const tags = data || preLoadedTags;
    if (isLoading || !tags) {
        return <Loading/>
    }
    return (<>
        <div id="tags">
            <h2>Tags</h2>
            <ul>
                {tags.map(tag => <li key={tag.name}><Link
                    to={`/tags/${tag.name}/entries`}>{tag.name}</Link> ({tag.count})</li>)}
            </ul>
        </div>
    </>)
}

export default TagsPage
