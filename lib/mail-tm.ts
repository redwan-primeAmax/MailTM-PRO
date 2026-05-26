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

async function directFetch(url: string, options: any = {}) {
    const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    };

    if (options.body && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method!.toUpperCase())) {
        fetchOptions.body = options.body;
    }

    const response = await fetch(url, fetchOptions);
    
    if (response.status === 204) {
        return null;
    }

    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
            const error = await response.json();
            errorMessage = error.description || error.detail || error.message || error.error || errorMessage;
        } catch (e) {
            // ignore
        }
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    return await response.text();
}

async function fetchThroughProxy(url: string, options: any = {}) {
    // Purely client-side static application routing for maximum performance and zero server bottlenecks
    return await directFetch(url, options);
}

export const MailService = {
    /**
     * Get available domains
     */
    async getDomains(): Promise<Domain[]> {
        try {
            const data = await fetchThroughProxy(`${BASE_URL}/domains`);
            if (Array.isArray(data) && data.length > 0) return data;
            if (data && Array.isArray(data['hydra:member']) && data['hydra:member'].length > 0) return data['hydra:member'];
            if (data && data.error) {
                throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
            }
            throw new Error('No domains in proxy response or bad format');
        } catch (e) {
            console.warn("[MailService] getDomains via proxy failed or empty. Trying direct client fetch...", e);
            try {
                const data = await directFetch(`${BASE_URL}/domains`);
                if (Array.isArray(data)) return data;
                if (data && Array.isArray(data['hydra:member'])) return data['hydra:member'];
                return [];
            } catch (directErr) {
                console.error("[MailService] Both proxy and direct fetch failed for domains:", directErr);
                throw directErr;
            }
        }
    },

    /**
     * Create a new email account
     */
    async createAccount(address: string, password: string): Promise<Account> {
        try {
            const data = await fetchThroughProxy(`${BASE_URL}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, password }),
            });
            if (data && (data.id || data.address)) return data;
            if (data && data.error) {
                throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
            }
            throw new Error('Invalid account creation response');
        } catch (e) {
            console.warn("[MailService] createAccount via proxy failed. Trying direct client fetch...", e);
            return await directFetch(`${BASE_URL}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, password }),
            });
        }
    },

    /**
     * Get login token
     */
    async getToken(address: string, password: string): Promise<string> {
        try {
            const data = await fetchThroughProxy(`${BASE_URL}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, password }),
            });
            if (data && data.token) return data.token;
            if (data && data.error) {
                throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
            }
            throw new Error('Invalid token response');
        } catch (e) {
            console.warn("[MailService] getToken via proxy failed. Trying direct client fetch...", e);
            const data = await directFetch(`${BASE_URL}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, password }),
            });
            if (data && data.token) return data.token;
            throw new Error(data && data.error ? String(data.error) : 'Failed to retrieve login token');
        }
    },

    /**
     * Get currently authenticated user details
     */
    async getMe(token: string): Promise<Account> {
        try {
            const data = await fetchThroughProxy(`${BASE_URL}/me`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (data && (data.id || data.address)) return data;
            throw new Error('Invalid account profile response');
        } catch (e) {
            console.warn("[MailService] getMe via proxy failed. Trying direct client fetch...", e);
            return await directFetch(`${BASE_URL}/me`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
        }
    },

    /**
     * Get messages for an account
     */
    async getMessages(token: string, page = 1): Promise<Message[]> {
        try {
            const data = await fetchThroughProxy(`${BASE_URL}/messages?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data['hydra:member'])) return data['hydra:member'];
            if (data && data.error) {
                throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
            }
            throw new Error('Invalid messages response format');
        } catch (e) {
            console.warn("[MailService] getMessages via proxy failed. Trying direct client fetch...", e);
            try {
                const data = await directFetch(`${BASE_URL}/messages?page=${page}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (Array.isArray(data)) return data;
                if (data && Array.isArray(data['hydra:member'])) return data['hydra:member'];
                return [];
            } catch (directErr) {
                console.error("[MailService] Direct fetch failed for messages:", directErr);
                throw directErr;
            }
        }
    },

    /**
     * Get single message detail
     */
    async getMessageDetail(token: string, id: string): Promise<MessageDetail> {
        try {
            return await fetchThroughProxy(`${BASE_URL}/messages/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } catch (e) {
            console.warn("[MailService] getMessageDetail via proxy failed. Trying direct client fetch...", e);
            return await directFetch(`${BASE_URL}/messages/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
        }
    },

    /**
     * Delete a message
     */
    async deleteMessage(token: string, id: string): Promise<boolean> {
        try {
            await fetchThroughProxy(`${BASE_URL}/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            return true;
        } catch (e) {
            console.warn("[MailService] deleteMessage via proxy failed. Trying direct client fetch...", e);
            await directFetch(`${BASE_URL}/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            return true;
        }
    },

    /**
     * Delete account
     */
    async deleteAccount(token: string, id: string): Promise<boolean> {
        try {
            await fetchThroughProxy(`${BASE_URL}/accounts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            return true;
        } catch (e) {
            console.warn("[MailService] deleteAccount via proxy failed. Trying direct client fetch...", e);
            await directFetch(`${BASE_URL}/accounts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            return true;
        }
    }
};
