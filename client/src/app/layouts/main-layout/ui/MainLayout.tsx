import { MainHeader } from "@/widgets";
import { MainFooter } from "@/widgets";
import "./style.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="main-layout">
    <MainHeader />
    <main className="main-content">{children}</main>
    <MainFooter />
  </div>
);
