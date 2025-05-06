'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RootPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Immediate check for token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        console.log('Token found in root page, redirecting to home');
        router.push('/home');
      } else {
        console.log('No token found in root page, redirecting to login');
        router.push('/login');
      }
    }
  }, [router]);

  return null;
} 