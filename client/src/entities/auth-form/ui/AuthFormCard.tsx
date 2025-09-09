import React from 'react';
import { Card, Container } from '@/shared/ui';
import { Box, Fade, useTheme } from '@mui/material';
import {
  SportsCricket as GameIcon,
} from '@mui/icons-material';

interface AuthFormCardProps {
  children: React.ReactNode;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({ children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)'
          : 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 50%, var(--accent-50) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'radial-gradient(circle at 30% 40%, var(--primary-600) 0%, transparent 70%), radial-gradient(circle at 70% 80%, var(--accent-600) 0%, transparent 70%)'
            : 'radial-gradient(circle at 30% 40%, var(--primary-200) 0%, transparent 70%), radial-gradient(circle at 70% 80%, var(--accent-200) 0%, transparent 70%)',
          opacity: isDark ? 0.03 : 0.1,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card
            variant="elevation"
            radius="xl"
            padding="none"
            sx={{
              backdropFilter: 'blur(20px)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'visible',
              position: 'relative',
            }}
          >
            {/* Декоративный элемент */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDark 
                  ? '0 10px 25px rgba(14, 165, 233, 0.1)' 
                  : '0 10px 25px rgba(14, 165, 233, 0.3)',
              }}
            >
              <GameIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>

            <Box sx={{ pt: 6, pb: 4, px: 4 }}>
              {children}
            </Box>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

