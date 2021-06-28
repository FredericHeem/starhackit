const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const { first } = require("rubico/x");
const testMngr = require("test/testManager");
const { testInfra } = require("./apiTestUtils");

const {
  TENANT_ID,
  SUBSCRIPTION_ID,
  APP_ID,
  PASSWORD,
  LOCATION,
  GIT_REPOSITORY_AZURE,
} = process.env;
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN } = process.env;

const config = {
  infra: {
    name: "infra-azure-test",
    providerType: "azure",
    providerName: "azure",
    providerAuth: {
      TENANT_ID,
      SUBSCRIPTION_ID,
      APP_ID,
      PASSWORD,
      LOCATION,
    },
    project: {
      url: "https://github.com/grucloud/grucloud/",
      title: "Instance with public address in a network",
      directory: "examples/azure/vm",
      branch: "main",
    },
    providerAuth: {
      TENANT_ID,
      SUBSCRIPTION_ID,
      APP_ID,
      PASSWORD,
      LOCATION,
    },
  },
  gitCredential: {
    providerType: "GitHub",
    username: GIT_USERNAME,
    password: PERSONAL_ACCESS_TOKEN,
  },
  gitRepository: {
    url: GIT_REPOSITORY_AZURE,
  },
};

describe("CloudDiagram Azure", function () {
  let client;
  before(async function () {
    if (!TENANT_ID) {
      return this.skip();
    }

    assert(SUBSCRIPTION_ID);
    assert(GIT_USERNAME);
    assert(PERSONAL_ACCESS_TOKEN);

    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {});

  it("azure create, list, get by id, delete", async () => {
    try {
      await pipe([
        // Create
        testInfra({ client, config }),
      ])();
    } catch (error) {
      throw error;
    }
  });
});
