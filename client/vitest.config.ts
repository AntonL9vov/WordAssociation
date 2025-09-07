import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/__tests__/setup.ts"],
    include: [
      "src/__tests__/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "src/__tests__/integration/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    coverage: {
      reporter: ["text", "json", "json-summary", "json", "html"],
      exclude: [
        "node_modules/",
        "src/__tests__/**",
        "src/**/*.test.*",
        "src/**/*.spec.*",
      ],
      reportOnFailure: true,
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    outputFile: {
      json: "test-results/unit/json/vitest.json",
      html: "test-results/unit/html/vitest.html",
    },    // Reduce file handle issues
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 2,
        minThreads: 1
      }
    },
    // Force cleanup between tests
    clearMocks: true,
    restoreMocks: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/test-utils": path.resolve(__dirname, "./src/__tests__/utils/test-utils"),
    },
  },
});
