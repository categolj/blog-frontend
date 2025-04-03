import React from "react";
import {Entry} from "../clients/entry";

interface LoadMoreProps {
    data: Entry[][] | undefined,
    limit: number,
    size: number,
    setSize: (size: number) => void;
    isPreLoaded?: boolean;
}

const LoadMore: React.FC<LoadMoreProps> = ({data, limit, size, setSize, isPreLoaded}) => {
    if (!isPreLoaded && (!data || data[data.length - 1].length < limit)) return null;
    return (
        <button 
            onClick={() => setSize(size + 1)}
            className="bg-fg text-bg border-none p-3 cursor-pointer rounded-[0.35rem] 
                     transition-colors duration-300 mt-6 mb-4 w-[600px] max-w-full
                     hover:bg-fg2 focus:outline-none"
        >
            Load More
        </button>
    );
};

export default LoadMore;