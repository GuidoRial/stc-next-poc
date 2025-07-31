'use client';

import { Provider } from 'jotai';
import { ReactNode } from 'react';
import ErrorBoundary from './error-boundary';
import AuthProvider from './auth-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <Provider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}