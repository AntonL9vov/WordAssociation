import { useTranslation } from "react-i18next";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Button, Input, Text } from "@/shared/ui";
import { Box, Tooltip, IconButton } from "@mui/material";
import {
  Games as GameIcon,
  Login as LoginIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";

const desktopFormStyles = {
  container: { display: "flex", flexDirection: "column", gap: 3 },
  description: { mb: 2 },
  button: {
    py: 1.5,
    fontSize: "1.1rem",
    maxWidth: "fit-content",
    alignSelf: "center",
    minWidth: 180,
  },
  hint: { mt: 1 },
};

const mobileFormStyles = {
  container: { display: "flex", flexDirection: "column", gap: 2 },
  description: { mb: 1.5 },
  button: {
    py: 2,
    fontSize: "1rem",
  },
  hint: { mt: 0.5 },
};

interface EnterGameFormProps {
  onJoinGame: (gameId: string) => void;
  buttonLabel: string;
  buttonDisabled?: boolean;
  gameId: string;
  onGameIdChange: (gameId: string) => void;
}

export const EnterGameForm = ({
  gameId,
  onGameIdChange,
  onJoinGame,
  buttonLabel,
  buttonDisabled,
}: EnterGameFormProps) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileFormStyles : desktopFormStyles;
  
  const [validationError, setValidationError] = useState<string | null>(null);

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const debouncedValidate = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (value && value.trim()) {
            if (!uuidRegex.test(value.trim())) {
              setValidationError(t("game.invalidGameId"));
            } else {
              setValidationError(null);
            }
          } else {
            setValidationError(null);
          }
        }, 500); 
      };
    })(),
    [t]
  );

  useEffect(() => {
    debouncedValidate(gameId);
  }, [gameId, debouncedValidate]);

  const handleJoinGame = (gameId: string) => {
    onJoinGame(gameId.trim());
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && onGameIdChange) {
        onGameIdChange(text.trim());
      }
    } catch (err) {
      console.error("Failed to read clipboard");
    }
  };

  const isButtonDisabled = !gameId?.trim() || !!buttonDisabled || !!validationError;

  return (
    <Box sx={styles.container}>
      <Box>
        <Text
          variant="body2"
          color="secondary"
          weight="medium"
          sx={styles.description}
        >
          {t("game.enterGameIdDescription")}
        </Text>
        <Input
          fullWidth
          label={t("game.gameIdLabel")}
          placeholder={t("game.gameIdPlaceholder")}
          value={gameId}
          onChange={(e) => onGameIdChange(e.target.value.trim())}
          autoFocus
          error={!!validationError}
          helperText={validationError || undefined}
          startIcon={<GameIcon />}
          endIcon={
            <Tooltip title={t("common.pasteFromClipboard")}>
              <IconButton
                size="small"
                onClick={handlePasteFromClipboard}
                sx={{
                  color: "var(--text-muted)",
                  "&:hover": {
                    color: "var(--primary-600)",
                  },
                }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "var(--bg-elevated)",
              "&:hover": {
                backgroundColor: "var(--bg-primary)",
              },
              "&.Mui-focused": {
                backgroundColor: "var(--bg-primary)",
              },
            },
          }}
        />
      </Box>

      <Button
        fullWidth={isMobile}
        size="large"
        disabled={isButtonDisabled}
        onClick={() => handleJoinGame(gameId)}
        startIcon={<LoginIcon />}
        gradient
        sx={{
          ...styles.button,
          ...(isButtonDisabled &&
            !isMobile && {
              maxWidth: 220,
              minWidth: 180,
            }),
        }}
      >
        {buttonLabel}
      </Button>

      <Text variant="caption" color="muted" align="center" sx={styles.hint}>
        {t("game.shareGameIdHint")}
      </Text>
    </Box>
  );
};
