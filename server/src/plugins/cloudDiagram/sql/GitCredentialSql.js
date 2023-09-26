const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity } = require("rubico/x");
const nanoid = require("nanoid");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "git_credential";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ git_credential_id: `cred-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
  };
};
