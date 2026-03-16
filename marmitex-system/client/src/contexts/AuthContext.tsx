import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get user from token
function getUserFromToken(token: string): User | null {
  try {
    // Parse token to get user info
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // For mock tokens, we'll determine user based on stored email
    const storedEmail = localStorage.getItem("auth_email");
    
    if (storedEmail === "admin@marmitex.com") {
      return {
        id: "1",
        email: "admin@marmitex.com",
        name: "Admin User",
        role: "admin",
      };
    } else if (storedEmail === "kitchen@marmitex.com") {
      return {
        id: "2",
        email: "kitchen@marmitex.com",
        name: "Kitchen Staff",
        role: "kitchen",
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("auth_token");
      const storedEmail = localStorage.getItem("auth_email");
      
      if (storedToken && storedEmail) {
        const user = getUserFromToken(storedToken);
        if (user) {
          setToken(storedToken);
          setUser(user);
        } else {
          // Clear invalid token
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_email");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let mockToken: string;
      let mockUser: User;

      if (email === "admin@marmitex.com" && password === "admin123") {
        mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQG1hcm1pdGV4LmNvbSIsInJvbGUiOiJhZG1pbiJ9.mock";
        mockUser = {
          id: "1",
          email: "admin@marmitex.com",
          name: "Admin User",
          role: "admin",
        };
      } else if (email === "kitchen@marmitex.com" && password === "kitchen123") {
        mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6ImtpdGNoZW5AbWFybWl0ZXguY29tIiwicm9sZSI6ImtpdGNoZW4ifQ.mock";
        mockUser = {
          id: "2",
          email: "kitchen@marmitex.com",
          name: "Kitchen Staff",
          role: "kitchen",
        };
      } else {
        throw new Error("Invalid credentials");
      }

      // Store token and email
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("auth_email", email);
      
      // Update state
      setToken(mockToken);
      setUser(mockUser);
      setIsLoading(false);
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJlbWFpbCI6IiIgKyBlbWFpbCArICIiLCJyb2xlIjoidXNlciJ9.mock";
      const mockUser: User = {
        id: "3",
        email,
        name,
        role: "customer",
      };
      
      localStorage.setItem("auth_token", mockToken);
      localStorage.setItem("auth_email", email);
      setToken(mockToken);
      setUser(mockUser);
      setIsLoading(false);
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
