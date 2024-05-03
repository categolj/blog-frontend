import React from "react";
import {Link} from "react-router-dom";

const Error404: React.FC = () => {
    return <div>
        <h2>Not Found</h2>
        <p>
            Go to <Link to={'/'}>Home</Link>.
        </p>
    </div>;

};

export default Error404;