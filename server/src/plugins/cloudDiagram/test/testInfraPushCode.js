const assert = require("assert");
const { pipe, tap, tryCatch, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const testMngr = require("test/testManager");

const { createInfra, pushCodeFromTemplate } = require("./apiTestUtils");
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN } = process.env;

const config = {
  infra: {
    name: "infra-aws-test",
    providerType: "aws",
    providerName: "aws",
    project: {
      url: "https://github.com/grucloud/grucloud/",
      title: "EC2 an instance with public address",
      directory: "examples/aws/ec2",
      branch: "main",
    },
  },
  gitCredential: {
    providerType: "GitHub",
    username: GIT_USERNAME,
    password: PERSONAL_ACCESS_TOKEN,
  },
};

describe("InfraPushCode", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    assert(GIT_USERNAME);
    assert(PERSONAL_ACCESS_TOKEN);

    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {});
  it("repo 404", async () => {
    try {
      await pipe([
        createInfra({
          client,
          config: defaultsDeep(config)({
            gitRepository: {
              url: "https://github.com/grucloud/grucloud/xxxxxxxx",
            },
          }),
        }),
        pushCodeFromTemplate({ client }),
      ])();
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.name, "HttpError");
    }
  });

  it("Cannot parse remote URL", async () => {
    try {
      await pipe([
        createInfra({
          client,
          config: defaultsDeep(config)({
            gitRepository: { url: "repocannotparseurl" },
          }),
        }),
        pushCodeFromTemplate({ client }),
        tap((result) => {
          assert(result);
        }),
      ])();
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.name, "UrlParseError");
    }
  });
});
