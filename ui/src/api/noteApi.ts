// Define necessary models to avoid dependencies on auto-generated code
export interface Author {
    name: string;
    date: string;
}

export interface FrontMatter {
    title: string;
}

export interface NoteDetails {
    noteId?: string;
    entryId: number;
    content: string;
    frontMatter: FrontMatter;
    noteUrl: string;
    created?: Author;
    updated: Author;
}

export interface NoteSummary {
    noteId?: string;
    entryId: number;
    title?: string;
    noteUrl: string;
    subscribed: boolean;
    updatedDate?: string;
}

export interface SubscribeOutput {
    entryId: number;
    subscribed: boolean;
}

export interface ResponseMessage {
    message: string;
}

export interface CreateReaderInput {
    email?: string;
    rawPassword?: string;
}

export interface PasswordResetInput {
    resetId?: string;
    newPassword?: string;
}

export interface SendLinkInput {
    email?: string;
}

// API functions
import { apiFetch } from '../utils/fetch';

/**
 * Get a note by entry ID
 * @param entryId ID of the entry to retrieve
 * @returns Promise with note details
 */
export async function getNoteByEntryId(entryId: number): Promise<NoteDetails> {
    return apiFetch<NoteDetails>(`/notes/${entryId}`);
}

/**
 * Get a list of all notes
 * @returns Promise with array of note summaries
 */
export async function getNotes(): Promise<NoteSummary[]> {
    return apiFetch<NoteSummary[]>(`/notes`);
}

/**
 * Subscribe to a note
 * @param noteId ID of the note to subscribe to
 * @returns Promise with subscription status
 */
export async function subscribe(noteId: string): Promise<SubscribeOutput> {
    return apiFetch<SubscribeOutput>(`/notes/${noteId}/subscribe`, {
        method: 'POST'
    });
}

/**
 * Create a new reader account
 * @param data Reader information
 * @returns Promise with response message
 */
export async function createReader(data: CreateReaderInput): Promise<ResponseMessage> {
    return apiFetch<ResponseMessage>(`/readers`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * Activate a reader account
 * @param readerId ID of the reader
 * @param activationLinkId Activation link ID
 * @returns Promise with response message
 */
export async function activateReader(readerId: string, activationLinkId: string): Promise<ResponseMessage> {
    return apiFetch<ResponseMessage>(`/readers/${readerId}/activations/${activationLinkId}`, {
        method: 'POST'
    });
}

/**
 * Reset a password
 * @param data Password reset data
 * @returns Promise with response message
 */
export async function resetPassword(data: PasswordResetInput): Promise<ResponseMessage> {
    return apiFetch<ResponseMessage>(`/password_reset`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * Send a password reset link
 * @param data Email data
 * @returns Promise with response message
 */
export async function sendPasswordResetLink(data: SendLinkInput): Promise<ResponseMessage> {
    return apiFetch<ResponseMessage>(`/password_reset/send_link`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
