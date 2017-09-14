/* global module */
var commands = {
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/profile';
    },
    elements: {
        submit: {
            selector: '.btn-update-profile'
        },
        biographyInput: {
            selector: '.biography-input'
        }
    }
};
