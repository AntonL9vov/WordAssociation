import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export interface IconProps extends Omit<SvgIconProps, 'color'> {
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'inherit';
}

const sizeMap = {
  small: '16px',
  medium: '20px', 
  large: '24px',
  xl: '32px',
};

const colorMap = {
  primary: 'var(--primary-600)',
  secondary: 'var(--secondary-600)',
  success: 'var(--success-600)',
  error: 'var(--error-600)',
  warning: 'var(--warning-600)',
  info: 'var(--info-600)',
  muted: 'var(--text-muted)',
  inherit: 'inherit',
};

export const Icon: React.FC<IconProps> = ({
  children,
  size = 'medium',
  color = 'inherit',
  sx = {},
  ...props
}) => {
  return (
    <SvgIcon
      sx={{
        fontSize: sizeMap[size],
        color: colorMap[color],
        ...sx,
      }}
      {...props}
    >
      {children}
    </SvgIcon>
  );
};

