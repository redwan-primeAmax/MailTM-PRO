import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { LoadingScreen } from '@/components/LoadingScreen';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Temp Mail Pro',
  description: 'Instant, secure temporary email service powered by mail.tm',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // Transparent global safeguard for JSON serialization of circular / DOM objects
                const originalStringify = JSON.stringify;
                JSON.stringify = function(value, replacer, space) {
                  const seen = new WeakSet();
                  const combinedReplacer = function(key, val) {
                    if (val && typeof val === 'object') {
                      if (seen.has(val)) {
                        return '[Circular]';
                      }
                      seen.add(val);
                      if (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) {
                        return '[HTMLElement]';
                      }
                      const name = val.constructor ? val.constructor.name : '';
                      if (name === 'HTMLElement' || name === 'FiberNode' || name === 'FiberImpl' || name.startsWith('__react')) {
                        return '[' + (name || 'Object') + ']';
                      }
                    }
                    if (typeof replacer === 'function') {
                      return replacer(key, val);
                    }
                    if (Array.isArray(replacer)) {
                      return replacer.indexOf(key) !== -1 ? val : undefined;
                    }
                    return val;
                  };

                  try {
                    return originalStringify(value, replacer, space);
                  } catch (err) {
                    if (err instanceof TypeError && (err.message.includes('circular') || err.message.includes('Circular'))) {
                      try {
                        return originalStringify(value, combinedReplacer, space);
                      } catch (innerErr) {
                        return '"[Unserializable Object]"';
                      }
                    }
                    throw err;
                  }
                };

                const wrapConsole = (method) => {
                  const original = window.console[method];
                  if (original) {
                    window.console[method] = function (...args) {
                      const sanitizedArgs = args.map(arg => {
                        if (arg && typeof arg === 'object') {
                          try {
                            return JSON.parse(JSON.stringify(arg));
                          } catch (e) {
                            return '[Unserializable Object]';
                          }
                        }
                        return arg;
                      });
                      original.apply(this, sanitizedArgs);
                    };
                  }
                };

                wrapConsole('log');
                wrapConsole('error');
                wrapConsole('warn');
                wrapConsole('info');
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-zinc-950 text-zinc-100 min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <LoadingScreen />
        <div className="relative flex flex-col min-h-screen">
          {/* Subtle background glow */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[120px]" />
          </div>
          
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
