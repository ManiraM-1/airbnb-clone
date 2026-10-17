// Behaviour of SPEC §2 Header, §3 Title row, §4 Hero gallery.
import { expect, test, type Locator } from "@playwright/test";
import listing from "../data/listing.json";

test.use({ reducedMotion: "reduce" });

const bg = (locator: Locator) => locator.evaluate((el) => getComputedStyle(el).backgroundColor);
const afterBg = (locator: Locator) =>
  locator.evaluate((el) => getComputedStyle(el, "::after").backgroundColor);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("header §2", () => {
  test("controls exist with SPEC labels and do nothing", async ({ page }) => {
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Airbnb homepage" })).toBeVisible();
    const search = header.getByRole("search");
    for (const name of ["Anywhere", "Anytime", "Add guests", "Search"]) {
      await expect(search.getByRole("button", { name, exact: true })).toBeVisible();
    }
    await expect(header.getByRole("button", { name: "Choose a language and currency" })).toBeVisible();
    await expect(header.getByRole("button", { name: "Main navigation menu" })).toBeVisible();

    const host = header.getByRole("link", { name: "Become a host" });
    await host.click();
    expect(page.url()).toBe(new URL("/", page.url()).href); // no "#" appended, no navigation
  });

  test("Become a host hover bg is #F7F7F7", async ({ page }) => {
    const host = page.getByRole("link", { name: "Become a host" });
    expect(await bg(host)).toBe("rgba(0, 0, 0, 0)");
    await host.hover();
    await expect.poll(() => bg(host)).toBe("rgb(247, 247, 247)");
  });

  test("globe and menu circles are #F2F2F2", async ({ page }) => {
    for (const name of ["Choose a language and currency", "Main navigation menu"]) {
      const button = page.getByRole("button", { name });
      expect(await bg(button)).toBe("rgb(242, 242, 242)");
      expect(await button.evaluate((el) => [el.clientWidth, el.clientHeight])).toEqual([40, 40]);
    }
  });
});

test.describe("title row §3", () => {
  test("h1 shows the listing title", async ({ page }) => {
    await expect(page.locator("section#photos h1")).toHaveText(listing.title);
  });

  test("Save toggles Saved with a filled Rausch heart and aria-pressed", async ({ page }) => {
    const save = page.getByRole("button", { name: "Save", exact: true });
    await expect(save).toHaveAttribute("aria-pressed", "false");
    await save.click();
    const saved = page.getByRole("button", { name: "Saved", exact: true });
    await expect(saved).toHaveAttribute("aria-pressed", "true");
    const heart = saved.locator("svg");
    expect(await heart.evaluate((el) => getComputedStyle(el).fill)).toBe("rgb(255, 56, 92)");
    await saved.click();
    await expect(page.getByRole("button", { name: "Save", exact: true })).toHaveAttribute("aria-pressed", "false");
  });

  test("Share and Save hover bg is #F2F2F2", async ({ page }) => {
    for (const name of ["Share", "Save"]) {
      const button = page.getByRole("button", { name, exact: true });
      await button.hover();
      await expect.poll(() => bg(button)).toBe("rgb(242, 242, 242)");
    }
  });

  test("Share does not navigate or throw", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.getByRole("button", { name: "Share", exact: true }).click();
    expect(errors).toEqual([]);
    expect(new URL(page.url()).pathname).toBe("/");
  });
});

test.describe("hero gallery §4", () => {
  test("five labelled image buttons; only the hovered one darkens", async ({ page }) => {
    const gallery = page.getByRole("region", { name: "Photos of this place" });
    const cells = [1, 2, 3, 4, 5].map((n) =>
      gallery.getByRole("button", { name: `${listing.title} image ${n}`, exact: true }),
    );
    for (const cell of cells) await expect(cell).toBeVisible();

    await cells[2].hover();
    await expect.poll(() => afterBg(cells[2])).toBe("rgba(0, 0, 0, 0.1)");
    for (const other of [cells[0], cells[1], cells[3], cells[4]]) {
      expect(await afterBg(other)).toBe("rgba(0, 0, 0, 0)");
    }
  });

  test("hero images render the data's hero photos in order", async ({ page }) => {
    const gallery = page.getByRole("region", { name: "Photos of this place" });
    const srcs = await gallery.locator("img").evaluateAll((imgs) =>
      imgs.map((img) => new URL((img as HTMLImageElement).currentSrc).pathname),
    );
    expect(srcs).toEqual(listing.hero);
  });

  test("Show all photos: bordered button with #F7F7F7 hover", async ({ page }) => {
    const showAll = page.getByRole("button", { name: "Show all photos", exact: true });
    expect(await bg(showAll)).toBe("rgb(255, 255, 255)");
    await showAll.hover();
    await expect.poll(() => bg(showAll)).toBe("rgb(247, 247, 247)");
  });

  test("hero focus ring is 2px #222 with 3px offset and not clipped", async ({ page }) => {
    const first = page.getByRole("button", { name: `${listing.title} image 1`, exact: true });
    await first.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab"); // keyboard focus, so :focus-visible applies
    const ring = await first.evaluate((el) => {
      const s = getComputedStyle(el);
      return [el.matches(":focus-visible"), s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset];
    });
    expect(ring).toEqual([true, "solid", "2px", "rgb(34, 34, 34)", "3px"]);
    // No ancestor up to the gallery clips the ring.
    const clipped = await first.evaluate((el) => {
      for (let node = el.parentElement; node && node.tagName !== "SECTION"; node = node.parentElement) {
        if (getComputedStyle(node).overflow !== "visible") return true;
      }
      return getComputedStyle(el.closest("section")!).overflow !== "visible";
    });
    expect(clipped).toBe(false);
  });
});

test("Tab order follows visual order through header, title row and gallery", async ({ page }) => {
  const expected = [
    "Airbnb homepage",
    "Anywhere",
    "Anytime",
    "Add guests",
    "Search",
    "Become a host",
    "Choose a language and currency",
    "Main navigation menu",
    "Share",
    "Save",
    ...[1, 2, 3, 4, 5].map((n) => `${listing.title} image ${n}`),
    "Show all photos",
  ];
  const seen: string[] = [];
  for (let i = 0; i < expected.length; i++) {
    await page.keyboard.press("Tab");
    seen.push(
      await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return el?.getAttribute("aria-label") ?? el?.textContent?.trim() ?? "";
      }),
    );
  }
  expect(seen).toEqual(expected);
});
