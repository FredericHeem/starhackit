import assert from "assert";
import testMngr from "~/test/testManager";
import faker from "faker";
import _ from "lodash";

const createFakeJob = () => ({
  title: faker.name.jobTitle(),
  description: faker.lorem.sentences(),
  company_name: faker.company.companyName(),
  company_info: faker.company.catchPhrase(),
  business_type: faker.commerce.department(),
  company_url: faker.internet.url(),
  company_logo_url: faker.image.imageUrl(),
  start_date: faker.date.future(),
  end_date: faker.date.future(),
  sector: faker.name.jobType(),
  geo: {
    type: "Point",
    coordinates: [
      faker.random.number({ min: 51, max: 52, precision: 0.01 }),
      faker.random.number({ min: -1, max: 1, precision: 0.01 })
    ]
  },
  location: {
    description: `${faker.address.city()} - ${faker.address.state()}`
  }
});

describe("Recruiter No Auth", function() {
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
      const jobs = await client.get("v1/recruiter/job");
      assert(jobs);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
  it("should get 403 when getting a job", async () => {
    try {
      let job = await client.get("v1/recruiter/job/123456");
      assert(job);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
});

describe("Recruiter Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it("should create a job and get this job", async () => {
    const input = createFakeJob();
    const job = await client.post("v1/recruiter/job", input);
    assert(job);
    assert(job.user_id);
    assert.equal(job.title, input.title);

    const jobNew = await client.get(`v1/recruiter/job/${job.id}`);
    assert(jobNew);
    assert(job.user_id);
    assert.equal(job.title, jobNew.title);
  });
  it("should create many jobs", async () => {
    _.times(100, async () => {
      const input = createFakeJob();
      const job = await client.post("v1/recruiter/job", input);
      assert(job);
      assert(job.user_id);
      assert.equal(job.title, input.title);
    });
  });
  it("should update a job", async () => {
    const inputNew = createFakeJob();
    const newJob = await client.post("v1/recruiter/job", inputNew);
    const inputUpdated = createFakeJob();
    const updatedJob = await client.patch(
      `v1/recruiter/job/${newJob.id}`,
      inputUpdated
    );
    assert.equal(updatedJob.title, inputUpdated.title);
  });
  it("should delete a job", async () => {
    const inputNew = createFakeJob();
    const newJob = await client.post("v1/recruiter/job", inputNew);
    await client.post("v1/recruiter/job", createFakeJob());
    const jobsBeforeDelete = await client.get("v1/recruiter/job");
    await client.delete(`v1/recruiter/job/${newJob.id}`);
    const jobsAfterDelete = await client.get("v1/recruiter/job");
    assert.equal(jobsBeforeDelete.length, jobsAfterDelete.length + 1);
  });
  it("should get all jobs", async () => {
    let jobs = await client.get("v1/recruiter/job");
    assert(jobs);
    assert(Array.isArray(jobs));
  });
  it("should get 404 when the job is not found", async () => {
    try {
      let jobs = await client.get("v1/recruiter/job/8f7be687-5457-4c37-b1e4-bb974c9fa28a");
      assert(jobs);
    } catch (error) {
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
  it("should get all jobs near me, internal", async () => {
    const jobs = await testMngr.app.data.models().Job.findAll({
      limit: 5,
      order: testMngr.app.data.sequelize.literal(
        "geo <-> 'SRID=4326;POINT(-48.234 20.12)'"
      )
    });
    console.log(jobs.length);
    assert(jobs);
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
  it("should get apply for a job", async () => {
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
