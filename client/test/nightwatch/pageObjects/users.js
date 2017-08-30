/* global module */
var commands = {
    toUser: function (userId) {
        return this.navigate(this.api.launchUrl + '/admin/users/' + userId)
    }
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/admin/users';
    },
    elements: {
    }
};
