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
            .setValue('@emailInput', 'alice')
            .click('@submit')
            .waitForElementVisible('.username', 5000)
            //.assert.containsText('.has-error span', 'The email must be a valid email address');
    });
});
