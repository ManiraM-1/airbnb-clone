// Photo tour (SPEC §8) and its dialog behaviour (SPEC §11), keyboard first.
import { expect, test, type Page } from "@playwright/test";
import listing from "../data/listing.json";

test.use({ reducedMotion: "reduce" });

const TOUR_QUERY = "modal=PHOTO_TOUR_SCROLLABLE";
const HEADER_HEIGHT = 88;
const ROOM_TOP = HEADER_HEIGHT + 24;
const photos = listing.tour.flatMap((room, roomIndex) => room.photos.map((src) => ({ src, roomIndex })));

const tour = (page: Page) => page.getByRole("dialog", { name: "Photo tour" });
const activeLabel = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el?.getAttribute("aria-label") ?? el?.textContent?.trim() ?? "";
  });
/** Viewport y of a tour room section's top. */
const roomTop = (page: Page, roomIndex: number) =>
  page.locator(`#tour-room-${roomIndex}`).evaluate((el) => el.getBoundingClientRect().top);
const scrollerTop = (page: Page) =>
  tour(page).locator("nav").evaluate((nav) => nav.closest("div[class*='scroller']")!.scrollTop);

test("keyboard only: hero image → tour at its room, Tab trapped, Esc closes, focus returns", async ({ page }) => {
  await page.goto("/");
  const heroNumber = 4;
  const heroLabel = `${listing.title} image ${heroNumber}`;
  const roomIndex = photos.find((p) => p.src === listing.hero[heroNumber - 1])!.roomIndex;
  expect(roomIndex).toBeGreaterThan(0); // a room below the top, so positioning is exercised

  for (let i = 0; i < 40 && (await activeLabel(page)) !== heroLabel; i++) await page.keyboard.press("Tab");
  expect(await activeLabel(page)).toBe(heroLabel);
  const scrollBefore = await page.evaluate(() => window.scrollY);

  await page.keyboard.press("Enter");
  await expect(tour(page)).toBeVisible();
  await expect(tour(page)).toHaveAttribute("aria-modal", "true");
  await expect(page).toHaveURL(new RegExp(`\\?${TOUR_QUERY}$`));
  expect(await activeLabel(page)).toBe("Back");
  // Positioned instantly with that photo's room at the top.
  expect(Math.abs((await roomTop(page, roomIndex)) - ROOM_TOP)).toBeLessThanOrEqual(1);

  // Tab through every control (3 header + 9 categories + 43 photos) and wrap back to Back.
  const tabbables = 3 + listing.tour.length + photos.length;
  for (let i = 0; i < tabbables; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  }
  expect(await activeLabel(page)).toBe("Back");
  await page.keyboard.press("Shift+Tab");
  expect(await activeLabel(page)).toBe(`${listing.title} image ${photos.length}`);

  expect(await page.locator("main").evaluate((el) => el.closest("[inert]") !== null)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");

  await page.keyboard.press("Escape");
  await expect(tour(page)).toBeHidden();
  expect(await activeLabel(page)).toBe(heroLabel);
  await expect(page).toHaveURL("/");
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

test("Show all photos opens at the top; Back closes and returns focus", async ({ page }) => {
  await page.goto("/");
  // Open from a room first, so the second open has to reset the position.
  await page.getByRole("button", { name: `${listing.title} image 5`, exact: true }).click();
  await expect(tour(page)).toBeVisible();
  expect(await scrollerTop(page)).toBeGreaterThan(0);
  await tour(page).getByRole("button", { name: "Back" }).click();
  await expect(tour(page)).toBeHidden();

  const showAll = page.getByRole("button", { name: "Show all photos", exact: true });
  await showAll.click();
  await expect(tour(page)).toBeVisible();
  expect(await scrollerTop(page)).toBe(0);
  await tour(page).getByRole("button", { name: "Back" }).click();
  await expect(tour(page)).toBeHidden();
  await expect(showAll).toBeFocused();
  await expect(page).toHaveURL("/");
});

test("loading the page with ?modal=PHOTO_TOUR_SCROLLABLE opens the tour", async ({ page }) => {
  await page.goto(`/?${TOUR_QUERY}`);
  await expect(tour(page)).toBeVisible();
  await expect(tour(page).getByRole("button", { name: "Back" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(tour(page)).toBeHidden();
  await expect(page).toHaveURL("/");
});

test("category thumbnail scrolls its room to 24px below the header", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Show all photos", exact: true }).click();
  const roomIndex = listing.tour.findIndex((r) => r.room === "Bedroom");
  await tour(page)
    .getByRole("navigation", { name: "Photo categories" })
    .getByRole("button", { name: "Bedroom", exact: true })
    .click();
  await expect.poll(async () => Math.abs((await roomTop(page, roomIndex)) - ROOM_TOP) <= 1).toBe(true);
});

test("rooms follow their layout strings: 1-up 458×305.3, 2-up 223×149, 43 labelled photos", async ({ page }) => {
  await page.goto(`/?${TOUR_QUERY}`);
  await expect(tour(page)).toBeVisible();
  let n = 0;
  for (const [roomIndex, room] of listing.tour.entries()) {
    const section = page.locator(`#tour-room-${roomIndex}`);
    await expect(section.getByRole("heading", { name: room.room, exact: true })).toBeVisible();
    const boxes = await section.locator("button").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { label: el.getAttribute("aria-label"), w: r.width, h: r.height };
      }),
    );
    const expected = [...room.layout].flatMap((cell) =>
      cell === "2" ? [{ w: 223, h: 149 }, { w: 223, h: 149 }] : [{ w: 458, h: 305.3 }],
    );
    expect(boxes.map(({ w, h }) => ({ w, h: Math.round(h * 10) / 10 }))).toEqual(expected);
    for (const box of boxes) expect(box.label).toBe(`${listing.title} image ${++n}`);
  }
  expect(n).toBe(43);
});

test("hover: thumbnail zooms and darkens, photo zooms with an overlay", async ({ page }) => {
  await page.goto(`/?${TOUR_QUERY}`);
  await expect(tour(page)).toBeVisible();
  const thumb = tour(page).getByRole("button", { name: "Living room 1", exact: true });
  await thumb.hover();
  await expect
    .poll(() => thumb.locator("img").evaluate((img) => [getComputedStyle(img).transform, getComputedStyle(img).filter]))
    .toEqual(["matrix(1.04, 0, 0, 1.04, 0, 0)", "brightness(0.94)"]);

  const photo = tour(page).getByRole("button", { name: `${listing.title} image 1`, exact: true });
  await photo.hover();
  await expect.poll(() => photo.locator("img").evaluate((img) => getComputedStyle(img).transform)).toBe(
    "matrix(1.04, 0, 0, 1.04, 0, 0)",
  );
  expect(await photo.evaluate((el) => getComputedStyle(el, "::after").backgroundColor)).toBe("rgba(0, 0, 0, 0.08)");
});

test("room titles stick 20px below the scroller top", async ({ page }) => {
  await page.goto(`/?${TOUR_QUERY}`);
  await expect(tour(page)).toBeVisible();
  const roomIndex = listing.tour.findIndex((r) => r.room === "Living room 2");
  await page.locator(`#tour-room-${roomIndex}`).evaluate((section) => {
    const scroller = section.closest("div[class*='scroller']")!;
    scroller.scrollTop += section.getBoundingClientRect().top - 88 + 300; // 300px into the section
  });
  // The sticky block is the title's wrapper (the title itself is nudged 1px up inside it).
  const info = page.locator(`#tour-room-${roomIndex}-title`).locator("..");
  expect(Math.round(await info.evaluate((el) => el.getBoundingClientRect().top))).toBe(HEADER_HEIGHT + 20);
});

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("opens and closes with opacity + translateY(28px), 0.3s cubic-bezier(0.2,0,0,1)", async ({ page }) => {
    await page.goto("/");
    const panel = page.locator('[role="dialog"][aria-label="Photo tour"]');
    const style = () =>
      panel.evaluate((el) => {
        const s = getComputedStyle(el);
        return { opacity: s.opacity, transform: s.transform, duration: s.transitionDuration, easing: s.transitionTimingFunction };
      });
    expect(await style()).toEqual({
      opacity: "0",
      transform: "matrix(1, 0, 0, 1, 0, 28)",
      duration: "0.3s, 0.3s",
      easing: "cubic-bezier(0.2, 0, 0, 1), cubic-bezier(0.2, 0, 0, 1)",
    });
    await page.getByRole("button", { name: "Show all photos", exact: true }).click();
    await expect.poll(async () => (await style()).opacity).toBe("1");
    expect((await style()).transform).toBe("none");
    await page.keyboard.press("Escape");
    // Still visible while it fades out, then hidden.
    expect(await panel.evaluate((el) => getComputedStyle(el).visibility)).toBe("visible");
    await expect(panel).toBeHidden();
    expect((await style()).transform).toBe("matrix(1, 0, 0, 1, 0, 28)");
  });
});
