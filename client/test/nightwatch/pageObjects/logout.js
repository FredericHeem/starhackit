/* global module */
var commands = {
    logout: function (done) {
        return this.navigate()
            .waitForElementVisible('.logout-page', 5e3)
            .getLocation('#application', function() {
                done();
            });
    }
};

module.exports = {
    commands: [commands],
    url: function () {
        return this.api.launchUrl + '/logout';
    },
    elements: {
    }
};
