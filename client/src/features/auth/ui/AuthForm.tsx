import React, { useState } from 'react';
import { AuthFormFields, AuthFormFeatures } from '@/entities/auth-form';
import { Text } from '@/shared/ui';
import { Box } from '@mui/material';
import { User } from '@/shared/lib/types';

interface AuthFormProps {
  onSubmit: (playerName: string) => Promise<User>;
  onSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, onSuccess }) => {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await onSubmit(playerName.trim());
      onSuccess(user);
    } catch (err) {
      setError("Failed to connect. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Фичи */}
      <AuthFormFeatures />

      {/* Форма */}
      <Box sx={{ mt: 4 }}>
        <AuthFormFields
          playerName={playerName}
          isLoading={isLoading}
          error={error}
          onPlayerNameChange={setPlayerName}
          onSubmit={handleSubmit}
        />
      </Box>

      {/* Дополнительная информация */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Text variant="body2" color="muted">
          Join players from around the world in this fun word game!
        </Text>
      </Box>
    </>
  );
};

