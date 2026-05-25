'use client'

import React from 'react';
import { User, Mail as MailIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Message, MessageDetail } from '@/lib/mail-tm';

interface MessageListProps {
    messages: Message[];
    selectedMessage: MessageDetail | null;
    isRefreshing: boolean;
    handleSelectMessage: (msg: Message) => void;
}

export function MessageList({
    messages,
    selectedMessage,
    isRefreshing,
    handleSelectMessage,
}: MessageListProps) {
    return (
        <div className={cn(
            "flex-1 lg:flex-none lg:w-96 border-r border-zinc-800 overflow-y-auto flex flex-col bg-zinc-950/20",
            selectedMessage ? "hidden md:flex" : "flex"
        )}>
            <AnimatePresence mode="popLayout">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <motion.button
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg)}
                            className={cn(
                                "w-full text-left p-5 border-b border-zinc-800 transition-all group relative",
                                selectedMessage?.id === msg.id ? "bg-zinc-900" : "hover:bg-zinc-900/50"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                                        {msg.from.name ? msg.from.name[0].toUpperCase() : <User className="w-3 h-3" />}
                                    </div>
                                    <span className="font-bold text-sm text-zinc-200 truncate max-w-[140px]">
                                        {msg.from.name || msg.from.address}
                                    </span>
                                </div>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <h4 className={cn(
                                "text-sm font-medium mb-1 truncate",
                                msg.seen ? "text-zinc-500" : "text-white"
                            )}>{msg.subject}</h4>
                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{msg.intro}</p>
                            {!msg.seen && (
                                <div className="absolute top-5 right-2 w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                            )}
                        </motion.button>
                    ))
                ) : (
                    isRefreshing ? (
                        <div className="flex-1 divide-y divide-zinc-800/40">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-5 space-y-3 animate-pulse">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800/80" />
                                            <div className="h-4 w-24 bg-zinc-800/80 rounded" />
                                        </div>
                                        <div className="h-3 w-10 bg-zinc-800/40 rounded" />
                                    </div>
                                    <div className="h-4 w-2/3 bg-zinc-800/80 rounded" />
                                    <div className="h-3 w-5/6 bg-zinc-800/40 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-600">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                                <MailIcon className="w-5 h-5 opacity-50" />
                            </div>
                            <p className="text-sm">Inbox is empty</p>
                            <p className="text-[10px] mt-1">Waiting for incoming messages...</p>
                        </div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
}
