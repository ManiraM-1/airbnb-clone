// Amenities modal (SPEC §10.1) and the shared Dialog behaviour (SPEC §11), keyboard first.
import { expect, test, type Page } from "@playwright/test";
import listing from "../data/listing.json";

test.use({ reducedMotion: "reduce" });

const OPENER = `Show all ${listing.amenitiesTotal} amenities`;
const dialog = (page: Page) => page.getByRole("dialog", { name: "What this place offers" });
const activeLabel = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el?.getAttribute("aria-label") ?? el?.textContent?.trim() ?? "";
  });

/** Tabs from the top of the page until the "Show all … amenities" button has focus. */
async function tabToOpener(page: Page) {
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab");
    if ((await activeLabel(page)) === OPENER) return;
  }
  throw new Error(`never reached "${OPENER}" with Tab`);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("keyboard only: open, Tab stays inside, Esc closes, focus returns", async ({ page }) => {
  await tabToOpener(page);
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("Enter");

  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page)).toHaveAttribute("aria-modal", "true");
  expect(await activeLabel(page)).toBe("Close"); // focus moved to the first control

  // Tab and Shift+Tab never leave the dialog.
  for (const key of ["Tab", "Tab", "Shift+Tab", "Shift+Tab", "Tab"]) {
    await page.keyboard.press(key);
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  }

  // Page behind is inert and not scrollable.
  expect(await page.locator("main").evaluate((el) => el.closest("[inert]") !== null)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  expect(await activeLabel(page)).toBe(OPENER); // focus back on the opener
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  expect(await page.locator("main").evaluate((el) => el.closest("[inert]") !== null)).toBe(false);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  await expect(page).toHaveURL("/"); // URL does not change
});

test("Close button and backdrop click both close", async ({ page }) => {
  const opener = page.getByRole("button", { name: OPENER });
  await opener.click();
  await dialog(page).getByRole("button", { name: "Close" }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(opener).toBeFocused();

  await opener.click();
  await expect(dialog(page)).toBeVisible();
  await page.mouse.click(100, 450); // the backdrop, left of the 780px panel
  await expect(dialog(page)).toBeHidden();
});

test("lists every amenity from the data with an icon; unavailable ones struck through", async ({ page }) => {
  await page.getByRole("button", { name: OPENER }).click();
  const d = dialog(page);
  for (const group of listing.amenitiesAll) {
    await expect(d.getByRole("heading", { name: group.category, exact: true })).toBeVisible();
  }
  const rows = d.locator("li");
  const expected = listing.amenitiesAll.flatMap((g) => g.items);
  await expect(rows).toHaveCount(expected.length);
  expect(await rows.evaluateAll((els) => els.filter((el) => !el.querySelector("svg")).length)).toBe(0);

  const unavailable = listing.amenitiesPreview.filter((a) => !a.available).map((a) => a.name);
  for (const name of unavailable) {
    // The struck-through name carries a visually hidden "Unavailable: " prefix for screen readers.
    const decoration = await d
      .getByText(`Unavailable: ${name}`, { exact: true })
      .evaluate((el) => getComputedStyle(el).textDecorationLine);
    expect(decoration).toBe("line-through");
  }
});

test("dialog is hidden from the tab order while closed", async ({ page }) => {
  await expect(dialog(page)).toBeHidden();
  await expect(page.getByRole("button", { name: "Close" })).toHaveCount(0);
});

test("the amenity list can be scrolled with the keyboard", async ({ page }) => {
  await page.getByRole("button", { name: OPENER }).click();
  const list = dialog(page).getByRole("region", { name: "What this place offers" });
  await expect(dialog(page).getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(list).toBeFocused();
  await page.keyboard.press("PageDown");
  await expect.poll(() => list.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
});
