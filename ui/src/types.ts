export interface Post {
    id: number;
    title: string;
    body: string;
}

export interface Entry {
    entryId: number;
    content: string;
    frontMatter: FrontMatter;
    created: Author;
    updated: Author;
}

export interface FrontMatter {
    title: string;
    categories: Category[];
    tags: Tag[];
}

export interface Entries {
    content: Entry[];
    hasNext: boolean;
    hasPrevious: boolean;
    size: number;
}

export interface Category {
    name: string;
}

export interface Tag {
    name: string,
    version: string | undefined,
    count: number
}

export interface Author {
    name: string;
    date: string;
}