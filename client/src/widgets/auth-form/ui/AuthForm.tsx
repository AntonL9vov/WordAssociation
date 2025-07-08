import React, { useState, useEffect } from "react";
import { initPlayerConnectListener, playerConnect } from "../api/socket-hooks";
import "./style.css";
import { User } from "@/shared/lib/types";

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthSuccess = (user: User) => {
    setIsLoading(false);
    onAuthSuccess(user);
  };

  useEffect(() => {
    const cleanup = initPlayerConnectListener(handleAuthSuccess);

    return cleanup;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName) {
      setError("Please enter your name");
      return;
    }

    playerConnect(playerName);

    setIsLoading(true);
    setError("");
  };

  return (
    <div className="auth-form">
      <h2 className="auth-title">Welcome to Multiplayer Game</h2>
      <p className="auth-subtitle">Enter your name to start playing</p>

      <form onSubmit={handleSubmit} className="auth-form-content">
        <div className="form-group">
          <label htmlFor="playerName" className="form-label">
            Player Name
          </label>
          <input
            id="playerName"
            type="text"
            className="form-input"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.trim())}
            disabled={isLoading}
            autoFocus
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="form-button"
          disabled={!playerName || isLoading}
        >
          {isLoading ? "Connecting..." : "Start Playing"}
        </button>
      </form>
    </div>
  );
};
