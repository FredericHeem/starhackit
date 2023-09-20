const assert = require("assert");
const faker = require("faker");
const testMngr = require("test/testManager");
const { pipe, tap, fork, get } = require("rubico");
const { first } = require("rubico/x");
const nanoid = require("nanoid");

const { sqlClient } = testMngr;

const sqlAdaptor = require("utils/SqlAdapter")(sqlClient);
const userSql = sqlAdaptor(require("../UserSql")());

const user_id = `user-${nanoid.nanoid(10)}`;
const email = faker.internet.email();

describe("UserSql", function () {
  before(async function () {
    if (!testMngr.app.config.db) {
      this.skip();
    }
  });
  it("user create, get one, get all, destroy", () =>
    pipe([
      // Insert user
      () => ({ user_id, email }),
      userSql.insert,
      // Get user by id
      () => ({ user_id }),
      userSql.getById,
      tap((rows) => {
        assert(rows);
      }),
      // Get user by id
      () => ({ where: { user_id }, attributes: ["user_id"] }),
      userSql.findOne,
      tap((rows) => {
        assert(rows);
      }),
      // Delete user
      () => ({ where: { user_id } }),
      userSql.destroy,
    ])());
  it("findAll", () =>
    pipe([
      () => ({}),
      userSql.findAll,
      tap((result) => {
        assert(result);
      }),
    ])());
  it("findAll limit 5", () =>
    pipe([
      () => ({ limit: 5 }),
      userSql.findAll,
      tap((rows) => {
        assert(rows);
      }),
    ])());
  it("findAll limit 5 where", () =>
    pipe([
      () => ({
        search: "alice",
      }),
      fork({
        count: pipe([
          userSql.count,
          tap((params) => {
            assert(params);
          }),
        ]),
        data: pipe([
          userSql.findAll,
          tap((rows) => {
            assert(rows);
          }),
        ]),
      }),
      tap((params) => {
        assert(params);
      }),
    ])());
});
