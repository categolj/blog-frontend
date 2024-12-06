import React, {useState} from 'react';
import {FormContainer} from "./styled/FormContainer.tsx";
import {CommentInput} from "./styled/CommentInput.tsx";
import {SubmitButton} from "./styled/SubmitButton.tsx";
import {ErrorText} from "./styled/ErrorText.tsx";
import {GoogleUser} from "./types.ts";
import {FormBody} from "./styled/FormBody.tsx";
import {Avatar} from "./styled/Avatar.tsx";

interface CommentFormProps {
    user: GoogleUser;
    entryId: string | undefined;
    onCommentPosted: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({user, entryId, onCommentPosted}) => {
    const [commentBody, setCommentBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    if (!entryId) {
        return <></>;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentBody.trim()) {
            setSubmissionError('Comment cannot be empty.');
            return;
        }
        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            const response = await fetch(`/api/entries/${entryId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': user.csrfToken
                },
                body: JSON.stringify({body: commentBody}),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the comment.');
            }

            // Clear the input field
            setCommentBody('');
            // Notify parent to update comments
            onCommentPosted();
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormBody>
                <Avatar src={user.picture} alt={user.name}/>
                <CommentInput
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Write your comment here..."
                    disabled={isSubmitting}
                />
            </FormBody>
            <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : `Post Comment as ${user.name}`}
            </SubmitButton>
            {submissionError && <ErrorText>{submissionError}</ErrorText>}
        </FormContainer>
    );
};

export default CommentForm;