import { languageNames } from "@/lib/lang";
import { getTheme } from "@/themes";

describe("Homepage Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("homepage loads and displays title", () => {
    cy.contains("h1", "Willkommen zur KI-Allianz Datenplattform").should(
      "be.visible",
    );
  });

  it("homepage displays categories", () => {
    // Check if at least one category card exists and is visible
    cy.get(".flex.flex-col.items-center.w-40").first().should("be.visible");
  });

  it("navigation to datasets page", () => {
    cy.get('a[href*="/dataset"]').first().click();

    cy.url().should("match", /\/dataset/);
  });

  it("navigation to catalogues page", () => {
    cy.get('a[href*="/catalogues"]').first().click();

    cy.url().should("match", /\/catalogues/);
  });

  it("theme toggle works", () => {
    // Open the theme menu
    cy.get('button[aria-label="Toggle theme"]').click();

    // Select dark theme
    cy.get('[role="menuitem"]').contains("Dark").click();

    // Check if html tag has dark class
    cy.get("html").should("have.class", "dark");
  });

  it("language selector works", () => {
    const theme = getTheme(null);
    const defaultLanguage = languageNames[theme.lang.default];

    // Open language selector
    cy.get("button").contains(defaultLanguage).click({ force: true });

    // Check if all options are visible
    theme.lang.supported.forEach((lang) => {
      const langName = languageNames[lang];
      cy.get('[role="option"]').contains(langName).should("be.visible");
    });

    // Select Last language in the list
    const lastLang = theme.lang.supported[theme.lang.supported.length - 1];
    const lastLangName = languageNames[lastLang];

    cy.get('[role="option"]').contains(lastLangName).click();

    // Check URL changes to include the locale
    cy.url().should("match", new RegExp(`/${lastLang}`));
  });
});
