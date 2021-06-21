/* global module */
var commands = {};

module.exports = {
  commands: [commands],
  url: function () {
    return this.api.launchUrl + "/infra/create";
  },
  elements: {
    formProviderSelect: {
      selector: "form[data-form-provider-select=true]",
    },
    buttonSelectAws: {
      selector: "button[data-button-select-aws=true]",
    },
    buttonSelectGoogle: {
      selector: "button[data-button-select-google=true]",
    },
    buttonSelectAzure: {
      selector: "button[data-button-select-azure=true]",
    },
    buttonSelectOvh: {
      selector: "button[data-button-select-ovh=true]",
    },
    submit: {
      selector: "button[data-infra-create-submit=true]",
    },
    submitUpdate: {
      selector: "button[data-infra-update-submit=true]",
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
    formCreateAzure: {
      selector: "data-infra-create-azure",
    },
    inputAzureName: {
      selector: "input[data-input-azure-name=true]",
    },
    inputSubscriptionId: {
      selector: "input[data-input-azure-subscription-id=true]",
    },
    inputTenantId: { selector: "input[data-input-azure-tenant-id=true]" },
    inputAppId: { selector: "input[data-input-azure-app-id=true]" },
    inputPassword: { selector: "input[data-input-azure-password=true]" },
    inputFileGoogleUpload: {
      selector: "input[data-input-google-upload=true]",
    },
    inputInfraName: { selector: "input[name=infraName]" },
    inputOsProjectId: { selector: "input[name=OS_PROJECT_ID]" },
    inputOsProjectName: { selector: "input[name=OS_PROJECT_NAME]" },
    inputOsUsername: { selector: "input[name=OS_USERNAME]" },
    inputOsPassword: { selector: "input[name=OS_PASSWORD]" },
    alertError: {
      selector: "div[data-alert-error-create=true]",
    },
  },
};
