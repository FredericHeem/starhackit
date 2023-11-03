const { pipe, get, fork, assign, omit } = require("rubico");
const { identity } = require("rubico/x");
const nanoid = require("nanoid");

const { insert } = require("utils/SqlOps");
const { hashPassword } = require("utils/hashPassword");

module.exports = ({ sql }) => {
  const tableName = "user_pending";
  return {
    tableName,
    insert: pipe([
      assign({
        code: () => nanoid.nanoid(16),
        password_hash: pipe([get("password"), hashPassword]),
      }),
      omit(["password"]),
      fork({ out: identity, query: insert({ tableName, sql }) }),
    ]),
  };
};
