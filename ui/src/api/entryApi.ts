// Define necessary models to avoid dependencies on auto-generated code
export interface Author {
    name?: string;
    date?: string;
}

export interface Category {
    name: string;
}

export interface Tag {
    name: string;
    version?: string;
}

export interface FrontMatter {
    title: string;
    categories: Category[];
    tags: Tag[];
}

export interface Entry {
    entryId: number;
    frontMatter: FrontMatter;
    content: string;
    created: Author;
    updated: Author;
}

export interface CursorPageEntryInstant {
    content?: Entry[];
    size?: number;
    hasPrevious?: boolean;
    hasNext?: boolean;
}

// API parameter interfaces
export interface EntriesParams {
    size?: number;
    cursor?: string;
    query?: string;
    tag?: string;
    categories?: string[];
    createdBy?: string;
    updatedBy?: string;
    excludeContent?: boolean;
    page?: number;
    tenantId?: string;
}

// Tag model for tag service
export interface TagAndCount {
    name: string;
    version?: string;
    count: number;
}

// API functions
import {apiFetch, buildQueryString} from '../utils/fetch';

/**
 * Get a single entry by ID
 * @param entryId ID of the entry to retrieve
 * @param tenantId Optional tenant ID for multi-tenant scenarios
 * @param excludeContent Flag to exclude content field
 * @returns Promise with entry data
 */
export async function getEntry(
    entryId: number | string,
    tenantId?: string,
    excludeContent?: boolean
): Promise<Entry> {
    const queryParams = excludeContent ? `?excludeContent=${excludeContent}` : '';

    if (tenantId) {
        return apiFetch<Entry>(`/tenants/${tenantId}/entries/${entryId}${queryParams}`);
    } else {
        return apiFetch<Entry>(`/entries/${entryId}${queryParams}`);
    }
}

/**
 * Get a list of entries
 * @param params Query parameters for entries endpoint
 * @returns Promise with paginated entries data
 */
export async function getEntries(params: EntriesParams = {}): Promise<CursorPageEntryInstant> {
    const {tenantId, ...queryParams} = params;
    const queryString = buildQueryString(queryParams);

    if (tenantId) {
        return apiFetch<CursorPageEntryInstant>(`/tenants/${tenantId}/entries${queryString}`);
    } else {
        return apiFetch<CursorPageEntryInstant>(`/entries${queryString}`);
    }
}

/**
 * Get all tags with their usage counts
 * @returns Promise with tag and count data
 */
export async function getTags(): Promise<TagAndCount[]> {
    return apiFetch<TagAndCount[]>(`/tags`);
}

/**
 * Get all categories
 * @returns Promise with categories data
 */
export async function getCategories(): Promise<Category[][]> {
    return apiFetch<Category[][]>(`/categories`);
}
