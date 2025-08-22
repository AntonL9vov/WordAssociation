import React, { useState, useEffect, useRef } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  IconButton,
  Tooltip,
  InputAdornment
} from "@mui/material";
import {
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";

interface MessengerInputProps {
  onSend: (message: string) => void;
  isInputDisabled?: boolean;
}

export const MessengerInput: React.FC<MessengerInputProps> = ({
  onSend,
  isInputDisabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() || isInputDisabled) return;
    
    onSend(message.trim());
    setMessage("");
    
    // Возвращаем фокус на поле ввода
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    setIsSendDisabled(message.trim() === "" || isInputDisabled);
  }, [message, isInputDisabled]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'flex-end',
        width: '100%',
      }}
    >
      <TextField
        inputRef={inputRef}
        label={isInputDisabled ? "Game finished" : "Type your message or word..."}
        variant="outlined"
        fullWidth
        multiline
        maxRows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isInputDisabled}
        placeholder={isInputDisabled ? "Game has ended" : "Enter your word or message"}
        InputProps={{
          endAdornment: !isInputDisabled && (
            <InputAdornment position="end">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Add emoji">
                  <IconButton 
                    size="small"
                    sx={{ 
                      color: 'var(--text-muted)',
                      '&:hover': {
                        color: 'var(--primary-600)',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <EmojiIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: isInputDisabled ? 'var(--bg-secondary)' : 'var(--bg-primary)',
            '&:hover': {
              backgroundColor: isInputDisabled ? 'var(--bg-secondary)' : 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              backgroundColor: isInputDisabled ? 'var(--bg-secondary)' : 'var(--bg-primary)',
            },
          },
          '& .MuiInputLabel-root': {
            color: isInputDisabled ? 'var(--text-muted)' : 'var(--text-secondary)',
          },
        }}
      />
      
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={isSendDisabled}
        startIcon={<SendIcon />}
        sx={{
          minWidth: 'auto',
          px: 2,
          py: 1.5,
          height: '56px', // Соответствует высоте TextField
          background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
          '&:hover': {
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            background: 'var(--neutral-300)',
            color: 'var(--text-muted)',
            transform: 'none',
          },
          '@media (max-width: 600px)': {
            minWidth: '48px',
            px: 1,
            '& .MuiButton-startIcon': {
              margin: 0,
            },
            '& .MuiButton-startIcon + *': {
              display: 'none',
            },
          },
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          Send
        </Box>
      </Button>
    </Box>
  );
};
