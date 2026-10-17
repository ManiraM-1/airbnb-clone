import { expect, test } from "@playwright/test";
import listing from "../data/listing.json";

test("Airbnb Cereal VF loads through @font-face", async ({ page }) => {
  await page.goto("/");
  const loaded = await page.evaluate(async () => {
    const faces = await document.fonts.load('500 16px "Airbnb Cereal VF"');
    return faces.length > 0 && document.fonts.check('500 16px "Airbnb Cereal VF"');
  });
  expect(loaded).toBe(true);
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family.startsWith('"Airbnb Cereal VF"')).toBe(true);
});

test("sample images are served and decode", async ({ page }) => {
  await page.goto("/");
  const samples = [
    ...listing.hero,
    listing.host.avatar,
    listing.reviews.topics[0].icon,
    listing.moreStays[0].image,
    ...listing.assets.ui,
  ];
  const results = await page.evaluate(async (srcs) => {
    return Promise.all(
      srcs.map(async (src) => {
        const img = new Image();
        img.src = src;
        document.body.append(img);
        try {
          await img.decode();
          return { src, ok: img.naturalWidth > 0 };
        } catch {
          return { src, ok: false };
        }
      }),
    );
  }, samples);
  expect(results.filter((r) => !r.ok)).toEqual([]);
});
