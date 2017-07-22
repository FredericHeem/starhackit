/* global module */
var commands = {
    toUser: function (userId) {
        return this.navigate(this.api.launchUrl + '/users/' + userId)
    }
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/users';
    },
    elements: {
    }
};
