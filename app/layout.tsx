// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata = {
  title: 'Wist',
  description: 'Create and manage shared + personal bucket lists',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
