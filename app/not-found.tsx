'use client'

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6" id="not-found-container">
            <h1 className="text-8xl font-sans font-medium tracking-tight text-zinc-200 mb-4" id="not-found-heading">404</h1>
            <p className="text-lg font-sans text-zinc-400 mb-8 max-w-md" id="not-found-text">
                The temporary mail resource or page you are looking for does not exist or has expired.
            </p>
            <Link 
                href="/" 
                className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-sans font-medium hover:bg-zinc-200 transition-colors"
                id="back-home-link"
            >
                Back to Generator
            </Link>
        </div>
    );
}
