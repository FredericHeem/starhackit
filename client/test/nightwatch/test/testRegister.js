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
        client
            .url(`${client.launch_url}/signup`)
            .waitForElementVisible('#signup', 5000)
            .setValue('input[placeholder=Email]', 'alice')
            .click('.btn-signup')
            .waitForElementVisible('.has-error', 5000)
            .assert.containsText('.has-error span', 'The email must be a valid email address');
    });
});
