// This file is auto-generated by @hey-api/openapi-ts

export type ProblemDetail = {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    properties?: {
        [key: string]: {
            [key: string]: unknown;
        };
    };
};

export type Author = {
    name?: string;
    date?: string;
};

export type Category = {
    name: string;
};

export type EntryRequest = {
    content?: string;
    frontMatter?: FrontMatter;
    created?: Author;
    updated?: Author;
};

export type FrontMatter = {
    title: string;
    categories: Array<Category>;
    tags: Array<Tag>;
};

export type Tag = {
    name: string;
    version?: string;
};

export type TagAndCount = {
    name: string;
    version?: string;
    count: number;
};

export type Entry = {
    entryId: number;
    frontMatter: FrontMatter;
    content: string;
    created: Author;
    updated: Author;
};

export type OffsetPageEntry = {
    content?: Array<Entry>;
    size?: number;
    number?: number;
    totalElements?: number;
};

export type CursorPageEntryInstant = {
    content?: Array<Entry>;
    size?: number;
    hasPrevious?: boolean;
    hasNext?: boolean;
};

export type $OpenApiTs = {
    '/tenants/{tenantId}/entries/{entryId}': {
        get: {
            req: {
                entryId: number;
                excludeContent?: boolean;
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: Entry;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
        put: {
            req: {
                entryId: number;
                requestBody: EntryRequest;
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: {
                    [key: string]: unknown;
                };
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
        delete: {
            req: {
                entryId: number;
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: unknown;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/entries/{entryId}': {
        get: {
            req: {
                entryId: number;
                excludeContent?: boolean;
                ifModifiedSince?: string;
            };
            res: {
                /**
                 * OK
                 */
                200: Entry;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
        put: {
            req: {
                entryId: number;
                requestBody: EntryRequest;
            };
            res: {
                /**
                 * OK
                 */
                200: {
                    [key: string]: unknown;
                };
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
        delete: {
            req: {
                entryId: number;
            };
            res: {
                /**
                 * OK
                 */
                200: unknown;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tenants/{tenantId}/entries': {
        get: {
            req: {
                categories?: Array<(string)>;
                createdBy?: string;
                cursor?: string;
                excludeContent?: boolean;
                page?: number;
                query?: string;
                size?: number;
                tag?: string;
                tenantId: string;
                updatedBy?: string;
            };
            res: {
                /**
                 * OK
                 */
                200: CursorPageEntryInstant | OffsetPageEntry;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
        post: {
            req: {
                requestBody: EntryRequest;
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: {
                    [key: string]: unknown;
                };
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/entries': {
        get: {
            req: {
                categories?: Array<(string)>;
                createdBy?: string;
                cursor?: string;
                excludeContent?: boolean;
                page?: number;
                query?: string;
                size?: number;
                tag?: string;
                updatedBy?: string;
            };
            res: {
                /**
                 * OK
                 */
                200: CursorPageEntryInstant | OffsetPageEntry;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
        post: {
            req: {
                requestBody: EntryRequest;
            };
            res: {
                /**
                 * OK
                 */
                200: {
                    [key: string]: unknown;
                };
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tenants/{tenantId}/entries/{entryId}.md': {
        get: {
            req: {
                entryId: number;
                excludeContent?: boolean;
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: string;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tenants/{tenantId}/entries.zip': {
        get: {
            req: {
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: {
                    [key: string]: unknown;
                };
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/entries/{entryId}.md': {
        get: {
            req: {
                entryId: number;
                excludeContent?: boolean;
            };
            res: {
                /**
                 * OK
                 */
                200: string;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/entries/template.md': {
        get: {
            res: {
                /**
                 * OK
                 */
                200: string;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/entries.zip': {
        get: {
            res: {
                /**
                 * OK
                 */
                200: {
                    [key: string]: unknown;
                };
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/webhook': {
        post: {
            req: {
                requestBody: string;
            };
            res: {
                /**
                 * OK
                 */
                200: Array<{
                    [key: string]: (number);
                }>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tenants/{tenantId}/webhook': {
        post: {
            req: {
                requestBody: string;
                tenantId: string;
                xHubSignature256: string;
            };
            res: {
                /**
                 * OK
                 */
                200: Array<{
                    [key: string]: (number);
                }>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tenants/{tenantId}/admin/import': {
        post: {
            req: {
                from?: number;
                tenantId: string;
                to?: number;
            };
            res: {
                /**
                 * OK
                 */
                200: Array<(string)>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/admin/import': {
        post: {
            req: {
                from?: number;
                to?: number;
            };
            res: {
                /**
                 * OK
                 */
                200: Array<(string)>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tenants/{tenantId}/tags': {
        get: {
            req: {
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: Array<TagAndCount>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tags': {
        get: {
            res: {
                /**
                 * OK
                 */
                200: Array<TagAndCount>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/tenants/{tenantId}/categories': {
        get: {
            req: {
                tenantId: string;
            };
            res: {
                /**
                 * OK
                 */
                200: Array<Array<Category>>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/categories': {
        get: {
            res: {
                /**
                 * OK
                 */
                200: Array<Array<Category>>;
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
    '/info': {
        get: {
            res: {
                /**
                 * OK
                 */
                200: {
                    [key: string]: {
                        [key: string]: unknown;
                    };
                };
                /**
                 * Bad Request
                 */
                400: ProblemDetail;
                /**
                 * Forbidden
                 */
                403: ProblemDetail;
                /**
                 * Internal Server Error
                 */
                500: ProblemDetail;
                /**
                 * Service Unavailable
                 */
                503: ProblemDetail;
            };
        };
    };
};