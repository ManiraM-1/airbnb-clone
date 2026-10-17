// Behaviour of SPEC §5.1–§5.6 (Overview … Where you'll sleep).
import { expect, test } from "@playwright/test";
import listing from "../data/listing.json";

test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("content comes from the listing data", async ({ page }) => {
  await expect(page.getByRole("heading", { name: listing.overview.heading })).toBeVisible();
  await expect(page.getByText(listing.overview.details.join(" · "), { exact: true })).toBeVisible();
  await expect(page.getByText(listing.guestFavourite.text, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: `Hosted by ${listing.host.name}` })).toBeVisible();
  for (const h of listing.highlights) {
    await expect(page.getByRole("heading", { name: h.title })).toBeVisible();
    await expect(page.getByText(h.text, { exact: true })).toBeVisible();
  }
  for (const area of listing.sleep) {
    await expect(page.getByRole("heading", { name: area.title, exact: true })).toBeVisible();
  }
});

test("left column is 652px wide and sections stack in SPEC order", async ({ page }) => {
  const box = (name: string) => page.getByRole("heading", { name }).boundingBox();
  const order = [
    listing.overview.heading,
    `Hosted by ${listing.host.name}`,
    listing.highlights[0].title,
    "Where you'll sleep",
  ];
  let lastY = 0;
  for (const name of order) {
    const b = await box(name);
    expect(b, name).not.toBeNull();
    expect(b!.x).toBeGreaterThanOrEqual(152);
    expect(b!.x + b!.width).toBeLessThanOrEqual(152 + 652 + 8);
    expect(b!.y).toBeGreaterThan(lastY);
    lastY = b!.y;
  }
});

test("Description: Show more / Show less toggles inline with aria-expanded", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Show more", exact: true });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  const textId = await toggle.getAttribute("aria-controls");
  expect(textId).toBeTruthy();
  const text = page.locator(`[id="${textId}"]`);
  await expect(text).toContainText(listing.description.slice(0, 40));

  const collapsedHeight = await text.evaluate((el) => el.getBoundingClientRect().height);
  expect(collapsedHeight).toBeCloseTo(99.2, 0);

  await toggle.click();
  const less = page.getByRole("button", { name: "Show less", exact: true });
  await expect(less).toHaveAttribute("aria-expanded", "true");
  const expanded = await text.evaluate((el) => ({
    height: el.getBoundingClientRect().height,
    scroll: el.scrollHeight,
    mask: getComputedStyle(el).maskImage,
  }));
  expect(expanded.height).toBeGreaterThan(collapsedHeight);
  expect(expanded.height).toBeCloseTo(expanded.scroll, 0); // nothing clipped
  expect(expanded.mask).toBe("none");

  await less.click();
  await expect(page.getByRole("button", { name: "Show more", exact: true })).toHaveAttribute("aria-expanded", "false");
  expect(await text.evaluate((el) => el.getBoundingClientRect().height)).toBeCloseTo(collapsedHeight, 0);
});

test("Description toggle works from the keyboard", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Show more", exact: true });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Show less", exact: true })).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "Show more", exact: true })).toHaveAttribute("aria-expanded", "false");
});

test("Show original is a no-op link", async ({ page }) => {
  const link = page.getByRole("link", { name: "Show original" });
  await link.scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => window.scrollY);
  await link.click();
  expect(new URL(page.url()).hash).toBe("");
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(y, -1);
});

test("guest favourite card shows rating, stars and review count", async ({ page }) => {
  const card = page.getByText(listing.guestFavourite.text, { exact: true }).locator("..");
  await expect(card).toContainText(listing.guestFavourite.rating.toFixed(2));
  await expect(card).toContainText(String(listing.guestFavourite.reviewCount));
  expect(await card.locator('span[aria-hidden="true"] svg').count()).toBe(5); // stars, not laurels
});
