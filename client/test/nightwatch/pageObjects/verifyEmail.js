/* global module */
var commands = {
    withCode: function (code) {
        return this.navigate(this.api.launchUrl + '/auth/verifyEmail/' + code)
    }
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/auth/verifyEmail/';
    },
    elements: {
    }
};
