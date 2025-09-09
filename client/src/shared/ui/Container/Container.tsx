import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { useBreakpoints } from '@/shared/hooks/useBreakpoints';

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

const desktopPaddingMap = {
  none: 0,
  small: 'var(--space-sm)',
  medium: 'var(--space-md)',
  large: 'var(--space-lg)',
};

const mobilePaddingMap = {
  none: 0,
  small: 'var(--space-xs)',
  medium: 'var(--space-sm)', 
  large: 'var(--space-md)',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  children,
  maxWidth = 'lg',
  center = true,
  padding = 'medium',
  sx = {},
  ...props
}, ref) => {
  const { isMobile } = useBreakpoints();
  const paddingMap = isMobile ? mobilePaddingMap : desktopPaddingMap;

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        maxWidth: maxWidth ? maxWidthMap[maxWidth] : 'none',
        margin: center ? '0 auto' : '0',
        padding: paddingMap[padding],
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

