import { defineConfig, devices } from "@playwright/test";

// Page-level browser checks and screenshot captures. Playwright boots the app
// itself (webServer below) and drives it in real browsers, so these tests see
// the fully rendered page - layout, fonts, and the WebGL globe - exactly as a
// visitor would. Kept separate from the Vitest unit suite (src/**/*.test.tsx),
// which runs component logic in jsdom.
export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      // Pixel 7 is a Chromium-based device descriptor (mobile viewport + touch),
      // so the whole suite runs on one browser - no extra WebKit download.
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  // Reuses an already-running `pnpm dev` locally; starts a fresh one in CI.
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
