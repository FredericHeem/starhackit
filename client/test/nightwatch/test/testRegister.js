describe('Register', function () {
    before(function (client, done) {
        done();
    });

    after(function (client, done) {
        client.end(function () {
            done();
        });
    });

    it('register no password', function (client) {
        client.page.register().navigate()
            .waitForElementVisible('.register-form', 5000)
            .setValue('@emailInput', 'alice@mail.com')
            .setValue('@usernameInput', 'alice')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.registration-request-complete', 5000)
    });
});
