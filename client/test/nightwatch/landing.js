module.exports = {
    'register empty password': function (browser) {
        browser
            .url('http://localhost:8080')
            .waitForElementVisible('body', 1000)
            .url('http://localhost:8080/signup')
            .setValue('input[placeholder=Email]', 'alice')
            .setValue('input[type=password]', 'password')
            .click('.btn-signup')
            .pause(2000)
            .end();
    },
    'login click with no password': function (browser) {
        browser
            .url('http://localhost:8080')
            .waitForElementVisible('body', 1000)
            .url('http://localhost:8080/login')
            .setValue('input[placeholder=Email]', 'alice')
            .click('.btn-signup')

            .pause(2000)
            .end();
    },
    'login': function (browser) {
        browser
            .url('http://localhost:8080')
            .waitForElementVisible('body', 1000)
            .url('http://localhost:8080/login')
            .setValue('input[placeholder=Email]', 'alice')
            .setValue('input[type=password]', 'password')
            .click('.btn-signup')
            .pause(2000)
            .end();
    }
};
