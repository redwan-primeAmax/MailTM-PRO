'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Terminal, CheckCircle2, Cpu, Globe } from 'lucide-react';

const stages = [
    "INITIALIZING SECURE REDWAN INTERFACES...",
    "LAUNCHING INSTANT PACKET RESOLVERS...",
    "CONNECTING TO DECENTRALIZED MAIL•TM GATEWAY...",
    "PREPARING INSTANT-SWITCH MEMORY CACHE...",
    "OPTIMIZING FOR RUNTIME MAXIMUM SPEEDS...",
    "ENCRYPTING TEMP MAILBOX HANDSHAKE...",
    "BOOSTING TRANSFER TO CLOUD REGIONS...",
    "ELEVATING SYSTEMS TO MAXIMUM 1000% LEVEL...",
    "REDWAN MAIL•TM FULLY DEPLOYED!"
];

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const startTime = Date.now();
        const duration = 3000; // exactly 3 seconds

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / duration);
            
            // Polished custom cubic-out/quadratic-out easing for hyperengine counts
            const easeRatio = 1 - Math.pow(1 - ratio, 2);
            const currentProgress = Math.floor(easeRatio * 1000);
            
            setProgress(currentProgress);

            if (ratio >= 1) {
                clearInterval(interval);
                // Pause slightly at 1000% for impact
                const timeout = setTimeout(() => {
                    setIsComplete(true);
                }, 600);
                return () => clearTimeout(timeout);
            }
        }, 16); // ~60fps smooth increments

        return () => clearInterval(interval);
    }, []);

    const statusIndex = Math.min(stages.length - 1, Math.floor((progress / 1000) * stages.length));

    if (isComplete) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-[99999] bg-zinc-950 flex flex-col items-center justify-center p-6 overflow-hidden select-none"
                id="redwan-loading-wrapper"
            >
                {/* Visual sci-fi grids and background effects */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent shadow-[0_1px_10px_rgba(99,102,241,0.1)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Main branding container */}
                <div className="w-full max-w-lg flex flex-col items-center" id="redwan-loading-content">
                    {/* Upper decorative label */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2 mb-8 px-3.5 py-1 rounded-full border border-indigo-500/10 bg-indigo-500/5 text-indigo-400 font-mono text-[10px] tracking-[0.2em] uppercase"
                    >
                        <Shield className="w-3.5 h-3.5 animate-pulse" />
                        System Protected
                    </motion.div>

                    {/* Logo & Slogan Header */}
                    <div className="text-center space-y-2 mb-12">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-3"
                        >
                            <span className="text-4xl md:text-5xl font-sans font-bold select-none text-zinc-100 tracking-tight" id="redwan-brand-name">
                                Redwan
                            </span>
                            <div className="h-8 w-[2px] bg-zinc-800" />
                            <span className="text-2xl md:text-3xl font-display font-medium tracking-wide text-indigo-400" id="redwan-tm">
                                Mail•TM
                            </span>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs uppercase font-mono tracking-[0.25em] text-zinc-400"
                        >
                            Instantaneous Email Architect
                        </motion.p>
                    </div>

                    {/* Large Counter Box */}
                    <div className="relative w-full aspect-[21/9] rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between overflow-hidden shadow-2xl mb-8">
                        <div className="absolute top-0 right-0 p-3 flex gap-1.5 opacity-60">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        </div>

                        {/* Speed multiplier and percentage text */}
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs font-mono text-zinc-500 tracking-wider">LOADING MULTIPLIER</span>
                            <span className="text-[10px] font-mono text-indigo-400/80 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">1000% Max Turbo</span>
                        </div>

                        <div className="flex items-baseline gap-1 mr-4">
                            <motion.span 
                                className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-400 font-mono select-none"
                                id="progress-percentage-display"
                            >
                                {progress}
                            </motion.span>
                            <span className="text-2xl font-display font-bold text-indigo-400">%</span>
                        </div>

                        {/* Status bar */}
                        <div className="space-y-2">
                            <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div 
                                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                                    style={{ width: `${progress / 10}%` }}
                                    transition={{ type: "tween" }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                                <span>POWER: V4 HYPERENGINES</span>
                                <span className="text-indigo-500/90 font-medium">STABLE STATUS</span>
                            </div>
                        </div>
                    </div>

                    {/* Step Execution Logs */}
                    <div className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 min-h-[58px] flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-indigo-500/5 text-indigo-400 border border-indigo-500/10">
                            {progress >= 1000 ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                            ) : (
                                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                            )}
                        </div>
                        <p className="text-xs font-mono text-zinc-400 tracking-wide select-none">
                            {stages[statusIndex]}
                        </p>
                    </div>

                    {/* Outer Footer Signature */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 text-[10px] uppercase font-mono tracking-widest text-zinc-500 flex items-center gap-2"
                    >
                        <span>Designed by Redwan</span>
                        <span>•</span>
                        <span>Multi-Account Mail Engine v4.0</span>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
