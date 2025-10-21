import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePluralization } from "@/shared/hooks";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Card, Text } from "@/shared/ui";
import { Box, Button, Chip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import type { GameContentProps } from "@/entities/game-content";

const desktopHeaderStyles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
    height: "100%",
  },
  chipContainer: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flexWrap: "wrap",
  },
};

const mobileHeaderStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    height: "100%",
  },
  chipContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    flexWrap: "wrap",
    justifyContent: "center",
  },
};

export interface GameHeaderProps {
  gameId: string;
  status: GameContentProps["gameStatus"];
  playersCount: number;
  onLeave: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gameId,
  status,
  playersCount,
  onLeave,
}) => {
  const { t } = useTranslation();
  const { players, formatCount } = usePluralization();
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileHeaderStyles : desktopHeaderStyles;

  const getStatusInfo = () => {
    switch (status) {
      case "created":
        return {
          icon: <GroupIcon />,
          label: t("game.statuses.setup.label"),
          color: "primary" as const,
          description: t("game.statuses.setup.description"),
        };
      case "started":
        return {
          icon: <PlayArrowIcon />,
          label: t("game.statuses.playing.label"),
          color: "success" as const,
          description: t("game.statuses.playing.description"),
        };
      case "finished":
        return {
          icon: <EmojiEventsIcon />,
          label: t("game.statuses.finished.label"),
          color: "warning" as const,
          description: t("game.statuses.finished.description"),
        };
      default:
        return {
          icon: <GroupIcon />,
          label: t("game.statuses.unknown.label"),
          color: "default" as const,
          description: t("game.statuses.unknown.description"),
        };
    }
  };

  const statusInfo = useMemo(() => getStatusInfo(), [status]);

  return (
    <Card
      cardVariant="filled"
      sx={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-primary)",
        height: "100%",
        minHeight: "fit-content",
      }}
    >
      <Box sx={styles.container}>
        {!isMobile && (
          <Box sx={{ height: "100%" }}>
            <Text variant="h6" weight="bold">
              {t("game.gameRoom")}
            </Text>
          </Box>
        )}

        {status === "created" && (
          <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
            <Text variant={isMobile ? "body2" : "body1"} color="secondary">
              {t("game.gameId")}:{" "}
              <Text component="span" weight="bold" sx={{ display: "inline" }}>
                {gameId}
              </Text>
            </Text>
          </Box>
        )}

        <Box sx={styles.chipContainer}>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            color={statusInfo.color}
            variant="filled"
            size={isMobile ? "small" : "medium"}
          />
          <Chip
            icon={<GroupIcon />}
            label={formatCount(playersCount, players)}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
          />
          <Button
            startIcon={<ExitToAppIcon />}
            variant="contained"
            color="error"
            size={isMobile ? "small" : "medium"}
            onClick={onLeave}
          >
            {t("game.leave")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
