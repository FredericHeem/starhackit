describe('Register', function () {

    it('register an account', function (client) {
        client.page.register().navigate()
            .waitForElementVisible('.register-form', 5000)
            .setValue('@emailInput', 'alice@mail.com')
            .setValue('@usernameInput', 'alice')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.registration-request-complete', 5000)
    });
    it('missing username', function (client) {
        client.page.register().navigate()
            .waitForElementVisible('.register-form', 5000)
            .setValue('@emailInput', 'alice@mail.com')
            .setValue('@passwordInput', 'password')
            .click('@submit');

        client.assert.containsText('.register-form', 'The username is required')
    });
    it('missing email', function (client) {
        client.page.register().navigate()
            .waitForElementVisible('.register-form', 5000)
            .setValue('@usernameInput', 'alice')
            .setValue('@passwordInput', 'password')
            .click('@submit');

        client.assert.containsText('.register-form', 'The email is required')
    });
    it('missing password', function (client) {
        client.page.register().navigate()
            .waitForElementVisible('.register-form', 5000)
            .setValue('@usernameInput', 'alice')
            .setValue('@emailInput', 'alice@mail.com')
            .click('@submit');

        client.assert.containsText('.register-form', 'The password is required')
    });
});
