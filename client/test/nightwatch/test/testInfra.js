const path = require("path");
const infraNameAws = "Aws Infra";
const infraNameGoogle = "grucloud-vm-tuto-1";
const infraNameAzure = "Azure Infra";
const infraNameOvh = "Ovh Infra";

const delay = 5e3;
const pause = 300;
const googleCredentialFile = "grucloud-vm-tuto-1.json";

const deleteInfra = async ({ client, infraName, delay = 3e3 }) => {
  await client.page
    .infra()
    .navigate()
    .waitForElementVisible("form[data-infra-list=true]", delay)
    .click(`li[data-infra-list-item-name="${infraName}"`)
    .waitForElementVisible("form[data-infra-detail=true]", delay)
    .pause(pause)
    .click("@editSettingsButton")
    .pause(pause)
    .click("a[data-infra-edit-delete-link=true]")
    .pause(pause)
    .setValue("div[data-delete-name=true] input", infraName)
    .click("button[data-infra-button-delete=true]")
    .pause(pause);
};

const gitConfiguration = ({ client }) => {
  client.page
    .infraCreate()
    .navigate()
    .waitForElementVisible("@formGitCredential", delay)
    .setValue("@inputGitUsername", process.env.GIT_USERNAME)
    .setValue("@inputGitPassword", process.env.PERSONAL_ACCESS_TOKEN)
    .click("@submit")
    .waitForElementVisible("@formRepository", delay)
    .setValue("@inputRepositoryUrl", process.env.GIT_REPOSITORY)
    .click("@submit")
    .waitForElementVisible("@formProviderSelect", delay);
};
describe.only("Infra", function () {
  before(function (client, done) {
    this.timeout(40e3);
    client.page.login().login(done);
  });

  // after(function (client, done) {
  //   client.page.logout().logout(done);
  // });

  it("create aws", function (client) {
    gitConfiguration({ client });

    client.page
      .infraCreate()
      .waitForElementVisible("@formProviderSelect", delay)
      .click("@buttonSelectAws")
      .waitForElementVisible("form[data-infra-create-aws=true]", delay)
      .setValue("@inputInfraName", infraNameAws)
      .setValue("@inputAccessKeyId", process.env.AWSAccessKeyId)
      .setValue("@inputSecretKey", process.env.AWSSecretKey)
      // AWS_REGION
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(pause);
  });
  it("delete aws", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameAws });
  });
  it("create azure", function (client) {
    gitConfiguration({ client });

    client.page
      .infraCreate()
      .waitForElementVisible("@formProviderSelect", delay)
      .click("@buttonSelectAzure")
      .waitForElementVisible("form[data-infra-create-azure=true]", delay)
      .setValue("@inputAzureName", infraNameAzure)
      .setValue("@inputSubscriptionId", process.env.SUBSCRIPTION_ID)
      .setValue("@inputTenantId", process.env.TENANT_ID)
      .setValue("@inputAppId", process.env.APP_ID)
      .setValue("@inputPassword", process.env.PASSWORD)
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(pause);
  });
  it("delete azure", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameAzure });
  });
  it("create google", function (client) {
    gitConfiguration({ client });
    client.page
      .infraCreate()
      .waitForElementVisible("@formProviderSelect", delay)
      .click("@buttonSelectGoogle")
      .waitForElementVisible("form[data-infra-create-google=true]", delay)
      .setValue(
        "@inputFileGoogleUpload",
        path.resolve(__dirname, googleCredentialFile)
      )
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(pause);
  });
  it("delete google", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameGoogle });
  });

  it("create ovh", function (client) {
    gitConfiguration({ client });

    client.page
      .infraCreate()
      .waitForElementVisible("@formProviderSelect", delay)
      .click("@buttonSelectOvh")
      .waitForElementVisible("form[data-infra-create-ovh=true]", delay)
      .setValue("@inputInfraName", infraNameOvh)
      .setValue("@inputOsProjectId", process.env.OS_PROJECT_ID)
      .setValue("@inputOsProjectName", process.env.OS_PROJECT_NAME)
      .setValue("@inputOsUsername", process.env.OS_USERNAME)
      .setValue("@inputOsPassword", process.env.OS_PASSWORD)

      // OS_REGION_NAME
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(pause);
  });

  it("delete ovh", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameOvh });
  });

  it("bad credentials", function (client) {
    gitConfiguration({ client });
    client.page
      .infraCreate()
      .waitForElementVisible("@formProviderSelect", delay)
      .click("@buttonSelectAws")
      .setValue("@inputInfraName", infraNameAws)
      .setValue("@inputAccessKeyId", Array(20).fill("K"))
      .setValue("@inputSecretKey", Array(40).fill("S"))
      .click("@submit")
      .waitForElementVisible("div[data-alert-error-create=true]", 50e3);
  });
});
