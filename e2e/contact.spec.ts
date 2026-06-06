import { expect, test } from "@playwright/test";

// Smoke check + visual capture of the link-in-bio contact page across
// viewports. Verifies the three blocks - profile header, stacked destination
// links, and the contact form - then writes a PNG to the per-test output dir
// (test-results/, gitignored) so the centered-mobile vs portrait-right-desktop
// layouts can be eyeballed.
test("contact link-in-bio renders and is captured", async ({
  page,
}, testInfo) => {
  await page.goto("/contact");

  // Scope to <main> so footer links (which repeat the socials) don't clash.
  const main = page.getByRole("main");

  // h1 is the name (link-in-bio profile header).
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();

  // Stacked destination buttons resolve to real routes.
  await expect(main.getByRole("link", { name: "View CV" })).toBeVisible();
  await expect(main.getByRole("link", { name: "See projects" })).toBeVisible();

  // Social icon row exposes accessible names on the icon-only links.
  await expect(main.getByRole("link", { name: "GitHub" })).toBeVisible();

  // The contact form is kept below the link-in-bio block.
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath(`contact-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
