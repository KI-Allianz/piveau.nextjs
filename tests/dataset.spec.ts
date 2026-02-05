import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  if (test.info().project.name === "auth") {
    test.skip();
  }
});

test("dataset search page loads", async ({ page }) => {
  await page.goto("/dataset");

  // Check if page has search input
  const searchInput = page.getByRole("textbox");
  await expect(searchInput).toBeVisible();
});

test("dataset search works", async ({ page }) => {
  await page.goto("/dataset");

  // Type in search
  const searchInput = page.getByRole("textbox");
  await searchInput.fill("test");
  await page.waitForTimeout(1000); // Wait for debounce

  // Check if URL has query
  await expect(page).toHaveURL(/q=test/);
});

test("dataset details page loads", async ({ page }) => {
  await page.goto("/dataset");

  // Wait for results to load
  await page.waitForSelector("main div.flex.flex-col.gap-4 a", {
    timeout: 10000,
  });

  // Click on first dataset card
  const firstCard = page.locator("main div.flex.flex-col.gap-4 a").first();
  await firstCard.click();

  // Should navigate to /dataset/[id]
  await expect(page).toHaveURL(/\/dataset\//);
});
