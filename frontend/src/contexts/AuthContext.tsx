import React, { useEffect, useState, createContext, useContext } from "react";
import apiService from "../services/api";

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type LoginResponse = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.login(email, password) as ApiResponse<LoginResponse>;
      
      const userData = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        isAdmin: data.data.role === "admin",
        token: data.data.token,
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (e: any) {
      setError(e.message || "Falha no login. Verifique suas credenciais.");
      setLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.register(name, email, password) as ApiResponse<LoginResponse>;
      
      const userData = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        isAdmin: data.data.role === "admin",
        token: data.data.token,
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (e: any) {
      setError(e.message || "Falha no registro. Tente novamente.");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        logout,
        loading,
        error,
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
