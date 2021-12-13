const assert = require("assert");
const { pipe, tap, tryCatch, fork } = require("rubico");
const { first } = require("rubico/x");

const testMngr = require("test/testManager");
const { testInfra } = require("./apiTestUtils");
const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN, GIT_REPOSITORY_AWS } = process.env;

const config = {
  infra: {
    name: "infra-aws-test",
    providerType: "aws",
    providerName: "aws",
    providerAuth: {
      AWSAccessKeyId,
      AWSSecretKey,
      AWS_REGION,
    },
    project: {
      url: "https://github.com/grucloud/grucloud/",
      title: "EC2 an instance with public address",
      directory: "examples/aws/ec2/ec2",
      branch: "main",
    },
  },
  gitCredential: {
    providerType: "GitHub",
    username: GIT_USERNAME,
    password: PERSONAL_ACCESS_TOKEN,
  },
  gitRepository: {
    url: GIT_REPOSITORY_AWS,
  },
};

describe("CloudDiagramAws", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    assert(AWS_REGION);
    assert(GIT_USERNAME);
    assert(PERSONAL_ACCESS_TOKEN);
    assert(GIT_REPOSITORY_AWS);
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {});
  it("aws create, list, get by id, delete", async () => {
    try {
      await pipe([
        // Create
        testInfra({ client, config }),
      ])();
    } catch (error) {
      throw error;
    }
  });
  it("list infra", async () => {
    return tryCatch(
      pipe([
        // List
        () => client.get("v1/infra"),
        tap((results) => {
          assert(Array.isArray(results));
        }),
        tap((xxx) => {
          assert(true);
        }),
      ]),
      (error) => {
        throw error;
      }
    )();
  });
  it("should get 404 when the cloudDiagram is not found", async () => {
    try {
      await client.get("v1/cloudDiagram/123456");
      assert(false, "should not be here");
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "BadRequest");
      assert.equal(error.response.status, 400);
    }
  });
});

describe("CloudDiagram No Auth", function () {
  let client;
  before(async function () {
    if (!testMngr.app.config.infra) {
      this.skip();
    }
    try {
      client = testMngr.client("bob");
    } catch (error) {
      throw error;
    }
  });
  after(async () => {});

  it("should get a 401 when getting all cloudDiagrams", async () => {
    try {
      await client.get("v1/cloudDiagram");
      assert(false, "should not be here");
    } catch (error) {
      console.log(error);

      console.log(error.response);
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a cloudDiagram", async () => {
    try {
      await client.get("v1/cloudDiagram/123456");
      assert(false, "should not be here");
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});
