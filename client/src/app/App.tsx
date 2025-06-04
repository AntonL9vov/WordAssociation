import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import "@shared/styles/global.css";

export const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </React.StrictMode>
  );
};
