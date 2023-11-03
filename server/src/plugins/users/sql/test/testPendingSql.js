const assert = require("assert");
const faker = require("faker");
const testMngr = require("test/testManager");
const { pipe, tap } = require("rubico");

const { sql } = testMngr;

const sqlAdaptor = require("utils/SqlAdapter")({ sql });
const userPendingSql = sqlAdaptor(require("../UserPendingSql")({ sql }));

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
      () => ({
        email,
        code: "fgc3Tm4mOXXwq80z",
        password: "password",
      }),
      userPendingSql.insert,
      tap((userPending) => {
        assert(userPending.password_hash);
      }),
      // Delete user pending
      () => ({ where: { email } }),
      userPendingSql.destroy,
    ])());
});
