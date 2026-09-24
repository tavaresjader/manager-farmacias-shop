import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { authTokenStorage, AuthSessionData, isMockToken, isTokenExpired } from "@/lib/authToken";

interface AuthContextType {
  token: string | null;
  session: AuthSessionData | null;
  isAuthenticated: boolean;
  setAuthToken: (token: string) => void;
  setAuthSession: (session: AuthSessionData) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Load token from storage synchronously on first render so protected routes
  // don't flash a redirect while auth state is still hydrating.
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = authTokenStorage.get();
    if (storedToken) {
      managerBackendBff.setAuthToken(storedToken);
    } else {
      managerBackendBff.removeAuthToken();
    }
    return storedToken;
  });
  const [session, setSession] = useState<AuthSessionData | null>(() => authTokenStorage.getSession());

  const clearAuth = useCallback(() => {
    setToken(null);
    setSession(null);
    authTokenStorage.clear();
    managerBackendBff.removeAuthToken();
  }, []);

  // Periodically drop expired tokens from memory and storage
  useEffect(() => {
    if (!token) return;
    const interval = window.setInterval(() => {
      if (isTokenExpired(token)) {
        clearAuth();
      }
    }, 30000);
    return () => window.clearInterval(interval);
  }, [token, clearAuth]);

  const setAuthSession = (newSession: AuthSessionData) => {
    const newToken = newSession.accessToken || newSession.token;
    if (!newToken) {
      clearAuth();
      return;
    }

    if (isTokenExpired(newToken) || isMockToken(newToken)) {
      clearAuth();
      return;
    }

    setToken(newToken);
    setSession(newSession);
    authTokenStorage.set(newToken);
    authTokenStorage.setSession(newSession);
    managerBackendBff.setAuthToken(newToken);
  };

  const setAuthToken = (newToken: string) => {
    setAuthSession({ accessToken: newToken });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        session,
        isAuthenticated: !!token,
        setAuthToken,
        setAuthSession,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
