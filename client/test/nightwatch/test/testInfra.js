const path = require("path");
const infraNameAws = "Aws Infra";
const infraNameGoogle = "grucloud-vm-tuto-1";
const infraNameAzure = "Azure Infra";
const infraNameOvh = "Ovh Infra";
const infraNewName = (name) => `${name}`;
const timeout = 500e3;
const timeoutLong = 300e3;

const pause = 100;
const googleCredentialFile = "grucloud-vm-tuto-1.json";

const {
  GIT_REPOSITORY_AWS,
  GIT_REPOSITORY_AWS_EKS,
  GIT_REPOSITORY_GCP,
  GIT_REPOSITORY_AZURE,
  GIT_REPOSITORY_OPENSTACK,
} = process.env;

const urlExamples = "https://github.com/grucloud/grucloud/";

const navigateInfra = async ({ client, infraName, timeout = 3e3 }) => {
  await client.page
    .infra()
    .waitForElementVisible("form[data-infra-list=true]", timeout)
    .waitForElementVisible(
      `li[data-infra-list-item-name="${infraName}"`,
      timeout
    )
    .click(`li[data-infra-list-item-name="${infraName}"`)
    .waitForElementVisible("form[data-infra-detail=true]", timeout);
};

const deleteInfra = async ({ client, infraName, timeout = 3e3 }) => {
  await client.page
    .infra()
    .navigate()
    .waitForElementVisible("form[data-infra-list=true]", timeout)
    .waitForElementVisible(
      `li[data-infra-list-item-name="${infraName}"`,
      timeout
    )

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

const navigate = ({ client }) => {
  client.page.infraCreate().navigate();
};

const navigateInfraList = ({ client }) => {
  client.page.infra().navigate();
};

const gitConfiguration = ({
  client,
  repositoryUrl,
  password = process.env.PERSONAL_ACCESS_TOKEN,
}) => {
  client.page
    .infraCreate()
    .waitForElementVisible("@formGitCredential", timeout)
    .setValue("@inputGitUsername", process.env.GIT_USERNAME)
    .pause(pause)
    .setValue("@inputGitPassword", password)
    .pause(pause)
    .click("@submit")
    .waitForElementVisible("@formRepository", timeout)
    .setValue("@inputRepositoryUrl", repositoryUrl)
    .pause(pause)
    .click("@submit");
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
    .click(`button[data-id="${urlExamples}${directory}"]`);
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

// Infra Settings

const infraSettings = ({ client, infraName }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("form[data-form-infra-settings=true]", timeout)
    .setValue('input[name="infraName"]', infraName)
    .setValue('input[name="stage"]', "uat")
    .click("button[data-button-submit=true]");
};
// Config
const configAWS = ({ client }) => {
  client.page
    .infraCreate()
    .waitForElementVisible("form[data-infra-create=true]", timeout)
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
    .waitForElementVisible("form[data-infra-create=true]", timeout)
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
    .waitForElementVisible("form[data-infra-create=true]", timeout)
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
    .waitForElementVisible("form[data-infra-create=true]", timeout)
    .setValue("@inputOsProjectId", process.env.OS_PROJECT_ID)
    .setValue("@inputOsProjectName", process.env.OS_PROJECT_NAME)
    .setValue("@inputOsUsername", process.env.OS_USERNAME)
    .setValue("@inputOsPassword", process.env.OS_PASSWORD)

    // OS_REGION_NAME
    .click("@submit")
    .waitForElementVisible("form[data-infra-detail=true]", 50e3)
    .pause(pause);
};

// Update
const updateAWS = ({ client, infraName }) => {
  navigateInfra({ client, infraName });

  client.page
    .infraCreate()
    .click("button[data-infra-edit-button=true]")
    .waitForElementVisible("form[data-infra-update=true]", timeout)
    .setValue("@inputAccessKeyId", process.env.AWSAccessKeyId)
    .setValue("@inputSecretKey", process.env.AWSSecretKey)
    .click("button[data-infra-update-submit=true]")
    .waitForElementVisible("form[data-infra-detail=true]", timeoutLong)
    .pause(pause);
};
const updateAzure = ({ client, infraName }) => {
  navigateInfra({ client, infraName });

  client.page
    .infraCreate()
    .click("button[data-infra-edit-button=true]")
    .waitForElementVisible("form[data-infra-update=true]", timeout)
    // .clearValue("@inputAzureName")
    // .setValue("@inputAzureName", infraNewName(infraName))
    .click("button[data-infra-update-submit=true]")
    .waitForElementVisible("form[data-infra-detail=true]", timeoutLong)
    .pause(pause);
};
const updateGoogle = ({ client, infraName }) => {
  navigateInfra({ client, infraName });

  client.page
    .infraCreate()
    .click("button[data-infra-edit-button=true]")
    .waitForElementVisible("form[data-infra-update=true]", timeout)
    .clearValue("@inputFileGoogleUpload")

    .setValue(
      "@inputFileGoogleUpload",
      path.resolve(__dirname, googleCredentialFile)
    )
    .click("@submit")
    .click("button[data-infra-update-submit=true]")
    .waitForElementVisible("form[data-infra-detail=true]", timeoutLong)
    .pause(pause);
};

const updateOvh = ({ client, infraName }) => {
  navigateInfra({ client, infraName });

  client.page
    .infraCreate()
    .click("button[data-infra-edit-button=true]")
    .waitForElementVisible("form[data-infra-update=true]", timeout)
    // .clearValue("@inputInfraName")
    // .setValue("@inputInfraName", infraNewName(infraName))
    .click("button[data-infra-update-submit=true]")
    .pause(pause);
};

// TEST
describe.only("Infra", function () {
  before(function (client, done) {
    this.timeout(40e3);
    client.page.login().login(done);
  });

  // after(function (client, done) {
  //   client.page.logout().logout(done);
  // });

  it("create aws from existing", function (client) {
    navigate({ client });
    providerSelectAws({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameAws });
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AWS });
    configAWS({ client });
  });

  it("error git credential", function (client) {
    navigate({ client });
    providerSelectAws({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameAws });
    gitConfiguration({
      client,
      repositoryUrl: GIT_REPOSITORY_AWS,
      password: "xxxxxx",
    });

    client.page
      .infraCreate()
      .waitForElementVisible(`div[data-input-error="gitUsername"]`, timeout)
      .assert.containsText(
        `div[data-input-error="gitUsername"]`,
        "Invalid username or password"
      );
  });
  it("error pushing repo 404", function (client) {
    navigate({ client });
    providerSelectAws({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameAws });
    gitConfiguration({
      client,
      repositoryUrl: "https://github.com/grucloud/grucloud/xxxxx",
    });

    client.page
      .infraCreate()
      .waitForElementVisible(`div[data-input-error="repositoryUrl"]`, timeout)
      .assert.containsText(
        `div[data-input-error="repositoryUrl"]`,
        "Not Found"
      );
  });

  it("error repo url malformed", function (client) {
    navigate({ client });
    providerSelectAws({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameAws });
    gitConfiguration({
      client,
      repositoryUrl: "xxxxx",
    });

    client.page
      .infraCreate()
      .waitForElementVisible(`div[data-input-error="repositoryUrl"]`, timeout)
      .assert.containsText(
        `div[data-input-error="repositoryUrl"]`,
        "UrlParseError"
      );
  });
  it("update aws", function (client) {
    navigateInfraList({ client });
    updateAWS({ client, infraName: infraNameAws });
  });

  it("delete aws", async function (client, done) {
    await deleteInfra({ client, infraName: infraNewName(infraNameAws) });
  });
  it("create azure", function (client) {
    navigate({ client });
    providerSelectAzure({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameAzure });
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AZURE });
    configAzure({ client });
  });
  it("update azure", function (client) {
    navigateInfraList({ client });
    updateAzure({ client, infraName: infraNameAzure });
  });
  it("delete azure", async function (client, done) {
    await deleteInfra({ client, infraName: infraNewName(infraNameAzure) });
  });

  // Google
  it("create google", function (client) {
    navigate({ client });
    providerSelectGoogle({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameGoogle });
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_GCP });
    configGoogle({ client });
  });

  it("update google", function (client) {
    navigateInfraList({ client });
    updateGoogle({ client, infraName: infraNameGoogle });
  });
  it("delete google", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameGoogle });
  });

  // OVH
  it("create ovh", function (client) {
    navigate({ client });
    providerSelectOvh({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameOvh });
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_OPENSTACK });
    configOvh({ client });
  });

  it("update ovh", function (client) {
    navigateInfraList({ client });
    updateOvh({ client, infraName: infraNameOvh });
  });

  it("delete ovh", async function (client, done) {
    await deleteInfra({ client, infraName: infraNewName(infraNameOvh) });
  });

  it.skip("bad credentials", function (client) {
    navigate({ client });
    providerSelectAws({ client });
    projectImportExisting({ client });
    infraSettings({ client, infraName: infraNameAws });
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AWS });

    client.page
      .infraCreate()
      .setValue("@inputInfraName", infraNameAws)
      .setValue("@inputAccessKeyId", Array(20).fill("K"))
      .setValue("@inputSecretKey", Array(40).fill("S"))
      .click("@submit")
      .waitForElementVisible("div[data-alert-error-create=true]", 50e3);
  });

  it("create aws from template ec2", function (client) {
    navigate({ client });
    providerSelectAws({ client });
    projectImportFromTemplate({ client, directory: "examples/aws/ec2" });
    infraSettings({ client, infraName: "ec2" });
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AWS });
    configAWS({ client });
  });
  it("create aws from template eks", function (client) {
    navigate({ client });
    providerSelectAws({ client });
    projectImportFromTemplate({
      client,
      directory: "packages/modules/aws/eks/example",
    });
    infraSettings({ client, infraName: "eks" });
    gitConfiguration({ client, repositoryUrl: GIT_REPOSITORY_AWS_EKS });
    configAWS({ client });
  });
});
