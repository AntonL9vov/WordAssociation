import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
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

const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const saveUserToStorage = (user: User) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save user:", err);
  }
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem("user");
  } catch (err) {
    console.error("Failed to remove user:", err);
  }
};

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
      removeUserFromStorage();
      return null;
    }
  });

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      if (!user?.id) return;
      try {
        const updatedUser = await getUserById(user.id);
        if (isMounted && updatedUser) setUser(updatedUser);
      } catch (error) {
        if (isMounted) {
          setUser(null);
          removeUserFromStorage();
          console.error(error);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const login = (newUser: User) => {
    setUser(newUser);
    saveUserToStorage(newUser);
  };

  const logout = () => {
    setUser(null);
    removeUserFromStorage();
  };

  const value: AuthContextType = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
