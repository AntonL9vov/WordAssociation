import React from "react";
import { Button, Chip } from "@mui/material";
import { Person as PersonIcon, Logout as LogoutIcon } from "@mui/icons-material";

interface DesktopUserMenuProps {
  user: { id: string; name: string };
  onLogout: () => void;
  t: (key: string) => string;
}

export const DesktopUserMenu: React.FC<DesktopUserMenuProps> = ({ user, onLogout, t }) => (
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
      onClick={onLogout}
      color="error"
    >
      {t("common.logout")}
    </Button>
  </>
);