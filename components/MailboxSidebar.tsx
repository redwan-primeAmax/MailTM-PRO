'use client'

import React from 'react';
import { Mail as MailIcon, User, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Account } from '@/lib/mail-tm';
import { LoginModal } from './LoginModal';
import { ConfirmModal } from './ConfirmModal';

interface MailboxSidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (val: boolean) => void;
    accounts: Account[];
    activeAccount: Account | null;
    selectAccount: (account: Account | null) => void;
    addAccount: (account: Account) => void;
    clearAllAccounts: () => void;
}

export function MailboxSidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    accounts,
    activeAccount,
    selectAccount,
    addAccount,
    clearAllAccounts,
}: MailboxSidebarProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
    const [isConfirmClearOpen, setIsConfirmClearOpen] = React.useState(false);

    return (
        <aside className={cn(
            "fixed lg:relative z-30 h-full w-72 bg-zinc-950 border-r border-zinc-800 transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between gap-2">
                <h2 className="font-display font-bold text-lg truncate flex-1">Emails</h2>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-indigo-400 rounded-lg transition-colors"
                        title="Manual Login"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    {accounts.length > 0 && (
                        <button 
                            onClick={() => setIsConfirmClearOpen(true)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
                            title="Logout All"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 text-zinc-500 hover:text-white rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={(acc) => {
                    addAccount(acc);
                    selectAccount(acc);
                }}
            />

            <ConfirmModal 
                isOpen={isConfirmClearOpen}
                onClose={() => setIsConfirmClearOpen(false)}
                onConfirm={clearAllAccounts}
                title="Clear All Accounts"
                message="Are you sure you want to log out from all email addresses? This action cannot be undone."
                confirmText="Yes, Log Out All"
                variant="danger"
            />
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {accounts.length > 0 ? (
                    accounts.map((acc) => (
                        <button
                            key={acc.id}
                            onClick={() => {
                                selectAccount(acc);
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                    setIsSidebarOpen(false);
                                }
                            }}
                            className={cn(
                                "w-full text-left p-4 rounded-2xl border transition-all duration-200 group relative overflow-hidden",
                                activeAccount?.address === acc.address
                                ? "bg-indigo-600/10 border-indigo-500/50 text-white shadow-sm shadow-indigo-500/5"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            )}
                        >
                            {activeAccount?.address === acc.address && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                             )}
                             <div className="flex items-center gap-3">
                                 <div className={cn(
                                     "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                     activeAccount?.address === acc.address ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-500"
                                 )}>
                                     <User className="w-4 h-4" />
                                 </div>
                                 <div className="min-w-0 flex-1">
                                     <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mb-0.5">INBOX</p>
                                     <div className="overflow-x-auto scrollbar-none py-0.5">
                                         <p className="font-medium text-sm text-zinc-200 whitespace-nowrap">
                                             {acc.address}
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         </button>
                    ))
                ) : (
                    <div className="text-center py-12 px-4">
                        <MailIcon className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-500 text-sm">No accounts yet</p>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-zinc-800">
                <button 
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            window.location.href = '/';
                        }
                    }}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center gap-2 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    <MailIcon className="w-4 h-4" />
                    Create New Email
                </button>
            </div>
        </aside>
    );
}
