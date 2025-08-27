import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { EmojiEmotions as EmojiIcon } from "@mui/icons-material";

interface MessengerTextFieldProps {
  inputRef: React.RefObject<HTMLInputElement>;
  isInputDisabled: boolean;
  message: string;
  setMessage: (message: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const MessengerTextField = ({
  inputRef,
  isInputDisabled,
  message,
  setMessage,
  handleKeyPress,
}: MessengerTextFieldProps) => {
  return (
    <TextField
      inputRef={inputRef}
      label={isInputDisabled ? "Waiting for other players" : "Type your message or word..."}
      variant="outlined"
      fullWidth
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyPress}
      disabled={isInputDisabled}
      placeholder={
        isInputDisabled ? "You have already emitted a word" : "Enter your word or message"
      }
      slotProps={{
        input: {
          endAdornment: !isInputDisabled && (
            <InputAdornment position="end">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Tooltip title="Add emoji">
                  <IconButton
                    size="small"
                    sx={{
                      color: "var(--text-muted)",
                      "&:hover": {
                        color: "var(--primary-600)",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <EmojiIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: isInputDisabled
            ? "var(--bg-secondary)"
            : "var(--bg-primary)",
          "&:hover": {
            backgroundColor: isInputDisabled
              ? "var(--bg-secondary)"
              : "rgba(255, 255, 255, 0.9)",
          },
          "&.Mui-focused": {
            backgroundColor: isInputDisabled
              ? "var(--bg-secondary)"
              : "var(--bg-primary)",
          },
        },
        "& .MuiInputLabel-root": {
          color: isInputDisabled
            ? "var(--text-muted)"
            : "var(--text-secondary)",
        },
      }}
    />
  );
};
