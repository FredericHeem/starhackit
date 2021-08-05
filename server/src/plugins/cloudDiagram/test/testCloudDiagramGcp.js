const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const { first } = require("rubico/x");
const { testInfra } = require("./apiTestUtils");

let gcpCredentials;
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN, GIT_REPOSITORY_GCP } = process.env;

const testMngr = require("test/testManager");

const createConfig = ({ credentials }) => {
  return {
    infra: {
      name: "infra-google-test",
      providerType: "google",
      providerName: "google",
      project: {
        url: "https://github.com/grucloud/grucloud/",
        title: "Instance with public address in a network",
        directory: "examples/google/vm-network",
        branch: "main",
      },
      providerAuth: {
        credentials,
      },
    },
    gitCredential: {
      providerType: "GitHub",
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
