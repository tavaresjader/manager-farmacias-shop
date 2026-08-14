import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { authTokenStorage, isTokenExpired } from "@/lib/authToken";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  setAuthToken: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const clearAuth = useCallback(() => {
    setToken(null);
    authTokenStorage.clear();
    managerBackendBff.removeAuthToken();
  }, []);

  // Load token from storage on mount (expired tokens are discarded)
  useEffect(() => {
    const storedToken = authTokenStorage.get();
    if (storedToken) {
      setToken(storedToken);
      managerBackendBff.setAuthToken(storedToken);
    } else {
      managerBackendBff.removeAuthToken();
    }
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

  const setAuthToken = (newToken: string) => {
    if (isTokenExpired(newToken)) {
      clearAuth();
      return;
    }
    setToken(newToken);
    authTokenStorage.set(newToken);
    managerBackendBff.setAuthToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        setAuthToken,
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
