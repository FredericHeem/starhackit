describe('Profile', function () {
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

    it.only('read profile', function (client) {

        client.page.profile().navigate()
            .waitForElementVisible('#profile', 5000);

    });
});
