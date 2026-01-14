import React from "react";
import {Link} from "react-router-dom";
import Message from "../../components/Message.tsx";

const Error429Page: React.FC = () => {
    return <>
        <h2>Too Many Requests</h2>
        <Message status={'error'} text={<>Please wait a moment and try again. Go to <Link to={'/'}>Home</Link>.</>}/>
    </>;

};

export default Error429Page;
