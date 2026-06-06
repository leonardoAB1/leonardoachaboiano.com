import { expect, test } from "@playwright/test";

// Regression coverage for the mobile burger menu (issue #261: clicking outside
// the open menu sometimes failed to close it). The menu is a Radix Dialog
// rendered only on small viewports, so these tests run on the `mobile` Pixel 7
// project and are skipped on `desktop`, where the burger is `sm:hidden`.
//
// We assert against Radix's own semantics rather than localized copy:
//   - the trigger button carries `aria-expanded`
//   - the open panel is the element with `[role="dialog"][data-state="open"]`
// which keeps the test locale-independent.

// Radix marks the dialog trigger with aria-haspopup="dialog", which uniquely
// identifies the burger button (the language switcher uses haspopup="menu").
const trigger = 'button[aria-haspopup="dialog"]';
const openPanel = '[role="dialog"][data-state="open"]';
const desktopSkip = "burger menu only renders below the sm breakpoint";

test.describe("mobile burger menu", () => {
  test("opens, then closes when clicking outside the panel", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", desktopSkip);
    await page.goto("/");

    await expect(page.locator(trigger)).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    await page.locator(trigger).click();
    await expect(page.locator(openPanel)).toBeVisible();

    // Click the backdrop, well to the left of the 18rem (288px) right-side
    // panel, so the click lands outside it.
    await page.mouse.click(10, 300);

    await expect(page.locator(openPanel)).toHaveCount(0);
    await expect(page.locator(trigger)).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("closes on Escape", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", desktopSkip);
    await page.goto("/");

    await page.locator(trigger).click();
    await expect(page.locator(openPanel)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(openPanel)).toHaveCount(0);
  });

  test("never gets stuck open under rapid open/close", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", desktopSkip);
    await page.goto("/");

    // The #261 repro: open then immediately dismiss, repeatedly. With the old
    // interrupted-JS-animation approach the panel could stick visible; with
    // CSS transitions driven by Radix state it must always end closed.
    for (let i = 0; i < 3; i++) {
      await page.locator(trigger).click();
      await expect(page.locator(openPanel)).toBeVisible();
      await page.mouse.click(10, 300);
      await expect(page.locator(openPanel)).toHaveCount(0);
    }

    await expect(page.locator(trigger)).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("a nav link navigates and closes the menu", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", desktopSkip);
    await page.goto("/");

    await page.locator(trigger).click();
    await expect(page.locator(openPanel)).toBeVisible();

    // Follow the first nav link inside the panel (CV/Contact/Projects).
    await page.locator(`${openPanel} nav a`).first().click();

    await expect(page).not.toHaveURL(/\/$/);
    await expect(page.locator(openPanel)).toHaveCount(0);
  });
});
