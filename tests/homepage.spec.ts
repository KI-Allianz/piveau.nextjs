import { defaultLocale, languageNames, SupportedLocales } from "@/lib/lang";
import { test, expect } from "@playwright/test";

test("homepage loads and displays title", async ({ page }) => {
  await page.goto("/");

  // Check the main title
  await expect(
    page.getByRole("heading", {
      name: "Willkommen zur KI-Allianz Datenplattform",
    }),
  ).toBeVisible();
});

test("homepage displays categories", async ({ page }) => {
  await page.goto("/");

  // Check if categories are loaded (at least one category card)
  const categoryCards = page.locator(".flex.flex-col.items-center.w-40");
  await expect(categoryCards.first()).toBeVisible();
});

test("navigation to datasets page", async ({ page }) => {
  await page.goto("/");

  // Click on Datasets nav item
  await page.locator('a[href*="/dataset"]').first().click();

  const isAuth = test.info().project.name === "auth";
  if (isAuth) {
    // Should have navigated to authentication page
    await expect(page).toHaveURL(
      new RegExp(`^((?!http://localhost:3001/).)*$`),
    );
  } else {
    // Should navigate to /dataset
    await expect(page).toHaveURL(/\/dataset/);
  }
});

test("navigation to catalogues page", async ({ page }) => {
  await page.goto("/");

  // Click on Catalogues nav item
  await page.locator('a[href*="/catalogues"]').first().click();

  const isAuth = test.info().project.name === "auth";
  if (isAuth) {
    // Should have navigated to authentication page
    await expect(page).toHaveURL(
      new RegExp(`^((?!http://localhost:3001/).)*$`),
    );
  } else {
    // Should navigate to /catalogues
    await expect(page).toHaveURL(/\/catalogues/);
  }
});

test("theme toggle works", async ({ page }) => {
  await page.goto("/");

  // Click the theme toggle button in footer
  const themeToggle = page.getByRole("button", { name: "Toggle theme" });
  await themeToggle.click();

  // Select dark theme
  await page.getByRole("menuitem", { name: "Dark" }).click();

  // Check if body has dark class
  await expect(page.locator("html")).toHaveAttribute("class", /dark/);
});

test("language selector works", async ({ page }) => {
  await page.goto("/");

  const defaultLanguage = languageNames[defaultLocale];

  // Open language selector
  const langSelect = page
    .locator("button")
    .filter({ hasText: defaultLanguage });
  await langSelect.click();

  // Check if options are visible
  for (const lang of SupportedLocales) {
    const langName = languageNames[lang];
    await expect(page.getByRole("option", { name: langName })).toBeVisible();
  }

  // Select Last language in the list
  const lastLang = SupportedLocales[SupportedLocales.length - 1];
  const lastLangName = languageNames[lastLang];
  await page.getByRole("option", { name: lastLangName }).click();

  // Check URL changes
  await expect(page).toHaveURL(new RegExp(`/${lastLang}`));
});
