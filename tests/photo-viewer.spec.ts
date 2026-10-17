// Photo viewer (SPEC §9) stacked on the Photo Tour, and its dialog behaviour (SPEC §11).
import { expect, test, type Page } from "@playwright/test";
import listing from "../data/listing.json";

test.use({ reducedMotion: "reduce" });

const TOUR_QUERY = "modal=PHOTO_TOUR_SCROLLABLE";
const photos = listing.tour.flatMap((room) => room.photos.map((src) => ({ src, room: room.room })));
const TOTAL = photos.length;

const tour = (page: Page) => page.getByRole("dialog", { name: "Photo tour" });
const viewer = (page: Page) => page.getByRole("dialog", { name: "Photo viewer" });
const photoLabel = (n: number) => `${listing.title} image ${n}`;
const activeLabel = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el?.getAttribute("aria-label") ?? el?.textContent?.trim() ?? "";
  });
const scrollerTop = (page: Page) =>
  tour(page).locator("nav").evaluate((nav) => nav.closest("div[class*='scroller']")!.scrollTop);
const viewerImageSrc = (page: Page) => viewer(page).locator("img").getAttribute("src");

test("keyboard only: tour photo → viewer, arrows to the end, Esc back to the tour, Esc closes", async ({ page }) => {
  await page.goto("/");
  const showAll = page.getByRole("button", { name: "Show all photos", exact: true });
  for (let i = 0; i < 60 && (await activeLabel(page)) !== "Show all photos"; i++) await page.keyboard.press("Tab");
  await expect(showAll).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(tour(page)).toBeVisible();

  // Tab to a photo a little way down the tour.
  const start = 4;
  for (let i = 0; i < 80 && (await activeLabel(page)) !== photoLabel(start); i++) await page.keyboard.press("Tab");
  expect(await activeLabel(page)).toBe(photoLabel(start));
  const tourScroll = await scrollerTop(page);

  await page.keyboard.press("Enter");
  await expect(viewer(page)).toBeVisible();
  await expect(viewer(page)).toHaveAttribute("aria-modal", "true");
  await expect(page).toHaveURL(new RegExp(`\\?${TOUR_QUERY}&modalItem=${1000 + start - 1}$`));
  expect(await activeLabel(page)).toBe("Show all photos");
  await expect(viewer(page).getByText(`${start} of ${TOTAL}`)).toBeVisible();
  await expect(viewer(page).getByRole("heading", { name: photos[start - 1].room })).toBeVisible();
  // The tour behind is inert; Tab stays in the viewer.
  expect(await tour(page).evaluate((el) => el.closest("[inert]") !== null)).toBe(true);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest('[aria-label="Photo viewer"]'))).toBe(true);
  }

  // Arrow to the last photo; the URL and counter follow every step.
  for (let n = start + 1; n <= TOTAL; n++) {
    await page.keyboard.press("ArrowRight");
    await expect(viewer(page).getByText(`${n} of ${TOTAL}`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`modalItem=${1000 + n - 1}$`));
  }
  const next = viewer(page).getByRole("button", { name: "Next" });
  await expect(next).toBeDisabled();
  expect(await next.evaluate((el) => getComputedStyle(el).opacity)).toBe("0.28");
  await page.keyboard.press("ArrowRight"); // no wrap-around
  await expect(viewer(page).getByText(`${TOTAL} of ${TOTAL}`)).toBeVisible();
  expect(await viewerImageSrc(page)).toBe(photos[TOTAL - 1].src);

  // Esc returns to the tour: scroll unchanged, focus on the photo that opened the viewer.
  await page.keyboard.press("Escape");
  await expect(viewer(page)).toBeHidden();
  await expect(tour(page)).toBeVisible();
  expect(await activeLabel(page)).toBe(photoLabel(start));
  expect(await scrollerTop(page)).toBe(tourScroll);
  await expect(page).toHaveURL(new RegExp(`\\?${TOUR_QUERY}$`));

  await page.keyboard.press("Escape");
  await expect(tour(page)).toBeHidden();
  await expect(showAll).toBeFocused();
  await expect(page).toHaveURL("/");
});

test("deep link ?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1003 opens the tour with the viewer on photo 4", async ({ page }) => {
  await page.goto(`/?${TOUR_QUERY}&modalItem=1003`);
  await expect(viewer(page)).toBeVisible();
  await expect(viewer(page).getByText(`4 of ${TOTAL}`)).toBeVisible();
  expect(await viewerImageSrc(page)).toBe(photos[3].src);
  await viewer(page).getByRole("button", { name: "Close" }).click();
  await expect(viewer(page)).toBeHidden();
  await expect(tour(page)).toBeVisible();
  await expect(tour(page).getByRole("button", { name: photoLabel(4), exact: true })).toBeFocused();
  await expect(page).toHaveURL(new RegExp(`\\?${TOUR_QUERY}$`));
});

test("Previous is disabled on photo 1; arrow buttons navigate; grid button returns to the tour", async ({ page }) => {
  await page.goto(`/?${TOUR_QUERY}`);
  const first = tour(page).getByRole("button", { name: photoLabel(1), exact: true });
  await first.click();
  await expect(viewer(page)).toBeVisible();
  const previous = viewer(page).getByRole("button", { name: "Previous" });
  const next = viewer(page).getByRole("button", { name: "Next" });
  await expect(previous).toBeDisabled();
  expect(await previous.evaluate((el) => getComputedStyle(el).opacity)).toBe("0.28");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer(page).getByText(`1 of ${TOTAL}`)).toBeVisible();

  await next.click();
  await expect(viewer(page).getByText(`2 of ${TOTAL}`)).toBeVisible();
  expect(await viewerImageSrc(page)).toBe(photos[1].src);
  await expect(previous).toBeEnabled();
  // Back to photo 1 with the keyboard: focus moves off the arrow that becomes disabled.
  await previous.focus();
  await page.keyboard.press("Enter");
  await expect(viewer(page).getByText(`1 of ${TOTAL}`)).toBeVisible();
  await expect(next).toBeFocused();

  await viewer(page).getByRole("button", { name: "Show all photos" }).click();
  await expect(viewer(page)).toBeHidden();
  await expect(first).toBeFocused();
});

test("layout: 968×725.5 image, arrows 20px from the edges, live counter", async ({ page }) => {
  await page.goto(`/?${TOUR_QUERY}&modalItem=1003`);
  await expect(viewer(page)).toBeVisible();
  const img = viewer(page).locator("img");
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  // Rendered (contain) box of the 4:3 photo.
  const rendered = await img.evaluate((el: HTMLImageElement) => {
    const r = el.getBoundingClientRect();
    const scale = Math.min(r.width / el.naturalWidth, r.height / el.naturalHeight);
    const w = el.naturalWidth * scale;
    const h = el.naturalHeight * scale;
    const round = (n: number) => Math.round(n * 100) / 100;
    return { x: round(r.x + (r.width - w) / 2), y: round(r.y + (r.height - h) / 2), w: round(w), h: round(h) };
  });
  expect(rendered).toEqual({ x: 236.33, y: 88, w: 967.33, h: 725.5 });
  const prev = await viewer(page).getByRole("button", { name: "Previous" }).boundingBox();
  const next = await viewer(page).getByRole("button", { name: "Next" }).boundingBox();
  expect(prev).toMatchObject({ x: 20, width: 40, height: 40 });
  expect(next!.x + next!.width).toBe(1420);
  await expect(viewer(page).getByText(`4 of ${TOTAL}`)).toHaveAttribute("aria-live", "polite");
});

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("fades in and out over 0.25s", async ({ page }) => {
    await page.goto(`/?${TOUR_QUERY}`);
    await expect(tour(page)).toBeVisible();
    const panel = page.locator('[role="dialog"][aria-label="Photo viewer"]');
    const style = () =>
      panel.evaluate((el) => {
        const s = getComputedStyle(el);
        return { opacity: s.opacity, property: s.transitionProperty, duration: s.transitionDuration };
      });
    expect(await style()).toEqual({ opacity: "0", property: "opacity", duration: "0.25s" });
    await tour(page).getByRole("button", { name: photoLabel(1), exact: true }).click();
    await expect.poll(async () => (await style()).opacity).toBe("1");
    await page.keyboard.press("Escape");
    expect(await panel.evaluate((el) => getComputedStyle(el).visibility)).toBe("visible");
    await expect(panel).toBeHidden();
    await expect(tour(page)).toBeVisible();
  });
});
