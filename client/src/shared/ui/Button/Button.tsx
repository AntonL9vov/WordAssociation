import { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  gradient?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  loading = false,
  disabled,
  gradient = false,
  sx = {},
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const gradientStyles = gradient ? {
    background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
    '&:hover': {
      background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
    },
    '&:disabled': {
      background: 'var(--neutral-300)',
    },
  } : {};

  return (
    <MuiButton
      ref={ref}
      disabled={isDisabled}
      sx={{
        borderRadius: 'var(--radius-lg)',
        fontWeight: 'var(--font-weight-medium)',
        textTransform: 'none',
        transition: 'all var(--transition-normal)',
        minHeight: '44px',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: 'var(--shadow-md)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:disabled': {
          transform: 'none',
        },
        ...gradientStyles,
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          {children}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
});

Button.displayName = 'Button';
