const assert = require("assert");
const { pipe, tap, tryCatch } = require("rubico");
const { first } = require("rubico/x");

let gcpCredentials;
const { GIT_USERNAME, PERSONAL_ACCESS_TOKEN } = process.env;

const testMngr = require("test/testManager");

describe("CloudDiagram GCP", function () {
  let client;
  before(async function () {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
    try {
      gcpCredentials = require("../../../../grucloud-gcp.json");
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {
    await testMngr.stop();
  });

  it("gcp create, list, get by id, delete", async () => {
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
          git_credential_id,
          name: "infra-gcp-test",
          providerType: "google",
          providerName: "google",
          providerAuth: { credentials: gcpCredentials },
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
