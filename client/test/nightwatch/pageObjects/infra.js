/* global module */
var commands = {};

module.exports = {
  commands: [commands],
  url: function () {
    return this.api.launchUrl + "/infra";
  },
  elements: {
    listItem: {
      selector: "section[data-infra-list-item=true]",
    },
    editSettingsButton: {
      selector: "button[data-infra-edit-button=true]",
    },
  },
};
