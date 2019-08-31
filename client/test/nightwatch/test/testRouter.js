describe("Router", function() {
  before(function(client, done) {
    this.timeout(40e3);
    client.page.login().login(done);
  });
  it.only("page not found", function(client) {
    client.page
      .notFound()
      .navigate()
      .waitForElementVisible("@page", 5000)
      .assert.containsText("@page", "404");
  });
});
