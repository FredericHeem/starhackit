describe("Profile", function () {
  before(function (client, done) {
    this.timeout(40e3);
    client.page.login().login(done);
  });

  after(function (client, done) {
    client.page.logout().logout(done);
  });

  it("read and save profile", function (client) {
    client.page
      .profile()
      .navigate()
      .waitForElementVisible(".profile-page", 15e3)
      .setValue("@biographyInput", "My Bio")
      .click("@submit")
      .waitForElementVisible("div[data-alert-profile-updated=true]", 10e3);
    //.assert.title('My Profile - StarHackIt')
  });

  it.skip("save biography too long", function (client) {
    client.page
      .profile()
      .navigate()
      .waitForElementVisible("@biographyInput", 15e3)
      .setValue("@biographyInput", "abcdefhigk")
      .click("@submit");
    //.waitForElementVisible(".alert", 15e3);
    client.pause(500e3);
  });
});
