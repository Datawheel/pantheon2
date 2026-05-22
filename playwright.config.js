import {defineConfig, devices} from "@playwright/test";

/**
 * Playwright config for the pantheon-site smoke suite.
 *
 * The suite assumes the app is ALREADY running (e.g. `npm run dev` or
 * `npm run build && npm start`). It does not start a server itself.
 * Point it elsewhere with BASE_URL, e.g.:
 *   BASE_URL=https://pantheon.world npm run test:e2e
 */
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  // Run every page in parallel — that's what keeps the full sweep under a minute.
  fullyParallel: true,
  // No retries: a smoke suite should be deterministic. Bump locally if needed.
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", {open: "never"}]] : [["list"], ["html", {open: "never"}]],
  // Generous per-test budget so a cold Next dev server (compiles routes on
  // first hit) doesn't false-fail. A prod build finishes far faster.
  timeout: 90_000,
  expect: {timeout: 10_000},
  use: {
    baseURL: BASE_URL,
    navigationTimeout: 60_000,
    actionTimeout: 15_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {...devices["Desktop Chrome"]},
    },
  ],
});
