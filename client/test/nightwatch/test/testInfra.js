const path = require("path");
const infraNameAws = "Aws Infra";
const infraNameGoogle = "grucloud-vm-tuto-1";
const infraNameAzure = "Azure Infra";

const googleCredentialFile = "grucloud-vm-tuto-1.json";

const deleteInfra = async ({ client, infraName, delay = 3e3 }) => {
  await client.page
    .infra()
    .navigate()
    .waitForElementVisible("form[data-infra-list=true]", delay)
    .click(`li[data-infra-list-item-name="${infraName}"`)
    .waitForElementVisible("form[data-infra-detail=true]", delay)
    .pause(delay)
    .click("@editSettingsButton")
    .pause(delay)
    .click("a[data-infra-edit-delete-link=true]")
    .pause(delay)
    .setValue("div[data-delete-name=true] input", infraName)
    .click("button[data-infra-button-delete=true]")
    .pause(delay);
};

describe.only("Infra", function () {
  before(function (client, done) {
    this.timeout(40e3);
    client.page.login().login(done);
  });

  // after(function (client, done) {
  //   client.page.logout().logout(done);
  // });

  it("bad credentials", function (client) {
    client.page
      .infraCreate()
      .navigate()
      .waitForElementVisible("@formProviderSelect", 5e3)
      .click("@buttonSelectAws")
      .setValue("@nameInput", infraNameAws)
      .setValue("@accessKeyIdInput", Array(20).fill("K"))
      .setValue("@secretKeyInput", Array(40).fill("S"))
      .click("@submit")
      .waitForElementVisible("div[data-alert-error-create=true]", 50e3);
  });
  it("create aws", function (client) {
    client.page
      .infraCreate()
      .navigate()
      .waitForElementVisible("@formProviderSelect", 5e3)
      .click("@buttonSelectAws")
      .waitForElementVisible("form[data-infra-create-aws=true]", 5e3)
      .setValue("@nameInput", infraNameAws)
      .setValue("@accessKeyIdInput", process.env.AWSAccessKeyId)
      .setValue("@secretKeyInput", process.env.AWSSecretKey)
      // AWS_REGION
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(5e3);
  });
  it("delete aws", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameAws });
  });
  it("create azure", function (client) {
    client.page
      .infraCreate()
      .navigate()
      .waitForElementVisible("@formProviderSelect", 5e3)
      .click("@buttonSelectAzure")
      .waitForElementVisible("form[data-infra-create-azure=true]", 5e3)
      .setValue("@inputAzureName", infraNameAzure)
      .setValue("@inputSubscriptionId", process.env.SUBSCRIPTION_ID)
      .setValue("@inputTenantId", process.env.TENANT_ID)
      .setValue("@inputAppId", process.env.APP_ID)
      .setValue("@inputPassword", process.env.PASSWORD)
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(5e3);
  });
  it("delete azure", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameAzure });
  });
  it("create google", function (client) {
    client.page
      .infraCreate()
      .navigate()
      .waitForElementVisible("@formProviderSelect", 5e3)
      .click("@buttonSelectGoogle")
      .waitForElementVisible("form[data-infra-create-google=true]", 5e3)
      .setValue(
        "@inputFileGoogleUpload",
        path.resolve(__dirname, googleCredentialFile)
      )
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(5e3);
  });
  it("delete google", async function (client, done) {
    await deleteInfra({ client, infraName: infraNameGoogle });
  });
});
