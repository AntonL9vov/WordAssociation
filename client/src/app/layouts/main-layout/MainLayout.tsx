import { MainFooter } from "@widgets/main-footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="main-layout">
    <header>Game Header</header>
    <main>{children}</main>
    <MainFooter />
  </div>
);
