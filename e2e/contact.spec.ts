import { expect, test } from "@playwright/test";

// Smoke check + visual capture of the contact card across viewports. The card
// (squircle photo that flips to a QR + name + socials) shows everywhere; the
// contact form is desktop-only. Screenshots land in the per-test output dir
// (test-results/, gitignored) so both states/layouts can be eyeballed.
test("contact card renders, toggles, and is captured", async ({
  page,
}, testInfo) => {
  await page.goto("/contact");

  // Scope to <main> so footer links (which repeat the socials) don't clash.
  const main = page.getByRole("main");
  const isDesktop = testInfo.project.name === "desktop";

  // h1 is the name (card header).
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();

  // Squircle photo uses the name as its accessible label.
  await expect(
    main.getByRole("img", { name: "Leonardo Acha Boiano" }),
  ).toBeVisible();

  // Social icons expose accessible names on the icon-only links.
  await expect(main.getByRole("link", { name: "GitHub" })).toBeVisible();

  // The contact form is desktop-only.
  const sendButton = page.getByRole("button", { name: "Send message" });
  if (isDesktop) {
    await expect(sendButton).toBeVisible();
  } else {
    await expect(sendButton).toBeHidden();
  }

  // Default capture (photo).
  await page.screenshot({
    path: testInfo.outputPath(`contact-${testInfo.project.name}.png`),
    fullPage: true,
  });

  // Tapping the avatar reveals the QR (button label flips).
  const toggle = main.getByRole("button", { name: "Show QR code" });
  await toggle.click();
  await expect(main.getByRole("button", { name: "Show photo" })).toBeVisible();

  // Let the cross-fade settle so the capture isn't mid-transition.
  await page.waitForTimeout(400);

  // QR-revealed capture.
  await page.screenshot({
    path: testInfo.outputPath(`contact-${testInfo.project.name}-qr.png`),
    fullPage: true,
  });
});
