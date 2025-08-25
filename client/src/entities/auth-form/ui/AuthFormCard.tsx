import React from 'react';
import { Card, Container } from '@/shared/ui';
import { Box, Fade } from '@mui/material';
import {
  SportsCricket as GameIcon,
} from '@mui/icons-material';

interface AuthFormCardProps {
  children: React.ReactNode;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 50%, var(--accent-50) 100%)',
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
          background: 'radial-gradient(circle at 30% 40%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Card
            variant="elevated"
            radius="xl"
            padding="none"
            sx={{
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
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
                boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)',
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

