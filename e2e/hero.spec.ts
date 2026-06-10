import { expect, test } from "@playwright/test";

// Smoke check + visual capture of the home hero across viewports. The PNG is
// written to the per-test output dir (test-results/, gitignored) so you can
// eyeball how the hero renders. The globe lives on /cv now (see cv.spec.ts),
// so the home page should carry no WebGL canvas at all.
test("home hero renders and is captured", async ({ page }, testInfo) => {
  await page.goto("/");

  // The hero heading is the page h1.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Let the entrance animation settle so the capture isn't mid-transition.
  await page.waitForTimeout(1200);

  await page.screenshot({
    path: testInfo.outputPath(`hero-${testInfo.project.name}.png`),
  });
});
