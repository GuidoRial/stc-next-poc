'use client';

import { Provider } from 'jotai';
import { ReactNode } from 'react';
import { useHydrateAtoms } from 'jotai/utils';
import ErrorBoundary from './error-boundary';
import AuthProvider from './auth-provider';
import { SSRProvider } from './ssr-provider';
import { Config } from '@/services';
import { AuthState } from '@/store/auth';
import { configAtom } from '@/store/config';
import { authAtom } from '@/store/auth';

interface ProvidersProps {
  children: ReactNode;
  initialData?: {
    config?: Config;
    auth?: AuthState;
    [key: string]: unknown;
  };
  ssrData?: {
    config?: Config | null;
    timestamp?: string;
    source?: string;
  };
}

export function Providers({ children, initialData, ssrData }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <Provider>
        <HydrateClientAtoms initialData={initialData}>
          <SSRProvider ssrData={ssrData}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SSRProvider>
        </HydrateClientAtoms>
      </Provider>
    </ErrorBoundary>
  );
}

interface HydrateClientAtomsProps {
  children: ReactNode;
  initialData?: {
    config?: Config;
    auth?: AuthState;
    [key: string]: unknown;
  };
}

function HydrateClientAtoms({ children, initialData }: HydrateClientAtomsProps) {
  // Hydrate client atoms using existing pattern (separate from SSR atoms)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hydrateAtoms: [any, any][] = [];
  
  if (initialData?.config) {
    hydrateAtoms.push([configAtom, {
      config: initialData.config,
      isLoading: false,
      error: null,
    }]);
  }
  
  if (initialData?.auth) {
    hydrateAtoms.push([authAtom, initialData.auth]);
  }
  
  useHydrateAtoms(hydrateAtoms);
  
  return <>{children}</>;
}