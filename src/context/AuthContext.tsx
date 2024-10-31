"use client";

import { UserProfile } from "@/types/user.types";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (token: string, userId: number) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userProfile");

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
      } else {
        fetchUserProfile(token);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "/";

    if (isAuthenticated && user && currentPath === "/") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8000/users/me", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("userProfile", JSON.stringify(userData));
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, userId: number) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    fetchUserProfile(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
