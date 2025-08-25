import React from 'react';
import { Input, Button } from '@/shared/ui';
import { Box, Alert } from '@mui/material';
import {
  Person as PersonIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

interface AuthFormFieldsProps {
  playerName: string;
  isLoading: boolean;
  error?: string;
  onPlayerNameChange: (value: string) => void;
  onSubmit: () => void;
}

export const AuthFormFields: React.FC<AuthFormFieldsProps> = ({
  playerName,
  isLoading,
  error,
  onPlayerNameChange,
  onSubmit,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && playerName.trim()) {
      onSubmit();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Input
        fullWidth
        label="Your Name"
        placeholder="Enter your player name"
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        disabled={isLoading}
        autoFocus
        startIcon={<PersonIcon sx={{ color: 'var(--text-muted)' }} />}
        onKeyPress={handleKeyPress}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      />

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--error-50)',
            border: '1px solid var(--error-200)',
          }}
        >
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        size="large"
        disabled={!playerName.trim() || isLoading}
        loading={isLoading}
        gradient
        startIcon={<PlayIcon />}
        onClick={onSubmit}
        sx={{
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
      >
        {isLoading ? "Connecting..." : "Start Playing"}
      </Button>
    </Box>
  );
};

