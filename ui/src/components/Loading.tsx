import React from "react";
import Spinner from "./Spinner";

/**
 * A loading indicator component that displays a spinner with text
 */
const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center gap-2 p-4">
            <Spinner />
            <span>Loading...</span>
        </div>
    );
};

export default Loading;