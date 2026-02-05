import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  if (test.info().project.name === "auth") {
    test.skip();
  }
});

test("catalogues page loads", async ({ page }) => {
  await page.goto("/catalogues");

  // Check if page has search input
  const searchInput = page.getByRole("textbox");
  await expect(searchInput).toBeVisible();
});

test("catalogues search works", async ({ page }) => {
  await page.goto("/catalogues");

  // Type in search
  const searchInput = page.getByRole("textbox");
  await searchInput.fill("test");
  await page.waitForTimeout(1000); // Wait for debounce

  // Check if URL has query
  await expect(page).toHaveURL(/q=test/);
});

test("catalogue details page loads", async ({ page }) => {
  await page.goto("/catalogues");

  // Wait for results to load
  await page.waitForSelector("main div.flex.flex-col.gap-4 a", {
    timeout: 10000,
  });

  // Click on first catalogue card
  const firstCard = page.locator("main div.flex.flex-col.gap-4 a").first();
  await firstCard.click();

  // Should navigate to /catalogues/[id]
  await expect(page).toHaveURL(/\/catalogues\//);
});
