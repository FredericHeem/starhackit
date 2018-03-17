import assert from "assert";
import testMngr from "~/test/testManager";

describe("Ticket No Auth", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get a 401 when getting all tickets", async () => {
    try {
      let tickets = await client.get("v1/ticket");
      assert(tickets);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
  it("should get 403 when getting a ticket", async () => {
    try {
      let ticket = await client.get("v1/ticket/123456");
      assert(ticket);
    } catch (error) {
      assert.equal(error.body, "Unauthorized");
      assert.equal(error.statusCode, 401);
    }
  });
});


describe("Ticket", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    assert(client);
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });

  it("should get all tickets", async () => {
    let tickets = await client.get("v1/ticket");
    assert(tickets);
  });
  it("should get 404 when the ticket is not found", async () => {
    try {
      let tickets = await client.get("v1/ticket/123456");
      assert(tickets);
    } catch (error) {
      //console.log(error.body)
      //console.log(error.statusCode)
      assert(error.body.error);
      assert.equal(error.body.error.name, "NotFound");
      assert.equal(error.statusCode, 404);
    }
  });
});

