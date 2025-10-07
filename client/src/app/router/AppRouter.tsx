import { Routes, Route, Navigate } from "react-router-dom";
import { routesConfig, RouteConfig } from "./config";
import { getLayout } from "./utils/getLayout";
import { useAuth } from "@/shared/context/AuthContext";

const renderRoutes = (routes: RouteConfig[]) => {
  const { isAuthenticated } = useAuth();

  return routes.map((route) => {
    const PageComponent = route.element;

    const LayoutComponent = getLayout(route.meta?.layout);

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
