const assert = require("assert");
const faker = require("faker");
const testMngr = require("test/testManager");
const { pipe, tap } = require("rubico");
const { sql } = testMngr;

const sqlAdaptor = require("utils/SqlAdapter")({ sql });
const orgSql = sqlAdaptor(require("../OrganisationSql")({ sql }));

const user_id = "user-test-1234567890";
const org_id = `org-${faker.random.alphaNumeric(8)}`;

describe("OrganisationSql", function () {
  before(async function () {
    if (!testMngr.app.config.db) {
      this.skip();
    }
  });
  it("org create, get one, get all, destroy", () =>
    pipe([
      // Insert Org
      () => ({ org_id, org_name: faker.company.companyName() }),
      orgSql.insert,
      // Add user to org
      () => ({ org_id, user_id }),
      orgSql.addUser,
      // Get orgs per user
      () => ({ user_id }),
      orgSql.getAllByUser,
      tap((rows) => {
        assert(rows);
        assert(rows.length);
      }),
      //Update
      () => ({ data: { org_name: "new org" }, where: { org_id, user_id } }),
      orgSql.update,
      tap((params) => {
        assert(params);
      }),
      // Delete Org
      () => ({ where: { org_id, user_id } }),
      orgSql.destroy,
    ])());
});
