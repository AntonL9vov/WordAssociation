import React from "react";
import { Button, Input, Text } from "@/shared/ui";
import { 
  Box, 
  Tooltip,
  IconButton,
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
          <Text 
            variant="body2" 
            color="secondary"
            weight="medium"
            sx={{ mb: 2 }}
          >
            Enter the Game ID shared by your friend to join their game
          </Text>
          <Input
            fullWidth
            label="Game ID"
            placeholder="Enter game ID (e.g. abc123)"
            value={gameId}
            onChange={(e) => onGameIdChange(e.target.value.trim())}
            autoFocus
            startIcon={<GameIcon />}
            endIcon={
              <Tooltip title="Paste from clipboard">
                <IconButton
                  size="small"
                  onClick={handlePasteFromClipboard}
                  sx={{
                    color: 'var(--text-muted)',
                    '&:hover': {
                      color: 'var(--primary-600)',
                    },
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
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
        size="large"
        disabled={!gameId || buttonDisabled}
        onClick={() => handleJoinGame(gameId)}
        startIcon={<LoginIcon />}
        gradient
        sx={{
          py: 1.5,
          fontSize: '1.1rem',
        }}
      >
        {buttonLabel}
      </Button>

      {withGameId && (
        <Text 
          variant="caption" 
          color="muted"
          align="center"
          sx={{ mt: 1 }}
        >
          Ask your friend to share their Game ID with you
        </Text>
      )}
    </Box>
  );
};
