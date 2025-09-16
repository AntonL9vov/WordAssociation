import React from "react";
import { Chip, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import { Person as PersonIcon, Logout as LogoutIcon, MoreVert as MoreIcon } from "@mui/icons-material";
import { ThemeToggle, LanguageSwitcher } from "@/shared/ui";

interface MobileUserMenuProps {
  user: { id: string; name: string };
  onLogout: () => void;
  t: (key: string) => string;
}

export const MobileUserMenu: React.FC<MobileUserMenuProps> = ({ user, onLogout, t }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ pointerEvents: 'none' }}>
          <Chip
            icon={<PersonIcon />}
            label={user.name}
            variant="filled"
            color="success"
            size="small"
          />
        </MenuItem>
        <Divider />
        <MenuItem sx={{ justifyContent: 'space-between', alignItems: 'center', minHeight: 48 }}>
          <span style={{ marginRight: '16px', flexShrink: 0 }}>{t("common.theme")}</span>
          <ThemeToggle />
        </MenuItem>
        <MenuItem sx={{ justifyContent: 'space-between', alignItems: 'center', minHeight: 48 }}>
          <span style={{ marginRight: '16px', flexShrink: 0 }}>{t("common.language")}</span>
          <LanguageSwitcher />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 1 }} />
          {t("common.logout")}
        </MenuItem>
      </Menu>
    </>
  );
};