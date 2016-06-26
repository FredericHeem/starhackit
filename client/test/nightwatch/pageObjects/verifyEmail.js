/* global module */
var commands = {
    withCode: function (code) {
        return this.navigate(this.api.launchUrl + '/verifyEmail/' + code)
    }
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/verifyEmail/';
    },
    elements: {
    }
};
