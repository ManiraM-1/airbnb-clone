// Booking sidebar (SPEC §6), amenities preview (§5.7) and calendar (§5.8) behaviour.
import { expect, test, type Page } from "@playwright/test";
import listing from "../data/listing.json";

test.use({ reducedMotion: "reduce" });

const sticky = (page: Page) => page.locator("aside").locator(":scope > div").first();
const scrollTo = (page: Page, y: number) => page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
const pageBox = (page: Page, el: ReturnType<typeof sticky>) =>
  el.evaluate((node) => {
    const r = node.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, viewTop: r.top };
  });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.addStyleTag({ content: "html { scrollbar-width: none; }" }); // reference has no scrollbar
});

test("sidebar starts at the reference position and sticks 100px from the top", async ({ page }) => {
  // ref-full.png: discount card top border at page y=715.
  expect((await pageBox(page, sticky(page))).top).toBeCloseTo(715, 0);
  // ref-sticky-nav.png (scrollY 1500): discount card top border at viewport y=100.
  await scrollTo(page, 1500);
  expect((await pageBox(page, sticky(page))).viewTop).toBeCloseTo(100, 0);
});

test("sidebar stops at the bottom of the two-column grid", async ({ page }) => {
  // Room to scroll past the grid while the full-width sections below are still unbuilt.
  await page.addStyleTag({ content: "body { padding-bottom: 2000px; }" });
  const aside = page.locator("aside");
  const asideBottom = await aside.evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);
  const wrapper = await pageBox(page, sticky(page));
  const height = wrapper.bottom - wrapper.top;
  const stopScroll = asideBottom - height - 100;

  // ref-full.png: the full-width section below the grid starts at y=2729.
  expect(asideBottom).toBeCloseTo(2729 - 1, -1);

  await scrollTo(page, stopScroll - 50); // still sticking
  expect((await pageBox(page, sticky(page))).viewTop).toBeCloseTo(100, 0);
  await scrollTo(page, stopScroll + 200); // past the stop: scrolls away with the grid
  const after = await pageBox(page, sticky(page));
  expect(after.bottom).toBeCloseTo(asideBottom, 0);
  expect(after.viewTop).toBeLessThan(100);
});

test("Reserve, Claim, Terms and Report do not navigate", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const aside = page.locator("aside");
  await aside.getByRole("button", { name: "Reserve" }).click();
  await aside.getByRole("button", { name: "Claim" }).click();
  await aside.getByRole("link", { name: listing.booking.discount.link }).click();
  await aside.getByRole("link", { name: "Report this listing" }).click();
  expect(errors).toEqual([]);
  expect(new URL(page.url()).hash).toBe("");
});

test("Reserve uses the gradient and switches to the hover gradient", async ({ page }) => {
  const reserve = page.locator("aside").getByRole("button", { name: "Reserve" });
  const bg = () => reserve.evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(await bg()).toContain("rgb(230, 30, 77)"); // #E61E4D
  await reserve.hover();
  await expect.poll(bg).toContain("rgb(216, 27, 95)"); // #D81B5F
});

test("booking card shows the dates and price from the data", async ({ page }) => {
  const aside = page.locator("aside");
  await expect(aside).toContainText(listing.booking.price);
  await expect(aside).toContainText("10/18/2026");
  await expect(aside).toContainText("10/23/2026");
  await expect(aside).toContainText(listing.booking.cancellationBefore);
});

test("calendar marks the selected range and blocked days", async ({ page }) => {
  const day = (month: string, n: number) =>
    page.getByRole("table").nth(month === "2026-10" ? 0 : 1).getByText(String(n), { exact: true });
  const bg = (l: ReturnType<typeof day>) => l.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await bg(day("2026-10", 18))).toBe("rgb(34, 34, 34)");
  expect(await bg(day("2026-10", 23))).toBe("rgb(34, 34, 34)");
  for (const n of [19, 20, 21, 22]) expect(await bg(day("2026-10", n))).toBe("rgb(242, 242, 242)");
  expect(await bg(day("2026-10", 17))).toBe("rgba(0, 0, 0, 0)");
  for (const iso of listing.booking.blockedDates) {
    const n = Number(iso.slice(-2));
    const style = await day("2026-11", n).evaluate((el) => getComputedStyle(el).textDecorationLine);
    expect(style, iso).toBe("line-through");
  }
});

test("calendar month arrows and Clear dates are no-ops", async ({ page }) => {
  const before = await page.getByRole("table").first().textContent();
  await page.getByRole("button", { name: "Next month" }).click();
  await page.getByRole("button", { name: "Previous month" }).click();
  await page.getByRole("button", { name: "Clear dates" }).click();
  expect(await page.getByRole("table").first().textContent()).toBe(before);
});
