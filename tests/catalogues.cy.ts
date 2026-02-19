describe("Catalogues Search and Details", () => {
  beforeEach(function () {
    cy.visit("/de/catalogues");
  });

  it("catalogues page loads", () => {
    // Check if page has search input
    cy.get('input[role="search"]').should("be.visible");
  });

  it("catalogues search works", () => {
    // Type in search
    cy.get('input[role="search"]').type("test");

    cy.url().should("match", /q=test/);
  });
});
