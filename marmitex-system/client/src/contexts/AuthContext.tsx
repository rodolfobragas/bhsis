import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import apiService from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "kitchen" | "attendant" | "customer";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiService.getCurrentUser();
        const resolvedUser = data.user ?? data;
        if (resolvedUser) {
          setToken(storedToken);
          setUser({
            id: resolvedUser.id ?? resolvedUser.userId,
            email: resolvedUser.email,
            name: resolvedUser.name ?? resolvedUser.email,
            role: resolvedUser.role,
          });
        } else {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_email");
        }
      } catch (error) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_email");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await apiService.login(email, password);
      const resolvedUser = response.user ?? response;

      localStorage.setItem("auth_email", resolvedUser.email);
      setToken(response.token);
      const user: User = {
        id: resolvedUser.id ?? resolvedUser.userId,
        email: resolvedUser.email,
        name: resolvedUser.name ?? resolvedUser.email,
        role: resolvedUser.role,
      };
      setUser(user);
      setIsLoading(false);
      return user;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("remember_email");
    setToken(null);
    setUser(null);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await apiService.register(email, password, name);
      const resolvedUser = response.user ?? response;
      localStorage.setItem("auth_email", resolvedUser.email);
      setToken(response.token);
      const user: User = {
        id: resolvedUser.id ?? resolvedUser.userId,
        email: resolvedUser.email,
        name: resolvedUser.name ?? resolvedUser.email,
        role: resolvedUser.role,
      };
      setUser(user);
      setIsLoading(false);
      return user;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
