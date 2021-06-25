const path = require("path");
const infraNameAws = "Aws Infra";
const infraNameGoogle = "grucloud-vm-tuto-1";
const infraNameAzure = "Azure Infra";
const infraNameOvh = "Ovh Infra";

const timeout = 5e3;
const pause = 200;
const googleCredentialFile = "grucloud-vm-tuto-1.json";

const {
  GIT_REPOSITORY_AWS,
  GIT_REPOSITORY_GCP,
  GIT_REPOSITORY_AZURE,
  GIT_REPOSITORY_OPENSTACK,
} = process.env;

const urlExamples = "https://github.com/grucloud/grucloud/";

const deleteInfra = async ({ client, infraName, timeout = 3e3 }) => {
  await client.page
    .infra()
    .navigate()
    .waitForElementVisible("form[data-infra-list=true]", timeout)
    .click(`li[data-infra-list-item-name="${infraName}"`)
    .waitForElementVisible("form[data-infra-detail=true]", timeout)
    .pause(pause)
    .click("@editSettingsButton")
    .pause(pause)
    .click("a[data-infra-edit-delete-link=true]")
    .pause(pause)
    .setValue("div[data-delete-name=true] input", infraName)
    .pause(pause)
    .click("button[data-infra-button-delete=true]")
    .pause(pause);
};

const gitConfiguration = ({ client, repositoryUrl }) => {
  client.page
    .infraCreate()
    .navigate()
    .waitForElementVisible("@formGitCredential", timeout)
    .setValue("@inputGitUsername", process.env.GIT_USERNAME)
    .pause(pause)
    .setValue("@inputGitPassword", process.env.PERSONAL_ACCESS_TOKEN)
    .pause(pause)
    .click("@submit")
    .waitForElementVisible("@formRepository", timeout)
    .setValue("@inputRepositoryUrl", repositoryUrl)
    .pause(pause)
    .click("@submit")
    .waitForElementVisible("@formProviderSelect", timeout);
};

const projectImportExisting = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("@formImportProject", timeout)
    .click("@buttonSelectionProjectImportExisting");
};

const projectImportFromTemplate = ({ client, directory }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("form[data-form-import-project=true]", timeout)
    .click("button[data-selection-project-new-from-template=true]")
    .pause(pause)
    .click(`button[data-template="${urlExamples}${directory}"]`);
};

// ProviderSelect
const providerSelectAws = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("@formProviderSelect", timeout)
    .click("@buttonSelectAws");
};

const providerSelectGoogle = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("@formProviderSelect", timeout)
    .click("@buttonSelectGoogle");
};

const providerSelectAzure = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("@formProviderSelect", timeout)
    .click("@buttonSelectAzure");
};

const providerSelectOvh = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("@formProviderSelect", timeout)
    .click("@buttonSelectOvh");
};

// Config
const configAWS = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("form[data-infra-create-aws=true]", timeout)
    .setValue("@inputInfraName", infraNameAws)
    .setValue("@inputAccessKeyId", process.env.AWSAccessKeyId)
    .setValue("@inputSecretKey", process.env.AWSSecretKey)
    // AWS_REGION
    .click("@submit")
    .waitForElementVisible("form[data-infra-detail=true]", 50e3)
    .pause(pause);
};

const configAzure = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("form[data-infra-create-azure=true]", timeout)
    .setValue("@inputAzureName", infraNameAzure)
    .setValue("@inputSubscriptionId", process.env.SUBSCRIPTION_ID)
    .setValue("@inputTenantId", process.env.TENANT_ID)
    .setValue("@inputAppId", process.env.APP_ID)
    .setValue("@inputPassword", process.env.PASSWORD)
    .click("@submit")
    .waitForElementVisible("form[data-infra-detail=true]", 50e3)
    .pause(pause);
};

const configGoogle = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("form[data-infra-create-google=true]", timeout)
    .setValue(
      "@inputFileGoogleUpload",
      path.resolve(__dirname, googleCredentialFile)
    )
    .click("@submit")
    .waitForElementVisible("form[data-infra-detail=true]", 50e3)
    .pause(pause);
};

const configOvh = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("form[data-infra-create-ovh=true]", timeout)
    .setValue("@inputInfraName", infraNameOvh)
    .setValue("@inputOsProjectId", process.env.OS_PROJECT_ID)
    .setValue("@inputOsProjectName", process.env.OS_PROJECT_NAME)
    .setValue("@inputOsUsername", process.env.OS_USERNAME)
    .setValue("@inputOsPassword", process.env.OS_PASSWORD)

    // OS_REGION_NAME
    .click("@submit")
    .waitForElementVisible("form[data-infra-detail=true]", 50e3)
    .pause(pause);
};

describe.only("Infra", function () {
  before(function (client, done) {
    this.timeout(40e3);
    client.page.login().login(done);
  });

  // after(function (client, done) {
  //   client.page.logout().logout(done);
  // });

  it("create aws from existing", function (client) {
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AWS });
    providerSelectAws({ client });
    projectImportExisting({ client });
    configAWS({ client });
  });

  it("create aws from template", function (client) {
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AWS });
    providerSelectAws({ client });
    projectImportFromTemplate({ client, directory: "examples/aws/ec2" });
    configAWS({ client });
  });

  it("delete aws", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameAws });
  });
  it("create azure", function (client) {
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AZURE });
    providerSelectAzure({ client });
    projectImportExisting({ client });
    configAzure({ client });
  });
  it("delete azure", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameAzure });
  });

  // Google
  it("create google", function (client) {
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_GCP });
    providerSelectGoogle({ client });
    projectImportExisting({ client });
    configGoogle({ client });
  });
  it("delete google", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameGoogle });
  });

  // OVH
  it("create ovh", function (client) {
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_OPENSTACK });
    providerSelectOvh({ client });
    projectImportExisting({ client });
    configOvh({ client });
  });

  it("delete ovh", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameOvh });
  });

  it("bad credentials", function (client) {
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AWS });
    providerSelectAws({ client });
    projectImportExisting({ client });

    client.page
      .infraCreate()
      .setValue("@inputInfraName", infraNameAws)
      .setValue("@inputAccessKeyId", Array(20).fill("K"))
      .setValue("@inputSecretKey", Array(40).fill("S"))
      .click("@submit")
      .waitForElementVisible("div[data-alert-error-create=true]", 50e3);
  });
});
