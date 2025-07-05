import { ThemeToggle } from "@/shared";
import "./style.css";

export const MainHeader = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-title">Multiplayer Game</div>
        <ThemeToggle />
      </div>
    </header>
  );
};
