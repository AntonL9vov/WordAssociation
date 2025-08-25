import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export interface TextProps extends Omit<TypographyProps, 'color'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'subtitle1' | 'subtitle2';
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'success' | 'error' | 'warning' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  gradient?: boolean;
}

const colorMap = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
  inverse: 'var(--text-inverse)',
  success: 'var(--success-600)',
  error: 'var(--error-600)',
  warning: 'var(--warning-600)',
  info: 'var(--info-600)',
};

const weightMap = {
  light: 'var(--font-weight-light)',
  normal: 'var(--font-weight-normal)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  weight,
  align,
  truncate = false,
  gradient = false,
  sx = {},
  ...props
}) => {
  const gradientStyles = gradient ? {
    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } : {};

  return (
    <Typography
      variant={variant}
      sx={{
        color: gradient ? 'transparent' : colorMap[color],
        fontWeight: weight ? weightMap[weight] : undefined,
        textAlign: align,
        ...(truncate && {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }),
        ...gradientStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

