
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, type User } from "@/services/apiService";

interface AuthContextType {
  user: User | null;
  session: any | null;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      try {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          setSession({ user: response.data });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password, role || '');
      
      if (!response.success || !response.data) {
        throw new Error(response.error || `Invalid credentials for ${role} account`);
      }

      // Check if user has the required role
      if (role && response.data.role !== role) {
        throw new Error(`Invalid credentials for ${role} account`);
      }

      setUser(response.data);
      setSession({ user: response.data });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.register(name, email, password, role);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      setUser(response.data);
      setSession({ user: response.data });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
