const delay = 2e3;
const waitDelay = 10e3;

const { githubUserName, gitHubPassword } = process.env;
const { googleUserName, googlePassword } = process.env;
const { facebookUserName, facebookPassword } = process.env;

describe("Social Login", function () {
  afterEach(function (client, done) {
    client.page.logout().logout(done);
  });
  it("login github", function (client) {
    client.page
      .login()
      .navigate()
      .waitForElementVisible("@loginPage", waitDelay)
      .click("a[data-button-login=github]")
      .waitForElementVisible("#login_field", waitDelay)
      .setValue("#login_field", githubUserName)
      .setValue("#password", gitHubPassword)
      .click("input[value='Sign in']")
      .waitForElementVisible("#application", waitDelay)
      .pause(delay);
  });
  it("login google", function (client) {
    client.page
      .login()
      .navigate()
      .waitForElementVisible("@loginPage", waitDelay)
      .click("a[data-button-login=google]")
      .waitForElementVisible("input[type=email]", waitDelay)
      .setValue("input[type=email]", googleUserName)
      .click("#identifierNext button[type='button']")
      .waitForElementVisible("input[type=password]", waitDelay)
      .setValue("input[type=password]", googlePassword)
      .click("#passwordNext button[type='button']")
      //.waitForElementVisible("#application", waitDelay)
      .pause(delay);
  });
  it("login facebook", function (client) {
    client.page
      .login()
      .navigate()
      .waitForElementVisible("@loginPage", waitDelay)
      .click("a[data-button-login=facebook]")
      .waitForElementVisible(
        "button[data-testid='cookie-policy-dialog-accept-button']",
        waitDelay
      )
      .click("button[data-testid='cookie-policy-dialog-accept-button']")
      .waitForElementVisible("#email", waitDelay)
      .setValue("#email", facebookUserName)
      .setValue("#pass", facebookPassword)
      .click("#loginbutton")
      //.waitForElementVisible("button[type=submit]", waitDelay)
      //.click("button[type=submit]")
      //.waitForElementVisible("#application", waitDelay)
      .pause(delay);
  });
});
