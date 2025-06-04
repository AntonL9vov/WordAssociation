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
    element: null, // Will be replaced with Layout component
    children: [
      {
        path: "/home",
        element: <HomePage />, // Will be replaced with HomePage component
        meta: {
          title: "Home",
          layout: "main",
        },
      },
      {
        path: "game",
        element: null, // Will be replaced with GamePage component
        meta: {
          title: "Game",
          layout: "main",
          auth: true,
        },
      },
      {
        path: "login",
        element: null, // Will be replaced with LoginPage component
        meta: {
          title: "Login",
          layout: "auth",
        },
      },
      {
        path: "*",
        element: <NotFoundPage />, // Will be replaced with NotFoundPage component
        meta: {
          title: "Not Found",
          layout: "main",
        },
      },
    ],
  },
];
