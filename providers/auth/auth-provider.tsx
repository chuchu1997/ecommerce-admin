"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

import { User } from "@prisma/client";
import { decodeToken, isTokenExpired } from "@/utils/jwt";
import toast from "react-hot-toast";
import { AuthContextType } from "@/types/auth";
import { redirect } from "next/navigation";
// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  // register: async () => {},
  logout: async () => {},
  loading: true,
});

// Authentication Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    const token = document.cookie.includes("token");

    if (token) {
      try {
        // Fetch current user details
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    }

    setLoading(false);
  };

  // Login method
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);

        redirect("/");
      } else {
        toast.error(data.message || "Login failed");
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Login error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register method
  const register = async (
    email: string,
    password: string,
    name?: string,
    role: "USER" | "ADMIN" | "MANAGER" = "USER"
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success("Registration successful");
        redirect("/");
      } else {
        toast.error(data.message || "Registration failed");
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout method
  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (response.ok) {
        setUser(null);
        toast.success("Logged out successfully");
        redirect("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error", error);
      toast.error("An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        // register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export context for potential advanced use cases
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
