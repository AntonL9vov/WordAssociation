import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/shared/lib/types";
import { api } from "../api/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

interface UserResponse {
  user: User;
}

const getUserById = async (id: string) => {
  try {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      getUserById(user.id)
        .then((updatedUser) => {
          setUser(updatedUser);
        })
        .catch((error) => {
          setUser(null);
          try {
            localStorage.removeItem("user");
          } catch (storageError) {
            console.error(
              "Failed to remove user from localStorage:",
              storageError
            );
          }
          console.error("Failed to fetch user:", error);
        });
    }
  }, [user?.id]);

  const login = (user: User) => {
    if (!user) {
      console.error("Cannot login with null or undefined user");
      return;
    }
    setUser(user);
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to remove user from localStorage:", error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
