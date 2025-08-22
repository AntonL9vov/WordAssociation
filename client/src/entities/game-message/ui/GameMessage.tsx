import React from "react";
import type { Word } from "@/shared/lib/types";
import {
  Box,
  Chip,
  Typography,
  Avatar,
} from "@mui/material";

type GameMessageProps = {
  message: Word;
  variant?: 'self' | 'opponent';
};

export const GameMessage: React.FC<GameMessageProps> = ({ 
  message, 
  variant = 'opponent' 
}) => {
  const isSelf = variant === 'self';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        justifyContent: isSelf ? 'flex-end' : 'flex-start',
      }}
    >
      {!isSelf && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: 'var(--accent-100)',
            color: 'var(--accent-700)',
            fontSize: '0.875rem',
            fontWeight: 'bold',
          }}
        >
          {message.playerName.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isSelf ? 'flex-end' : 'flex-start',
          maxWidth: '70%',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-muted)',
            mb: 0.5,
            fontSize: '0.7rem',
          }}
        >
          {message.playerName}
        </Typography>
        
        <Chip
          label={message.word}
          sx={{
            backgroundColor: isSelf 
              ? 'var(--primary-100)' 
              : 'var(--bg-tertiary)',
            color: isSelf 
              ? 'var(--primary-700)' 
              : 'var(--text-primary)',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            height: 'auto',
            py: 1,
            px: 2,
            borderRadius: 'var(--radius-lg)',
            '& .MuiChip-label': {
              padding: '4px 8px',
            },
            border: isSelf 
              ? '1px solid var(--primary-200)' 
              : '1px solid var(--border-primary)',
            transition: 'all var(--transition-normal)',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: 'var(--shadow-sm)',
            },
          }}
        />
      </Box>

      {isSelf && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            fontSize: '0.875rem',
            fontWeight: 'bold',
          }}
        >
          {message.playerName.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Box>
  );
};
