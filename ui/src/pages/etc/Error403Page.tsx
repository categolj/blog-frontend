import React from "react";
import {Link} from "react-router-dom";
import Message from "../../components/Message.tsx";

const Error403Page: React.FC = () => {
    return <>
        <h2>Forbidden</h2>
        <Message status={'error'} text={<>Go to <Link to={'/'}>Home</Link>.</>}/>
    </>;

};

export default Error403Page;