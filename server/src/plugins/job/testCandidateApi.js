import assert from "assert";
import testMngr from "~/test/testManager";

describe("Candidate Job", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get all jobs", async () => {
    let jobs = await client.get("v1/candidate/job");
    assert(jobs);
    assert(Array.isArray(jobs));
  });
  it("should get 404 when the job is not found", async () => {
    try {
      let jobs = await client.get("v1/candidate/job/123456");
      assert(jobs);
    } catch (error) {
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
});
