import { Theme } from "@emotion/react";
import { createTheme } from "@mui/material";
import { darkColors, lightColors } from "./colors";

export const createMuiTheme = (isDark: boolean): Theme => {
  const colors = isDark ? darkColors : lightColors;

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      ...colors,
    },
    typography: {
      fontFamily: "var(--font-family-sans)",
      h1: {
        fontSize: "var(--font-size-4xl)",
        fontWeight: "var(--font-weight-bold)",
        lineHeight: "var(--line-height-tight)",
        color: "var(--text-primary)",
      },
      h2: {
        fontSize: "var(--font-size-3xl)",
        fontWeight: "var(--font-weight-semibold)",
        lineHeight: "var(--line-height-tight)",
        color: "var(--text-primary)",
      },
      h3: {
        fontSize: "var(--font-size-2xl)",
        fontWeight: "var(--font-weight-semibold)",
        lineHeight: "var(--line-height-normal)",
        color: "var(--text-primary)",
      },
      h4: {
        fontSize: "var(--font-size-xl)",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: "var(--line-height-normal)",
        color: "var(--text-primary)",
      },
      h5: {
        fontSize: "var(--font-size-lg)",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: "var(--line-height-normal)",
        color: "var(--text-primary)",
      },
      h6: {
        fontSize: "var(--font-size-base)",
        fontWeight: "var(--font-weight-medium)",
        lineHeight: "var(--line-height-normal)",
        color: "var(--text-primary)",
      },
      body1: {
        fontSize: "var(--font-size-base)",
        fontWeight: "var(--font-weight-normal)",
        lineHeight: "var(--line-height-normal)",
        color: "var(--text-secondary)",
      },
      body2: {
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-normal)",
        lineHeight: "var(--line-height-normal)",
        color: "var(--text-secondary)",
      },
      button: {
        fontSize: "var(--font-size-base)",
        fontWeight: "var(--font-weight-medium)",
        textTransform: "none",
      },
      caption: {
        fontSize: "var(--font-size-xs)",
        fontWeight: "var(--font-weight-normal)",
        lineHeight: "var(--line-height-normal)",
        color: "var(--text-muted)",
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
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-sm) var(--space-lg)",
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-medium)",
            textTransform: "none",
            boxShadow: "none",
            transition: "all var(--transition-normal)",
            "&:hover": {
              boxShadow: "var(--shadow-md)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "var(--shadow-sm)",
            },
            color: "#f8fafc",
          },
          containedPrimary: {
            background:
              "linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)",
            "&:hover": {
              background:
                "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)",
              color: "var(--text-primary)",
            },
          },
          outlined: {
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
            "&:hover": {
              borderColor: "var(--border-secondary)",
              backgroundColor: "var(--bg-tertiary)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--bg-primary)",
              transition: "all var(--transition-normal)",
              "& fieldset": {
                borderColor: "var(--border-primary)",
                borderWidth: "2px",
              },
              "&:hover fieldset": {
                borderColor: "var(--border-secondary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary-500)",
                boxShadow: "0 0 0 3px var(--primary-100)",
              },
            },
            "& .MuiInputLabel-root": {
              color: "var(--text-secondary)",
              fontWeight: "var(--font-weight-medium)",
              backgroundColor: "var(--bg-primary)",
              paddingLeft: "var(--space-xs)",
              paddingRight: "var(--space-xs)",
              "&.Mui-focused": {
                color: "var(--primary-600)",
                backgroundColor: "var(--bg-primary)",
              },
              "&.MuiInputLabel-shrink": {
                backgroundColor: "var(--bg-primary)",
                paddingLeft: "var(--space-xs)",
                paddingRight: "var(--space-xs)",
              },
            },
            "& .MuiOutlinedInput-input": {
              color: "var(--text-primary)",
              padding: "var(--space-md)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--bg-elevated)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-primary)",
            transition: "all var(--transition-normal)",
            "&:hover": {
              boxShadow: "var(--shadow-xl)",
              transform: "translateY(-2px)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--bg-elevated)",
            backgroundImage: "none",
          },
          elevation1: {
            boxShadow: "var(--shadow-sm)",
          },
          elevation2: {
            boxShadow: "var(--shadow-md)",
          },
          elevation3: {
            boxShadow: "var(--shadow-lg)",
          },
          elevation4: {
            boxShadow: "var(--shadow-xl)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "var(--radius-full)",
            fontWeight: "var(--font-weight-medium)",
            fontSize: "var(--font-size-sm)",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: "var(--radius-lg)",
            transition: "all var(--transition-normal)",
            "&:hover": {
              backgroundColor: "var(--bg-tertiary)",
              transform: "scale(1.05)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-sm)",
            borderBottom: "1px solid var(--border-primary)",
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: "1200px",
            padding: "0 var(--space-lg)",
            "@media (max-width: 768px)": {
              padding: "0 var(--space-sm)",
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: "var(--border-primary)",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: "var(--radius-lg)",
            fontWeight: "var(--font-weight-medium)",
          },
          standardSuccess: {
            backgroundColor: "var(--success-50)",
            color: "var(--success-700)",
            border: "1px solid var(--success-200)",
          },
          standardError: {
            backgroundColor: "var(--error-50)",
            color: "var(--error-700)",
            border: "1px solid var(--error-200)",
          },
          standardWarning: {
            backgroundColor: "var(--warning-50)",
            color: "var(--warning-700)",
            border: "1px solid var(--warning-200)",
          },
          standardInfo: {
            backgroundColor: "var(--info-50)",
            color: "var(--info-700)",
            border: "1px solid var(--info-200)",
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
