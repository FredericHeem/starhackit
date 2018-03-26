import assert from "assert";
import testMngr from "~/test/testManager";
import _ from "lodash";

import createFakeJob from "./createFakeJob";

describe("Job Application No Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all job application", async () => {
    try {
      const jobs = await client.get("v1/candidate/application");
      assert(jobs);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
});

describe("Job Application Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should apply for a job", async () => {
    const jobCreated = await client.post("v1/recruiter/job", createFakeJob());
    assert(jobCreated);
    let jobs = await client.get("v1/candidate/job");
    const job = jobs[0];
    assert(job);
    //console.log("JOB ", jobs);
    //console.log("JOBS ", jobs.length)
    await client.post("v1/candidate/application", {
      message: "Ready to perform to the heighest bidder",
      job_id: job.id
    });
    const applications = await client.get("v1/candidate/application");
    assert(Array.isArray(applications));
  });
});
