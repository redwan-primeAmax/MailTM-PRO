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

async function fetchThroughProxy(url: string, options: any = {}) {
    const proxyUrl = '/api/proxy';
    const body = {
        url,
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body ? JSON.parse(options.body) : undefined
    };

    const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok && res.status !== 204) {
        let errorMessage = `HTTP ${res.status}`;
        try {
            const error = await res.json();
            errorMessage = error.description || error.detail || error.message || error.error || errorMessage;
        } catch (e) {
            // ignore
        }
        throw new Error(errorMessage);
    }
    
    if (res.status === 204) return null;
    return await res.json();
}

export const MailService = {
    /**
     * Get available domains
     */
    async getDomains(): Promise<Domain[]> {
        const data = await fetchThroughProxy(`${BASE_URL}/domains`);
        if (Array.isArray(data)) return data;
        if (data && data['hydra:member']) return data['hydra:member'];
        return [];
    },

    /**
     * Create a new email account
     */
    async createAccount(address: string, password: string): Promise<Account> {
        return await fetchThroughProxy(`${BASE_URL}/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password }),
        });
    },

    /**
     * Get login token
     */
    async getToken(address: string, password: string): Promise<string> {
        const data: TokenResponse = await fetchThroughProxy(`${BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, password }),
        });
        return data.token;
    },

    /**
     * Get currently authenticated user details
     */
    async getMe(token: string): Promise<Account> {
        return await fetchThroughProxy(`${BASE_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    },

    /**
     * Get messages for an account
     */
    async getMessages(token: string, page = 1): Promise<Message[]> {
        const data = await fetchThroughProxy(`${BASE_URL}/messages?page=${page}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (Array.isArray(data)) return data;
        if (data && data['hydra:member']) return data['hydra:member'];
        return [];
    },

    /**
     * Get single message detail
     */
    async getMessageDetail(token: string, id: string): Promise<MessageDetail> {
        return await fetchThroughProxy(`${BASE_URL}/messages/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    },

    /**
     * Delete a message
     */
    async deleteMessage(token: string, id: string): Promise<boolean> {
        await fetchThroughProxy(`${BASE_URL}/messages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return true;
    },

    /**
     * Delete account
     */
    async deleteAccount(token: string, id: string): Promise<boolean> {
        await fetchThroughProxy(`${BASE_URL}/accounts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return true;
    }
};
