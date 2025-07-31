import { atom } from 'jotai';
import { User } from '@/services';

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth atom
export const authAtom = atom<AuthState>(initialAuthState);

// Derived atom for checking if user is authenticated
export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated);

// Derived atom for getting current user
export const currentUserAtom = atom((get) => get(authAtom).user);

// Write-only atom for updating auth state
export const updateAuthAtom = atom(
  null,
  (get, set, update: Partial<AuthState>) => {
    const currentState = get(authAtom);
    set(authAtom, { ...currentState, ...update });
  }
);

// Write-only atom for login action
export const loginAtom = atom(
  null,
  (get, set, { user, token }: { user: User; token: string }) => {
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    
    // Update auth state
    set(authAtom, {
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }
);

// Write-only atom for logout action
export const logoutAtom = atom(
  null,
  (get, set) => {
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    // Reset auth state
    set(authAtom, initialAuthState);
  }
);

// Write-only atom for setting auth error
export const setAuthErrorAtom = atom(
  null,
  (get, set, error: string) => {
    const currentState = get(authAtom);
    set(authAtom, {
      ...currentState,
      error,
      isLoading: false,
    });
  }
);

// Write-only atom for setting loading state
export const setAuthLoadingAtom = atom(
  null,
  (get, set, isLoading: boolean) => {
    const currentState = get(authAtom);
    set(authAtom, {
      ...currentState,
      isLoading,
      error: isLoading ? null : currentState.error,
    });
  }
);