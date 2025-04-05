// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Wist',
  description: 'Create and manage shared + personal bucket lists',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
