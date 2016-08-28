describe('DbSchema', function () {
    before(function (client, done) {
        client.page.login().login(done);
    });

    after(function (client, done) {
        client.page.logout().logout(done)
    });

    it('view the db schema', function (client) {
        client.page.dbSchema().navigate()
            .waitForElementVisible('.schema-view', 5000)
    });
});
