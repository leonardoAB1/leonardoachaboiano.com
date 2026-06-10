import { expect, test } from "@playwright/test";

// The CV globe is desktop-only: on lg viewports (>= 1024px) the three.js
// bundle loads and renders a WebGL <canvas>; below that the component tree is
// gated by a media query so the bundle is never even downloaded (issue #275).
test("cv globe renders on desktop only", async ({ page }, testInfo) => {
  // Dev-mode compile plus three.js init can eat the default 30s budget on
  // desktop before the screenshot runs - triple the timeout for this test.
  testInfo.slow();

  await page.goto("/cv");

  // The page heading confirms the route rendered regardless of viewport.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  if (testInfo.project.name === "desktop") {
    // The globe is a WebGL <canvas> appended once three.js initializes.
    await expect(page.locator("canvas").first()).toBeVisible({
      timeout: 30_000,
    });
  } else {
    // Give any stray lazy-loading a moment, then assert no canvas mounted.
    await page.waitForTimeout(3_000);
    await expect(page.locator("canvas")).toHaveCount(0);
  }

  await page.screenshot({
    path: testInfo.outputPath(`cv-${testInfo.project.name}.png`),
  });
});
