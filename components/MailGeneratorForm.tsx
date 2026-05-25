'use client'

import React from 'react';
import { 
    RefreshCcw, 
    ChevronDown, 
    AlertCircle,
    Wand2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { validatePrefix } from '@/lib/email-utils';
import { Domain } from '@/lib/mail-tm';

interface MailGeneratorFormProps {
    prefix: string;
    setPrefix: (val: string) => void;
    selectedDomain: string;
    setSelectedDomain: (val: string) => void;
    domains: Domain[];
    count: number;
    setCount: (val: number) => void;
    handleGenerate: () => void;
    isGenerating: boolean;
    progress?: { current: number; total: number };
    error: string;
}

export function MailGeneratorForm({
    prefix,
    setPrefix,
    selectedDomain,
    setSelectedDomain,
    domains,
    count,
    setCount,
    handleGenerate,
    isGenerating,
    progress,
    error,
}: MailGeneratorFormProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-5 bg-zinc-900/10 border border-zinc-900/90 shadow-2xl p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden backdrop-blur-md"
            id="generator-config-card"
        >
            {/* Ambient accent inside card */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Config Header */}
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">INBOX GENERATOR UNIT</span>
            </div>

            {/* Email Name Input */}
            <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                    <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase">Email Name</label>
                    <span className="text-[10px] text-zinc-500 font-mono">Suffix appended automatically</span>
                </div>
                <div className="relative group">
                    <input 
                        type="text" 
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value.toLowerCase())}
                        placeholder="your-name"
                        className={cn(
                            "w-full bg-zinc-950/80 border border-zinc-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-base text-zinc-100",
                            prefix && !validatePrefix(prefix) ? "border-red-500/50 focus:ring-red-500/30" : "group-hover:border-zinc-800"
                        )}
                        id="email-prefix-input"
                    />
                    <button 
                        onClick={() => setPrefix(Math.random().toString(36).substring(2, 10))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-900/50 rounded-xl transition-all"
                        title="Randomize"
                        id="btn-randomize-prefix"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
                {prefix && !validatePrefix(prefix) && (
                    <p className="text-xs text-red-400 ml-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Alphanumeric characters only
                    </p>
                )}
            </div>

            {/* Progress Bar (Only during generation) */}
            {isGenerating && progress && progress.total > 0 && (
                <div className="space-y-2 py-2">
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono uppercase tracking-widest px-1">
                        <span>Generating Inbox</span>
                        <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                        <motion.div 
                            className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase ml-1">Domain Router</label>
                <div className="relative">
                    <select 
                        value={selectedDomain}
                        onChange={(e) => setSelectedDomain(e.target.value)}
                        className="w-full bg-zinc-950/85 border border-zinc-900 rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-base cursor-pointer text-zinc-200"
                        id="email-domain-select"
                    >
                        {domains.map(d => (
                            <option key={d.id} value={d.domain}>@{d.domain}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Quantity</label>
                    <span className="text-indigo-400 font-bold font-mono text-sm">{count} Emails</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="1"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-zinc-900"
                    id="email-quantity-slider"
                />
                <div className="flex justify-between px-1 text-[9px] font-mono text-zinc-600">
                    <span>MIN: 1</span>
                    <span>MAX: 10</span>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3" id="generator-error-banner">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                </div>
            )}

            <button 
                onClick={handleGenerate}
                disabled={Boolean(isGenerating || !prefix || !selectedDomain || (prefix && !validatePrefix(prefix)))}
                className={cn(
                    "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 text-sm tracking-wider uppercase font-mono",
                    (isGenerating || !prefix || !selectedDomain || (prefix && !validatePrefix(prefix)))
                    ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-950"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 active:scale-[0.98] border border-indigo-500/30"
                )}
                id="btn-generate-emails"
            >
                {isGenerating ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                    <Wand2 className="w-5 h-5" />
                )}
                {isGenerating ? 'Generating...' : `Generate ${count} ${count === 1 ? 'Email' : 'Emails'}`}
            </button>
        </motion.div>
    );
}
