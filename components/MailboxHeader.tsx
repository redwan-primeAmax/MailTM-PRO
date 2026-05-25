'use client'

import React, { useState } from 'react';
import { User, RefreshCcw, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Account } from '@/lib/mail-tm';

interface MailboxHeaderProps {
    activeAccount: Account;
    setIsSidebarOpen: (val: boolean) => void;
    isRefreshing: boolean;
    fetchMessages: () => void;
}

export function MailboxHeader({
    activeAccount,
    setIsSidebarOpen,
    isRefreshing,
    fetchMessages,
}: MailboxHeaderProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(activeAccount.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-md">
            <div className="min-w-0 flex items-center gap-4">
                <button 
                    className="lg:hidden p-2 text-zinc-400 hover:text-white"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <User className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold truncate text-zinc-100 max-w-[200px] sm:max-w-[300px] md:max-w-none">{activeAccount.address}</h3>
                        <button 
                            onClick={handleCopy}
                            className="p-1.5 rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all text-zinc-500 hover:text-indigo-400 group relative"
                            title="Copy Address"
                            id="btn-copy-header-address"
                        >
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className={cn(
                                "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-[10px] text-zinc-100 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700 font-mono",
                                copied && "opacity-100"
                            )}>
                                {copied ? 'COPIED!' : 'COPY'}
                            </span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold whitespace-nowrap">Live Monitoring</span>
                            {showPassword ? (
                                <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 truncate max-w-[120px]">
                                    Pass: {activeAccount.password || 'password123'}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                        "p-2.5 rounded-xl border transition-all active:scale-95",
                        showPassword 
                        ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400" 
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    )}
                    title={showPassword ? "Hide Password" : "View Password"}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                    onClick={fetchMessages}
                    disabled={isRefreshing}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95"
                >
                    <RefreshCcw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                </button>
            </div>
        </header>
    );
}
