/* global module */
var commands = {
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/auth/register';
    },
    elements: {
        emailInput: {
            selector: '#email'
        },
        usernameInput: {
            selector: '#username'
        },
        passwordInput: {
            selector: '#password'
        },
        submit: {
            selector: '.btn-register'
        }
    }
};
