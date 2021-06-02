const path = require("path");
const infraName = "My Infra";
const googleCredentialFile = "grucloud-vm-tuto-1.json";

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
      .setValue("@nameInput", infraName)
      .setValue("@accessKeyIdInput", Array(20).fill("K"))
      .setValue("@secretKeyInput", Array(40).fill("S"))

      .click("@submit")
      .waitForElementVisible("div[data-alert-error-create=true]", 50e3);
    //.assert.title('')
  });
  it("create aws", function (client) {
    client.page
      .infraCreate()
      .navigate()
      .waitForElementVisible("@formProviderSelect", 5e3)
      .click("@buttonSelectAws")
      .waitForElementVisible("form[data-infra-create-aws=true]", 5e3)
      .setValue("@nameInput", infraName)
      .setValue("@accessKeyIdInput", process.env.AWSAccessKeyId)
      .setValue("@secretKeyInput", process.env.AWSSecretKey)
      // AWS_REGION
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(5e3);
  });
  it("create azure", function (client) {
    client.page
      .infraCreate()
      .navigate()
      .waitForElementVisible("@formProviderSelect", 5e3)
      .click("@buttonSelectAzure")
      .waitForElementVisible("form[data-infra-create-azure=true]", 5e3)
      .setValue("@inputAzureName", infraName)
      .setValue("@inputSubscriptionId", process.env.SUBSCRIPTION_ID)
      .setValue("@inputTenantId", process.env.TENANT_ID)
      .setValue("@inputAppId", process.env.APP_ID)
      .setValue("@inputPassword", process.env.PASSWORD)
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(5e3);
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
  it("list", async function (client, done) {
    const infraPage = await client.page
      .infra()
      .navigate()
      .waitForElementVisible("form[data-infra-list=true]", 5e3)
      .click("@listItem")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(3e3)
      .click("@editSettingsButton")
      .pause(3e3)
      .click("a[data-infra-edit-delete-link=true]")
      .pause(3e3)
      .setValue("div[data-delete-name=true] input", infraName)
      .click("button[data-infra-button-delete=true]")
      .pause(3e3);

    //.assert.title('My Profile - StarHackIt')
  });
});
