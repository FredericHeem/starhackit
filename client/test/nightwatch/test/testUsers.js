describe('Users', function () {
    before(function (client, done) {
        client.page.login().login(done);
    });
    after(function (client, done) {
        client.page.logout().logout(done)
    });

    it('read users', function (client) {
        client.page.users().navigate()
            .waitForElementVisible('.users-view', 5000);
    });
    it.skip('read one users', function (client) {
        client.page.users().toUser("1")
            .waitForElementVisible('.user-view', 5000);
    });
});
