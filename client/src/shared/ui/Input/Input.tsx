import React, { forwardRef } from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  startIcon,
  endIcon,
  sx = {},
  InputProps,
  ...props
}, ref) => {
  const inputProps = {
    ...InputProps,
    startAdornment: startIcon ? (
      <InputAdornment position="start">
        {startIcon}
      </InputAdornment>
    ) : InputProps?.startAdornment,
    endAdornment: endIcon ? (
      <InputAdornment position="end">
        {endIcon}
      </InputAdornment>
    ) : InputProps?.endAdornment,
  };

  return (
    <TextField
      ref={ref}
      variant="outlined"
      InputProps={inputProps}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-primary)',
          transition: 'all var(--transition-normal)',
          '& fieldset': {
            borderColor: 'var(--border-primary)',
            borderWidth: '2px',
          },
          '&:hover fieldset': {
            borderColor: 'var(--border-secondary)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--primary-500)',
            boxShadow: '0 0 0 3px var(--primary-100)',
          },
          '&.Mui-error fieldset': {
            borderColor: 'var(--error-500)',
            boxShadow: '0 0 0 3px var(--error-100)',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--text-secondary)',
          fontWeight: 'var(--font-weight-medium)',
          '&.Mui-focused': {
            color: 'var(--primary-600)',
          },
          '&.Mui-error': {
            color: 'var(--error-600)',
          },
        },
        '& .MuiOutlinedInput-input': {
          color: 'var(--text-primary)',
          padding: 'var(--space-md)',
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          marginTop: 'var(--space-xs)',
          '&.Mui-error': {
            color: 'var(--error-600)',
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

