import React from "react";
import { useTranslation } from "react-i18next";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Box, Container, Typography, IconButton, Tooltip } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";

export const MainFooter: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoints();

  const goToGitHub = () => {
    window.open("https://github.com/AntonL9vov/WordAssociation", "_blank");
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "var(--bg-elevated)",
        borderTop: "1px solid var(--border-primary)",
        py: isMobile ? 0.5 : 0.75,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row", // Always single row
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            minHeight: isMobile ? 40 : 48,
          }}
        >
          {/* Копирайт */}
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-muted)",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            © 2025 Word Association Game
          </Typography>

          {/* Ссылки и иконки */}
          <IconButton
            onClick={goToGitHub}
            size="small"
            sx={{
              color: "var(--text-muted)",
              "&:hover": {
                color: "var(--text-primary)",
                backgroundColor: "var(--bg-tertiary)",
              },
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Box sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
              GitHub
            </Box>
            <Box sx={{ fontSize: isMobile ? "small" : "medium" }}>
              <GitHubIcon />
            </Box>
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};
