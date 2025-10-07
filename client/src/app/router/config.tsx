import { ReactNode } from "react";
import { GamePage, HomePage, AuthPage, NotFoundPage } from "@/pages";

export type Layout = "main" | "auth";
export interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
  meta?: {
    auth?: boolean;
    title?: string;
    layout?: Layout;
    [key: string]: any;
  };
}

export const routesConfig: RouteConfig[] = [
  {
    path: "/",
    element: <HomePage />,
    meta: {
      title: "Home",
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/game",
    element: <GamePage />,
    meta: {
      title: "Game",
      layout: "main",
      auth: true,
    },
  },
  {
    path: "/login",
    element: <AuthPage />,
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