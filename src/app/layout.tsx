import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import type { Metadata } from 'next';
import AuthInitializer from '@/components/AuthInitializer';

export const metadata: Metadata = {
  title: 'Modern Login',
  description: 'A modern login page built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthInitializer />
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
} 