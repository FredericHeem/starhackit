const assert = require("assert");
const { pipe, tap } = require("rubico");
const { testInfra } = require("./apiTestUtils");

let gcpCredentials;
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN, GIT_REPOSITORY_GCP } = process.env;

const testMngr = require("test/testManager");

const createConfig = ({ credentials }) => {
  return {
    infra: {
      name: "infra-google-test",
      provider_type: "google",
      provider_name: "google",
      project: {
        url: "https://github.com/grucloud/grucloud/",
        title: "Instance with public address in a network",
        directory: "examples/google/vm-network",
        branch: "main",
      },
      provider_auth: {
        credentials,
      },
    },
    gitCredential: {
      provider_type: "GitHub",
      username: GIT_USERNAME,
      password: PERSONAL_ACCESS_TOKEN,
    },
    gitRepository: {
      url: GIT_REPOSITORY_GCP,
    },
  };
};
let config;

describe("CloudDiagram GCP", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }

    assert(GIT_USERNAME);
    assert(PERSONAL_ACCESS_TOKEN);
    assert(GIT_REPOSITORY_GCP);

    client = testMngr.client("alice");
    await client.login();
    try {
      gcpCredentials = require("../../../../../grucloud-gcp.json");
      config = createConfig({ credentials: gcpCredentials });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("gcp create, list, get by id, delete", async () => {
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
