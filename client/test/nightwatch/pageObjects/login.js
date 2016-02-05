/* global module */
var commands = {
    login: function (done) {
        return this.navigate()
            .waitForElementVisible('#login', 5e3)
            .setValue('@emailInput', 'alice')
            .setValue('@passwordInput', 'password')
            .click('@submit')
            .waitForElementVisible('#account', 5e3)
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
            selector: 'input[placeholder=Email]',
        },
        passwordInput: {
            selector: 'input[type=password]',
        },
        submit: {
            selector: '.btn-signup',
        }
    }
};
