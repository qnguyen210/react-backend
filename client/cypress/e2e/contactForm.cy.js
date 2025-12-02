describe("Contact Form", () => {
  it("submits form with authenticated user", () => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();

    // Intercept API call
    cy.intercept("POST", "**/contacts", {
      statusCode: 200,
      body: { message: "Contact saved successfully" }
    }).as("submitContact");
    
    // Visit the protected route and seed localStorage before the app boots
    cy.visit("http://localhost:5173/contact", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "auth",
          JSON.stringify({
            token: "fake-token-for-testing",
            user: { email: "test@example.com", role: "user", name: "Test User" }
          })
        );
      }
    });
    
    // Verify we're on the contact page
    cy.url().should("include", "/contact");
    cy.get('h2').contains("Contact").should("be.visible");
    
    // Fill out the form
    cy.get('input[name="name"]').should("be.visible").clear().type("Test User");
    cy.get('input[name="email"]').should("be.visible").clear().type("test@example.com");
    cy.get('textarea[name="message"]').should("be.visible").type("This is a test message");
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.wait("@submitContact");
    cy.contains("Contact saved successfully").should("be.visible");
  });
});
