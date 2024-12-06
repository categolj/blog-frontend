import React, {useEffect, useState} from "react";
import {Button} from "../../styled/Button.tsx";
import CommentList from "./CommentList.tsx";
import {GoogleUser} from "./types.ts";
import CommentForm from "./CommentForm.tsx";
import {SuccessText} from "./styled/SuccessText.tsx";


interface CommentsProps {
    entryId: string | undefined;
}

export const Comments: React.FC<CommentsProps> = ({entryId}) => {
    const [user, setUser] = useState<GoogleUser | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/google/whoami', {method: 'GET'});
                if (response.ok) {
                    const data = await response.json();
                    setUser(data || null);
                } else {
                    setUser(null); // Handle non-200 responses
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);
    if (!entryId) {
        return;
    }
    return <div>
        {user ? (
            <>
                <CommentForm user={user} entryId={entryId} onCommentPosted={() => {
                    setSuccessMessage(
                        'Thank you for posting a comment! It will appear after review. Please wait a moment.'
                    );
                }}/>
                {successMessage && <SuccessText onClick={() => setSuccessMessage(null)}>{successMessage}</SuccessText>}
            </>
        ) : (
            <>
                <Button onClick={() => {
                    window.location.href = `/api/google/login?redirect_path=${location.pathname}`;
                }}>
                    Log in with Google to comment
                </Button>
            </>
        )}
        <CommentList entryId={entryId} user={user}/>
    </div>;
};

