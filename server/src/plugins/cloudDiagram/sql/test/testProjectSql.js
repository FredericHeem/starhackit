const assert = require("assert");
const faker = require("faker");
const testMngr = require("test/testManager");
const { pipe, tap } = require("rubico");
const { sql } = testMngr;

const sqlAdaptor = require("utils/SqlAdapter")({ sql });
const projectSql = sqlAdaptor(require("../ProjectSql")({ sql }));

const user_id = "alice-1234567890";
const org_id = `org-alice`;
const project_id = faker.company.companyName();

describe("ProjectSql", function () {
  before(async function () {
    if (!testMngr.app.config.db) {
      this.skip();
    }
  });
  it("project create, get one, get all, destroy", () =>
    pipe([
      // Insert project
      () => ({ org_id, project_id, project_name: faker.company.companyName() }),
      projectSql.insert,
      tap((params) => {
        assert(params);
      }),
      // Get projects per user
      ({}) => ({ where: { user_id } }),
      projectSql.getAllByUser,
      tap((rows) => {
        assert(rows);
        assert(rows.length);
      }),
      // Get projects per orgs
      ({}) => ({ where: { org_id, user_id } }),
      projectSql.getAllByOrg,
      tap((rows) => {
        assert(rows);
        assert(rows.length);
      }),
      // // Delete Org
      () => ({ where: { project_id } }),
      projectSql.destroy,
    ])());
});
