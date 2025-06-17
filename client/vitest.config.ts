import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "src/__tests__/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/"],
    },
    outputFile: {
      json: "test-results/unit/json/vitest.json",
      html: "test-results/unit/html/vitest.html",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
