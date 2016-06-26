/* global module */
var commands = {
    login: function (done) {
        return this.navigate()
            .waitForElementVisible('#login', 5e3)
            .setValue('@emailInput', 'admin')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('#main-container', 5e3)
            .getLocation('#application', function() {
                done();
            });
    },
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/login';
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
