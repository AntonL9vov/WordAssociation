import { useEffect, useState } from "react";
import { createMuiTheme } from "./config";

export const useMuiTheme = () => {
  const [theme, setTheme] = useState(createMuiTheme(false));

  useEffect(() => {
    const observer = new MutationObserver(([e]) => {
      const isDark = (e.target as HTMLElement).dataset.theme === "dark";

      setTheme(createMuiTheme(isDark));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};
