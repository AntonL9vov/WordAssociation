import { MainLayout, AuthLayout } from "@/app/layouts";
import { Layout } from "../config";

export const getLayout = (layoutName?: Layout) => {
  switch (layoutName) {
    case "main":
      return MainLayout;
    case "auth":
      return AuthLayout;
    default:
      return MainLayout;
  }
};
