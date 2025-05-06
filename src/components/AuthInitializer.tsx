'use client';

import { useEffect } from 'react';
import { initAuthFromStorage, getUserName } from '@/utils/auth';

export default function AuthInitializer() {
  useEffect(() => {
    // Initialize auth from localStorage on app load
    initAuthFromStorage();
    console.log('Auth initialized with user:', getUserName());
  }, []);

  // This component doesn't render anything
  return null;
} 