/**
 * Mail.tm API Service
 * Handles interactions with the mail.tm temporary email service.
 */

const BASE_URL = 'https://api.mail.tm';

export interface Domain {
    id: string;
    domain: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Account {
    id: string;
    address: string;
    quota: number;
    used: number;
    isDisabled: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    password?: string; // Stored locally for login
}

export interface TokenResponse {
    token: string;
    id: string;
}

export interface Message {
    id: string;
    accountId: string;
    msgid: string;
    from: {
        address: string;
        name: string;
    };
    to: {
        address: string;
        name: string;
    }[];
    subject: string;
    intro: string;
    seen: boolean;
    isDeleted: boolean;
    hasAttachments: boolean;
    size: number;
    downloadUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface MessageDetail extends Message {
    text: string;
    html: string[];
}

export const MailService = {
    /**
     * Get available domains
     */
    async getDomains(): Promise<Domain[]> {
        const res = await fetch(`${BASE_URL}/domains`);
        if (!res.ok) throw new Error('Failed to fetch domains');
        const data = await res.json();
        return data['hydra:member'];
    },

    /**
     * Create a new email account
     */
    async createAccount(address: string, password: string): Promise<Account> {
        const res = await fetch(`${BASE_URL}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password }),
        });
        if (!res.ok) {
            let errorMessage = 'Failed to create account';
            try {
                const error = await res.json();
                errorMessage = error.description || 
                               error.detail || 
                               error.message || 
                               error['hydra:description'] || 
                               (error.violations && error.violations[0] && error.violations[0].message) ||
                               JSON.stringify(error);
            } catch (e) {
                errorMessage = `HTTP ${res.status}: ${res.statusText || 'Error'}`;
            }
            throw new Error(errorMessage);
        }
        return await res.json();
    },

    /**
     * Get login token
     */
    async getToken(address: string, password: string): Promise<string> {
        const res = await fetch(`${BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password }),
        });
        if (!res.ok) throw new Error('Authentication failed');
        const data: TokenResponse = await res.json();
        return data.token;
    },

    /**
     * Get currently authenticated user details
     */
    async getMe(token: string): Promise<Account> {
        const res = await fetch(`${BASE_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch account profile');
        return await res.json();
    },

    /**
     * Get messages for an account
     */
    async getMessages(token: string, page = 1): Promise<Message[]> {
        const res = await fetch(`${BASE_URL}/messages?page=${page}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        return data['hydra:member'];
    },

    /**
     * Get single message detail
     */
    async getMessageDetail(token: string, id: string): Promise<MessageDetail> {
        const res = await fetch(`${BASE_URL}/messages/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch message details');
        return await res.json();
    },

    /**
     * Delete a message
     */
    async deleteMessage(token: string, id: string): Promise<boolean> {
        const res = await fetch(`${BASE_URL}/messages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.status === 204;
    },

    /**
     * Delete account
     */
    async deleteAccount(token: string, id: string): Promise<boolean> {
        const res = await fetch(`${BASE_URL}/accounts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return res.status === 204;
    }
};
