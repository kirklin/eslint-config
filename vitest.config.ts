import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [".sync-upstream/**", "node_modules/**"],
    testTimeout: 60_000,
  },
});
