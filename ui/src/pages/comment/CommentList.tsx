// components/CommentList.tsx
import React from 'react';
import useSWR from 'swr';
import {Comment, GoogleUser} from "./types.ts";
import {CommentsContainer} from "./styled/CommentsContainer.tsx";
import {CommentCard} from "./styled/CommentCard.tsx";
import {Avatar} from "./styled/Avatar.tsx";
import {CommentContent} from "./styled/CommentContent.tsx";
import {CommentHeader} from "./styled/CommentHeader.tsx";
import {CommenterName} from "./styled/CommenterName.tsx";
import {CommentDate} from "./styled/CommentDate.tsx";
import {CommentBody} from "./styled/CommentBody.tsx";
import {ErrorText} from "./styled/ErrorText.tsx";
import {LoadingText} from "./styled/LoadingText.tsx";
import {styled} from "styled-components";

interface CommentListProps {
    entryId: string;
    user: GoogleUser | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CommentList: React.FC<CommentListProps> = ({entryId, user}) => {
    const {data, error, mutate} = useSWR<Comment[]>(`/api/entries/${entryId}/comments`, fetcher);

    if (error) return <ErrorText>Failed to load comments.</ErrorText>;
    if (!data) return <LoadingText>Loading comments...</LoadingText>;

    const handleDeleteComment = async (commentId: number) => {
        if (user) {
            if (!window.confirm('Are you sure you want to delete this comment?')) return;
            try {
                const response = await fetch(`/api/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': user.csrfToken
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to delete the comment.');
                }
                await mutate();
            } catch (error) {
                alert(error instanceof Error ? error.message : 'An unknown error occurred.');
            }
        }
    };

    return (
        <CommentsContainer>
            {data.length > 0 ?
                data.map((comment) => {
                    return (
                        <CommentCard key={comment.commentId}>
                            <Avatar src={comment.commenter.picture} alt={`${comment.commenter.name}'s avatar`}/>
                            <CommentContent>
                                <CommentHeader>
                                    <CommenterName>{comment.commenter.name}</CommenterName>
                                    <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
                                </CommentHeader>
                                <CommentBody>{comment.body}</CommentBody>
                                {user && comment.commenter.id === user.id && (
                                    <DeleteButton onClick={() => handleDeleteComment(comment.commentId)}>
                                        Delete
                                    </DeleteButton>
                                )}
                            </CommentContent>
                        </CommentCard>
                    );
                }) : <p>No Comment.</p>}
        </CommentsContainer>
    );
};
const DeleteButton = styled.button`
    position: absolute;
    top: 3rem;
    right: 1rem;
    padding: 0.3rem 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
`;
export default CommentList;

