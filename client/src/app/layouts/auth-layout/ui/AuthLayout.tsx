import React from "react";
import { Box, Container } from "@mui/material";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";

const desktopLayoutStyles = {
  main: { minHeight: "100vh", maxHeight: "100vh" },
};

const mobileLayoutStyles = {
  main: { minHeight: "100dvh", maxHeight: "100dvh" },
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isMobile } = useBreakpoints();
  const styles = isMobile ? mobileLayoutStyles : desktopLayoutStyles;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ...styles.main,
        backgroundColor: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--bg-secondary)",
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Container
          disableGutters
          maxWidth={false}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            maxWidth: "100%",
            padding: 0,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
