const { tap, pipe, fork } = require("rubico");
const { identity } = require("rubico/x");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "git_repository";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
  };
};
