import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ThemeProvider } from "@/shared/context/ThemeContext";
import { MuiThemeProvider } from "@/shared/ui";
import "@shared/styles/global.css";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MuiThemeProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
