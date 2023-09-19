const assert = require("assert");
const faker = require("faker");
const testMngr = require("test/testManager");
const { pipe, tap } = require("rubico");

const { sqlClient } = testMngr;

const sqlAdaptor = require("utils/SqlAdapter")(sqlClient);
const userPendingSql = sqlAdaptor(require("../UserPendingSql")());

const email = faker.internet.email();

describe("UserPendinSql", function () {
  before(async function () {
    if (!testMngr.app.config.db) {
      this.skip();
    }
  });
  it("user_pending create, get one, get all, destroy", () =>
    pipe([
      // Insert user pending
      () => ({ email, password: "password" }),
      userPendingSql.insert,
      tap((rows) => {
        assert(rows);
      }),
      // Get user by email
      () => ({ email }),
      userPendingSql.getByEmail,
      tap((rows) => {
        assert(rows);
      }),
      // Delete user pending
      () => ({ email }),
      userPendingSql.deleteByEmail,
    ])());
});
