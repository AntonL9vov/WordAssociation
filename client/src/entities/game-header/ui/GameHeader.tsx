import React from "react";
import { Card, Text } from "@/shared/ui";
import { Box, Chip } from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Group as GroupIcon,
  EmojiEvents as TrophyIcon,
  ExitToApp as LeaveIcon,
} from "@mui/icons-material";

export interface GameHeaderProps {
  gameId: string;
  status: "created" | "started" | "finished";
  playersCount: number;
  onLeave: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gameId,
  status,
  playersCount,
  onLeave,
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case "created":
        return {
          icon: <GroupIcon />,
          label: "Setup",
          color: "primary" as const,
          description: "Setting up the game",
        };
      case "started":
        return {
          icon: <PlayIcon />,
          label: "Playing",
          color: "success" as const,
          description: "Game in progress",
        };
      case "finished":
        return {
          icon: <TrophyIcon />,
          label: "Finished",
          color: "warning" as const,
          description: "Game completed",
        };
      default:
        return {
          icon: <GroupIcon />,
          label: "Unknown",
          color: "default" as const,
          description: "Unknown status",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card
      cardVariant="filled"
      sx={{
        background:
          "linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%)",
        border: "1px solid var(--border-primary)",
        height: "100%",
        minHeight: "fit-content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          height: "100%",
        }}
      >
        <Box sx={{ height: "100%" }}>
          <Text variant="h6" weight="bold">
            Game Room
          </Text>
        </Box>
        <Box>
          <Text variant="body1" color="secondary">
            Game ID:{" "}
            <Text component="span" weight="bold" sx={{ display: "inline" }}>
              {gameId}
            </Text>
          </Text>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            color={statusInfo.color}
            variant="filled"
            sx={{
              fontWeight: "bold",
              "& .MuiChip-icon": {
                fontSize: "18px",
              },
            }}
          />
          <Chip
            icon={<GroupIcon />}
            label={`${playersCount} players`}
            variant="outlined"
            sx={{
              borderColor: "var(--border-secondary)",
            }}
          />
          <Chip
            icon={<LeaveIcon color="error" />}
            label="Leave"
            variant="outlined"
            sx={{
              borderColor: "var(--border-error)",
              cursor: "pointer",
              color: "var(--text-primary)",
              backgroundColor: "var(--error-50)",
              "&:hover": {
                backgroundColor: "var(--error-100)",
              },
            }}
            onClick={() => {
              onLeave();
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};
