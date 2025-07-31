import { APIResponse } from './types/api';
import stcApi from './instances/stc';

// Auth-specific types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  verified?: boolean;
  company_id?: string;
  tradesman_id?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

const authService = {
  /**
   * Sign in user with email and password
   */
  login(credentials: AuthCredentials): Promise<APIResponse<LoginResponse>> {
    return stcApi.post('/auth/sign-in', credentials).then((res) => res.data);
  },

  /**
   * Decode JWT token to get current user
   */
  decodeJWT(): Promise<APIResponse<User>> {
    return stcApi.post('/auth/decode-jwt').then((res) => res.data);
  },

  /**
   * Sign out user (client-side token cleanup)
   */
  signOut(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

export default authService;