describe.skip('DbSchema', function() {
  before(function(client, done) {
    this.timeout(40e3);
    client.page.login().login(done);
  });

  after(function(client, done) {
    client.page.logout().logout(done);
  });

  it('view the db schema', function(client) {
    client.page.dbSchema().navigate().waitForElementVisible('.db-table', 30e3)
    client.pause(2e3);
  });
});
