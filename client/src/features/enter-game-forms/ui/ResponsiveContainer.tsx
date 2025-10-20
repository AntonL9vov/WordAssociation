import React from "react";
import { Box } from "@mui/material";

const desktopContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100% - 200px)",
};

const mobileContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  overflow: "hidden",
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  isMobile: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  isMobile,
}) => (
  <Box sx={isMobile ? mobileContainerStyles : desktopContainerStyles}>
    {children}
  </Box>
);
