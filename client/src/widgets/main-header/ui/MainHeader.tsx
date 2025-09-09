import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/shared/context/AuthContext";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { ThemeToggle, LanguageSwitcher } from "@/shared/ui";
import { deleteUser } from "../api/http";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  SportsCricket as GameIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";

// Separated style objects for clean mobile optimization
const desktopHeaderStyles = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 0",
    minHeight: "80px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
};

const mobileHeaderStyles = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    minHeight: "56px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    flex: 1, // Allow logo to take available space
    justifyContent: "flex-start", // Explicit start alignment
  },
};

import { MobileUserMenu } from "./MobileUserMenu";
import { DesktopUserMenu } from "./DesktopUserMenu";

export const MainHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileHeaderStyles : desktopHeaderStyles;

  const handleLogout = async () => {
    if (user?.id) {
      const response = await deleteUser(user?.id);
      if (response.status === 204) {
        logout();
      }
    }
  };

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={styles.toolbar}>
          <Box sx={styles.logo}>
            <IconButton
              size={isMobile ? "medium" : "large"}
              edge="start"
              sx={{
                background:
                  "linear-gradient(135deg, var(--primary-500), var(--primary-600))",
                color: "white",
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                marginLeft: isMobile ? 1 : 0,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, var(--primary-600), var(--primary-700))",
                },
              }}
            >
              <GameIcon fontSize={isMobile ? "medium" : "large"} />
            </IconButton>
            {!isMobile && (
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                  }}
                >
                  {t("app.title")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-muted)",
                  }}
                >
                  {t("app.subtitle")}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={styles.rightSection}>
            {!isMobile && <ThemeToggle />}
            {!isMobile && <LanguageSwitcher />}
            
            {isAuthenticated && user && (
              isMobile ? (
                <MobileUserMenu user={user} onLogout={handleLogout} t={t} />
              ) : (
                <DesktopUserMenu user={user} onLogout={handleLogout} t={t} />
              )
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
