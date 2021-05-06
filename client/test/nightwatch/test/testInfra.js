const infraName = "My Infra";
describe("Infra", function () {
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
      .waitForElementVisible("form[data-infra-create=true]", 5e3)

      .setValue("@nameInput", infraName)
      .setValue("@accessKeyIdInput", Array(20).fill("K"))
      .setValue("@secretKeyInput", Array(40).fill("S"))

      .click("@submit")
      .waitForElementVisible("div[data-alert-error-create=true]", 50e3);
    //.assert.title('')
  });
  it("create", function (client) {
    client.page
      .infraCreate()
      .navigate()
      .waitForElementVisible("form[data-infra-create=true]", 5e3)
      .setValue("@nameInput", infraName)
      .setValue("@accessKeyIdInput", process.env.AWSAccessKeyId)
      .setValue("@secretKeyInput", process.env.AWSSecretKey)
      // AWSRegion
      .click("@submit")
      .waitForElementVisible("form[data-infra-detail=true]", 50e3)
      .pause(10e3);
    //.assert.title('My Profile - StarHackIt')
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
