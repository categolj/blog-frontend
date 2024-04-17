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

export interface Entries {
    content: Entry[];
    hasNext: boolean;
    hasPrevious: boolean;
    size: number;
}