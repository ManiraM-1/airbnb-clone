import { expect, test } from "@playwright/test";
import listing from "../data/listing.json";

test("page loads with the listing title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(listing.pageTitle);
});

test("GET /api/listing returns the listing JSON", async ({ request }) => {
  const res = await request.get("/api/listing");
  expect(res.ok()).toBe(true);
  expect(await res.json()).toEqual(listing);
});
