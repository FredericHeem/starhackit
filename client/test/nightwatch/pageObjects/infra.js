/* global module */
var commands = {};

module.exports = {
  commands: [commands],
  url: function () {
    return this.api.launchUrl + "/infra";
  },
  elements: {
    listItem: {
      selector: "li[data-infra-list-item=true]",
    },
    editSettingsButton: {
      selector: "button[data-infra-edit-button=true]",
    },
  },
};
