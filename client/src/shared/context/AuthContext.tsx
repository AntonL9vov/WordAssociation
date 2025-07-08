import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/shared/lib/types";
import { gameService } from "@/shared/api/game-service";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

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
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );

  useEffect(() => {
    const cleanup = gameService.addListener(
      "user:connected",
      (data: { user: User }) => {
        setUser(data.user);
      }
    );

    if (user) {
      gameService.setUser(user);
    }

    return cleanup;
  }, []);

  const login = (user: User) => {
    gameService.setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    gameService.setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
