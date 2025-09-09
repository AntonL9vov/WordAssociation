import React from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Button, Input, Text } from "@/shared/ui";
import { Box, Tooltip, IconButton } from "@mui/material";
import {
  Games as GameIcon,
  Login as LoginIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";

// Separated styles for clean mobile optimization
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
    // На мобильном кнопка может быть полной ширины
  },
  hint: { mt: 0.5 },
};

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
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileFormStyles : desktopFormStyles;

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
      console.log("Failed to read clipboard");
    }
  };

  return (
    <Box sx={styles.container}>
      {withGameId && (
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
      )}

      <Button
        fullWidth={isMobile} // На мобильном fullWidth, на десктопе - нет
        size="large"
        disabled={!gameId || buttonDisabled}
        onClick={() => handleJoinGame(gameId)}
        startIcon={<LoginIcon />}
        gradient
        sx={{
          ...styles.button,
          // Ограничиваем ширину при disabled состоянии на десктопе
          ...((!gameId || buttonDisabled) && !isMobile && {
            maxWidth: 220,
            minWidth: 180,
          }),
        }}
      >
        {buttonLabel}
      </Button>

      {withGameId && (
        <Text 
          variant="caption" 
          color="muted" 
          align="center" 
          sx={styles.hint}
        >
          {t("game.shareGameIdHint")}
        </Text>
      )}
    </Box>
  );
};
