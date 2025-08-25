import React from 'react';
import { Paper, PaperProps, Box } from '@mui/material';

export interface CardProps extends Omit<PaperProps, 'elevation'> {
  cardVariant?: 'outlined' | 'filled' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  clickable?: boolean;
  radius?: 'small' | 'medium' | 'large' | 'xl';
}

const paddingMap = {
  none: 0,
  small: 'var(--space-sm)',
  medium: 'var(--space-md)',
  large: 'var(--space-lg)',
};

const radiusMap = {
  small: 'var(--radius-sm)',
  medium: 'var(--radius-md)',
  large: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  cardVariant = 'elevated',
  padding = 'medium',
  hover = false,
  clickable = false,
  radius = 'large',
  sx = {},
  ...props
}, ref) => {
  const getVariantStyles = () => {
    switch (cardVariant) {
      case 'outlined':
        return {
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-elevated)',
          boxShadow: 'none',
        };
      case 'filled':
        return {
          backgroundColor: 'var(--bg-elevated)',
          boxShadow: 'none',
        };
      case 'elevated':
      default:
        return {
          backgroundColor: 'var(--bg-elevated)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-primary)',
        };
    }
  };

  const hoverStyles = hover || clickable ? {
    transition: 'all var(--transition-normal)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-xl)',
    },
  } : {};

  const clickableStyles = clickable ? {
    cursor: 'pointer',
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: 'var(--shadow-md)',
    },
  } : {};

  return (
    <Paper
      ref={ref}
      elevation={0}
      sx={{
        borderRadius: radiusMap[radius],
        overflow: 'hidden',
        ...getVariantStyles(),
        ...hoverStyles,
        ...clickableStyles,
        ...sx,
      }}
      {...props}
    >
      {padding !== 'none' ? (
        <Box sx={{ p: paddingMap[padding] }}>
          {children}
        </Box>
      ) : (
        children
      )}
    </Paper>
  );
});

