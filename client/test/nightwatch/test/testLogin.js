describe('Login', function () {
    after(function (client, done) {
        client.page.logout().logout(done)
    });
    it('login with no password', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('.login-page', 5000)
            .setValue('@emailInput', 'alice')
            .click('@submit')
            .waitForElementVisible('.username', 5000)
            .assert.containsText('.local-login-form', 'The password is required')
    });
    it('login with too short password', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('.login-page', 5000)
            .setValue('@emailInput', 'alice')
            .setValue('@passwordInput', 'pass')
            .click('@submit')
            .waitForElementVisible('.username', 5000)
            .assert.containsText('.local-login-form', 'The password must be at least 6 characters long')
    });
    it('login with no email', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('.login-page', 5000)
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.password', 5000)
            .assert.containsText('.local-login-form', 'The username is required')
    });
    it('login with incorrect password', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('.login-page', 5000)
            .setValue('@emailInput', 'alice')
            .setValue('@passwordInput', 'wrongpassword')
            .click('@submit')
            .waitForElementVisible('.alert-danger', 5000)
            .assert.containsText('.alert-danger', 'do not match');
    });
    it('login ok', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('.login-page', 5000)
            .setValue('@emailInput', 'alice')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.profile-page', 5e3);
    });

});
