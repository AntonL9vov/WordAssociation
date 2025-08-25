import React from 'react';
import { Card, Text, Button } from '@/shared/ui';
import { Box } from '@mui/material';

export interface GameActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  colorScheme: 'primary' | 'secondary';
  onClick: () => void;
}

export const GameActionCard: React.FC<GameActionCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  colorScheme,
  onClick,
}) => {
  const getColorScheme = () => {
    switch (colorScheme) {
      case 'primary':
        return {
          topBorder: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
          iconBg: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
          iconColor: 'var(--primary-600)',
          buttonBg: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
          hoverShadow: 'rgba(14, 165, 233, 0.15)',
        };
      case 'secondary':
        return {
          topBorder: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
          iconBg: 'linear-gradient(135deg, var(--accent-100), var(--accent-200))',
          iconColor: 'var(--accent-600)',
          buttonBg: 'linear-gradient(135deg, var(--accent-500), var(--accent-600))',
          hoverShadow: 'rgba(34, 197, 94, 0.15)',
        };
    }
  };

  const colors = getColorScheme();

  return (
    <Card
      variant="elevated"
      clickable
      hover
      sx={{
        flex: 1,
        maxWidth: { xs: '100%', md: 280 },
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${colors.hoverShadow}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: colors.topBorder,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: colors.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            '& svg': {
              fontSize: 36,
              color: colors.iconColor,
            },
          }}
        >
          {icon}
        </Box>
        
        <Text
          variant="h5"
          weight="bold"
          sx={{ mb: 2 }}
        >
          {title}
        </Text>
        
        <Text
          variant="body2"
          color="secondary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Text>
        
        <Button
          variant="contained"
          startIcon={icon}
          sx={{
            background: colors.buttonBg,
            fontWeight: 'bold',
            py: 1,
            px: 3,
            '&:hover': {
              background: colors.buttonBg,
              filter: 'brightness(1.1)',
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
};

