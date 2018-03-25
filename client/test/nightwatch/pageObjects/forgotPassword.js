/* global module */
var commands = {
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/forgot';
    },
    elements: {
        emailInput: {
            selector: '.data-test-email-input'
        },
        submit: {
            selector: '.btn-forgot-password'
        }
    }
};
