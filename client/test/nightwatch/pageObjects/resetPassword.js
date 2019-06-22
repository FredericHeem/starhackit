/* global module */
var commands = {
    withResetCode: function (code) {
        return this.navigate(this.api.launchUrl + '/auth/resetPassword/' + code)
    }
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/auth/resetPassword/';
    },
    elements: {
        passwordInput: {
            selector: '#password'
        },
        submit: {
            selector: '.btn-reset-password'
        }
    }
};
