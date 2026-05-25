'use client'

import React from 'react';
import { Trash2, User, ArrowLeft, Mail as MailIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { MessageDetail } from '@/lib/mail-tm';
import { ConfirmModal } from './ConfirmModal';

interface MessageDetailViewProps {
    selectedMessage: MessageDetail | null;
    setSelectedMessage: (msg: MessageDetail | null) => void;
    handleDeleteMessage: (id: string) => void;
    isFetchingDetail?: boolean;
}

export function MessageDetailView({
    selectedMessage,
    setSelectedMessage,
    handleDeleteMessage,
    isFetchingDetail = false,
}: MessageDetailViewProps) {
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);

    return (
        <div className={cn(
            "flex-1 flex flex-col overflow-hidden bg-zinc-950",
            (!selectedMessage && !isFetchingDetail) ? "hidden md:flex" : "flex"
        )}>
            <AnimatePresence mode="wait">
                {isFetchingDetail ? (
                    <motion.div
                        key="detail-loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col overflow-hidden p-6 space-y-6"
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/40 animate-pulse">
                            <div className="h-8 w-8 bg-zinc-800 rounded-lg" />
                            <div className="h-8 w-8 bg-zinc-800 rounded-lg" />
                        </div>
                        <div className="space-y-4 animate-pulse">
                            <div className="h-8 w-3/4 bg-zinc-800 rounded-xl" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-32 bg-zinc-800 rounded-md" />
                                    <div className="h-3 w-48 bg-zinc-800 rounded-md" />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 pt-6 animate-pulse">
                            <div className="h-4 w-full bg-zinc-800/60 rounded" />
                            <div className="h-4 w-11/12 bg-zinc-800/60 rounded" />
                            <div className="h-4 w-4/5 bg-zinc-800/60 rounded" />
                            <div className="h-4 w-5/6 bg-zinc-800/60 rounded" />
                            <div className="h-4 w-full bg-zinc-800/60 rounded" />
                        </div>
                    </motion.div>
                ) : selectedMessage ? (
                    <motion.div 
                        key={selectedMessage.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        {/* Custom Confirm Modal for single message */}
                        <ConfirmModal 
                            isOpen={isConfirmDeleteOpen}
                            onClose={() => setIsConfirmDeleteOpen(false)}
                            onConfirm={() => handleDeleteMessage(selectedMessage.id)}
                            title="Delete Message"
                            message="Are you sure you want to delete this message? This action is permanent."
                            confirmText="Delete Now"
                        />

                        {/* Detail Header */}
                        <div className="p-6 border-b border-zinc-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <button 
                                    className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setIsConfirmDeleteOpen(true)}
                                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-zinc-100 leading-tight mb-4">
                                    {selectedMessage.subject}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-zinc-200 truncate">
                                            {selectedMessage.from.name || "Unknown Sender"}
                                        </p>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {selectedMessage.from.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white/[0.02] custom-scrollbar">
                            {selectedMessage.html && selectedMessage.html.length > 0 ? (
                                <div 
                                    className="prose prose-invert max-w-none text-zinc-300"
                                    dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] }} 
                                />
                            ) : (
                                <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed">
                                    {selectedMessage.text}
                                </pre>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-600">
                        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                            <MailIcon className="w-10 h-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-display text-zinc-400 mb-2">Select a message</h3>
                        <p className="text-sm max-w-[240px]">Select an email from the left sidebar to view its full content here.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
