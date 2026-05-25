'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, PlusCircle, Inbox, MailQuestion } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Generator', href: '/', icon: PlusCircle },
    { name: 'Mailbox', href: '/mailbox', icon: Inbox },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group" id="navbar-brand-link">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/90 flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight hidden sm:block text-zinc-100">
                        Redwan <span className="text-indigo-400">Mail•TM</span>
                    </span>
                </Link>

                <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800/50">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2 flex items-center gap-2 rounded-xl text-sm font-medium transition-all duration-300 outline-none",
                                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute inset-0 bg-indigo-600 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                                    />
                                )}
                                <item.icon className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <MailQuestion className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
                </div>
            </div>
        </nav>
    );
}
