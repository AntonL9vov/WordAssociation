import React from 'react';
import { Box, BoxProps } from '@mui/material';

export interface ContainerProps extends Omit<BoxProps, 'maxWidth'> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  center?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const maxWidthMap = {
  xs: '480px',
  sm: '640px', 
  md: '768px',
  lg: '1024px',
  xl: '1200px',
};

const paddingMap = {
  none: 0,
  small: 'var(--space-sm)',
  medium: 'var(--space-md)',
  large: 'var(--space-lg)',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  children,
  maxWidth = 'lg',
  center = true,
  padding = 'medium',
  sx = {},
  ...props
}, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: maxWidth ? maxWidthMap[maxWidth] : 'none',
        margin: center ? '0 auto' : '0',
        padding: paddingMap[padding],
        '@media (max-width: 768px)': {
          padding: padding !== 'none' ? 'var(--space-sm)' : 0,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

