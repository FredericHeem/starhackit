/* global module */
var commands = {
};

module.exports = {
    //commands: [commands],
    url: function () {
        return this.api.launchUrl + '/';
    },
    elements: {
        leftNavButton: {
            selector: '#app-bar button'
        }
    }
};
