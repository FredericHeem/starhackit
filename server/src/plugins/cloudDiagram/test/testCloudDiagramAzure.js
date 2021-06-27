const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const { first } = require("rubico/x");
const testMngr = require("test/testManager");

const { TENANT_ID, SUBSCRIPTION_ID, APP_ID, PASSWORD, LOCATION } = process.env;
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN } = process.env;

describe("CloudDiagram Azure", function () {
  let client;
  before(async function () {
    if (!TENANT_ID) {
      return this.skip();
    }

    assert(SUBSCRIPTION_ID);
    assert(GIT_USERNAME);
    assert(PERSONAL_ACCESS_TOKEN);

    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });

  it("azure create, list, get by id, delete", async () => {
    try {
      await pipe([
        // use createGitInfo
        () =>
          client.post("v1/git_credential", {
            providerType: "GitHub",
            username: GIT_USERNAME,
            password: PERSONAL_ACCESS_TOKEN,
          }),
        ({ id: git_credential_id }) => ({
          name: "infra-azure-test",
          git_credential_id,
          providerType: "azure",
          providerName: "azure",
          providerAuth: {
            TENANT_ID,
            SUBSCRIPTION_ID,
            APP_ID,
            PASSWORD,
            LOCATION,
          },
        }),
        (input) => client.post("v1/infra", input),
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
        //tap(({ id }) => client.delete(`v1/cloudDiagram/${id}`)),
        tap((xxx) => {
          assert(true);
        }),
      ])();
    } catch (error) {
      throw error;
    }
  });
});
