describe("Homepage Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("homepage loads and displays title", () => {
    cy.contains("h1", "Welcome to the HammerHAI data platform").should(
      "be.visible",
    );
  });

  it("homepage displays categories", () => {
    cy.request("/api/deployment").then((response) => {
      const showCategories =
        response.body.theme.data.homepage.showCategorySlider;

      if (showCategories) {
        // If enabled in the theme, verify it exists and is visible
        cy.get(".flex.flex-col.items-center.w-40").first().should("be.visible");
      } else {
        // If disabled in the theme, ensure it does not exist on the page
        cy.get(".flex.flex-col.items-center.w-40").should("not.exist");
      }
    });
  });

  it("navigation to datasets page", () => {
    cy.get('a[href*="/dataset"]').first().click();

    cy.url().should("match", /\/dataset/);
  });

  it("navigation to catalogues page", () => {
    cy.get('a[href*="/catalogues"]').first().click();

    cy.url().should("match", /\/catalogues/);
  });
});
