import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { routesConfig, RouteConfig } from "./config";
import { MainLayout, AuthLayout } from "../layouts";
const NotFoundPage = () => <div>404 - Page Not Found</div>;

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
  return routes.map((route) => {
    // Get the appropriate component based on the path
    console.log(
      route.path,
      route.path.includes("*") ? NotFoundPage : route.element
    );

    const PageComponent = route.path.includes("*")
      ? NotFoundPage
      : route.element;

    // Get the appropriate layout
    const LayoutComponent = route.meta?.layout
      ? getLayout(route.meta.layout)
      : ({ children }: { children: React.ReactNode }) => <>{children}</>;

    // Check if the route requires authentication
    const requiresAuth = route.meta?.auth;

    // Placeholder for authentication check
    const isAuthenticated = false; // This will be replaced with actual auth check

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          requiresAuth && !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <LayoutComponent>
              {typeof PageComponent === "function" ? (
                <PageComponent />
              ) : (
                PageComponent
              )}
            </LayoutComponent>
          )
        }
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
};

export const AppRouter = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);
  return <Routes>{renderRoutes(routesConfig)}</Routes>;
};
