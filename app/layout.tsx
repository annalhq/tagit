import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'tagit',
  description: 'Ask questions like a pro',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold">tagit</h1>
                <ThemeToggle />
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}