import { expect, test } from "@playwright/test";

// Smoke check + visual capture of the home hero across viewports. The PNG is
// written to the per-test output dir (test-results/, gitignored) so you can
// eyeball how the hero renders - including the globe, which now appears inline
// on mobile rather than only in a modal.
test("home hero renders and is captured", async ({ page }, testInfo) => {
  await page.goto("/");

  // The hero heading is the page h1.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // The globe is a WebGL <canvas> appended once three.js initializes. It now
  // renders on every viewport, so wait for it before capturing.
  await expect(page.locator("canvas").first()).toBeVisible({ timeout: 30_000 });

  // Let the globe's fade-in settle so the capture isn't mid-transition.
  await page.waitForTimeout(1200);

  await page.screenshot({
    path: testInfo.outputPath(`hero-${testInfo.project.name}.png`),
  });
});
