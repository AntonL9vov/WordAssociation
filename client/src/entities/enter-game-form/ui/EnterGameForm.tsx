import React from "react";
import { 
  Button, 
  TextField, 
  Box, 
  Typography,
  InputAdornment,
  Tooltip
} from "@mui/material";
import {
  Games as GameIcon,
  Login as LoginIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";

interface EnterGameFormBaseProps {
  onJoinGame: (gameId: string) => void;
  buttonLabel: string;
  buttonDisabled?: boolean;
}

interface EnterGameFormWithGameIdProps extends EnterGameFormBaseProps {
  withGameId: true;
  gameId: string;
  onGameIdChange: (gameId: string) => void;
}

interface EnterGameFormWithoutGameIdProps extends EnterGameFormBaseProps {
  withGameId: false;
  gameId?: never;
  onGameIdChange?: never;
}

type EnterGameFormProps =
  | EnterGameFormWithGameIdProps
  | EnterGameFormWithoutGameIdProps;

export const EnterGameForm: React.FC<EnterGameFormProps> = ({
  gameId,
  onGameIdChange,
  onJoinGame,
  buttonLabel,
  withGameId,
  buttonDisabled,
}) => {
  const handleJoinGame = (gameId: string | undefined) => {
    if (gameId) {
      onJoinGame(gameId);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && onGameIdChange) {
        onGameIdChange(text.trim());
      }
    } catch (err) {
      console.log('Failed to read clipboard');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {withGameId && (
        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              color: 'var(--text-secondary)',
              fontWeight: 'medium'
            }}
          >
            Enter the Game ID shared by your friend to join their game
          </Typography>
          <TextField
            fullWidth
            label="Game ID"
            placeholder="Enter game ID (e.g. abc123)"
            value={gameId}
            onChange={(e) => onGameIdChange(e.target.value.trim())}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GameIcon sx={{ color: 'var(--text-muted)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Paste from clipboard">
                    <Button
                      size="small"
                      onClick={handlePasteFromClipboard}
                      sx={{
                        minWidth: 'auto',
                        px: 1,
                        color: 'var(--text-muted)',
                        '&:hover': {
                          color: 'var(--primary-600)',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      <CopyIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              },
            }}
          />
        </Box>
      )}
      
      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={!gameId || buttonDisabled}
        onClick={() => handleJoinGame(gameId)}
        startIcon={<LoginIcon />}
        sx={{
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
          '&:hover': {
            background: 'linear-gradient(135deg, var(--accent-600), var(--accent-700))',
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            background: 'var(--neutral-300)',
            color: 'var(--text-muted)',
            transform: 'none',
          },
        }}
      >
        {buttonLabel}
      </Button>

      {withGameId && (
        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: 'center',
            color: 'var(--text-muted)',
            mt: 1
          }}
        >
          Ask your friend to share their Game ID with you
        </Typography>
      )}
    </Box>
  );
};
