import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { managerBackendBff } from "@/services/ManagerBackendBff";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  setAuthToken: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "FarmaciasShopManagerAccessToken";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  // Load token from storage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      managerBackendBff.setAuthToken(storedToken);
    }
  }, []);

  const setAuthToken = (newToken: string) => {
    setToken(newToken);
    sessionStorage.setItem(AUTH_TOKEN_KEY, newToken);
    managerBackendBff.setAuthToken(newToken);
  };

  const clearAuth = () => {
    setToken(null);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    managerBackendBff.removeAuthToken();
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
