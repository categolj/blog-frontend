export interface Post {
    id: number;
    title: string;
    body: string;
}

export interface Entry {
    entryId: number;
    content: string;
    frontMatter: FrontMatter;
}

export interface FrontMatter {
    title: string;
}