describe('Logout', function () {
    before(function (client, done) {
        client.page.login().login(done);
    });
    after(function (client, done) {
        client.page.logout().logout(done)
    });

    it('logout, go to profile, redirect to login', function (client) {
        client.page.logout().navigate()
            .waitForElementVisible('.logout-page', 5000);

        client.page.profile().navigate()
            .waitForElementVisible('.login-page', 5000)

        client.page.login()
            .setValue('@emailInput', 'admin')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.profile-page', 5000);
    });
});
