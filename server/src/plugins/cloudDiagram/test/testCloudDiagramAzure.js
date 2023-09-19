const assert = require("assert");
const { pipe, tap } = require("rubico");
const testMngr = require("test/testManager");
const { testInfra } = require("./apiTestUtils");

const {
  AZURE_TENANT_ID,
  AZURE_SUBSCRIPTION_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  LOCATION,
  GIT_REPOSITORY_AZURE,
  GIT_USERNAME,
  PERSONAL_ACCESS_TOKEN,
} = process.env;

const config = {
  infra: {
    name: "infra-azure-test",
    provider_type: "azure",
    provider_name: "azure",
    provider_auth: {
      AZURE_TENANT_ID,
      AZURE_SUBSCRIPTION_ID,
      AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET,
      LOCATION,
    },
    project: {
      url: "https://github.com/grucloud/grucloud/",
      title: "Instance with public address in a network",
      directory: "examples/azure/Compute/vm",
      branch: "main",
    },
    provider_auth: {
      AZURE_TENANT_ID,
      AZURE_SUBSCRIPTION_ID,
      AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET,
      LOCATION,
    },
  },
  gitCredential: {
    provider_type: "GitHub",
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
    if (!testMngr.app.config.infra) {
      this.skip();
    }

    assert(AZURE_TENANT_ID);
    assert(AZURE_SUBSCRIPTION_ID);
    assert(AZURE_CLIENT_ID);
    assert(AZURE_CLIENT_SECRET);
    assert(GIT_REPOSITORY_AZURE);
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
      console.log(error);
      throw error;
    }
  });
});
