// Behaviour of SPEC §7.1–§7.5 (Reviews … More stays nearby).
import { expect, test } from "@playwright/test";
import listing from "../data/listing.json";

test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("content comes from the listing data", async ({ page }) => {
  const reviews = page.locator("#reviews");
  await expect(reviews.getByText(String(listing.reviews.rating), { exact: true })).toBeVisible();
  for (const category of listing.reviews.categories) {
    await expect(reviews.getByText(category.name, { exact: true }).first()).toBeVisible();
  }
  for (const review of listing.reviews.items) {
    await expect(reviews.getByRole("heading", { name: review.name, exact: true })).toBeVisible();
  }
  await expect(page.getByText(listing.location.note, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: listing.host.name, exact: true })).toBeVisible();
  for (const cohost of listing.cohosts) {
    await expect(page.getByText(cohost.name, { exact: true })).toBeVisible();
  }
  for (const item of listing.thingsToKnow) {
    await expect(page.getByRole("heading", { name: item.title, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: listing.moreStays[0].title, exact: true })).toBeVisible();
});

test("topic chips scroll sideways in one row", async ({ page }) => {
  const chips = page.getByRole("list", { name: "Review topics" });
  await expect(chips.getByRole("button")).toHaveCount(listing.reviews.topics.length);
  const { scrollWidth, clientWidth, rowTops } = await chips.evaluate((el) => ({
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
    rowTops: new Set([...el.querySelectorAll("button")].map((b) => Math.round(b.getBoundingClientRect().top))).size,
  }));
  expect(clientWidth).toBe(1120);
  expect(scrollWidth).toBeGreaterThan(1500);
  expect(rowTops).toBe(1);
});

test("review cards clamp to 4 lines and long ones toggle Show more / Show less", async ({ page }) => {
  const cards = page.locator("#reviews article");
  await expect(cards).toHaveCount(listing.reviews.items.length);
  // Reference: only Aheesh's and Vedant's reviews have the toggle.
  await expect(page.locator("#reviews").getByRole("button", { name: "Show more", exact: true })).toHaveCount(2);

  const vedant = cards.filter({ has: page.getByRole("heading", { name: "Vedant" }) });
  const toggle = vedant.getByRole("button", { name: "Show more", exact: true });
  const text = vedant.locator(`[id="${await toggle.getAttribute("aria-controls")}"]`);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(await text.evaluate((el) => el.getBoundingClientRect().height)).toBeCloseTo(84, 0);

  await toggle.click();
  const less = vedant.getByRole("button", { name: "Show less", exact: true });
  await expect(less).toHaveAttribute("aria-expanded", "true");
  expect(await text.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(84);

  await less.click();
  await expect(vedant.getByRole("button", { name: "Show more", exact: true })).toHaveAttribute("aria-expanded", "false");
});

test("fake map is CSS only with labelled controls", async ({ page }) => {
  const map = page.getByRole("region", { name: "Map" });
  const box = await map.boundingBox();
  expect(box?.width).toBe(1120);
  expect(box?.height).toBe(480);
  for (const name of ["Search", "Zoom in", "Zoom out"]) {
    await expect(map.getByRole("button", { name, exact: true })).toBeVisible();
  }
  await expect(map.locator("img, canvas, iframe")).toHaveCount(0);
});

test("no-op links do not navigate", async ({ page }) => {
  await page.getByRole("link", { name: /^Learn more about/ }).first().click();
  await expect(page).toHaveURL(/\/$/);
});

test("More stays: arrows page the track and update the counter", async ({ page }) => {
  const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "More stays nearby" }) });
  const prev = section.getByRole("button", { name: "Previous" });
  const next = section.getByRole("button", { name: "Next" });
  const track = section.getByRole("list");
  await expect(track.getByRole("listitem")).toHaveCount(listing.moreStays.length);

  await expect(section.getByText("1 / 2", { exact: true })).toBeVisible();
  await expect(prev).toBeDisabled();
  await expect(prev).toHaveCSS("opacity", "0.3");
  await expect(next).toBeEnabled();

  await next.click();
  await expect(section.getByText("2 / 2", { exact: true })).toBeVisible();
  expect(await track.evaluate((el) => el.scrollLeft)).toBe(684);
  await expect(next).toBeDisabled();
  await expect(prev).toBeEnabled();

  await prev.click();
  await expect(section.getByText("1 / 2", { exact: true })).toBeVisible();
  expect(await track.evaluate((el) => el.scrollLeft)).toBe(0);
});

test("More stays: keyboard focus moves to the other arrow when one disables", async ({ page }) => {
  const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "More stays nearby" }) });
  const next = section.getByRole("button", { name: "Next" });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(next).toBeDisabled();
  await expect(section.getByRole("button", { name: "Previous" })).toBeFocused();
});
