// Sticky section nav (SPEC §10.2) and toast (SPEC §10.3).
import { expect, test, type Page } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

const nav = (page: Page) => page.getByRole("navigation", { name: "Listing sections" });
const toast = (page: Page) => page.getByRole("status");
const scrollTo = (page: Page, y: number) => page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
const activeLink = (page: Page) => nav(page).locator('a[aria-current="location"]');

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("appears once the hero gallery has scrolled away, hides again above it", async ({ page }) => {
  await expect(nav(page)).toBeHidden();
  const galleryBottom = await page
    .getByRole("region", { name: "Photos of this place" })
    .evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);

  await scrollTo(page, galleryBottom - 10);
  await expect(nav(page)).toBeHidden();
  await scrollTo(page, galleryBottom + 10);
  await expect(nav(page)).toBeVisible();
  expect(await nav(page).evaluate((el) => el.closest("div")!.getBoundingClientRect().top)).toBe(0);
  await scrollTo(page, 0);
  await expect(nav(page)).toBeHidden();
});

test("scroll-spy underlines the section in view (instant jumps included)", async ({ page }) => {
  await scrollTo(page, 1500);
  await expect(activeLink(page)).toHaveText("Photos");
  for (const [id, label] of [
    ["location", "Location"],
    ["amenities", "Amenities"],
    ["reviews", "Reviews"],
  ] as const) {
    await page.locator(`#${id}`).evaluate((el) => window.scrollTo({ top: (el as HTMLElement).offsetTop - 20, behavior: "instant" }));
    await expect(activeLink(page)).toHaveText(label);
    await expect(activeLink(page)).toHaveCount(1);
  }
  const underline = await activeLink(page).evaluate((el) => {
    const s = getComputedStyle(el, "::after");
    return [s.content, s.height, s.backgroundColor, s.left, s.right];
  });
  expect(underline).toEqual(['""', "2px", "rgb(34, 34, 34)", "8px", "8px"]);
});

test("clicking a link scrolls to its section", async ({ page }) => {
  await scrollTo(page, 1500);
  await nav(page).getByRole("link", { name: "Reviews" }).click();
  await expect.poll(() => page.locator("#reviews").evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBe(0);
  await expect(activeLink(page)).toHaveText("Reviews");
});

test("Share and both Reserve buttons show their toasts", async ({ page }) => {
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(toast(page)).toHaveText("Share options");
  await expect(toast(page).locator("div")).toBeVisible();

  await page.getByRole("complementary", { name: "Booking" }).getByRole("button", { name: "Reserve" }).click();
  await expect(toast(page)).toHaveText("You won't be charged yet");

  await scrollTo(page, 1500);
  await expect(nav(page)).toBeVisible();
  await page.getByRole("button", { name: "Share", exact: true }).evaluate((el) => (el as HTMLElement).click());
  await expect(toast(page)).toHaveText("Share options");
  await page.locator("div").filter({ has: nav(page) }).last().getByRole("button", { name: "Reserve" }).click();
  await expect(toast(page)).toHaveText("You won't be charged yet");
});

test("toast hides after ~2s; a new trigger replaces the text and restarts the timer", async ({ page }) => {
  const share = page.getByRole("button", { name: "Share", exact: true });
  const box = toast(page).locator("div");
  await share.click();
  const shownAt = Date.now();
  await page.waitForTimeout(1500);
  await page.getByRole("complementary", { name: "Booking" }).getByRole("button", { name: "Reserve" }).click();
  const restartedAt = Date.now();
  await expect(toast(page)).toHaveText("You won't be charged yet");
  await page.waitForTimeout(Math.max(0, shownAt + 2300 - Date.now()));
  await expect(box).toBeVisible(); // the first timer was cancelled
  await expect(box).toBeHidden({ timeout: 2000 });
  const elapsed = Date.now() - restartedAt;
  expect(elapsed).toBeGreaterThan(1800);
  expect(elapsed).toBeLessThan(2800);
});
