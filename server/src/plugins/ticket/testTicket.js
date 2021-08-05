const assert = require("assert");
const testMngr = require("test/testManager");

describe("Ticket No Auth", function () {
  let client;
  before(async () => {
    client = testMngr.client("bob");
  });
  after(async () => {});

  it("should get a 401 when getting all tickets", async () => {
    try {
      let tickets = await client.get("v1/ticket");
      assert(tickets);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
  it("should get 403 when getting a ticket", async () => {
    try {
      let ticket = await client.get("v1/ticket/123456");
      assert(ticket);
    } catch (error) {
      assert.equal(error.response.data, "Unauthorized");
      assert.equal(error.response.status, 401);
    }
  });
});

describe("Ticket", function () {
  let client;
  before(async () => {
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {});
  it("should create a ticket", async () => {
    const input = {
      subject: "Ciao Bella",
    };
    let ticket = await client.post("v1/ticket", input);
    assert(ticket);
    assert(ticket.user_id);
    assert.equal(ticket.subject, input.subject);
  });
  it("should update a ticket", async () => {
    const inputNew = {
      subject: "Ciao Mundo",
    };
    const newTicket = await client.post("v1/ticket", inputNew);
    const inputUpdated = {
      subject: "Hello World",
    };
    const updatedTicket = await client.patch(
      `v1/ticket/${newTicket.id}`,
      inputUpdated
    );
    assert.equal(updatedTicket.subject, inputUpdated.subject);
  });
  it("should delete a ticket", async () => {
    const inputNew = {
      subject: "Ciao Mundo",
    };
    const newTicket = await client.post("v1/ticket", inputNew);
    const ticketsBeforeDelete = await client.get("v1/ticket");
    await client.delete(`v1/ticket/${newTicket.id}`);
    const ticketsAfterDelete = await client.get("v1/ticket");
    assert.equal(ticketsBeforeDelete.length, ticketsAfterDelete.length + 1);
  });
  it("should get all tickets", async () => {
    let tickets = await client.get("v1/ticket");
    assert(tickets);
    assert(Array.isArray(tickets));
  });
  it("should get one ticket", async () => {
    let ticket = await client.get("v1/ticket/1");
    assert(ticket);
    assert(ticket.user_id);
  });
  it("should get 404 when the ticket is not found", async () => {
    try {
      let tickets = await client.get("v1/ticket/123456");
      assert(tickets);
    } catch (error) {
      assert(error.response.data.error);
      assert.equal(error.response.data.error.name, "NotFound");
      assert.equal(error.response.status, 404);
    }
  });
});
