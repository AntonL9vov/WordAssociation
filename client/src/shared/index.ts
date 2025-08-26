// Shared layer
// This layer is responsible for reusable code shared across the entire application
// Contains UI components, utils, API clients, constants, and other infrastructure code

export { ThemeProvider, useTheme } from "./context/ThemeContext";
export { ThemeToggle } from "./ui/ThemeToggle";

// Hooks
export * from "./hooks";

// UI & Animations
export * from "./ui";

// Types
export * from "./lib/types";

export {};
