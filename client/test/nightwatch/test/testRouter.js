describe("Router", function() {
  it("page not found", function(client) {
    client.page
      .notFound()
      .navigate()
      .waitForElementVisible("@page", 5000)
      .assert.containsText("@page", "404");
  });
});
