/* global module */
var commands = {
    login: function (done) {
        return this.navigate()
            .waitForElementVisible('.login-page', 10e3)
            .setValue('@emailInput', 'admin')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('.profile-page', 10e3)
            .getLocation('#application', function() {
                done();
            });
    }
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/auth/login';
    },
    elements: {
        emailInput: {
            selector: '#username'
        },
        passwordInput: {
            selector: '#password'
        },
        submit: {
            selector: '.btn-login'
        }
    }
};
