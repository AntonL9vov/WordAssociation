import React from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import './style.css';

export const MainHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Multiplayer Game</h1>
        </div>
        
        <div className="header-right">
          {isAuthenticated && user && (
            <div className="user-info">
              {/* <span className="user-name">Welcome, {user.name}</span> */}
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
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
