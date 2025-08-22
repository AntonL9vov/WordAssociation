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
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <MainHeader />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-secondary)',
          minHeight: 0,
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            flex: 1,
            py: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Container>
      </Box>
      <MainFooter />
    </Box>
  );
};
