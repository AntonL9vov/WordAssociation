import { ReactNode } from "react";
import { HomePage } from "../../pages";
import { NotFoundPage } from "../../pages/not-found";

// Define the route configuration interface
export interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
  meta?: {
    auth?: boolean;
    title?: string;
    layout?: string;
    [key: string]: any;
  };
}

// Define the routes configuration
export const routesConfig: RouteConfig[] = [
  {
    path: "/",
    element: <HomePage />,
    meta: {
      title: "Home",
      layout: "main",
    },
  },
  {
    path: "/game",
    element: null,
    meta: {
      title: "Game",
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/login",
    element: null,
    meta: {
      title: "Login",
      layout: "auth",
    },
  },
  {
    path: "*",
    element: <NotFoundPage />,
    meta: {
      title: "Not Found",
      layout: "main",
    },
  },
];