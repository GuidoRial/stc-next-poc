import { atom } from 'jotai';
import { Config } from '@/services';

export interface ConfigState {
  config: Config | null;
  isLoading: boolean;
  error: string | null;
}

// Initialize the config atom with default state
export const configAtom = atom<ConfigState>({
  config: null,
  isLoading: false,
  error: null,
});

// Derived atom to get just the config data
export const configDataAtom = atom((get) => get(configAtom).config);

// Action atom to update config
export const updateConfigAtom = atom(
  null,
  (get, set, update: Partial<ConfigState>) => {
    const current = get(configAtom);
    set(configAtom, { ...current, ...update });
  }
);