import React from "react";
import {Entry} from "../clients/entry";
import {LoadButton} from "../styled/LoadButton.tsx";

interface LoadMoreProps {
    data: Entry[][] | undefined,
    limit: number,
    size: number,
    setSize: (size: number) => void;
    isPreLoaded?: boolean;
}

const LoadMore: React.FC<LoadMoreProps> = ({data, limit, size, setSize, isPreLoaded}) => {
    if (!isPreLoaded && (!data || data[data.length - 1].length < limit)) return null;
    return <LoadButton onClick={() => setSize(size + 1)}>Load More</LoadButton>;
};

export default LoadMore;