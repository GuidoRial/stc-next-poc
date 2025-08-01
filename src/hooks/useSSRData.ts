'use client';

import { useAtom, useAtomValue } from 'jotai';
import { configAtom, updateConfigAtom } from '@/store/config';
import { authAtom } from '@/store/auth';

/**
 * Hook to access config data that's been hydrated from SSR
 */
export function useConfig() {
  const config = useAtomValue(configAtom);
  const updateConfig = useAtom(updateConfigAtom)[1];
  
  return {
    config: config.config,
    isLoading: config.isLoading,
    error: config.error,
    updateConfig,
  };
}

/**
 * Hook to access auth data that's been hydrated from SSR
 */
export function useAuth() {
  const auth = useAtomValue(authAtom);
  
  return auth;
}

/**
 * Hook to refresh data on the client side
 */
export function useRefreshData() {
  const [, updateConfig] = useAtom(updateConfigAtom);
  
  const refreshConfig = async () => {
    updateConfig({ isLoading: true, error: null });
    
    try {
      const { configService } = await import('@/services');
      const response = await configService.getConfig();
      
      updateConfig({
        config: response.result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to refresh config:', error);
      updateConfig({
        isLoading: false,
        error: 'Failed to refresh config',
      });
    }
  };
  
  return {
    refreshConfig,
  };
}