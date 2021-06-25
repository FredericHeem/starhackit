/* global module */
var commands = {};

module.exports = {
  commands: [commands],
  url: function () {
    return this.api.launchUrl + "/infra/create";
  },
  elements: {
    formImportProject: {
      selector: "form[data-form-import-project=true]",
    },
    buttonSelectionProjectImportExisting: {
      selector: "button[data-selection-project-import-existing=true]",
    },
    submit: {
      selector: "button[data-button-submit=true]",
    },
    formGitCredential: {
      selector: "form[data-form-git-credential-config=true]",
    },
    inputGitUsername: { selector: "input[name=gitUsername]" },
    inputGitPassword: { selector: "input[name=gitPassword]" },

    formRepository: {
      selector: "form[data-form-repository-config=true]",
    },
    inputRepositoryUrl: { selector: "input[name=repositoryUrl]" },
    inputRepositoryBranch: { selector: "input[name=repositoryBranch]" },

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
    submitUpdate: {
      selector: "button[data-infra-update-submit=true]",
    },

    inputAccessKeyId: { selector: "input[name=AWSAccessKeyId]" },
    inputSecretKey: { selector: "input[name=AWSSecretKey]" },

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
