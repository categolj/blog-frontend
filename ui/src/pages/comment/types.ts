export interface GoogleUser {
    id: string,
    name: string,
    email: string,
    picture: string,
    csrfToken: string
}

export interface Comment {
    commentId: number;
    entryId: number;
    body: string;
    commenter: {
        id: string;
        name: string;
        picture: string;
    };
    status: string;
    createdAt: string;
}