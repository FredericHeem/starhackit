const { tap, pipe, fork } = require("rubico");
const assert = require("assert");

module.exports = ({ sql }) => {
  assert(sql)
  const tableName = "user_orgs";
  return {
    tableName,
  };
};
