import { useTranslation } from "react-i18next";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Box, Stack, Typography } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";
import { Game } from "@/shared";

type GameStatus = Game["status"];

// Separated style objects for clean mobile optimization
const desktopHeaderStyles = {
  container: {
    p: 2,
    backgroundColor: "var(--bg-elevated)",
    borderBottom: "1px solid var(--border-primary)",
  },
  titleStack: { direction: "row" as const, alignItems: "center" as const, spacing: 1 },
};

const mobileHeaderStyles = {
  container: {
    p: 1.5,
    backgroundColor: "var(--bg-elevated)",
    borderBottom: "1px solid var(--border-primary)",
  },
  titleStack: { direction: "column" as const, alignItems: "flex-start" as const, spacing: 0.5 },
};

export const GameMessengerHeader = ({
  gameStatus,
}: {
  gameStatus?: GameStatus;
}) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileHeaderStyles : desktopHeaderStyles;
  
  return (
    <Box sx={styles.container}>
      <Stack {...styles.titleStack}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ChatIcon sx={{ color: "var(--primary-600)" }} />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{
              fontWeight: "bold",
              color: "var(--text-primary)",
            }}
          >
            {t("messenger.title")}
          </Typography>
        </Box>
        {gameStatus === "started" && (
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-muted)",
              fontStyle: "italic",
              ...(isMobile ? {} : { ml: "auto" }),
            }}
          >
            {t("messenger.subtitle")}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
