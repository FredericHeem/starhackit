const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { identity } = require("rubico/x");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "cloud_authentication";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
  };
};
