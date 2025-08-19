import React from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import "./style.css";
import { Typography } from "@mui/material";
import { deleteUser } from "../api/http";

export const MainHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    if (user?.id) {
      const response = await deleteUser(user?.id);
      if (response.status === 204) {
        logout();
      }
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Word Association Game</h1>
          <Typography>{user?.name}</Typography>
        </div>

        <div className="header-right">
          {isAuthenticated && user && (
            <div className="user-info">
              {/* <span className="user-name">Welcome, {user.name}</span> */}
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
