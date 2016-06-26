describe.only('Logout', function () {
    before(function (client, done) {
        client.page.login().login(done);
    });

    after(function (client, done) {
        client
        .pause(2e3)
        .end(function () {
            done();
        });
    });

    it('logout', function (client) {
        client.page.logout().navigate()
            .waitForElementVisible('.logout-view', 5000);
    });
});
