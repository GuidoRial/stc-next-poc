'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { restoreSession, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only attempt to restore session if not already authenticated
    if (!isAuthenticated) {
      restoreSession().then((restored) => {
        if (restored) {
          console.log('Session restored from token');
        } else {
          console.log('No valid session found');
        }
      }).catch((error) => {
        console.error('Failed to restore session:', error);
      });
    }
  }, [restoreSession, isAuthenticated]);

  return <>{children}</>;
}