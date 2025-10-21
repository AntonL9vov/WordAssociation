import React from "react";
import { Card, Text, Button } from "@/shared/ui";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Box } from "@mui/material";

export interface GameActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  colorScheme: "primary" | "secondary";
  onClick: () => void;
}

// Separated styles for mobile optimization
const desktopCardStyles = {
  card: {
    flex: 1,
    maxWidth: { xs: "100%" },
    p: 3,
  },
  icon: {
    width: 72,
    height: 72,
  },
  button: {
    py: 1,
    px: 3,
    fontSize: "1rem",
  },
};

const mobileCardStyles = {
  card: {
    flex: 1,
    maxWidth: "100%",
  },
  icon: {
    width: 48,
    height: 48,
  },
  button: {
    py: 1.2,
    px: 2,
    fontSize: "0.9rem",
    minHeight: 44,
  },
};

export const GameActionCard: React.FC<GameActionCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  colorScheme,
  onClick,
}) => {
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileCardStyles : desktopCardStyles;
  const getColorScheme = () => {
    switch (colorScheme) {
      case "primary":
        return {
          topBorder:
            "linear-gradient(135deg, var(--primary-500), var(--primary-600))",
          iconBg:
            "linear-gradient(135deg, var(--primary-100), var(--primary-200))",
          iconColor: "var(--primary-600)",
          buttonBg:
            "linear-gradient(135deg, var(--primary-500), var(--primary-600))",
          hoverShadow: "rgba(14, 165, 233, 0.15)",
        };
      case "secondary":
        return {
          topBorder:
            "linear-gradient(135deg, var(--accent-500), var(--accent-600))",
          iconBg:
            "linear-gradient(135deg, var(--accent-100), var(--accent-200))",
          iconColor: "var(--accent-600)",
          buttonBg:
            "linear-gradient(135deg, var(--accent-500), var(--accent-600))",
          hoverShadow: "rgba(34, 197, 94, 0.15)",
        };
    }
  };

  const colors = getColorScheme();

  return (
    <Card
      variant="elevation"
      clickable
      hover
      sx={{
        ...styles.card,
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: isMobile ? "scale(1.02)" : "translateY(-8px)",
          boxShadow: `0 ${isMobile ? 10 : 20}px ${isMobile ? 20 : 40}px ${
            colors.hoverShadow
          }`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: colors.topBorder,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ textAlign: "center" }}>
        <Box
          sx={{
            ...styles.icon,
            borderRadius: "50%",
            background: colors.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            "& svg": {
              fontSize: isMobile ? 24 : 36,
              color: colors.iconColor,
            },
          }}
        >
          {icon}
        </Box>

        <Text
          variant={isMobile ? "subtitle1" : "h5"}
          weight="bold"
          sx={{ mb: isMobile ? 1 : 2 }}
        >
          {title}
        </Text>

        <Text
          variant={isMobile ? "body2" : "body2"}
          color="secondary"
          sx={{
            mb: isMobile ? 1.5 : 3,
            lineHeight: 1.5,
            fontSize: isMobile ? "0.85rem" : "0.875rem",
          }}
        >
          {description}
        </Text>

        <Button
          variant="contained"
          startIcon={isMobile ? undefined : icon}
          fullWidth={isMobile}
          sx={{
            ...styles.button,
            background: colors.buttonBg,
            fontWeight: "bold",
            "&:hover": {
              background: colors.buttonBg,
              filter: "brightness(1.1)",
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
};
