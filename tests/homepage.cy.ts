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
});
