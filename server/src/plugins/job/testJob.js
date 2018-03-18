import assert from "assert";
import testMngr from "~/test/testManager";

describe("Job No Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("bob");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all jobs", async () => {
    try {
      let jobs = await client.get("v1/job");
      assert(jobs);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
  it("should get 403 when getting a job", async () => {
    try {
      let job = await client.get("v1/job/123456");
      assert(job);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
});

describe("Job", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("should create a job", async () => {
    const input = {
      title: "Software Engineer",
      description: "Greenfield project"
    };
    let job = await client.post("v1/job", input);
    assert(job);
    assert(job.user_id);
    assert.equal(job.title, input.title);
  });
  it("should update a job", async () => {
    const inputNew = {
      subject: "Ciao Mundo"
    };
    const newJob = await client.post("v1/job", inputNew);
    const inputUpdated = {
      title: "Hello World"
    };
    const updatedJob = await client.patch(`v1/job/${newJob.id}`, inputUpdated);
    assert.equal(updatedJob.subject, inputUpdated.subject);
  });
  it("should delete a job", async () => {
    const inputNew = {
      title: "Ciao Mundo"
    };
    const newJob = await client.post("v1/job", inputNew);
    const jobsBeforeDelete = await client.get("v1/job");
    await client.delete("v1/job", { id: newJob.id });
    const jobsAfterDelete = await client.get("v1/job");
    assert.equal(jobsBeforeDelete.length, jobsAfterDelete.length + 1);
  });
  it("should get all jobs", async () => {
    let jobs = await client.get("v1/job");
    assert(jobs);
    assert(Array.isArray(jobs));
  });
  it("should get one job", async () => {
    let job = await client.get("v1/job/1");
    assert(job);
    assert(job.user_id);
  });
  it("should get 404 when the job is not found", async () => {
    try {
      let jobs = await client.get("v1/job/123456");
      assert(jobs);
    } catch (error) {
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
});
