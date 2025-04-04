import React, { useState, useEffect } from "react";
import { Entry } from "../clients/entry";
import Spinner from "./Spinner";

interface LoadMoreProps {
    data: Entry[][] | undefined,
    limit: number,
    size: number,
    setSize: (size: number) => void;
    isPreLoaded?: boolean;
}

/**
 * A component that displays a "Load More" button for pagination
 * Shows a spinner when loading more entries
 */
const LoadMore: React.FC<LoadMoreProps> = ({data, limit, size, setSize, isPreLoaded}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [requestedSize, setRequestedSize] = useState(size);
    
    // Track when data has been loaded after a size change
    useEffect(() => {
        if (isLoading && size === requestedSize && data && data.length === requestedSize) {
            setIsLoading(false);
        }
    }, [data, size, requestedSize, isLoading]);
    
    if (!isPreLoaded && (!data || data[data.length - 1].length < limit)) return null;
    
    const handleLoadMore = () => {
        setIsLoading(true);
        const newSize = size + 1;
        setRequestedSize(newSize);
        setSize(newSize);
    };
    
    return (
        <button 
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-fg text-bg border-none px-4 md:px-16 py-4 cursor-pointer rounded-[0.35rem]
                     transition-colors duration-300 mt-2 mb-4 w-full md:w-auto md:min-w-[600px]
                     hover:bg-fg2 focus:outline-none disabled:opacity-75"
        >
            {isLoading ? (
                <span className="flex justify-center items-center gap-2">
                    <Spinner /> Loading...
                </span>
            ) : (
                "Load More"
            )}
        </button>
    );
};

export default LoadMore;