/* global module */
var commands = {};

module.exports = {
  commands: [commands],
  url: function () {
    return this.api.launchUrl + "/infra/create";
  },
  elements: {
    submit: {
      selector: "button[data-infra-create-submit=true]",
    },
    nameInput: {
      selector: ".infra-name input",
    },
    accessKeyIdInput: {
      selector: ".access-key input",
    },
    secretKeyInput: {
      selector: ".secret-key input",
    },
    alertError: {
      selector: "div[data-alert-error-create=true]",
    },
  },
};
