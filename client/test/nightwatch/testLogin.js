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
        client
            .url('http://localhost:8080/login')
            .waitForElementVisible('#login', 5000)
            .setValue('input[placeholder=Email]', 'alice')
            .click('.btn-signup')
            .waitForElementVisible('.has-error', 5000)
            .assert.containsText('.has-error span', 'The password is required');
    });
    it('login with no email', function (client) {
        client
            .url('http://localhost:8080/login')
            .waitForElementVisible('#login', 5000)
            .setValue('input[type=password]', 'password')
            .click('.btn-signup')
            .waitForElementVisible('.has-error', 5000)
            .assert.containsText('.has-error span', 'The email is required');
    });
    it.only('login with incorrect password', function (client) {
        client
            .url('http://localhost:8080/login')
            .waitForElementVisible('#login', 5000)
            .setValue('input[type=password]', 'wrongpassword')
            .click('.btn-signup')
            .waitForElementVisible('.has-error', 5000)
            .assert.containsText('.has-error span', 'The email is required');
    });
    it('login ok', function (client) {
        client
            .url('http://localhost:8080/login')
            .waitForElementVisible('#login', 5000)
            .setValue('input[placeholder=Email]', 'alice')
            .setValue('input[type=password]', 'password')
            .click('.btn-signup')
            .waitForElementVisible('.btn-profile', 5000);
    });

});
