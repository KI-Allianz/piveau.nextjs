describe("Dataset Tests", () => {
  beforeEach(function () {
    cy.visit("/de/catalogues");
  });

  it("dataset search page loads", () => {
    // Check if page has search input
    cy.get('input[role="search"]').should("be.visible");
  });

  it("dataset search url works", () => {
    // Type in search
    cy.get('input[role="search"]').type("test");

    cy.url().should("include", "q=test");
  });

  it("dataset search results work", () => {
    // Type in search
    cy.get('input[role="search"]').type("test").type("{enter}");

    // Check if results are visible
    const cardSelector = "main div.flex.flex-col.gap-4 a";
    cy.get(cardSelector, { timeout: 10000 }).should("be.visible");

    // Check if at least one result card exists
    cy.get(cardSelector).should("have.length.greaterThan", 0);

    // Check if name of first result contains "test"
    cy.get(cardSelector).first().contains(/test/i).should("be.visible");
  });

  it("dataset details page loads", () => {
    const cardSelector = "main div.flex.flex-col.gap-4 a";

    cy.get(cardSelector, { timeout: 10000 }).first().click();

    cy.url().should("match", /\/dataset\//);
  });
});
