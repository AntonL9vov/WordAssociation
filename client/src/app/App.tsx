import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { ThemeProvider } from "@/shared";
import "@shared/styles/global.css";

export const App = () => {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
};
