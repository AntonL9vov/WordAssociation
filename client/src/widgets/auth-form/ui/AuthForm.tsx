import React, { useState } from "react";
import { playerConnect } from "../api/api";
import "./style.css";
import { User } from "@/shared/lib/types";

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName) {
      setError("Please enter your name");
      return;
    }
    setIsLoading(true);
    setError("");

    const user = await playerConnect(playerName);

    setIsLoading(false);
    onAuthSuccess(user);
  };

  return (
    <div className="auth-form">
      <h2 className="auth-title">Welcome to Word Association Game</h2>
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
