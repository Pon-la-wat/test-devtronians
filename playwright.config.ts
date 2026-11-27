import { defineConfig } from "@playwright/test";

const port = 4179;

export default defineConfig({
  testDir: "e2e",
  webServer: {
    command: "npm run build && npm start",
    url: `http://127.0.0.1:${port}`,
    env: { PORT: String(port) },
    reuseExistingServer: false,
    timeout: 120_000,
  },
  use: { baseURL: `http://127.0.0.1:${port}` },
});
