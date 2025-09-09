import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useMuiTheme } from './muiTheme';

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export const MuiThemeProvider: React.FC<MuiThemeProviderProps> = ({ children }) => {
  const theme = useMuiTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
