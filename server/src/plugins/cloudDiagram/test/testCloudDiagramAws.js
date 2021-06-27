const assert = require("assert");
const { pipe, tap, tryCatch, fork } = require("rubico");
const { first } = require("rubico/x");

const testMngr = require("test/testManager");
const { createInfra, pushCodeFromTemplate } = require("./apiTestUtils");
const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN, GIT_REPOSITORY_AWS } = process.env;

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
  gitRepository: {
    url: GIT_REPOSITORY_AWS,
  },
};

describe("CloudDiagramAws", function () {
  let client;
  before(async function () {
    if (!AWSAccessKeyId) {
      return this.skip();
    }
    assert(AWS_REGION);
    assert(GIT_USERNAME);
    assert(PERSONAL_ACCESS_TOKEN);
    assert(GIT_REPOSITORY_AWS);
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("aws create, list, get by id, delete", async () => {
    try {
      await pipe([
        // Create
        createInfra({ client, config }),
        tap(({ infra }) => {
          assert(infra);
        }),
        pushCodeFromTemplate({ client }),
        ({ infra }) => ({
          id: infra.id,
          providerAuth: {
            AWSAccessKeyId,
            AWSSecretKey,
            AWS_REGION,
          },
        }),
        tap((input) => {
          assert(input);
        }),
        (input) => client.patch(`v1/infra/${input.id}`, input),
        tap((result) => {
          assert(result);
        }),
        ({ id: infra_id }) => ({
          options: {},
          infra_id,
        }),
        (input) => client.post("v1/cloudDiagram", input),
        tap((result) => {
          assert(result);
          //TODO add jobId
        }),
        () => client.get("v1/cloudDiagram"),
        // List
        tap((results) => {
          assert(Array.isArray(results));
        }),
        first,
        tap(({ id }) => client.get(`v1/cloudDiagram/${id}`)),
        tap((result) => {
          assert(result);
          assert(result.id);
          assert(result.user_id);
        }),
        () => client.get("v1/infra"),
        tap((results) => {
          assert(Array.isArray(results));
        }),
        //tap(({ id }) => client.delete(`v1/cloudDiagram/${id}`)),
        tap((xxx) => {
          assert(true);
        }),
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
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all cloudDiagrams", async () => {
    try {
      await client.get("v1/cloudDiagram");
      assert(false, "should not be here");
    } catch (error) {
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
