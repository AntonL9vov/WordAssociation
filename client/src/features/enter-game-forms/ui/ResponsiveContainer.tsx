import React from "react";
import { Box } from "@mui/material";

const desktopContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100% - 200px)",
  py: 4,
};

const mobileContainerStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: "calc(100vh - 120px)", // Reduced from 100% to fit on screen
  py: 1, // Reduced padding
  px: 1,
  overflow: "hidden", // Prevent overflow
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  isMobile: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  isMobile 
}) => (
  <Box sx={isMobile ? mobileContainerStyles : desktopContainerStyles}>
    {children}
  </Box>
);