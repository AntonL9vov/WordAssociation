import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <TextField
      inputRef={inputRef}
      label={isInputDisabled ? t('messenger.typeMessageDisabled') : t('messenger.typeMessage')}
      variant="outlined"
      fullWidth
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyPress}
      disabled={isInputDisabled}
      placeholder={
        isInputDisabled ? t('messenger.placeholderDisabled') : t('messenger.placeholderDefault')
      }
      slotProps={{
        input: {
          endAdornment: !isInputDisabled && (
            <InputAdornment position="end">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Tooltip title={t('messenger.addEmoji')}>
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
              : "var(--bg-elevated)",
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
          backgroundColor: isInputDisabled
            ? "var(--bg-secondary)"
            : "var(--bg-primary)",
          paddingLeft: "var(--space-xs)",
          paddingRight: "var(--space-xs)",
          "&.Mui-focused": {
            backgroundColor: isInputDisabled
              ? "var(--bg-secondary)"
              : "var(--bg-primary)",
          },
          "&.MuiInputLabel-shrink": {
            backgroundColor: isInputDisabled
              ? "var(--bg-secondary)"
              : "var(--bg-primary)",
            paddingLeft: "var(--space-xs)",
            paddingRight: "var(--space-xs)",
          },
        },
      }}
    />
  );
};
