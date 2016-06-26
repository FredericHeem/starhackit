/* global module */
var commands = {
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/app/profile';
    },
    elements: {

        submit: {
            selector: '.btn-signup',
        }
    }
};
