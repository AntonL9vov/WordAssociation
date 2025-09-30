import React from "react";
import { MainHeader } from "@/widgets";
import { MainFooter } from "@/widgets";
import { useBreakpoints } from "@/shared/hooks/useBreakpoints";
import { Box, Container } from "@mui/material";

//TODO: Протестить просто height без min и max

const desktopLayoutStyles = {
  container: { py: 3 },
  main: { minHeight: "100vh", maxHeight: "100vh" },
};

const mobileLayoutStyles = {
  container: { py: 1 },
  main: { minHeight: "100dvh", maxHeight: "100dvh" },
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
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
      <MainHeader />
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
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            ...styles.container,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {children}
        </Container>
      </Box>
      <MainFooter />
    </Box>
  );
};
