/* global module */
var commands = {
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/idonotexist';
    },
    elements: {
        page: {
            selector: '.page-not-found'
        }
    }
};
