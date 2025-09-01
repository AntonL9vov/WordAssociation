import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routesConfig, RouteConfig } from "./config";
import { MainLayout, AuthLayout } from "../layouts";
import { useAuth } from "@/shared/context/AuthContext";

// Function to get the appropriate layout component
const getLayout = (layoutName: string | undefined) => {
  switch (layoutName) {
    case "main":
      return MainLayout;
    case "auth":
      return AuthLayout;
    default:
      return MainLayout;
  }
};

// Recursive function to render routes from configuration
const renderRoutes = (routes: RouteConfig[]) => {
  const { isAuthenticated } = useAuth();

  return routes.map((route) => {
    const PageComponent = route.element;
    const LayoutComponent = route.meta?.layout
      ? getLayout(route.meta.layout)
      : ({ children }: { children: React.ReactNode }) => <>{children}</>;

    const requiresAuth = route.meta?.auth;
    const isAuthPage = route.path === "/login";

    const routeElement = <LayoutComponent>{PageComponent}</LayoutComponent>;

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          requiresAuth && !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAuthPage && isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            routeElement
          )
        }
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
};

export const AppRouter = () => {
  return <Routes>{renderRoutes(routesConfig)}</Routes>;
};
