import { MainHeader } from "@/widgets/main-header/ui/MainHeader";
import { MainFooter } from "@widgets/main-footer";
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
