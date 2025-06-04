
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="main-layout">
    <header>Game Header</header>
    <main>{children}</main>
    <footer>Game Footer</footer>
  </div>
);
