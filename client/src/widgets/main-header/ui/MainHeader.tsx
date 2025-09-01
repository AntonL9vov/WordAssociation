import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/shared/context/AuthContext";
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
} from "@mui/material";
import {
  SportsCricket as GameIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

export const MainHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

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
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: { xs: "0.5rem 0", sm: "1rem 0" },
            minHeight: { xs: "64px", sm: "80px" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              size="large"
              edge="start"
              sx={{
                background:
                  "linear-gradient(135deg, var(--primary-500), var(--primary-600))",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, var(--primary-600), var(--primary-700))",
                },
              }}
            >
              <GameIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                {t("app.title")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-muted)",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {t("app.subtitle")}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isAuthenticated && user && (
              <>
                <Chip
                  icon={<PersonIcon />}
                  label={user.name}
                  variant="filled"
                  color="success"
                />
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  color="error"
                >
                  {t("common.logout")}
                </Button>
              </>
            )}
            <LanguageSwitcher size="small" />
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
