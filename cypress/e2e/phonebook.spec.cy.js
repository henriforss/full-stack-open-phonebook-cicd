describe("Phonebook", () => {
  it("front page can be opened", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Phonebook");
  });

  it("can add new entry", () => {
    cy.visit("http://localhost:3000");
    cy.get("#input-name").type("Testname");
    cy.get("#input-number").type("321-54321");
    cy.get("#input-submit").click();
    cy.wait(2000);
    cy.contains("Testname");
    cy.contains("321-54321");
  });

  it("can delete entry", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Testname").as("targetDiv");
    cy.get("@targetDiv").find("button").click();
  });
});
