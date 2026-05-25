'use client'

import { useState, useEffect } from 'react';
import { Account } from '@/lib/mail-tm';

const STORAGE_KEY = 'temp_mail_accounts';
const ACTIVE_ACCOUNT_KEY = 'temp_mail_active_account';

export function useMailAccounts() {
    const [accounts, setAccounts] = useState<Account[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error("Failed to parse stored accounts", e);
                }
            }
        }
        return [];
    });

    const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
        if (typeof window !== 'undefined') {
            const activeSub = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
            if (activeSub) {
                try {
                    return JSON.parse(activeSub);
                } catch (e) {
                    console.error("Failed to parse active account", e);
                }
            }
        }
        return null;
    });

    const [isLoading, setIsLoading] = useState(false);

    // Initial load completion
    useEffect(() => {
        // No-op
    }, []);

    const sanitizeAccount = (account: any): Account => {
        return {
            id: String(account?.id || ''),
            address: String(account?.address || ''),
            quota: Number(account?.quota || 0),
            used: Number(account?.used || 0),
            isDisabled: Boolean(account?.isDisabled),
            isDeleted: Boolean(account?.isDeleted),
            createdAt: String(account?.createdAt || ''),
            updatedAt: String(account?.updatedAt || ''),
            password: account?.password ? String(account.password) : 'password123'
        };
    };

    const saveAccounts = (newAccounts: Account[]) => {
        try {
            const sanitized = Array.isArray(newAccounts) 
                ? newAccounts.map(sanitizeAccount)
                : [];
            setAccounts(sanitized);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } catch (err) {
            console.error("Failed to save accounts:", err);
        }
    };

    const addAccounts = (newlyCreated: Account[]) => {
        const sanitizedNew = Array.isArray(newlyCreated) 
            ? newlyCreated.map(sanitizeAccount)
            : [];
        const updated = [...sanitizedNew, ...accounts].slice(0, 50);
        saveAccounts(updated);
        
        if (!activeAccount && sanitizedNew.length > 0) {
            selectAccount(sanitizedNew[0]);
        }
    };

    const removeAccount = (address: string) => {
        const updated = accounts.filter(a => a.address !== address);
        saveAccounts(updated);
        if (activeAccount?.address === address) {
            const next = updated.length > 0 ? updated[0] : null;
            selectAccount(next);
        }
    };

    const selectAccount = (account: Account | null) => {
        try {
            const sanitized = account ? sanitizeAccount(account) : null;
            setActiveAccount(sanitized);
            if (sanitized) {
                localStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(sanitized));
            } else {
                localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
            }
        } catch (err) {
            console.error("Failed to select account:", err);
        }
    };

    const clearAllAccounts = () => {
        saveAccounts([]);
        selectAccount(null);
    };

    return {
        accounts,
        activeAccount,
        addAccounts,
        removeAccount,
        selectAccount,
        clearAllAccounts,
        isLoading
    };
}
