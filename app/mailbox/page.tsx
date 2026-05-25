'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MailService, Message, MessageDetail, Account } from '@/lib/mail-tm';
import { useMailAccounts } from '@/hooks/use-mail-accounts';
import { MailboxSidebar } from '@/components/MailboxSidebar';
import { MailboxHeader } from '@/components/MailboxHeader';
import { MessageList } from '@/components/MessageList';
import { MessageDetailView } from '@/components/MessageDetailView';
import { 
    Inbox, 
    User,
    ArrowLeft,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function MailboxPage() {
    const { 
        accounts, 
        activeAccount, 
        selectAccount, 
        addAccounts,
        clearAllAccounts,
        isLoading: accountsLoading 
    } = useMailAccounts();
    const [token, setToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);
    const [error, setError] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Memory caches for tokens and messages to provide instantaneous switching
    const tokensCacheRef = useRef<Record<string, string>>({});
    const [messagesCache, setMessagesCache] = useState<Record<string, Message[]>>({});
    const [prevActiveAccountAddress, setPrevActiveAccountAddress] = useState<string | null>(null);

    // Synchronously adjust local states on activeAccount changes to avoid stale data visual lag
    const currentAddress = activeAccount?.address || null;
    if (currentAddress !== prevActiveAccountAddress) {
        setPrevActiveAccountAddress(currentAddress);
        setSelectedMessage(null);
        const cached = activeAccount ? (messagesCache[activeAccount.address] || []) : [];
        setMessages(cached);
    }

    const fetchToken = useCallback(async (account: Account) => {
        try {
            setError('');
            const cachedToken = tokensCacheRef.current[account.address];
            if (cachedToken) {
                setToken(cachedToken);
                return cachedToken;
            }
            // Use stored password if available, else default
            const t = await MailService.getToken(account.address, account.password || 'password123');
            if (t) {
                tokensCacheRef.current[account.address] = t;
                setToken(t);
            }
            return t;
        } catch (err) {
            setError('Authentication failed. Account might be expired.');
            setToken(null);
            return null;
        }
    }, []);

    const fetchMessages = useCallback(async (t: string, currentAddress: string) => {
        setIsRefreshing(true);
        try {
            const msgs = await MailService.getMessages(t);
            setMessages(msgs);
            setMessagesCache(prev => ({ ...prev, [currentAddress]: msgs }));
        } catch (err) {
            console.error(err);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    // Decoupled loading logic to avoid effect loop with token dependency
    useEffect(() => {
        if (!activeAccount) {
            Promise.resolve().then(() => {
                setToken(null);
                setMessages([]);
            });
            return;
        }

        let isMounted = true;

        const loadActiveAccount = async () => {
            const t = await fetchToken(activeAccount);
            if (t && isMounted) {
                fetchMessages(t, activeAccount.address);
            }
        };

        loadActiveAccount();

        return () => {
            isMounted = false;
        };
    }, [activeAccount, fetchToken, fetchMessages]);

    // Separate polling effect
    useEffect(() => {
        if (!token || !activeAccount) return;

        const interval = setInterval(() => {
            fetchMessages(token, activeAccount.address);
        }, 15000);

        return () => clearInterval(interval);
    }, [token, activeAccount, fetchMessages]);

    const handleSelectMessage = async (msg: Message) => {
        if (!token) return;
        setIsFetchingDetail(true);
        try {
            const detail = await MailService.getMessageDetail(token, msg.id);
            setSelectedMessage(detail);
        } catch (err) {
            setError('Failed to load message body');
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!token || !activeAccount) return;
        try {
            await MailService.deleteMessage(token, id);
            setMessages(prev => {
                const updated = prev.filter(m => m.id !== id);
                setMessagesCache(cache => ({ ...cache, [activeAccount.address]: updated }));
                return updated;
            });
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (err) {
            setError('Failed to delete message');
        }
    };

    if (accountsLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            
            <main className="flex-1 flex overflow-hidden relative">
                {/* Mobile Account Switcher Trigger (Floating) */}
                {!isSidebarOpen && (
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden absolute left-4 bottom-4 z-40 bg-indigo-600 p-3 rounded-full shadow-lg shadow-indigo-500/20 text-white"
                    >
                        <User className="w-6 h-6" />
                    </button>
                )}

                {/* Sidebar - Account List */}
                <MailboxSidebar 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    accounts={accounts}
                    activeAccount={activeAccount}
                    selectAccount={selectAccount}
                    addAccount={(acc) => addAccounts([acc])}
                    clearAllAccounts={clearAllAccounts}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
                    {!activeAccount ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
                            <Inbox className="w-16 h-16 mb-4 text-zinc-800" />
                            <h2 className="text-xl font-display font-medium text-zinc-400 mb-2">No Active Inbox</h2>
                            <p className="max-w-xs text-sm">Please select an email address from the sidebar or generate a new one.</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col min-w-0">
                            {/* Inbox Header */}
                            <MailboxHeader 
                                activeAccount={activeAccount}
                                setIsSidebarOpen={setIsSidebarOpen}
                                isRefreshing={isRefreshing}
                                fetchMessages={() => token && fetchMessages(token, activeAccount.address)}
                            />

                            {/* Inbox Content Split */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Message List */}
                                <MessageList 
                                    messages={messages}
                                    selectedMessage={selectedMessage}
                                    isRefreshing={isRefreshing}
                                    handleSelectMessage={handleSelectMessage}
                                />

                                {/* Message View Area */}
                                <MessageDetailView 
                                    selectedMessage={selectedMessage}
                                    setSelectedMessage={setSelectedMessage}
                                    handleDeleteMessage={handleDeleteMessage}
                                    isFetchingDetail={isFetchingDetail}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Global Error Overlay */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 right-6 z-50 p-4 bg-red-500/90 backdrop-blur-md rounded-2xl border border-red-400 flex items-center gap-3 text-white shadow-2xl"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={() => setError('')} className="ml-2 hover:bg-white/20 p-1 rounded-lg">
                            <ArrowLeft className="w-4 h-4 rotate-90" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
