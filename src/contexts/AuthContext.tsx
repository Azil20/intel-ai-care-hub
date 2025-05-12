
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "patient" | "doctor" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for demo purpose
    const mockPatients = [
      { id: "p1", name: "John Doe", email: "patient@example.com", role: "patient" as const, password: "password" },
    ];
    
    const mockDoctors = [
      { id: "d1", name: "Dr. Sarah Smith", email: "doctor@example.com", role: "doctor" as const, password: "password" },
    ];
    
    const users = role === "patient" ? mockPatients : mockDoctors;
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }
    
    // Remove password before storing user
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
