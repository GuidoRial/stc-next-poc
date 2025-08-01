import { authService, type AuthCredentials } from "@/services";
import {
  authAtom,
  currentUserAtom,
  isAuthenticatedAtom,
  loginAtom,
  logoutAtom,
  setAuthErrorAtom,
  setAuthLoadingAtom,
} from "@/store/auth";
import { useAtom } from "jotai";
import { useCallback } from "react";

export const useAuth = () => {
  const [authState] = useAtom(authAtom);
  const [, login] = useAtom(loginAtom);
  const [, logout] = useAtom(logoutAtom);
  const [, setError] = useAtom(setAuthErrorAtom);
  const [, setLoading] = useAtom(setAuthLoadingAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [currentUser] = useAtom(currentUserAtom);

  // Login function
  const signIn = useCallback(
    async (credentials: AuthCredentials): Promise<boolean> => {
      setLoading(true);

      try {
        const response = await authService.login(credentials);
        console.log(response);
        login({
          user: response.result.data.user,
          token: response.result.data.token,
        });
        return true;
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = "Login failed";

        if (error && typeof error === "object" && "response" in error) {
          // Could handle specific error cases here if needed
          console.log("Response error details:", error);
        }

        setError(errorMessage);
        return false;
      }
    },
    [login, setError, setLoading]
  );

  // Logout function
  const signOut = useCallback(() => {
    authService.signOut();
    logout();
  }, [logout]);

  // Decode JWT and restore session
  const restoreSession = useCallback(async (): Promise<boolean> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      return false;
    }

    setLoading(true);

    try {
      const response = await authService.decodeJWT();

      if (response.result.data) {
        login({
          user: response.result.data,
          token,
        });
        return true;
      } else {
        // Invalid token, remove it
        signOut();
        return false;
      }
    } catch (error) {
      console.error("Session restore error:", error);
      // Invalid token, remove it
      signOut();
      return false;
    }
  }, [login, signOut, setLoading]);

  // Clear error
  const clearError = useCallback(() => {
    setError("");
  }, [setError]);

  return {
    // State
    user: currentUser,
    token: authState.token,
    isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,

    // Actions
    signIn,
    signOut,
    restoreSession,
    clearError,
  };
};
