import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit tests only. The e2e/ specs are Playwright's and fail under Vitest
    // because its `test` has a different signature.
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
  },
});
