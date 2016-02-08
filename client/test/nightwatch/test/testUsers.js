describe('Users', function () {
    before(function (client, done) {
        client.page.login().login(done);
    });

    after(function (client, done) {
        client
        .pause(1e3)
        .end(function () {
            done();
        });
    });

    it('read users', function (client) {
        client.page.users().navigate()
            .waitForElementVisible('#users-view', 5000);
    });
});
