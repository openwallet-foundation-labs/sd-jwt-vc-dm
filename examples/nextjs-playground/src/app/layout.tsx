import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SD JWT VCDM Playground',
  description:
    'Explore the SD JWT VCDM Typescript library in this interactive playground. Test selective disclosure JWT verifiable credentials and JAdES digital signatures across multiple signature profiles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto p-4">
          <header className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">SD-JWT VCDM Playground</h1>
              <p className="text-amber-600">
                ⚠️ Experimental: Not for production. May change or shut down
                without notice.
              </p>
            </div>
            <a
              href="https://github.com/openwallet-foundation-labs/sd-jwt-vc-dm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white dark:bg-gray-800 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 transition-all hover:shadow-lg"
            >
              <svg
                height="24"
                width="24"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              <span className="hidden md:inline">View on GitHub</span>
            </a>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
