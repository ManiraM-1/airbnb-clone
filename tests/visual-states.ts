// Puts our page into the same states as the manual reference screenshots in tests/reference/
// (see tests/reference/README.md) and saves screenshots to tests/__output__/ for comparison
// with `npm run compare`.
import { expect, type Page } from "@playwright/test";
import listing from "../data/listing.json";

export const OUTPUT_DIR = "tests/__output__";
export const VIEWPORT = { width: 1440, height: 900 };

export const STATE_NAMES = [
  "full",
  "top",
  "sticky-nav",
  "tour-top",
  "tour-bedroom",
  "viewer-4",
  "amenities",
] as const;

export type VisualState = (typeof STATE_NAMES)[number];

interface StateDefinition {
  /** Matching file in tests/reference/. */
  reference: string;
  fullPage: boolean;
  setup: (page: Page) => Promise<void>;
}

/** Loads the listing page and checks the layout matches the reference capture conditions. */
export async function loadPage(page: Page): Promise<void> {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  // The reference was captured without a scrollbar; hide ours (test-only) now the page scrolls.
  await page.addStyleTag({ content: "html { scrollbar-width: none; }" });
  // The reference screenshots have no scrollbar: layout width must be the full 1440px.
  const layoutWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(layoutWidth, "layout width (a visible scrollbar would shift everything)").toBe(VIEWPORT.width);
}

/** Scrolls the window without the smooth-scroll animation. */
export async function scrollPageTo(page: Page, y: number): Promise<void> {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
}

/** Scrolls through the whole page so lazy images load, then returns to the top. */
export async function loadLazyImages(page: Page): Promise<void> {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += VIEWPORT.height / 2) {
    await scrollPageTo(page, y);
    await waitForVisibleImages(page);
  }
  await scrollPageTo(page, 0);
}

/** Waits until every image visible in the viewport has decoded. */
export async function waitForVisibleImages(page: Page): Promise<void> {
  await page.waitForFunction(
    () =>
      [...document.images]
        .filter((img) => {
          const r = img.getBoundingClientRect();
          const inView = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
          return inView && r.width > 0 && getComputedStyle(img).visibility !== "hidden";
        })
        .every((img) => img.complete && img.naturalWidth > 0),
    undefined,
    { timeout: 15_000 },
  );
}

/** Waits until an element's position stops changing (e.g. after a smooth scroll). */
export async function waitForStablePosition(page: Page, elementId: string): Promise<void> {
  await page.evaluate(async (id) => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`#${id} not found`);
    const start = performance.now();
    let last = Number.NaN;
    let stableSince = start;
    while (performance.now() - start < 3000) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const top = el.getBoundingClientRect().top;
      if (top !== last) {
        last = top;
        stableSince = performance.now();
      } else if (performance.now() - stableSince > 200) {
        return;
      }
    }
  }, elementId);
}

export async function openPhotoTour(page: Page): Promise<void> {
  // The reference's tour scroller has an overlay scrollbar that takes no space; hide ours (test-only).
  await page.addStyleTag({ content: '[role="dialog"] * { scrollbar-width: none; }' });
  await page.getByRole("button", { name: "Show all photos", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();
}

const tourRoomIndex = (room: string): number => {
  const index = listing.tour.findIndex((r) => r.room === room);
  if (index === -1) throw new Error(`Room not in listing.tour: ${room}`);
  return index;
};

export const STATES: Record<VisualState, StateDefinition> = {
  // Full page, scrollY 0, no overlay.
  full: {
    reference: "ref-full.png",
    fullPage: true,
    setup: async (page) => {
      await loadPage(page);
      await loadLazyImages(page);
    },
  },

  // First viewport, scrollY 0.
  top: {
    reference: "ref-top.png",
    fullPage: false,
    setup: loadPage,
  },

  // scrollY 1500: sticky section nav visible.
  "sticky-nav": {
    reference: "ref-sticky-nav.png",
    fullPage: false,
    setup: async (page) => {
      await loadPage(page);
      await scrollPageTo(page, 1500);
      await expect(page.getByRole("navigation", { name: "Listing sections" })).toBeVisible();
    },
  },

  // Photo tour opened from "Show all photos", scroller at top.
  "tour-top": {
    reference: "ref-tour-top.png",
    fullPage: false,
    setup: async (page) => {
      await loadPage(page);
      await openPhotoTour(page);
    },
  },

  // Photo tour after clicking the Bedroom category thumbnail.
  "tour-bedroom": {
    reference: "ref-tour-bedroom.png",
    fullPage: false,
    setup: async (page) => {
      await loadPage(page);
      await openPhotoTour(page);
      await page
        .getByRole("dialog", { name: "Photo tour" })
        .getByRole("navigation", { name: "Photo categories" })
        .getByRole("button", { name: "Bedroom", exact: true })
        .click();
      await waitForStablePosition(page, `tour-room-${tourRoomIndex("Bedroom")}`);
    },
  },

  // Photo viewer on photo 4 of 43, opened from the tour.
  "viewer-4": {
    reference: "ref-viewer-4.png",
    fullPage: false,
    setup: async (page) => {
      await loadPage(page);
      await openPhotoTour(page);
      await page
        .getByRole("dialog", { name: "Photo tour" })
        .getByRole("button", { name: `${listing.title} image 4`, exact: true })
        .click();
      const viewer = page.getByRole("dialog", { name: "Photo viewer" });
      await expect(viewer).toBeVisible();
      await expect(viewer.getByText(`4 of ${listing.tour.flatMap((r) => r.photos).length}`)).toBeVisible();
    },
  },

  // Amenities modal open with the page still at scrollY 0.
  amenities: {
    reference: "ref-amenities.png",
    fullPage: false,
    setup: async (page) => {
      await loadPage(page);
      // A DOM click does not scroll the button into view, so the page stays at the top.
      await page
        .getByRole("button", { name: `Show all ${listing.amenitiesTotal} amenities`, exact: true })
        .evaluate((el) => (el as HTMLElement).click());
      await expect(page.getByRole("dialog", { name: "What this place offers" })).toBeVisible();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    },
  },
};

/** Puts the page into `state` and saves tests/__output__/{state}.png. Returns the file path. */
export async function captureState(page: Page, state: VisualState): Promise<string> {
  const definition = STATES[state];
  await definition.setup(page);
  // Park the mouse where it hovers nothing, so no hover styles leak into the capture.
  await page.mouse.move(1, 1);
  await waitForVisibleImages(page);
  const path = `${OUTPUT_DIR}/${state}.png`;
  await page.screenshot({
    path,
    fullPage: definition.fullPage,
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });
  return path;
}
