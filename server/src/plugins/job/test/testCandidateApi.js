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
      let jobs = await client.get(
        "v1/candidate/job/8f7be687-5457-4c37-b1e4-bb974c9fa28a"
      );
      assert(jobs);
    } catch (error) {
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
  it("should not get any job given an unknown sector", async () => {
    let jobs = await client.get("v1/candidate/job?sectors[]=Restaurant");
    assert.equal(jobs.length, 0);
    assert(jobs);
  });
  it("should get all jobs given an array of sectors", async () => {
    let jobs = await client.get(
      "v1/candidate/job?sectors[]=Administrator&sectors[]=Developer"
    );
    console.log(jobs.length);
    assert(jobs);
  });
  it("should get all jobs everywhere", async () => {
    let jobs = await client.get(
      "v1/candidate/job?lat=50&lon=0&max=10000&sectors[]=Developer"
    );
    const job = jobs[0];
    //console.log("JOB ", jobs);
    //console.log("JOBS ", jobs.length)
    if (job) {
      const jobDetails = await client.get(`v1/candidate/job/${job.id}`);
      assert(jobDetails.recruiter.id);
      const jobDetails2 = await client.get(`v1/candidate/job/${job.id}`);
      assert.equal(jobDetails.views + 1, jobDetails2.views);
    }
    assert(jobs);
  });
  it("should get all jobs near me", async () => {
    let jobs = await client.get("v1/candidate/job?lat=50&lon=0&max=1");
    //console.log("JOBS ", jobs.length)
    assert(jobs);
  });
});
