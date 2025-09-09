import React from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Text } from "@/shared/ui";

interface MobileHeaderProps {
  title: string;
  onBack: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, onBack }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <IconButton
      onClick={onBack}
      sx={{
        mr: 2,
        backgroundColor: "var(--bg-tertiary)",
        "&:hover": {
          backgroundColor: "var(--bg-secondary)",
        },
      }}
    >
      <ArrowBackIcon />
    </IconButton>
    <Text variant="h5" weight="bold">
      {title}
    </Text>
  </Box>
);