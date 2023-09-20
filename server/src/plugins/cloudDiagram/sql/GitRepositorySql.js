const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity } = require("rubico/x");
const nanoid = require("nanoid");
const { insert, buildUpdateSet } = require("utils/SqlOps");

module.exports = () => {
  const tableName = "git_repository";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ git_repository_id: `repo-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName }) }),
      ])(),
  };
};
