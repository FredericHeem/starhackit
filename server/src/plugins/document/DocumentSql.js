const { tap, pipe, fork } = require("rubico");
const assert = require("assert");
const { defaultsDeep, identity, keys } = require("rubico/x");
const nanoid = require("nanoid");
const { insert } = require("utils/SqlOps");

module.exports = ({ sql }) => {
  const tableName = "document";
  return {
    tableName,
    insert: (data) =>
      pipe([
        () => data,
        defaultsDeep({ document_id: `document-${nanoid.nanoid(8)}` }),
        fork({ out: identity, query: insert({ tableName, sql }) }),
      ])(),
  };
};
