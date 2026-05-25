'use client'

import React, { useState, useEffect } from 'react';
import { MailService, Domain, Account } from '@/lib/mail-tm';
import { useMailAccounts } from '@/hooks/use-mail-accounts';
import { MailGeneratorForm } from '@/components/MailGeneratorForm';
import { MailPreviewList } from '@/components/MailPreviewList';
import { generateRandomSuffix, validatePrefix } from '@/lib/email-utils';
import { motion } from 'motion/react';
import { Sparkles, Layers, Mail, Calendar, HardDrive, Code, Info, FileText } from 'lucide-react';

export default function GeneratorPage() {
    const { accounts, addAccounts } = useMailAccounts();
    const [domains, setDomains] = useState<Domain[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string>('');
    const [prefix, setPrefix] = useState('');
    const [count, setCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [error, setError] = useState('');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [generatedPreview, setGeneratedPreview] = useState<Account[]>([]);
    const [startDateText, setStartDateText] = useState('May 25, 2026');
    const [localAccountsCount, setLocalAccountsCount] = useState(0);

    // Initialize random prefix on mount to avoid hydration mismatch
    useEffect(() => {
        Promise.resolve().then(() => {
            setPrefix(Math.random().toString(36).substring(2, 10));
            setStartDateText(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        });
    }, []);

    // Sync counts after hydration to prevent markup mismatch
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalAccountsCount(accounts.length);
    }, [accounts.length]);

    // Load domains
    useEffect(() => {
        MailService.getDomains().then(data => {
            const activeDomains = (data || []).filter(d => d.isActive);
            setDomains(activeDomains);
            if (activeDomains.length > 0) setSelectedDomain(activeDomains[0].domain);
            else setError('No active domains found. Please retry later.');
        }).catch(err => {
            setError('Failed to load domains. Please refresh.');
            console.error(err);
        });
    }, []);

    const handleGenerate = async () => {
        if (!prefix || !selectedDomain) {
            setError('Please provide a name and select a domain');
            return;
        }

        if (!validatePrefix(prefix)) {
            setError('Invalid characters in email name');
            return;
        }

        setError('');
        setIsGenerating(true);
        setGeneratedPreview([]);
        setProgress({ current: 0, total: count });

        const finalizedAccounts: Account[] = [];
        const errors: string[] = [];

        try {
            let consecutiveFailures = 0;
            // Attempt to generate exactly the requested quantity of accounts
            while (finalizedAccounts.length < count && consecutiveFailures < 10) {
                // Introduce a slightly larger base stagger for rate limiting protection
                if (finalizedAccounts.length > 0) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                }

                const randomPart = generateRandomSuffix(10);
                const addressPrefix = `${prefix}${randomPart}`;
                const fullAddress = `${addressPrefix}@${selectedDomain}`;
                
                // Generate a different and unique password for each email (exactly 5 chars)
                const uniquePassword = generateRandomSuffix(5);

                try {
                    const acc = await MailService.createAccount(fullAddress, uniquePassword);
                    const accountWithPass = { ...acc, password: uniquePassword };
                    
                    finalizedAccounts.push(accountWithPass);
                    
                    // Update UI immediately (incremental display)
                    setGeneratedPreview(prev => [...prev, accountWithPass]);
                    addAccounts([accountWithPass]);
                    setProgress(prev => ({ ...prev, current: finalizedAccounts.length }));

                    consecutiveFailures = 0; // Reset consecutive failures count on successful creation
                } catch (e: any) {
                    const isRateLimit = e.message?.includes('429');
                    console.warn(`Failed to create ${fullAddress}. Rate limit: ${isRateLimit}. Retrying...`, e);
                    
                    consecutiveFailures++;
                    errors.push(e.message || 'An unexpected error occurred');
                    
                    // If rate limited, wait a significant amount of time (5-8 seconds)
                    const waitTime = isRateLimit ? 6000 : 2000;
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }

            if (finalizedAccounts.length < count) {
                const uniqueErrors = Array.from(new Set(errors));
                const errorDetails = uniqueErrors.length > 0 ? `: ${uniqueErrors.join(', ')}` : '';
                throw new Error(`Could not generate the requested amount. Succeeded with ${finalizedAccounts.length}/${count} accounts${errorDetails}`);
            }
        } catch (err: any) {
            setError(err.message || 'Generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl relative z-10" id="generator-dashboard-view">
            {/* Header / Hero Section - Unique & Futuristic styling */}
            <div className="text-center mb-10 xl:mb-14 relative" id="generator-hero-banner">
                {/* Decorative absolute element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/10 bg-indigo-500/5 text-indigo-400 font-mono text-xs tracking-wide mb-4 uppercase"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    POWERED BY REDWAN TUNNELING
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-4 tracking-tight select-none text-zinc-100"
                >
                    Redwan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Mail•TM</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto tracking-wide font-sans font-light"
                    id="redwan-hero-description"
                >
                    Generate disposable mailboxes instantly with unique custom password, premium UI, caching, and extreme 100% navigating speed.
                </motion.p>
            </div>

            {/* Comprehensive Metrics & HUD Grid - Expanded with 4 distinct items for complete operational metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto" id="metrics-hud-grid">
                {[
                    { label: "User start date", value: startDateText || "May 25, 2026", icon: Calendar, color: "text-amber-400" },
                    { label: "Total emails created", value: `${localAccountsCount} Local / 1.32M Global`, icon: Mail, color: "text-teal-400" },
                    { label: "Storage capacity", value: "40 MB Per Inbox", icon: HardDrive, color: "text-cyan-400" },
                    { label: "Website source", value: "Redwan Open Source", icon: Code, color: "text-rose-400" }
                ].map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="bg-zinc-900/10 border border-zinc-900/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-md backdrop-blur-sm hover:border-zinc-800/80 transition-all duration-300"
                    >
                        <div className={`p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-900/80 ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">{item.label}</p>
                            <p className="text-xs sm:text-sm font-display font-semibold text-zinc-200 truncate max-w-[130px] sm:max-w-none">{item.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Interactive Workspace Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto mb-14" id="workspace-grid-container">
                <MailGeneratorForm 
                    prefix={prefix}
                    setPrefix={setPrefix}
                    selectedDomain={selectedDomain}
                    setSelectedDomain={setSelectedDomain}
                    domains={domains}
                    count={count}
                    setCount={setCount}
                    handleGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    progress={progress}
                    error={error}
                />

                <MailPreviewList 
                    generatedPreview={generatedPreview}
                    copiedIndex={copiedIndex}
                    copyToClipboard={copyToClipboard}
                    isGenerating={isGenerating}
                />
            </div>

            {/* Bulletproof Legal Compliance & Safety Disclaimer (আইনি সুরক্ষাকল্পে ঘোষণা) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-5xl mx-auto bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl"
                id="legal-compliance-card"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 border-b border-zinc-900 pb-4 mb-5">
                    <Info className="w-5 h-5 text-zinc-400" />
                    <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase font-medium">
                        SYSTEM LEGAL COMPLIANCE & SAFETY DISCLOSURES
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400 font-sans leading-relaxed">
                    <div className="space-y-3">
                        <p className="font-semibold text-zinc-300">
                            1. Third-Party Gateway Client Agreement
                        </p>
                        <p>
                            Redwan Mail•TM operates exclusively as an independent, lightweight programmatic client interface built on top of the public, free Mail.tm API service. We do not own, lease, operate, or maintain any of the underlying mailbox servers, domains, message delivery nodes, or transactional logs. All electronic mail exchanges are completed directly by the upstream service operators.
                        </p>
                        <p className="font-semibold text-zinc-300 mt-4">
                            2. Absolute Limitation of Liability (কোনো আইনি দায় বা মোকদ্দমা বর্জন)
                        </p>
                        <p>
                            By utilizing this portal, you agree that you are accessing a fully free, educational, and testing utility. Under no legal circumstances or jurisdictions shall the creator (Redwan) or site operators be subject to lawsuits, litigation, financial claims, civil disputes, or penalties. We provide this client template &quot;as-is&quot; without any warranties, express or implied.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <p className="font-semibold text-zinc-300">
                            3. Non-Persistent Data & Zero Storage Local Cache
                        </p>
                        <p>
                            To maintain maximum privacy levels, no email messages, active passwords, token secrets, or personal identities are recorded or stored on any remote cloud database by this application. All items reside securely inside your browser&apos;s private sandbox space (via <code>localStorage</code>) and are deleted instantly when you choose to clear your browser state or when the upstream API deletes them.
                        </p>
                        <p className="font-semibold text-zinc-300 mt-4">
                            4. Strict Prohibition of Illegal Activities
                        </p>
                        <p>
                            Users are strictly prohibited from using these temporary inboxes for fraudulent accounts, spam engines, social network evasion schemes, illegal registrations, harassment, or actions violating digital security laws. The end user assumes 100% sole personal, legal, civil, and criminal liability for any activity conducted with generated addresses.
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-zinc-500 gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>OPERATIONAL STATUS: SECURE & LEGAL</span>
                    </div>
                    <span>© {new Date().getFullYear()} Redwan Mail•TM • Licensed under Educational Fair-Use</span>
                </div>
            </motion.div>
        </main>
    );
}
