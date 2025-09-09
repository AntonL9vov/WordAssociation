import React from "react";
import { MainHeader } from "@/widgets";
import { MainFooter } from "@/widgets";
import { Box, Container } from "@mui/material";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        maxHeight: "100vh",
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
            py: 3,
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
