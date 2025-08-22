import { createTheme, Theme } from '@mui/material/styles';

// Функция для получения CSS переменной
const getCSSVariable = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  }
  return '';
};

// Цвета для светлой темы
const lightColors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    main: '#0284c7',
    light: '#38bdf8',
    dark: '#075985',
    contrastText: '#ffffff',
  },
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    main: '#eab308',
    light: '#fde047',
    dark: '#a16207',
    contrastText: '#1e293b',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    main: '#ef4444',
    light: '#fee2e2',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    main: '#f59e0b',
    light: '#fef3c7',
    dark: '#b45309',
    contrastText: '#1e293b',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    main: '#3b82f6',
    light: '#dbeafe',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    main: '#22c55e',
    light: '#dcfce7',
    dark: '#15803d',
    contrastText: '#ffffff',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
  divider: '#e2e8f0',
  action: {
    hover: '#f1f5f9',
    selected: '#e0f2fe',
    disabled: '#94a3b8',
    disabledBackground: '#f8fafc',
  },
};

// Цвета для темной темы
const darkColors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    main: '#38bdf8',
    light: '#7dd3fc',
    dark: '#0284c7',
    contrastText: '#0f172a',
  },
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    main: '#facc15',
    light: '#fde047',
    dark: '#ca8a04',
    contrastText: '#0f172a',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#f87171',
    600: '#ef4444',
    700: '#dc2626',
    main: '#f87171',
    light: '#fee2e2',
    dark: '#dc2626',
    contrastText: '#0f172a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#fbbf24',
    600: '#f59e0b',
    700: '#d97706',
    main: '#fbbf24',
    light: '#fef3c7',
    dark: '#d97706',
    contrastText: '#0f172a',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#60a5fa',
    600: '#3b82f6',
    700: '#2563eb',
    main: '#60a5fa',
    light: '#dbeafe',
    dark: '#2563eb',
    contrastText: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#4ade80',
    600: '#22c55e',
    700: '#16a34a',
    main: '#4ade80',
    light: '#dcfce7',
    dark: '#16a34a',
    contrastText: '#0f172a',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    disabled: '#64748b',
  },
  divider: '#334155',
  action: {
    hover: '#334155',
    selected: '#1e293b',
    disabled: '#64748b',
    disabledBackground: '#1e293b',
  },
};

// Создание темы MUI с правильными цветами
export const createMuiTheme = (): Theme => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      ...colors,
    },
    typography: {
      fontFamily: 'var(--font-family-sans)',
      h1: {
        fontSize: 'var(--font-size-4xl)',
        fontWeight: 'var(--font-weight-bold)',
        lineHeight: 'var(--line-height-tight)',
        color: 'var(--text-primary)',
      },
      h2: {
        fontSize: 'var(--font-size-3xl)',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: 'var(--line-height-tight)',
        color: 'var(--text-primary)',
      },
      h3: {
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: 'var(--line-height-normal)',
        color: 'var(--text-primary)',
      },
      h4: {
        fontSize: 'var(--font-size-xl)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 'var(--line-height-normal)',
        color: 'var(--text-primary)',
      },
      h5: {
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 'var(--line-height-normal)',
        color: 'var(--text-primary)',
      },
      h6: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 'var(--line-height-normal)',
        color: 'var(--text-primary)',
      },
      body1: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-normal)',
        lineHeight: 'var(--line-height-normal)',
        color: 'var(--text-secondary)',
      },
      body2: {
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-normal)',
        lineHeight: 'var(--line-height-normal)',
        color: 'var(--text-secondary)',
      },
      button: {
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-medium)',
        textTransform: 'none',
      },
      caption: {
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-normal)',
        lineHeight: 'var(--line-height-normal)',
        color: 'var(--text-muted)',
      },
    },
    spacing: 8, // базовый множитель для spacing
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-sm) var(--space-lg)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            textTransform: 'none',
            boxShadow: 'none',
            transition: 'all var(--transition-normal)',
            '&:hover': {
              boxShadow: 'var(--shadow-md)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'var(--shadow-sm)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
            color: 'var(--text-inverse)',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
            },
          },
          outlined: {
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)',
            '&:hover': {
              borderColor: 'var(--border-secondary)',
              backgroundColor: 'var(--bg-tertiary)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
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
            },
            '& .MuiInputLabel-root': {
              color: 'var(--text-secondary)',
              fontWeight: 'var(--font-weight-medium)',
              '&.Mui-focused': {
                color: 'var(--primary-600)',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'var(--text-primary)',
              padding: 'var(--space-md)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-primary)',
            transition: 'all var(--transition-normal)',
            '&:hover': {
              boxShadow: 'var(--shadow-xl)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--bg-elevated)',
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: 'var(--shadow-sm)',
          },
          elevation2: {
            boxShadow: 'var(--shadow-md)',
          },
          elevation3: {
            boxShadow: 'var(--shadow-lg)',
          },
          elevation4: {
            boxShadow: 'var(--shadow-xl)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--radius-full)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--font-size-sm)',
          },
          filled: {
            backgroundColor: 'var(--accent-100)',
            color: 'var(--accent-700)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--radius-lg)',
            transition: 'all var(--transition-normal)',
            '&:hover': {
              backgroundColor: 'var(--bg-tertiary)',
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
            borderBottom: '1px solid var(--border-primary)',
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: '1200px',
            padding: '0 var(--space-lg)',
            '@media (max-width: 768px)': {
              padding: '0 var(--space-sm)',
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: 'var(--border-primary)',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--radius-lg)',
            fontWeight: 'var(--font-weight-medium)',
          },
          standardSuccess: {
            backgroundColor: 'var(--success-50)',
            color: 'var(--success-700)',
            border: '1px solid var(--success-200)',
          },
          standardError: {
            backgroundColor: 'var(--error-50)',
            color: 'var(--error-700)',
            border: '1px solid var(--error-200)',
          },
          standardWarning: {
            backgroundColor: 'var(--warning-50)',
            color: 'var(--warning-700)',
            border: '1px solid var(--warning-200)',
          },
          standardInfo: {
            backgroundColor: 'var(--info-50)',
            color: 'var(--info-700)',
            border: '1px solid var(--info-200)',
          },
        },
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  });
};

// Хук для обновления темы при смене режима
export const useMuiTheme = () => {
  const [theme, setTheme] = React.useState(createMuiTheme());
  
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(createMuiTheme());
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    
    return () => observer.disconnect();
  }, []);
  
  return theme;
};

import React from 'react';
