'use client'

import React from 'react';
import { 
    Check, 
    Copy, 
    Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Account } from '@/lib/mail-tm';

interface MailPreviewListProps {
    generatedPreview: Account[];
    copiedIndex: number | null;
    copyToClipboard: (text: string, index: number) => void;
    isGenerating: boolean;
}

export function MailPreviewList({
    generatedPreview,
    copiedIndex,
    copyToClipboard,
    isGenerating,
}: MailPreviewListProps) {
    return (
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
            <AnimatePresence mode="popLayout">
                {generatedPreview.length > 0 ? (
                    <motion.div 
                        key="preview-list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-zinc-400 mb-2 ml-1">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm">Recently Generated</span>
                        </div>
                        {generatedPreview.map((acc, index) => (
                            <motion.div 
                                key={acc.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition-all shadow-sm"
                            >
                                <div className="flex flex-col">
                                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold mb-0.5">ADDRESS</span>
                                    <span className="text-zinc-100 font-medium font-display sm:text-lg overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-none">
                                        {acc.address}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => copyToClipboard(acc.address, index)}
                                    className={cn(
                                        "p-3 rounded-xl transition-all duration-300",
                                        copiedIndex === index 
                                        ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                                        : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                                    )}
                                >
                                    {copiedIndex === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    !isGenerating && (
                        <motion.div 
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-zinc-800"
                        >
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                                <Layers className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="font-display font-medium text-xl text-zinc-400 mb-2">Ready to expand?</h3>
                            <p className="text-zinc-600 text-sm max-w-[240px]">
                                Generate multiple accounts to separate your different online identities.
                            </p>
                        </motion.div>
                    )
                )}
            </AnimatePresence>
        </div>
    );
}
