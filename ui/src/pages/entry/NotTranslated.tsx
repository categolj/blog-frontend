import React from "react";
import Message from "../../components/Message.tsx";

export const NotTranslated: React.FC<{ entryId?: string }> = ({entryId}) => <>
    <h2 className="text-2xl m-0 mb-4">Not Translated</h2>
    <Message status={'info'} text={
        <>
            🙇‍ Sorry, this entry is not yet translated.<br/><br/>
            Please <a
            href={`https://github.com/making/ik.am_en/issues/new?title=Translation%20Request%20to%20${entryId}&body=Please%20translate%20https://ik.am/entries/${entryId}%20into%20English`}>file
            an issue</a> requesting the translation.
        </>
    }/>
</>;