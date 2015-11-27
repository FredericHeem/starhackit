describe('Login', function () {
    before(function (client, done) {
        done();
    });

    after(function (client, done) {
        client.end(function () {
            done();
        });
    });
    it('login with no password', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('#login', 5000)
            .setValue('@emailInput', 'alice')
            .click('@submit')
            .waitForElementVisible('.has-error', 5000)
            .assert.containsText('.has-error span', 'The password is required');
    });
    it('login with no email', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('#login', 5000)
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.has-error', 5000)
            .assert.containsText('.has-error span', 'The email is required');
    });
    it('login with incorrect password', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('#login', 5000)
            .setValue('@emailInput', 'alice')
            .setValue('@passwordInput', 'wrongpassword')
            .click('@submit')
            .waitForElementVisible('.alert-danger', 5000)
            .assert.containsText('.alert-danger', 'do not match');
    });
    it('login ok', function (client) {
        client.page.login().navigate()
            .waitForElementVisible('#login', 5000)
            .setValue('@emailInput', 'alice')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementNotVisible('#login', 10000);
    });

});
