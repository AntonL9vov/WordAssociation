// Shared layer
// This layer is responsible for reusable code shared across the entire application
// Contains UI components, utils, API clients, constants, and other infrastructure code

export { ThemeProvider, useTheme } from "./context/ThemeContext";
export { AuthProvider, useAuth } from "./context/AuthContext";
export { ThemeToggle } from "./ui/ThemeToggle";
export { Feature } from "./ui/Feature";
export { Logo } from "./ui/Logo";
export { Card } from "./ui/Card";
export { Container } from "./ui/Container";
export { Text } from "./ui/Text";

// API
export { api } from "./api/api";

// Hooks
export * from "./hooks";

// UI & Animations
export * from "./ui";

// Types
export * from "./lib/types";

// Schemas
export * from "./schemas/game";