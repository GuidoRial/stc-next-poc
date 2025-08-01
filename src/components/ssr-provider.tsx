'use client';

import { ReactNode } from 'react';
import { useHydrateAtoms } from 'jotai/utils';
import { prepareSSRData, SSRData } from './server-data-store';

interface SSRProviderProps {
  children: ReactNode;
  ssrData?: Partial<SSRData>;
}

/**
 * SSR Provider component following Jotai's official SSR pattern
 * This component hydrates server-side data into Jotai atoms
 */
export function SSRProvider({ children, ssrData }: SSRProviderProps) {
  // Use the official prepareSSRData function to prepare hydration tuples
  const hydrateAtoms = ssrData ? prepareSSRData(ssrData) : [];

  // Use Jotai's official useHydrateAtoms hook
  useHydrateAtoms(hydrateAtoms);
  
  console.log('[SSR Provider] Hydrated atoms using prepareSSRData:', {
    atomCount: hydrateAtoms.length,
    hasConfig: !!ssrData?.config,
    timestamp: ssrData?.timestamp,
    source: ssrData?.source
  });

  return <>{children}</>;
}